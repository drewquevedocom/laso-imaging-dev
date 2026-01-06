import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Wrench, Phone, CheckCircle, DollarSign, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchShopifyProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import MakeOfferModal from "@/components/offer/MakeOfferModal";

const BuySell = () => {
  const [featuredSystems, setFeaturedSystems] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [offerProduct, setOfferProduct] = useState<{ name: string; price?: string } | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchShopifyProducts(6, 'product_type:"1.5T MRI Systems" OR product_type:"3.0T MRI Systems" OR product_type:"Mobile MRI Systems"');
        setFeaturedSystems(products);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product: ShopifyProduct) => {
    const firstVariant = product.node.variants.edges[0]?.node;
    if (firstVariant) {
      addItem({
        product,
        variantId: firstVariant.id,
        variantTitle: firstVariant.title !== "Default Title" ? firstVariant.title : "",
        price: firstVariant.price,
        quantity: 1,
        selectedOptions: firstVariant.selectedOptions,
      });
      toast.success(`${product.node.title} added to cart`);
    }
  };

  const buyBenefits = [
    { icon: ShieldCheck, title: "Quality Assured", description: "All systems tested and certified" },
    { icon: Truck, title: "Nationwide Delivery", description: "Professional shipping & handling" },
    { icon: Wrench, title: "Installation Included", description: "Expert installation services" },
  ];

  const sellBenefits = [
    { icon: DollarSign, title: "Top Dollar Value", description: "Competitive pricing for your equipment" },
    { icon: Search, title: "Free Evaluation", description: "No-obligation equipment assessment" },
    { icon: CheckCircle, title: "Fast Turnaround", description: "Quick quotes and payment" },
  ];

  return (
    <>
      <SEOHead
        title="Buy & Sell Medical Imaging Systems | MRI, CT, X-Ray | LASO Medical"
        description="Buy refurbished MRI, CT, and X-Ray systems or sell your medical imaging equipment. Trusted partner for healthcare facilities nationwide. Get a free quote today."
        keywords={["buy MRI machine", "sell MRI equipment", "refurbished CT scanner", "medical imaging trade-in", "used imaging systems"]}
        canonical="/buy-sell"
      />
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary-dark py-20 lg:py-28">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Buy & Sell Imaging Systems
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Your trusted partner for medical imaging equipment transactions. 
                Whether you're looking to purchase quality refurbished systems or sell your existing equipment, 
                we provide expert service every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg">
                  <Link to="/products?category=mri-systems">
                    Browse Systems <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg bg-transparent border-white text-white hover:bg-white/10">
                  <Link to="/quote?interest=Sell Equipment">
                    Sell Your Equipment
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Buy & Sell Sections */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Buy Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-card rounded-2xl p-8 h-full border border-border shadow-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-6">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Buy Imaging Systems</h2>
                  <p className="text-muted-foreground mb-6">
                    Browse our extensive inventory of refurbished MRI, CT, and X-Ray systems. 
                    Every system undergoes rigorous testing and comes with our quality guarantee.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {buyBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <benefit.icon className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-foreground">{benefit.title}</span>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg" className="w-full">
                    <Link to="/products?category=mri-systems">
                      View Available Systems <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* Sell Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-card rounded-2xl p-8 h-full border border-border shadow-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-xl mb-6">
                    <DollarSign className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Sell Your Equipment</h2>
                  <p className="text-muted-foreground mb-6">
                    Looking to upgrade or decommission your imaging equipment? 
                    We offer competitive prices and hassle-free transactions for your used systems.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {sellBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <benefit.icon className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-foreground">{benefit.title}</span>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg" variant="secondary" className="w-full">
                    <Link to="/quote?interest=Sell Equipment">
                      Get a Free Quote <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Systems */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Featured Imaging Systems
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse our selection of quality refurbished imaging equipment ready for immediate purchase.
              </p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredSystems.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSystems.map((product) => (
                  <motion.div
                    key={product.node.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="group overflow-hidden h-full flex flex-col">
                      <Link to={`/product/${product.node.handle}`} className="block overflow-hidden">
                        <img
                          src={product.node.images.edges[0]?.node.url || "/placeholder.svg"}
                          alt={product.node.images.edges[0]?.node.altText || product.node.title}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <Link to={`/product/${product.node.handle}`}>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {product.node.title}
                          </h3>
                        </Link>
                        <p className="text-lg font-bold text-primary mt-2">
                          ${parseFloat(product.node.priceRange.minVariantPrice.amount).toLocaleString()}
                        </p>
                        <div className="flex gap-2 mt-auto pt-4">
                          <Button asChild size="sm" variant="outline" className="flex-1">
                            <Link to={`/quote?product=${encodeURIComponent(product.node.title)}`}>
                              Quote
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => setOfferProduct({
                              name: product.node.title,
                              price: `$${parseFloat(product.node.priceRange.minVariantPrice.amount).toLocaleString()}`
                            })}
                          >
                            <DollarSign className="w-3 h-3 mr-1" />
                            Offer
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleAddToCart(product)}
                          >
                            Buy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No systems currently available. Check back soon!</p>
              </div>
            )}

            <div className="text-center mt-10">
              <Button asChild size="lg" variant="outline">
                <Link to="/products?category=mri-systems">
                  View All Systems <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Why Choose LASO Medical?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                With over 18 years of experience in medical imaging, we're the trusted choice for healthcare facilities nationwide.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "18+ Years", subtitle: "Industry Experience" },
                { title: "FDA Registered", subtitle: "Certified Equipment" },
                { title: "Nationwide", subtitle: "Shipping & Service" },
                { title: "Full Service", subtitle: "Install & Support" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-6 bg-card rounded-xl border border-border"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{stat.title}</div>
                  <div className="text-muted-foreground">{stat.subtitle}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact our team today for a free consultation on buying or selling medical imaging equipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link to="/quote">
                  Request a Quote <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg bg-transparent border-white text-white hover:bg-white/10">
                <a href="tel:1-800-MRI-LASO">
                  <Phone className="mr-2 h-5 w-5" /> Call 1-800-MRI-LASO
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <MakeOfferModal
        isOpen={!!offerProduct}
        onClose={() => setOfferProduct(null)}
        productName={offerProduct?.name || ""}
        productPrice={offerProduct?.price}
      />

      <Footer />
    </>
  );
};

export default BuySell;
