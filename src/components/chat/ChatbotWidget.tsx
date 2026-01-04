import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Minimize2, Maximize2, Send, User, Bot, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/chatStore";
import { useChatPersistence } from "@/hooks/useChatPersistence";
import { supabase } from "@/integrations/supabase/client";
import TypingIndicator from "./TypingIndicator";

const ChatbotWidget = () => {
  const {
    isOpen,
    isMinimized,
    messages,
    pendingQuery,
    isLoading,
    openChat,
    closeChat,
    toggleMinimize,
    addMessage,
    setPendingQuery,
    setLoading,
  } = useChatStore();

  const { requestHumanHandoff } = useChatPersistence();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle pending query from search bar
  useEffect(() => {
    if (pendingQuery && isOpen) {
      handleSend(pendingQuery);
      setPendingQuery(null);
    }
  }, [pendingQuery, isOpen]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    // Add user message
    addMessage({ role: "user", content: text });
    setInput("");
    setLoading(true);

    try {
      // Build message history for context
      const messageHistory = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: text },
      ];

      const { data, error } = await supabase.functions.invoke("ai-chatbot", {
        body: { messages: messageHistory },
      });

      if (error) throw error;

      addMessage({
        role: "assistant",
        content: data.content || "I apologize, but I could not generate a response.",
      });
    } catch (error) {
      console.error("Chatbot error:", error);
      addMessage({
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again or call us at (818) 916-9503 or 1-800-MRI-LASO.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRequestHuman = () => {
    requestHumanHandoff();
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={openChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 animate-pulse"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-card border border-border rounded-xl shadow-2xl flex flex-col transition-all duration-300 ${
        isMinimized ? "w-72 h-14" : "w-96 h-[500px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-primary rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary-foreground">LASO AI Sales Advisor</h3>
            {!isMinimized && (
              <p className="text-xs text-primary-foreground/70">75+ years combined expertise</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMinimize}
            className="p-1.5 hover:bg-primary-foreground/10 rounded text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={closeChat}
            className="p-1.5 hover:bg-primary-foreground/10 rounded text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-accent mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-2">Hi! I'm your MRI specialist</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  With 75+ years of combined experience, I'm here to help you find the perfect 
                  MRI system or parts. What can I help you with today?
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Looking for a 1.5T MRI", "Need replacement parts", "Mobile MRI rental"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSend(suggestion)}
                      className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user" ? "bg-accent" : "bg-primary"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-3.5 h-3.5 text-accent-foreground" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <div className="bg-secondary rounded-xl px-3 py-2">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Human Handoff Button - show after some messages */}
          {messages.length >= 2 && (
            <div className="px-3 pb-2">
              <button
                onClick={handleRequestHuman}
                className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <Phone className="w-3 h-3" />
                Speak to a human agent
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-accent hover:bg-accent/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotWidget;
