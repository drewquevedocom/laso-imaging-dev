import { useState } from 'react';
import { Globe, Search } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';

interface MobileSearchInputProps {
  onClose: () => void;
}

export const MobileSearchInput = ({ onClose }: MobileSearchInputProps) => {
  const [query, setQuery] = useState('');
  const { openChat, setPendingQuery } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setPendingQuery(query.trim());
      openChat();
      onClose();
    }
  };

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
