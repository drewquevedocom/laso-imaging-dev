import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, FileText, Eye, Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchProductsByType, ShopifyProduct } from "@/lib/shopify";
import mriSystem1 from "@/assets/mri-system-1.jpg";
import ctScanner from "@/assets/ct-scanner.jpg";
import mobileMri from "@/assets/mobile-mri.jpg";

const fallbackSystems = [
  {
    id: "1",
    handle: "ge-signa-hdxt-1-5t-mri",
    image: mriSystem1,
    title: "GE Signa HDxt 1.5T MRI",
    price: "$89,000",
    description: "Complete system with 16 channels, cardiac and neuro packages included.",
    features: ["16 Channel", "Cardiac Ready", "1-Year Warranty"],
    isMobile: false
  },
  {
    id: "2",
    handle: "siemens-magnetom-verio-3t",
    image: ctScanner,
    title: "Siemens MAGNETOM Verio 3.0T",
    price: "$195,000",
    description: "High-field 3T MRI with Tim technology for advanced imaging applications.",
    features: ["70cm Open Bore", "Tim Technology", "Full Warranty"],
    isMobile: false
  },
  {
    id: "3",
    handle: "mobile-mri-trailer-siemens",
    image: mobileMri,
    title: "Mobile MRI Trailer - GE Signa",
    price: "Contact for Pricing",
    description: "Turnkey mobile MRI solution with GE 1.5T system, DOT certified and site ready.",
    features: ["Turnkey Solution", "DOT Certified", "Site Ready"],
    isMobile: true
  }
];

const FeaturedSystems = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Fetch MRI systems including mobile units
        const mriProducts = await searchProductsByType("MRI", 6);
        setProducts(mriProducts);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const formatPrice = (amount: string, currencyCode: string) => {
    const numAmount = parseFloat(amount);
    if (numAmount === 0) return "Contact for Pricing";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  const isMobileUnit = (title: string) => {
    return title.toLowerCase().includes('mobile') || title.toLowerCase().includes('trailer');
  };

  const displaySystems = products.length > 0 
    ? products.slice(0, 3).map(product => ({
        id: product.node.id,
        handle: product.node.handle,
        image: product.node.images.edges[0]?.node.url || mriSystem1,
        title: product.node.title,
        price: formatPrice(
          product.node.priceRange.minVariantPrice.amount,
          product.node.priceRange.minVariantPrice.currencyCode
        ),
        description: product.node.description?.slice(0, 100) + (product.node.description?.length > 100 ? '...' : '') || 'Quality medical imaging equipment.',
        features: product.node.options?.slice(0, 3).map(opt => opt.name) || ['Certified', 'Warranty Included', 'Full Support'],
        isMobile: isMobileUnit(product.node.title)
      }))
    : fallbackSystems;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured MRI Systems</h2>
            <p className="text-muted-foreground">Pre-owned imaging equipment with full warranty</p>
          </div>
          <Link to="/products">
            <Button variant="outline">View All Systems</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySystems.map((system) => (
              <div
                key={system.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={system.image}
                    alt={system.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {system.isMobile && (
                      <div className="bg-success text-success-foreground text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        MOBILE
                      </div>
                    )}
                    <div className="bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                      FEATURED
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-1">{system.title}</h3>
                  <p className="text-accent font-bold text-xl mb-3">{system.price}</p>
                  <p className="text-muted-foreground text-sm mb-4">{system.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {system.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                      >
                        <CheckCircle2 className="w-3 h-3 text-success" />
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/quote?product=${encodeURIComponent(system.title)}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="w-4 h-4 mr-1" />
                        Request Quote
                      </Button>
                    </Link>
                    <Link to={`/product/${system.handle}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSystems;
