import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Loader2 } from 'lucide-react';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { useRecentSearches } from '@/hooks/useRecentSearches';

const productCategories = [
  '1.5T MRI Systems',
  '3.0T MRI Systems',
  'Mobile MRI Systems',
  'RF Coils',
  'MRI Parts',
  'CT Parts',
  'Power Supplies',
  'CT Scanners',
  'Circuit Boards',
];

export const ProductSearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewProducts, setPreviewProducts] = useState<ShopifyProduct[]>([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { recentSearches, addSearch, removeSearch } = useRecentSearches();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Animate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % productCategories.length);
        setIsAnimating(false);
      }, 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Debounced product search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (inputValue.trim().length < 2) {
      setPreviewProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const products = await fetchShopifyProducts(5, inputValue.trim());
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
  }, [inputValue]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeSearch = () => {
    if (inputValue.trim()) {
      addSearch(inputValue.trim());
      navigate(`/products?query=${encodeURIComponent(inputValue.trim())}`);
      setInputValue('');
      setIsFocused(false);
    }
  };

  const handleProductClick = (handle: string) => {
    addSearch(inputValue.trim());
    navigate(`/product/${handle}`);
    setInputValue('');
    setIsFocused(false);
  };

  const handleRecentClick = (search: string) => {
    addSearch(search);
    navigate(`/products?query=${encodeURIComponent(search)}`);
    setInputValue('');
    setIsFocused(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  const formatPrice = (amount: string) => {
    const num = parseFloat(amount);
    return num > 0 ? `$${num.toLocaleString()}` : 'Contact for Price';
  };

  const showDropdown = isFocused && (inputValue.trim().length > 0 || recentSearches.length > 0);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-secondary rounded-lg border border-border overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
          <div className="flex items-center pl-4">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full py-3 px-3 bg-transparent text-foreground placeholder-transparent focus:outline-none"
              placeholder={productCategories[placeholderIndex]}
            />
            {!inputValue && (
              <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                <span 
                  className={`text-muted-foreground transition-all duration-200 ${
                    isAnimating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
                  }`}
                >
                  {productCategories[placeholderIndex]}
                </span>
              </div>
            )}
          </div>

          {isLoading && (
            <Loader2 className="w-4 h-4 text-muted-foreground mr-2 animate-spin" />
          )}
          
          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="p-2 mr-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <button
            type="submit"
            className="flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto animate-fade-in">
          {/* Recent Searches */}
          {!inputValue.trim() && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recent Searches
              </div>
              {recentSearches.map((search) => (
                <div
                  key={search}
                  className="flex items-center justify-between px-3 py-2 hover:bg-secondary rounded-md cursor-pointer group transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => handleRecentClick(search)}
                    className="flex items-center gap-3 flex-1 text-left"
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
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Product Preview Results */}
          {inputValue.trim().length >= 2 && (
            <>
              {isLoading ? (
                <div className="p-6 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                  <span className="text-sm text-muted-foreground">Searching products...</span>
                </div>
              ) : previewProducts.length > 0 ? (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Products
                  </div>
                  {previewProducts.map((product) => (
                    <button
                      key={product.node.id}
                      type="button"
                      onClick={() => handleProductClick(product.node.handle)}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-secondary rounded-md text-left transition-colors"
                    >
                      {product.node.images.edges[0]?.node.url ? (
                        <img
                          src={product.node.images.edges[0].node.url}
                          alt=""
                          className="w-12 h-12 object-cover rounded-md bg-muted"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                          <Search className="w-5 h-5 text-muted-foreground" />
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
                    onClick={executeSearch}
                    className="w-full mt-2 px-3 py-2.5 text-sm font-medium text-primary hover:bg-secondary rounded-md text-center transition-colors"
                  >
                    View all results for "{inputValue}"
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No products found for "{inputValue}"
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;
