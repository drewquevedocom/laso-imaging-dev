import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Search } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';

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

const placeholderTexts = [
  'Imaging Systems',
  'Services & Maintenance',
  'Parts & Components',
  'Mobile Solutions'
];

export const SearchBar = () => {
  const navigate = useNavigate();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const { openChat, setPendingQuery } = useChatStore();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (isProductSearch(inputValue.trim())) {
        navigate(`/products?query=${encodeURIComponent(inputValue.trim())}`);
      } else {
        setPendingQuery(inputValue.trim());
        openChat();
      }
      setInputValue('');
    }
  };

  const handleSearchClick = () => {
    if (inputValue.trim()) {
      if (isProductSearch(inputValue.trim())) {
        navigate(`/products?query=${encodeURIComponent(inputValue.trim())}`);
      } else {
        setPendingQuery(inputValue.trim());
        openChat();
      }
      setInputValue('');
    }
  };

  const showModeIndicator = inputValue.trim().length > 0;

  return (
    <form 
      onSubmit={handleSubmit}
      className={`
        relative flex items-center w-full max-w-2xl bg-secondary/50 rounded-full 
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
          onBlur={() => setIsFocused(false)}
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

      {/* Mode Indicator */}
      {showModeIndicator && (
        <span className={`text-xs px-2 whitespace-nowrap ${isProductSearch(inputValue) ? 'text-green-600' : 'text-blue-600'}`}>
          {isProductSearch(inputValue) ? '🔍 Products' : '💬 AI'}
        </span>
      )}

      {/* Search Button */}
      <button 
        type="submit"
        onClick={handleSearchClick}
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
  );
};
