import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Loader2 } from 'lucide-react';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { useRecentSearches } from '@/hooks/useRecentSearches';

interface MobileSearchInputProps {
  onClose: () => void;
}

export const MobileSearchInput = ({ onClose }: MobileSearchInputProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewProducts, setPreviewProducts] = useState<ShopifyProduct[]>([]);
  const navigate = useNavigate();
  const { recentSearches, addSearch, removeSearch } = useRecentSearches();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search for instant preview
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setPreviewProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const products = await fetchShopifyProducts(6, query.trim());
        setPreviewProducts(products);
      } catch (error) {
        console.error('Search preview error:', error);
        setPreviewProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addSearch(query.trim());
      navigate(`/products?query=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleProductClick = (handle: string) => {
    addSearch(query.trim());
    navigate(`/product/${handle}`);
    onClose();
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
    addSearch(search);
    navigate(`/products?query=${encodeURIComponent(search)}`);
    onClose();
  };

  const formatPrice = (amount: string) => {
    const num = parseFloat(amount);
    return num > 0 ? `$${num.toLocaleString()}` : 'Contact for Price';
  };

  const showDropdown = isFocused && (query.trim().length > 0 || recentSearches.length > 0);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center bg-secondary rounded-lg border border-border overflow-hidden">
          <Search className="w-5 h-5 text-muted-foreground ml-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search parts, systems, equipment..."
            className="flex-1 py-3 px-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
            autoComplete="off"
          />
          {isLoading && (
            <Loader2 className="w-4 h-4 text-muted-foreground mr-2 animate-spin" />
          )}
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-2 mr-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Recent Searches (when no query) */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                Recent Searches
              </div>
              {recentSearches.map((search) => (
                <div
                  key={search}
                  className="flex items-center justify-between px-2 py-2 hover:bg-secondary rounded cursor-pointer group"
                >
                  <button
                    type="button"
                    onClick={() => handleRecentClick(search)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{search}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSearch(search);
                    }}
                    className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Product Preview Results */}
          {query.trim().length >= 2 && (
            <>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                  Searching...
                </div>
              ) : previewProducts.length > 0 ? (
                <div className="p-2">
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                    Products
                  </div>
                  {previewProducts.map((product) => (
                    <button
                      key={product.node.id}
                      type="button"
                      onClick={() => handleProductClick(product.node.handle)}
                      className="flex items-center gap-3 w-full px-2 py-2 hover:bg-secondary rounded text-left"
                    >
                      {product.node.images.edges[0]?.node.url ? (
                        <img
                          src={product.node.images.edges[0].node.url}
                          alt=""
                          className="w-10 h-10 object-cover rounded bg-muted"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <Search className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {product.node.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatPrice(product.node.priceRange.minVariantPrice.amount)}
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full mt-2 px-3 py-2 text-sm text-primary hover:bg-secondary rounded text-center"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No products found for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileSearchInput;
