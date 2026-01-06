import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuoteForm from "@/components/shared/QuoteForm";
import { Shield, Award, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EquipmentFilters, { FilterState } from "@/components/equipment/EquipmentFilters";
import { searchProductsByVendor, ShopifyProduct } from "@/lib/shopify";
import mriSystem1 from "@/assets/mri-system-1.jpg";

interface BrandInfo {
  name: string;
  fullName: string;
  vendorName: string;
  description: string;
  color: string;
}

const brandData: Record<string, BrandInfo> = {
  ge: {
    name: "GE",
    fullName: "GE Healthcare",
    vendorName: "GE",
    description: "GE Healthcare has been a leader in medical imaging for over a century. Their MRI systems are known for reliability, advanced technology, and exceptional image quality.",
    color: "from-blue-600 to-blue-800",
  },
  siemens: {
    name: "Siemens",
    fullName: "Siemens Healthineers",
    vendorName: "Siemens",
    description: "Siemens Healthineers pioneers breakthrough innovations in diagnostic and therapeutic imaging. Their MRI systems feature cutting-edge technology like BioMatrix and Tim 4G.",
    color: "from-teal-600 to-teal-800",
  },
  philips: {
    name: "Philips",
    fullName: "Philips Healthcare",
    vendorName: "Philips",
    description: "Philips Healthcare is known for innovative patient-centric design and advanced imaging technologies. Their Ingenia and Achieva platforms set industry standards.",
    color: "from-blue-500 to-indigo-700",
  },
  canon: {
    name: "Canon",
    fullName: "Canon Medical Systems",
    vendorName: "Canon",
    description: "Canon Medical Systems (formerly Toshiba Medical) delivers innovative imaging solutions with technologies like Pianissimo for ultra-quiet MRI scanning.",
    color: "from-red-600 to-red-800",
  },
  hitachi: {
    name: "Hitachi",
    fullName: "Hitachi Healthcare",
    vendorName: "Hitachi",
    description: "Hitachi Healthcare specializes in open MRI systems that provide exceptional patient comfort while maintaining high image quality for diagnostic excellence.",
    color: "from-gray-700 to-gray-900",
  },
};

const BrandPage = () => {
  const { brand } = useParams<{ brand: string }>();
  const brandInfo = brand ? brandData[brand.toLowerCase()] : null;

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
      if (!brandInfo) return;
      
      try {
        setLoading(true);
        const results = await searchProductsByVendor(brandInfo.vendorName, 50);
        setProducts(results);
      } catch (error) {
        console.error(`Error fetching ${brandInfo.name} products:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandInfo]);

  const filteredProducts = products.filter((product) => {
    const title = product.node.title.toLowerCase();
    const matchesSearch = title.includes(filters.search.toLowerCase());
    const matchesFieldStrength = filters.fieldStrength === "All" || 
      title.includes(filters.fieldStrength.toLowerCase());
    return matchesSearch && matchesFieldStrength;
  });

  const formatPrice = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (!brandInfo) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Brand Not Found</h1>
            <p className="text-muted-foreground mb-4">The brand you're looking for doesn't exist.</p>
            <Link to="/products" className="text-accent hover:underline">
              View All Equipment
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{brandInfo.fullName} Imaging Systems | LASO Imaging</title>
        <meta
          name="description"
          content={`Browse our selection of ${brandInfo.fullName} imaging systems. Refurbished and certified with 12-month warranty. FDA registered.`}
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className={`bg-gradient-to-r ${brandInfo.color} py-16 md:py-24`}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded mb-4">
                {brandInfo.name.toUpperCase()} IMAGING SYSTEMS
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {brandInfo.fullName}
              </h1>
              <p className="text-xl text-white/80 mb-8">
                {brandInfo.description}
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-white/90">
                  <Shield className="h-5 w-5" />
                  <span>FDA Registered</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Award className="h-5 w-5" />
                  <span>12-Month Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Truck className="h-5 w-5" />
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
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Available {brandInfo.name} Systems
                </h2>

                {/* Filters */}
                <EquipmentFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  showBrand={false}
                  showFieldStrength={true}
                  totalCount={products.length}
                  filteredCount={filteredProducts.length}
                />

                {loading ? (
                  <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <span className="ml-2 text-muted-foreground">Loading {brandInfo.name} systems...</span>
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
                            ? `No ${brandInfo.name} systems currently available. Contact us for upcoming inventory.`
                            : "No systems match your filters. Try adjusting your criteria."}
                        </p>
                        <Link to={`/quote?interest=${brandInfo.name}`}>
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
                    sourcePage={`${brandInfo.name} Brand Page`}
                    prefilledInterest="1.5T Systems"
                    variant="sidebar"
                    title={`Get a ${brandInfo.name} Quote`}
                    subtitle={`Interested in ${brandInfo.fullName} equipment? Let us help.`}
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

export default BrandPage;
