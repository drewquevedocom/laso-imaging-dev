import { useState, useEffect } from "react";
import { fetchShopifyProducts, ShopifyProduct } from "@/lib/shopify";

export function useShopifyProductSearch(query?: string, limit: number = 50) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchShopifyProducts(limit, query || undefined);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch products"));
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [query, limit]);

  return { products, isLoading, error };
}
