import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays } from "date-fns";

export interface SiteVisit {
  id: string;
  sell_request_id: string | null;
  lead_id: string | null;
  title: string;
  description: string | null;
  scheduled_date: string;
  scheduled_time: string | null;
  duration_hours: number;
  location_address: string | null;
  location_notes: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  assigned_to: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useUpcomingSiteVisits(days = 7) {
  return useQuery({
    queryKey: ["site-visits", "upcoming", days],
    queryFn: async () => {
      const today = new Date();
      const endDate = addDays(today, days);
      
      const { data, error } = await supabase
        .from("site_visits")
        .select("*")
        .gte("scheduled_date", format(today, "yyyy-MM-dd"))
        .lte("scheduled_date", format(endDate, "yyyy-MM-dd"))
        .in("status", ["scheduled", "confirmed"])
        .order("scheduled_date", { ascending: true })
        .order("scheduled_time", { ascending: true });
      
      if (error) throw error;
      return data as SiteVisit[];
    },
  });
}

export function useSiteVisit(id: string) {
  return useQuery({
    queryKey: ["site-visit", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_visits")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as SiteVisit;
    },
    enabled: !!id,
  });
}

export function useSiteVisitsForMonth(year: number, month: number) {
  return useQuery({
    queryKey: ["site-visits", "month", year, month],
    queryFn: async () => {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const { data, error } = await supabase
        .from("site_visits")
        .select("*")
        .gte("scheduled_date", format(startDate, "yyyy-MM-dd"))
        .lte("scheduled_date", format(endDate, "yyyy-MM-dd"))
        .order("scheduled_date", { ascending: true })
        .order("scheduled_time", { ascending: true });
      
      if (error) throw error;
      return data as SiteVisit[];
    },
  });
}
