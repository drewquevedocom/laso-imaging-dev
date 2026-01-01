import { useState, useRef, useEffect } from 'react';
import { X, Globe, Send, Loader2, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AISearchModal = ({ isOpen, onClose, initialQuery }: AISearchModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && initialQuery && messages.length === 0) {
      handleSubmit(initialQuery);
    }
  }, [isOpen, initialQuery]);

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('ai-search', {
        body: { 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.data?.content || 'I apologize, but I encountered an issue. Please try again.' 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Search error:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an issue processing your request. Please try again or contact our team directly.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMessages([]);
    setInput('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogOverlay className="bg-foreground/60" />
      <DialogContent className="max-w-2xl w-[90vw] h-[80vh] max-h-[600px] p-0 gap-0 flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">ASK LASO AI</h2>
              <p className="text-xs text-muted-foreground">Your MRI Equipment Expert</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">How can I help you today?</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Ask me about MRI systems, parts, services, pricing, or anything related to medical imaging equipment.
              </p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length > 0 && !isLoading && (
          <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              View Products
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Get Quote
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              Contact Sales
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about MRI systems, parts, or services..."
              className="flex-1 px-4 py-3 bg-secondary rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full w-12 h-12"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISearchModal;
