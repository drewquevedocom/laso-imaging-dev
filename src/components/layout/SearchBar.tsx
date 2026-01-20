import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Search, Clock, X, Loader2 } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { useRecentSearches } from '@/hooks/useRecentSearches';

const placeholderTexts = [
  'Imaging Systems',
  'Services & Maintenance',
  'Parts & Components',
  'Mobile Solutions'
];

// Detection patterns for product searches
const PRODUCT_PATTERNS = [
  /\b(ge|siemens|philips|canon|toshiba|hitachi)\b/i,
  /\b(mri|ct|scanner|coil|magnet|x-ray|xray|pet|petct)\b/i,
  /\b(parts?|component|board|power supply|gradient|amplifier)\b/i,
  /\b(1\.5t|1\.5 t|3t|3\.0t|3\.0 t|0\.35t)\b/i,
  /\b(\d+[\-\s]?slice)\b/i,
  /\b[A-Z0-9]{2,}-[A-Z0-9]{2,}/i,
  /\b(mobile|system|machine|unit)\b/i,
];

const AI_CHAT_PATTERNS = [
  /^(what|how|why|when|where|who|can you|could you|help|tell me)/i,
  /\b(quote|pricing|service|install|repair|maintenance|support)\b/i,
  /\b(question|help me|i need help|looking for help)\b/i,
];

const isProductSearch = (query: string): boolean => {
  if (AI_CHAT_PATTERNS.some(p => p.test(query))) return false;
  if (PRODUCT_PATTERNS.some(p => p.test(query))) return true;
  return query.split(' ').length <= 2;
};

export const SearchBar = () => {
  const navigate = useNavigate();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewProducts, setPreviewProducts] = useState<ShopifyProduct[]>([]);
  
  const { openChat, setPendingQuery } = useChatStore();
  const { recentSearches, addSearch, removeSearch } = useRecentSearches();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Animated placeholder text
  useEffect(() => {
    const currentFullText = placeholderTexts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % placeholderTexts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex]);

  // Debounced search for instant preview
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (inputValue.trim().length < 2 || !isProductSearch(inputValue)) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  const executeSearch = () => {
    if (inputValue.trim()) {
      addSearch(inputValue.trim());
      if (isProductSearch(inputValue.trim())) {
        navigate(`/products?query=${encodeURIComponent(inputValue.trim())}`);
      } else {
        setPendingQuery(inputValue.trim());
        openChat();
      }
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
    if (isProductSearch(search)) {
      navigate(`/products?query=${encodeURIComponent(search)}`);
    } else {
      setPendingQuery(search);
      openChat();
    }
    setInputValue('');
    setIsFocused(false);
  };

  const formatPrice = (amount: string) => {
    const num = parseFloat(amount);
    return num > 0 ? `$${num.toLocaleString()}` : 'Contact for Price';
  };

  const showDropdown = isFocused && (inputValue.trim().length > 0 || recentSearches.length > 0);
  const showModeIndicator = inputValue.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <form 
        onSubmit={handleSubmit}
        className={`
          relative flex items-center w-full bg-secondary/50 rounded-full 
          border-2 transition-all duration-300
          ${isFocused 
            ? 'border-accent shadow-lg ring-4 ring-accent/20' 
            : 'border-border hover:border-accent/50'
          }
        `}
      >
        {/* Globe Icon */}
        <div className="flex items-center pl-4 pr-2">
          <Globe className="w-5 h-5 text-accent" />
        </div>

        {/* ASK LASO AI Label */}
        <div className="flex items-center pr-3 border-r border-border/50">
          <span className="text-sm font-semibold text-primary whitespace-nowrap">
            ASK LASO AI
          </span>
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full py-3 px-4 bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            placeholder=""
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            autoComplete="off"
          />
          {/* Animated Placeholder */}
          {!inputValue && (
            <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
              <span className="text-muted-foreground/50">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </div>
          )}
        </div>

        {/* Loading / Mode Indicator */}
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-muted-foreground mr-2 animate-spin" />
        ) : showModeIndicator && (
          <span className={`text-xs px-2 whitespace-nowrap ${isProductSearch(inputValue) ? 'text-green-600' : 'text-blue-600'}`}>
            {isProductSearch(inputValue) ? '🔍 Products' : '💬 AI'}
          </span>
        )}

        {/* Search Button */}
        <button 
          type="submit"
          className="
            flex items-center justify-center w-10 h-10 mr-1.5
            bg-primary hover:bg-primary/90 rounded-full
            transition-all duration-200 hover:scale-105 active:scale-95
            group
          "
          aria-label="Search"
        >
          <Search className="w-4 h-4 text-primary-foreground group-hover:scale-110 transition-transform" />
        </button>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-background border border-border rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Recent Searches (when no query or AI mode) */}
          {(!inputValue.trim() || !isProductSearch(inputValue)) && recentSearches.length > 0 && (
            <div className="p-3">
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Recent Searches
              </div>
              {recentSearches.map((search) => (
                <div
                  key={search}
                  className="flex items-center justify-between px-2 py-2 hover:bg-secondary rounded-lg cursor-pointer group"
                >
                  <button
                    type="button"
                    onClick={() => handleRecentClick(search)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{search}</span>
                    <span className={`text-xs ml-auto ${isProductSearch(search) ? 'text-green-600' : 'text-blue-600'}`}>
                      {isProductSearch(search) ? '🔍' : '💬'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSearch(search);
                    }}
                    className="p-1 ml-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Product Preview Results */}
          {inputValue.trim().length >= 2 && isProductSearch(inputValue) && (
            <>
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                  Searching products...
                </div>
              ) : previewProducts.length > 0 ? (
                <div className="p-3">
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Products
                  </div>
                  {previewProducts.map((product) => (
                    <button
                      key={product.node.id}
                      type="button"
                      onClick={() => handleProductClick(product.node.handle)}
                      className="flex items-center gap-3 w-full px-2 py-2 hover:bg-secondary rounded-lg text-left"
                    >
                      {product.node.images.edges[0]?.node.url ? (
                        <img
                          src={product.node.images.edges[0].node.url}
                          alt=""
                          className="w-12 h-12 object-cover rounded-lg bg-muted"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
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
                    className="w-full mt-2 px-3 py-2 text-sm text-primary hover:bg-secondary rounded-lg text-center font-medium"
                  >
                    View all results for "{inputValue}"
                  </button>
                </div>
              ) : inputValue.trim().length >= 2 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No products found for "{inputValue}"
                </div>
              ) : null}
            </>
          )}

          {/* AI Chat hint */}
          {inputValue.trim().length >= 2 && !isProductSearch(inputValue) && (
            <div className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-2">
                💬 This looks like a question
              </div>
              <button
                type="button"
                onClick={executeSearch}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90"
              >
                Ask LASO AI
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
