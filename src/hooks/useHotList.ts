import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface HotListItem {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string;
  type: 'lead' | 'sell_request';
  status?: string;
  urgency?: string;
  deal_priority?: string;
  timeline?: string;
  is_hot?: boolean;
  interest?: string;
  equipment_type?: string;
  created_at: string;
}

// Legacy type for backwards compatibility
export type HotListLead = HotListItem;

export function useHotList() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["hot-list"],
    queryFn: async () => {
      // Calculate the threshold for stale leads (2 hours ago)
      const twoHoursAgo = new Date();
      twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
      const thresholdISO = twoHoursAgo.toISOString();

      // Fetch emergency leads OR stale new leads
      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("id, name, company, phone, email, status, urgency, is_hot, created_at, interest")
        .or(`urgency.eq.Emergency,and(status.eq.new,created_at.lt.${thresholdISO})`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (leadsError) {
        console.error("Error fetching hot leads:", leadsError);
      }

      // Fetch urgent sell requests (timeline = 'Immediately' OR deal_priority = 'urgent')
      const { data: sellRequests, error: sellError } = await supabase
        .from("equipment_sell_requests")
        .select("id, name, company, phone, email, timeline, deal_priority, equipment_type, created_at")
        .or("timeline.eq.Immediately,deal_priority.eq.urgent")
        .order("created_at", { ascending: false })
        .limit(10);

      if (sellError) {
        console.error("Error fetching urgent sell requests:", sellError);
      }

      // Transform leads to HotListItem
      const hotLeads: HotListItem[] = (leads || []).map(lead => ({
        id: lead.id,
        name: lead.name,
        company: lead.company,
        phone: lead.phone,
        email: lead.email,
        type: 'lead' as const,
        status: lead.status,
        urgency: lead.urgency,
        is_hot: lead.is_hot,
        interest: lead.interest,
        created_at: lead.created_at,
      }));

      // Transform sell requests to HotListItem
      const hotSellRequests: HotListItem[] = (sellRequests || []).map(req => ({
        id: req.id,
        name: req.name,
        company: req.company,
        phone: req.phone,
        email: req.email,
        type: 'sell_request' as const,
        deal_priority: req.deal_priority,
        timeline: req.timeline,
        equipment_type: req.equipment_type,
        created_at: req.created_at,
      }));

      // Combine and sort by created_at (newest first)
      const combined = [...hotLeads, ...hotSellRequests];
      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return combined.slice(0, 20);
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Subscribe to realtime updates for both leads and sell requests
  useEffect(() => {
    const leadsChannel = supabase
      .channel("hot-list-leads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["hot-list"] });
        }
      )
      .subscribe();

    const sellChannel = supabase
      .channel("hot-list-sell-requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "equipment_sell_requests" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["hot-list"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(sellChannel);
    };
  }, [queryClient]);

  return {
    ...query,
    count: query.data?.length || 0,
  };
}
