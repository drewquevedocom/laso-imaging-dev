import { create } from "zustand";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface UserInfo {
  name?: string;
  email?: string;
  phone?: string;
  facility?: string;
}

interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  messages: ChatMessage[];
  pendingQuery: string | null;
  userInfo: UserInfo;
  isLoading: boolean;
  conversationId: string | null;
  openChat: () => void;
  closeChat: () => void;
  toggleMinimize: () => void;
  addMessage: (message: Omit<ChatMessage, "timestamp">) => void;
  setPendingQuery: (query: string | null) => void;
  setUserInfo: (info: Partial<UserInfo>) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  setConversationId: (id: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  isMinimized: false,
  messages: [],
  pendingQuery: null,
  userInfo: {},
  isLoading: false,
  conversationId: null,
  openChat: () => set({ isOpen: true, isMinimized: false }),
  closeChat: () => set({ isOpen: false }),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, timestamp: new Date() }],
    })),
  setPendingQuery: (query) => set({ pendingQuery: query }),
  setUserInfo: (info) =>
    set((state) => ({ userInfo: { ...state.userInfo, ...info } })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),
  setConversationId: (id) => set({ conversationId: id }),
  setMessages: (messages) => set({ messages }),
}));
