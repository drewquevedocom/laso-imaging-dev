import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "./useCustomerAuth";
import { useToast } from "./use-toast";

interface Conversation {
  id: string;
  customer_id: string;
  subject: string | null;
  type: string;
  status: string;
  last_message_at: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_type: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export const useCustomerMessages = () => {
  const { profile, isAuthenticated } = useCustomerAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUnread, setTotalUnread] = useState(0);

  const fetchConversations = useCallback(async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("customer_id", profile.id)
        .eq("type", "support")
        .order("last_message_at", { ascending: false });

      if (error) throw error;

      const convs = data as Conversation[];
      setConversations(convs);
      setTotalUnread(convs.reduce((sum, c) => sum + (c.unread_count || 0), 0));
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (isAuthenticated && profile?.id) {
      fetchConversations();
    }
  }, [isAuthenticated, profile?.id, fetchConversations]);

  // Set up realtime subscription for new messages
  useEffect(() => {
    if (!profile?.id || !isAuthenticated) return;

    const channel = supabase
      .channel(`customer-messages-${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_conversations",
          filter: `customer_id=eq.${profile.id}`,
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, isAuthenticated, fetchConversations]);

  const createConversation = useCallback(async (subject: string, initialMessage: string) => {
    if (!profile?.id) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to send messages.",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from("chat_conversations")
        .insert({
          customer_id: profile.id,
          subject,
          type: "support",
          status: "active",
          session_id: `support-${profile.id}-${Date.now()}`,
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add initial message
      const { error: msgError } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: conversation.id,
          sender_type: "user",
          content: initialMessage,
        });

      if (msgError) throw msgError;

      toast({
        title: "Message Sent",
        description: "Our team will respond shortly.",
      });

      fetchConversations();
      return conversation as Conversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [profile?.id, toast, fetchConversations]);

  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    try {
      const { error } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: conversationId,
          sender_type: "user",
          content,
        });

      if (error) throw error;

      // Update last_message_at
      await supabase
        .from("chat_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const getMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return data as Message[];
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }, []);

  return {
    conversations,
    loading,
    totalUnread,
    createConversation,
    sendMessage,
    getMessages,
    refetch: fetchConversations,
  };
};
