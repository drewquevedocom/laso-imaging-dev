import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuoteForm from "@/components/shared/QuoteForm";
import { CheckCircle2, Shield, Award, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EquipmentFilters, { FilterState } from "@/components/equipment/EquipmentFilters";
import { searchProductsByType, ShopifyProduct } from "@/lib/shopify";
import mriSystem1 from "@/assets/mri-system-1.jpg";

const Systems15T = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    brand: "All",
    fieldStrength: "All",
    availability: "All",
  });
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Search for 1.5T MRI products
        const results = await searchProductsByType("1.5T", 50);
        setProducts(results);
      } catch (error) {
        console.error("Error fetching 1.5T products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const title = product.node.title.toLowerCase();
    const matchesSearch = title.includes(filters.search.toLowerCase());
    const matchesBrand = filters.brand === "All" || title.includes(filters.brand.toLowerCase());
    return matchesSearch && matchesBrand;
  });

  const formatPrice = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <>
      <Helmet>
        <title>1.5T MRI Systems | LASO Imaging</title>
        <meta
          name="description"
          content="Browse our selection of refurbished and certified 1.5T MRI systems from GE, Siemens, and Philips. FDA registered with 12-month warranty."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded mb-4">
                IMAGING SYSTEMS
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                1.5T MRI Systems
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                High-quality refurbished 1.5T MRI systems from leading manufacturers.
                All systems are FDA registered and come with a 12-month warranty.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <Shield className="h-5 w-5 text-accent" />
                  <span>FDA Registered</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <Award className="h-5 w-5 text-accent" />
                  <span>12-Month Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/90">
                  <Truck className="h-5 w-5 text-accent" />
                  <span>Installation Included</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Systems Grid */}
              <div className="lg:col-span-2">
                {/* Filters */}
                <EquipmentFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  showFieldStrength={false}
                  totalCount={products.length}
                  filteredCount={filteredProducts.length}
                />

                {loading ? (
                  <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <span className="ml-2 text-muted-foreground">Loading systems...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.node.id}
                        className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                      >
                        <div className="aspect-video bg-muted relative">
                          <img
                            src={product.node.images.edges[0]?.node.url || mriSystem1}
                            alt={product.node.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded bg-success text-success-foreground">
                            Available
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                            {product.node.title}
                          </h3>
                          <p className="text-lg font-bold text-accent mb-3">
                            {formatPrice(product.node.priceRange.minVariantPrice.amount)}
                          </p>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {product.node.description || "Contact us for specifications and details."}
                          </p>
                          <div className="flex gap-2">
                            <Link to={`/product/${product.node.handle}`} className="flex-1">
                              <Button variant="outline" className="w-full">
                                View Details
                              </Button>
                            </Link>
                            <Link to={`/quote?product=${encodeURIComponent(product.node.title)}`} className="flex-1">
                              <Button className="w-full">
                                Get Quote
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}

                    {!loading && filteredProducts.length === 0 && (
                      <div className="col-span-full text-center py-12 bg-muted rounded-xl">
                        <p className="text-muted-foreground mb-4">
                          {products.length === 0 
                            ? "No 1.5T systems currently available. Contact us for upcoming inventory."
                            : "No systems match your filters. Try adjusting your criteria."}
                        </p>
                        <Link to="/quote?interest=1.5T Systems">
                          <Button>Request Quote</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar Quote Form */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <QuoteForm
                    sourcePage="1.5T Systems"
                    prefilledInterest="1.5T Systems"
                    variant="sidebar"
                    title="Get a Quote"
                    subtitle="Interested in a 1.5T system? Let us know your requirements."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Systems15T;
