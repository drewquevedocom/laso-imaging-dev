import { useState } from 'react';
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

interface MobileSearchInputProps {
  onClose: () => void;
}

export const MobileSearchInput = ({ onClose }: MobileSearchInputProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { openChat, setPendingQuery } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (isProductSearch(query.trim())) {
        navigate(`/products?query=${encodeURIComponent(query.trim())}`);
      } else {
        setPendingQuery(query.trim());
        openChat();
      }
      onClose();
    }
  };

  const showModeIndicator = query.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center bg-secondary/50 rounded-full border border-border overflow-hidden">
        <Globe className="w-5 h-5 text-accent ml-3 flex-shrink-0" />
        <span className="text-xs font-semibold text-primary px-2 border-r border-border whitespace-nowrap">
          ASK LASO AI
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search equipment, parts, services..."
          className="flex-1 py-3 px-3 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
        />
        {showModeIndicator && (
          <span className={`text-xs px-2 whitespace-nowrap ${isProductSearch(query) ? 'text-green-600' : 'text-blue-600'}`}>
            {isProductSearch(query) ? '🔍' : '💬'}
          </span>
        )}
        <button
          type="submit"
          className="flex items-center justify-center w-8 h-8 mr-1 bg-primary rounded-full flex-shrink-0 hover:bg-primary/90 transition-colors"
        >
          <Search className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>
    </form>
  );
};

export default MobileSearchInput;
