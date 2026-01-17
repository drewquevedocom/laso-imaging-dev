import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface HotListLead {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string;
  status: string;
  urgency: string;
  is_hot: boolean;
  created_at: string;
  interest: string;
}

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
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, company, phone, email, status, urgency, is_hot, created_at, interest")
        .or(`urgency.eq.Emergency,and(status.eq.new,created_at.lt.${thresholdISO})`)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching hot list:", error);
        throw error;
      }

      return (data || []) as HotListLead[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("hot-list-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["hot-list"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    ...query,
    count: query.data?.length || 0,
  };
}
