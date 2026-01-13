import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  Search, X, Filter, Download, Star, CheckCircle2, 
  ArrowLeft, ShoppingCart, FileText, Bookmark, History,
  Zap, Settings, Package, Cpu, Radio, Thermometer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { fetchAllShopifyProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const categoryFilters = [
  { key: "coil", label: "Coils", icon: Radio },
  { key: "amplifier", label: "Amplifiers", icon: Zap },
  { key: "cold head", label: "Cold Heads", icon: Thermometer },
  { key: "compressor", label: "Compressors", icon: Settings },
  { key: "power supply", label: "Power Supplies", icon: Cpu },
  { key: "cable", label: "Cables", icon: Package },
];

const brandFilters = [
  { key: "GE", label: "GE Healthcare" },
  { key: "Siemens", label: "Siemens" },
  { key: "Philips", label: "Philips" },
  { key: "Toshiba", label: "Toshiba/Canon" },
  { key: "Hitachi", label: "Hitachi" },
];

const PartsSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("laso-recent-searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Fetch all parts on load
  useEffect(() => {
    const loadParts = async () => {
      setLoading(true);
      try {
        // Fetch all parts-related products with pagination
        const data = await fetchAllShopifyProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch parts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadParts();
  }, []);

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.node.title.toLowerCase().includes(query) ||
          p.node.description.toLowerCase().includes(query)
      );
    }

    // Category filters
    if (activeCategories.length > 0) {
      result = result.filter((p) =>
        activeCategories.some(
          (cat) =>
            p.node.title.toLowerCase().includes(cat) ||
            p.node.description.toLowerCase().includes(cat)
        )
      );
    }

    // Brand filters
    if (activeBrands.length > 0) {
      result = result.filter((p) =>
        activeBrands.some(
          (brand) =>
            p.node.title.toLowerCase().includes(brand.toLowerCase()) ||
            p.node.description.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    return result;
  }, [products, searchQuery, activeCategories, activeBrands]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query.trim())) {
      const newRecent = [query.trim(), ...recentSearches.slice(0, 4)];
      setRecentSearches(newRecent);
      localStorage.setItem("laso-recent-searches", JSON.stringify(newRecent));
    }
  }, [recentSearches]);

  const toggleCategory = (key: string) => {
    setActiveCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const toggleBrand = (key: string) => {
    setActiveBrands((prev) =>
      prev.includes(key) ? prev.filter((b) => b !== key) : [...prev, key]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategories([]);
    setActiveBrands([]);
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

    toast.success(`${product.node.title} added to cart`);
  };

  const exportResults = () => {
    const csv = [
      ["Title", "Price", "Description"].join(","),
      ...filteredProducts.map((p) =>
        [
          `"${p.node.title}"`,
          p.node.priceRange.minVariantPrice.amount,
          `"${p.node.description.slice(0, 100).replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laso-parts-search-${Date.now()}.csv`;
    a.click();
    toast.success("Results exported to CSV");
  };

  const hasActiveFilters = searchQuery || activeCategories.length > 0 || activeBrands.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Search Section */}
        <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-accent text-accent-foreground">
                <Bookmark className="w-3 h-3 mr-1" />
                Bookmark This Page
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                MRI Parts Finder
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-8">
                The fastest way to find OEM and aftermarket MRI parts. Search by part number, 
                description, or browse by category. Used by engineers and resellers worldwide.
              </p>

              {/* Main Search Input */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by part number, name, or description..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 pr-12 h-14 text-lg rounded-full bg-background border-2 border-transparent focus:border-accent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Keyboard Shortcut Hint */}
              <p className="text-primary-foreground/60 text-sm mt-3">
                Press <kbd className="px-2 py-0.5 bg-primary-foreground/10 rounded text-primary-foreground">/</kbd> to focus search
              </p>

              {/* Recent Searches */}
              {recentSearches.length > 0 && !searchQuery && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <History className="w-4 h-4 text-primary-foreground/60" />
                  {recentSearches.map((search, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      size="sm"
                      className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => setSearchQuery(search)}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Quick Filters */}
            <div className="mb-6 space-y-4">
              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground mr-2">
                  <Filter className="w-4 h-4 inline mr-1" />
                  Category:
                </span>
                {categoryFilters.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategories.includes(cat.key);
                  return (
                    <Button
                      key={cat.key}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory(cat.key)}
                      className={isActive ? "" : "hover:border-accent"}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>

              {/* Brand Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground mr-2">Brand:</span>
                {brandFilters.map((brand) => {
                  const isActive = activeBrands.includes(brand.key);
                  return (
                    <Button
                      key={brand.key}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleBrand(brand.key)}
                      className={isActive ? "" : "hover:border-accent"}
                    >
                      {brand.label}
                    </Button>
                  );
                })}
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <Link to="/">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {loading ? "Searching..." : `${filteredProducts.length} parts found`}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-1" />
                      Clear Filters
                    </Button>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={exportResults} disabled={filteredProducts.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse">
                    <div className="h-32 bg-secondary rounded mb-3" />
                    <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                    <div className="h-5 bg-secondary rounded w-1/2 mb-3" />
                    <div className="h-3 bg-secondary rounded w-full" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No parts found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const variant = product.node.variants.edges[0]?.node;
                  const image = product.node.images.edges[0]?.node;
                  const price = variant?.price;

                  return (
                    <div
                      key={product.node.id}
                      className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-card transition-all group"
                    >
                      <Link to={`/product/${product.node.handle}`}>
                        <div className="relative h-36 overflow-hidden bg-secondary">
                          {image ? (
                            <img
                              src={image.url}
                              alt={image.altText || product.node.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-4">
                        <Link to={`/product/${product.node.handle}`}>
                          <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2 hover:text-accent transition-colors">
                            {product.node.title}
                          </h3>
                        </Link>
                        {price && (
                          <p className="text-accent font-bold text-lg mb-2">
                            {price.currencyCode} {parseFloat(price.amount).toLocaleString()}
                          </p>
                        )}

                        {variant?.availableForSale && (
                          <div className="flex items-center gap-1 text-success text-xs mb-3">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>In Stock</span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Link to={`/quote?product=${encodeURIComponent(product.node.title)}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              Quote
                            </Button>
                          </Link>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-secondary/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Can't find what you need?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Our parts specialists can source hard-to-find components from our global network. 
              Get a custom quote within 24 hours.
            </p>
            <Link to="/quote?interest=Parts">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                <Star className="w-4 h-4 mr-2" />
                Request Custom Part Quote
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PartsSearch;
