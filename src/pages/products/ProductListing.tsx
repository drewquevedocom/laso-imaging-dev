import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, FileText, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">{categoryTitle}</h1>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No products found in this category.</p>
              <Link to="/">
                <Button>Browse All Equipment</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const variant = product.node.variants.edges[0]?.node;
                const image = product.node.images.edges[0]?.node;
                const price = variant?.price;

                return (
                  <div
                    key={product.node.id}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card transition-all group"
                  >
                    <div className="relative h-56 overflow-hidden bg-secondary">
                      {image && (
                        <img
                          src={image.url}
                          alt={image.altText || product.node.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">
                        {product.node.title}
                      </h3>
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
                        <Link to="/contact" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <FileText className="w-4 h-4 mr-1" />
                            Request Quote
                          </Button>
                        </Link>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
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
