import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EmailDeliveryEvent {
  id: string;
  email_id: string;
  event_type: string;
  recipient: string;
  created_at: string | null;
  payload: unknown;
  quote_id: string | null;
}

export function useEmailDeliveryStatus(quoteId: string | null) {
  return useQuery({
    queryKey: ["email-delivery-status", quoteId],
    queryFn: async () => {
      if (!quoteId) return null;
      
      const { data, error } = await supabase
        .from("email_delivery_events")
        .select("*")
        .eq("quote_id", quoteId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as EmailDeliveryEvent | null;
    },
    enabled: !!quoteId,
  });
}

export function useQuoteEmailStatuses(quoteIds: string[]) {
  return useQuery({
    queryKey: ["email-delivery-statuses", quoteIds],
    queryFn: async () => {
      if (quoteIds.length === 0) return {};
      
      const { data, error } = await supabase
        .from("email_delivery_events")
        .select("*")
        .in("quote_id", quoteIds)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Group by quote_id and get the latest event for each
      const statusMap: Record<string, EmailDeliveryEvent> = {};
      for (const event of data || []) {
        if (event.quote_id && !statusMap[event.quote_id]) {
          statusMap[event.quote_id] = event as EmailDeliveryEvent;
        }
      }
      
      return statusMap;
    },
    enabled: quoteIds.length > 0,
  });
}
