import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, FileText, ShoppingCart, ArrowLeft, Search, Grid, List, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchShopifyProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const categoryMap: Record<string, string> = {
  "ct-scanners": "CT",
  "mri-systems": "MRI",
  "petct-scanners": "PET",
  "xray-units": "X-Ray",
  "mobile-ct": "Mobile CT",
  "mobile-mri": "Mobile MRI",
  "mobile-petct": "Mobile PET",
  "mobile-xray": "Mobile X-Ray",
  "rf-coils": "RF Coils",
  "power-supplies": "Power Supply",
  "mri-parts": "MRI Parts",
  "accessories": "Accessories",
};

const categories = [
  { key: "", label: "All Products" },
  { key: "mri-systems", label: "MRI Systems" },
  { key: "ct-scanners", label: "CT Scanners" },
  { key: "petct-scanners", label: "PET/CT Scanners" },
  { key: "xray-units", label: "X-Ray Units" },
  { key: "mobile-mri", label: "Mobile MRI" },
  { key: "mobile-ct", label: "Mobile CT" },
  { key: "rf-coils", label: "RF Coils" },
  { key: "mri-parts", label: "MRI Parts" },
];

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const addItem = useCartStore((state) => state.addItem);

  const categoryTitle = category
    ? category.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "All Products";

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const query = categoryMap[category] ? `product_type:${categoryMap[category]}` : undefined;
        const data = await fetchShopifyProducts(50, query);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.node.title.toLowerCase().includes(query) ||
          p.node.description.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.node.title.localeCompare(b.node.title);
        case "name-desc":
          return b.node.title.localeCompare(a.node.title);
        case "price-asc":
          return (
            parseFloat(a.node.priceRange.minVariantPrice.amount) -
            parseFloat(b.node.priceRange.minVariantPrice.amount)
          );
        case "price-desc":
          return (
            parseFloat(b.node.priceRange.minVariantPrice.amount) -
            parseFloat(a.node.priceRange.minVariantPrice.amount)
          );
        default:
          return 0;
      }
    });

    return result;
  }, [products, searchQuery, sortBy]);

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory) {
      setSearchParams({ category: newCategory });
    } else {
      setSearchParams({});
    }
  };

  const handleAddToCart = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });

    toast.success(`${product.node.title} added to cart`, {
      position: "top-center",
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSearchParams({});
    setSortBy("name-asc");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">{categoryTitle}</h1>
          </div>

          {/* Filters Bar */}
          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full lg:w-48">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.key} value={cat.key || "all"}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex gap-1 border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Clear Filters */}
              {(searchQuery || category) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-4">
            {loading ? "Loading..." : `${filteredAndSortedProducts.length} products found`}
          </p>

          {/* Products */}
          {loading ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
                  <div className="h-48 bg-secondary rounded-lg mb-4" />
                  <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                  <div className="h-6 bg-secondary rounded w-1/2 mb-4" />
                  <div className="h-3 bg-secondary rounded w-full mb-2" />
                  <div className="h-3 bg-secondary rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No products found.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => {
                const variant = product.node.variants.edges[0]?.node;
                const image = product.node.images.edges[0]?.node;
                const price = variant?.price;

                return (
                  <div
                    key={product.node.id}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all group"
                  >
                    <Link to={`/product/${product.node.handle}`}>
                      <div className="relative h-56 overflow-hidden bg-secondary">
                        {image && (
                          <img
                            src={image.url}
                            alt={image.altText || product.node.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                    </Link>

                    <div className="p-5">
                      <Link to={`/product/${product.node.handle}`}>
                        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2 hover:text-accent transition-colors">
                          {product.node.title}
                        </h3>
                      </Link>
                      {price && (
                        <p className="text-accent font-bold text-xl mb-3">
                          {price.currencyCode} {parseFloat(price.amount).toLocaleString()}
                        </p>
                      )}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {product.node.description}
                      </p>

                      {variant?.availableForSale && (
                        <div className="flex items-center gap-1 text-success text-sm mb-4">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Available</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Link to={`/quote?product=${encodeURIComponent(product.node.title)}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <FileText className="w-4 h-4 mr-1" />
                            Quote
                          </Button>
                        </Link>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedProducts.map((product) => {
                const variant = product.node.variants.edges[0]?.node;
                const image = product.node.images.edges[0]?.node;
                const price = variant?.price;

                return (
                  <div
                    key={product.node.id}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all flex"
                  >
                    <Link to={`/product/${product.node.handle}`} className="flex-shrink-0">
                      <div className="w-40 h-40 overflow-hidden bg-secondary">
                        {image && (
                          <img
                            src={image.url}
                            alt={image.altText || product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <Link to={`/product/${product.node.handle}`}>
                          <h3 className="text-lg font-bold text-foreground mb-1 hover:text-accent transition-colors">
                            {product.node.title}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                          {product.node.description}
                        </p>
                        {variant?.availableForSale && (
                          <div className="flex items-center gap-1 text-success text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Available</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {price && (
                          <p className="text-accent font-bold text-xl">
                            {price.currencyCode} {parseFloat(price.amount).toLocaleString()}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Link to={`/quote?product=${encodeURIComponent(product.node.title)}`}>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-1" />
                              Quote
                            </Button>
                          </Link>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductListing;
