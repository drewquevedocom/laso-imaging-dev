import { useEffect, useCallback, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useChatStore, ChatMessage } from '@/stores/chatStore';

const SESSION_KEY = 'laso_chat_session_id';

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Create a supabase client with x-session-id header for chat RLS policies
const createChatClient = (sessionId: string) => {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        headers: { 'x-session-id': sessionId },
      },
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
};

export const useChatPersistence = () => {
  const { 
    messages, 
    addMessage, 
    setConversationId, 
    conversationId,
    setMessages 
  } = useChatStore();
  
  const isInitialized = useRef(false);
  const lastSavedMessageCount = useRef(0);
  const sessionId = getOrCreateSessionId();
  
  // Chat-specific client with x-session-id header for RLS
  const chatClient = useMemo(() => createChatClient(sessionId), [sessionId]);

  // Initialize or restore conversation
  const initializeConversation = useCallback(async () => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      // Try to find existing conversation
      const { data: existingConv, error: findError } = await chatClient
        .from('chat_conversations')
        .select('id')
        .eq('session_id', sessionId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (findError) {
        console.error('Error finding conversation:', findError);
        return;
      }

      if (existingConv) {
        // Restore existing conversation
        setConversationId(existingConv.id);

        // Load messages
        const { data: savedMessages, error: msgError } = await chatClient
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', existingConv.id)
          .order('created_at', { ascending: true });

        if (msgError) {
          console.error('Error loading messages:', msgError);
          return;
        }

        if (savedMessages && savedMessages.length > 0) {
          const restoredMessages: ChatMessage[] = savedMessages.map((msg) => ({
            role: msg.sender_type as 'user' | 'assistant',
            content: msg.content,
            timestamp: new Date(msg.created_at),
          }));
          setMessages(restoredMessages);
          lastSavedMessageCount.current = restoredMessages.length;
        }
      } else {
        // Create new conversation
        const { data: newConv, error: createError } = await chatClient
          .from('chat_conversations')
          .insert({ session_id: sessionId, status: 'active' })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating conversation:', createError);
          return;
        }

        if (newConv) {
          setConversationId(newConv.id);
        }
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  }, [sessionId, setConversationId, setMessages, chatClient]);

  // Save new messages to database
  const saveMessage = useCallback(async (message: ChatMessage) => {
    if (!conversationId) return;

    try {
      await chatClient.from('chat_messages').insert({
        conversation_id: conversationId,
        sender_type: message.role,
        content: message.content,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }, [conversationId, chatClient]);

  // Watch for new messages and save them
  useEffect(() => {
    if (messages.length > lastSavedMessageCount.current && conversationId) {
      const newMessages = messages.slice(lastSavedMessageCount.current);
      newMessages.forEach(saveMessage);
      lastSavedMessageCount.current = messages.length;
    }
  }, [messages, conversationId, saveMessage]);

  // Request human handoff
  const requestHumanHandoff = useCallback(async () => {
    if (!conversationId) return;

    try {
      await chatClient
        .from('chat_conversations')
        .update({ status: 'waiting_human' })
        .eq('id', conversationId);

      addMessage({
        role: 'assistant',
        content: "I've notified our team that you'd like to speak with a human agent. Someone will reach out to you shortly. In the meantime, feel free to call us at (844) 511-5276.",
      });
    } catch (error) {
      console.error('Error requesting handoff:', error);
    }
  }, [conversationId, addMessage, chatClient]);

  // Initialize on mount
  useEffect(() => {
    initializeConversation();
  }, [initializeConversation]);

  return {
    requestHumanHandoff,
    sessionId,
  };
};
