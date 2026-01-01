import { useState, useEffect } from "react";
import { CheckCircle2, Shield, Wrench, Headphones, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { fetchShopifyProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import QuoteForm from "@/components/shared/QuoteForm";

// Fallback data for when Shopify products aren't loaded
import mriSystem from "@/assets/mri-system-1.jpg";
import ctScanner from "@/assets/ct-scanner.jpg";
import mobileMri from "@/assets/mobile-mri.jpg";

const fallbackSystems = [
  {
    image: mriSystem,
    badge: "In Stock",
    badgeColor: "bg-success",
    title: "GE 1.5T 23X 16ch Fixed MRI System",
    price: "Contact for Quote",
    description: "1.5T MRI system with 23 channel 16ch configuration.",
    features: ["FDA Registered", "Warranty Included", "Installation Available", "24/7 Support"],
  },
  {
    image: ctScanner,
    badge: "Parts Available",
    badgeColor: "bg-accent",
    title: "Toshiba/Canon Aquilion ONE CT Scanner",
    price: "Contact for Quote",
    description: "Premium CT scanner with parts and service available.",
    features: ["Wide-Area Detector", "Low-Dose Imaging", "AI Reconstruction", "Service Contracts"],
  },
  {
    image: mobileMri,
    badge: "Available Now",
    badgeColor: "bg-success",
    title: "2007 GE 1.5T 23 X 16 Channel Mobile MRI Unit",
    price: "Contact for Quote",
    description: "GE 1.5T Mobile MRI in 07 OSH 102\" Trailer.",
    features: ["Short-Term Rental", "Lease-to-Own Options", "16-Channel System", "Full Coil Package"],
    specialBadge: "RENTAL / LEASE / SALE",
  },
];

const FeaturedSystems = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const shopifyProducts = await fetchShopifyProducts(6);
      setProducts(shopifyProducts);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) {
      toast.error("No variant available for this product");
      return;
    }

    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });

    toast.success("Added to cart!", {
      description: product.node.title,
    });
  };

  // Show Shopify products if available, otherwise fallback
  const hasShopifyProducts = products.length > 0;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured MRI Systems</h2>
            <p className="text-muted-foreground mt-1">Premium quality systems for your healthcare facility</p>
          </div>
          <Button variant="outline">View All Systems</Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="h-56 bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-20 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shopify Products Grid */}
        {!loading && hasShopifyProducts && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <div 
                key={product.node.id}
                className="bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-secondary/20">
                  {product.node.images.edges[0]?.node ? (
                    <img 
                      src={product.node.images.edges[0].node.url} 
                      alt={product.node.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-success text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                      {product.node.variants.edges[0]?.node.availableForSale ? "In Stock" : "Contact Us"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {product.node.title}
                  </h3>
                  <p className="text-accent font-semibold mb-3">
                    {product.node.priceRange.minVariantPrice.currencyCode} {parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)}
                  </p>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.node.description || "Premium quality medical imaging equipment."}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3 w-3 text-accent" />
                      <span>FDA Registered</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-accent" />
                      <span>Warranty Included</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Wrench className="h-3 w-3 text-accent" />
                      <span>Installation</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Headphones className="h-3 w-3 text-accent" />
                      <span>24/7 Support</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="cta" 
                          className="flex-1"
                          onClick={() => setSelectedProduct(product.node.title)}
                        >
                          Request Quote
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Request Quote: {product.node.title}</DialogTitle>
                        </DialogHeader>
                        <QuoteForm prefilledInterest={product.node.title} sourcePage="featured-systems" />
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback Systems Grid */}
        {!loading && !hasShopifyProducts && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallbackSystems.map((system, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={system.image} 
                    alt={system.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {system.specialBadge && (
                      <span className="bg-warning text-warning-foreground text-xs font-semibold px-2 py-1 rounded">
                        {system.specialBadge}
                      </span>
                    )}
                    <span className={`${system.badgeColor} text-primary-foreground text-xs font-semibold px-2 py-1 rounded`}>
                      {system.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {system.title}
                  </h3>
                  <p className="text-accent font-semibold mb-3">{system.price}</p>
                  <p className="text-muted-foreground text-sm mb-4">{system.description}</p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {system.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        {i === 0 && <Shield className="h-3 w-3 text-accent" />}
                        {i === 1 && <CheckCircle2 className="h-3 w-3 text-accent" />}
                        {i === 2 && <Wrench className="h-3 w-3 text-accent" />}
                        {i === 3 && <Headphones className="h-3 w-3 text-accent" />}
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="cta" className="flex-1">Request Quote</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Request Quote: {system.title}</DialogTitle>
                        </DialogHeader>
                        <QuoteForm prefilledInterest={system.title} sourcePage="featured-systems" />
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="flex-1">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" size="lg">View All Systems</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSystems;
