import { useState, useEffect } from "react";
import { fetchAllShopifyProducts, ShopifyProduct } from "@/lib/shopify";

export function useShopifyProductSearch(query?: string) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use fetchAllShopifyProducts for complete catalog (756+ items)
        const data = await fetchAllShopifyProducts(query || undefined);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch products"));
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [query]);

  return { products, isLoading, error };
}
