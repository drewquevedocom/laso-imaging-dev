import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, FileText, ShoppingCart, ArrowLeft, Search, Grid, List, X, SlidersHorizontal, DollarSign } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchShopifyProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import MakeOfferModal from "@/components/offer/MakeOfferModal";

// Multi-type queries for categories that span multiple Shopify product types
const categoryMap: Record<string, string> = {
  // All Imaging Systems (MRI + CT + Mobile)
  "imaging-systems": 'product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems" OR product_type:"4-Slice CT" OR product_type:"8-Slice CT" OR product_type:"16-Slice CT" OR product_type:"32-Slice CT" OR product_type:"40-Slice CT" OR product_type:"64-Slice CT" OR product_type:"128-Slice CT" OR product_type:"Mobile CT"',
  // Individual categories
  "ct-scanners": 'product_type:"4-Slice CT" OR product_type:"8-Slice CT" OR product_type:"16-Slice CT" OR product_type:"32-Slice CT" OR product_type:"40-Slice CT" OR product_type:"64-Slice CT" OR product_type:"128-Slice CT"',
  "mri-systems": 'product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems"',
  "1-5t-mri": 'product_type:"1.5T MRI Systems"',
  "3t-mri": 'product_type:"3.0T MRI Systems"',
  // Mobile
  "mobile-ct": 'product_type:"Mobile CT"',
  "mobile-mri": 'product_type:"Mobile MRI Systems"',
  // Parts
  "rf-coils": 'product_type:"RF Coils"',
  "power-supplies": 'product_type:"Power Supplies"',
  "mri-parts": 'product_type:"MRI Parts"',
  "ct-parts": 'product_type:"CT Parts"',
  "circuit-boards": 'product_type:"Circuit Boards"',
};

const categories = [
  { key: "", label: "All Products" },
  { key: "imaging-systems", label: "Imaging Systems" },
  { key: "mri-systems", label: "MRI Systems" },
  { key: "ct-scanners", label: "CT Scanners" },
  { key: "1-5t-mri", label: "1.5T MRI" },
  { key: "3t-mri", label: "3.0T MRI" },
  { key: "mobile-mri", label: "Mobile MRI" },
  { key: "mobile-ct", label: "Mobile CT" },
  { key: "rf-coils", label: "RF Coils" },
  { key: "mri-parts", label: "MRI Parts" },
  { key: "ct-parts", label: "CT Parts" },
  { key: "power-supplies", label: "Power Supplies" },
];

// Custom category titles for proper display names
const categoryTitles: Record<string, string> = {
  "imaging-systems": "Imaging Systems",
  "mri-systems": "MRI Systems",
  "ct-scanners": "CT Scanners",
  "1-5t-mri": "1.5T MRI Systems",
  "3t-mri": "3.0T MRI Systems",
  "mobile-mri": "Mobile MRI",
  "mobile-ct": "Mobile CT",
  "rf-coils": "RF Coils",
  "mri-parts": "MRI Parts",
  "ct-parts": "CT Parts",
  "power-supplies": "Power Supplies",
};

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const PRODUCTS_PER_PAGE = 12;

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [offerProduct, setOfferProduct] = useState<{ name: string; price?: string } | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const categoryTitle = category
    ? categoryTitles[category] || category.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "All Products";

  // Get additional filter params
  const vendorParam = searchParams.get("vendor") || "";
  const filterParam = searchParams.get("filter") || "";
  const queryParam = searchParams.get("query") || "";

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Build query from URL params
        let shopifyQuery = "";
        
        // If explicit query param, use it directly
        if (queryParam) {
          shopifyQuery = queryParam.replace(/\+/g, " ");
        } else {
          // Build from category + vendor + filter
          if (category && categoryMap[category]) {
            // categoryMap values already include 'product_type:' prefix and OR logic
            shopifyQuery = categoryMap[category];
          }
          if (vendorParam) {
            shopifyQuery += ` vendor:${vendorParam.replace(/\+/g, " ")}`;
          }
          if (filterParam) {
            shopifyQuery += ` ${filterParam.replace(/\+/g, " ")}`;
          }
        }
        
        const data = await fetchShopifyProducts(250, shopifyQuery.trim() || undefined);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, vendorParam, filterParam, queryParam]);

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, category, sortBy]);

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
    setCurrentPage(1);
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
            {loading 
              ? "Loading..." 
              : `Showing ${((currentPage - 1) * PRODUCTS_PER_PAGE) + 1}-${Math.min(currentPage * PRODUCTS_PER_PAGE, filteredAndSortedProducts.length)} of ${filteredAndSortedProducts.length} products`
            }
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
              {paginatedProducts.map((product) => {
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
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => setOfferProduct({
                            name: product.node.title,
                            price: price ? `${price.currencyCode} ${parseFloat(price.amount).toLocaleString()}` : undefined
                          })}
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Offer
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Buy
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedProducts.map((product) => {
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
                            variant="secondary"
                            size="sm"
                            onClick={() => setOfferProduct({
                              name: product.node.title,
                              price: price ? `${price.currencyCode} ${parseFloat(price.amount).toLocaleString()}` : undefined
                            })}
                          >
                            <DollarSign className="w-4 h-4 mr-1" />
                            Offer
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first, last, current, and adjacent pages
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, idx, arr) => {
                      // Add ellipsis if there's a gap
                      const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;
                      return (
                        <span key={page} className="flex items-center">
                          {showEllipsisBefore && (
                            <PaginationItem>
                              <span className="px-2 text-muted-foreground">...</span>
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        </span>
                      );
                    })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>

      <MakeOfferModal
        isOpen={!!offerProduct}
        onClose={() => setOfferProduct(null)}
        productName={offerProduct?.name || ""}
        productPrice={offerProduct?.price}
      />

      <Footer />
    </div>
  );
};

export default ProductListing;
