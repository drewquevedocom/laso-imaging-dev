import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek, subWeeks, format } from "date-fns";

export interface DashboardStats {
  totalLeads: number;
  hotLeads: number;
  openTickets: number;
  pendingQuotes: number;
  availableEquipment: number;
  quotePipeline: number;
}

export interface LeadsByWeek {
  week: string;
  count: number;
}

export interface LeadsBySource {
  source: string;
  count: number;
}

export interface RecentLead {
  id: string;
  name: string;
  company: string | null;
  email: string;
  status: string;
  lead_score: number;
  is_hot: boolean;
  created_at: string;
  interest: string;
  urgency: string | null;
}

export interface ServiceTicket {
  id: string;
  ticket_number: string;
  equipment_type: string | null;
  status: string;
  priority: string;
  created_at: string;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      // Total leads
      const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

      // Hot leads
      const { count: hotLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("is_hot", true);

      // Open service tickets
      const { count: openTickets } = await supabase
        .from("service_tickets")
        .select("*", { count: "exact", head: true })
        .neq("status", "closed");

      // Pending quotes (leads with interest = quote and status = new)
      const { count: pendingQuotes } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("interest", "quote")
        .eq("status", "new");

      // Try to get inventory stats (may not exist yet)
      let availableEquipment = 0;
      try {
        const { count } = await supabase
          .from("inventory" as any)
          .select("*", { count: "exact", head: true })
          .eq("availability_status", "Available");
        availableEquipment = count || 0;
      } catch {
        // Table may not exist yet
      }

      // Try to get quote pipeline (may not exist yet)
      let quotePipeline = 0;
      try {
        const { data: quotesData } = await supabase
          .from("quotes" as any)
          .select("total_amount")
          .neq("status", "Draft");
        quotePipeline = (quotesData as any[])?.reduce((sum, q) => sum + (q.total_amount || 0), 0) || 0;
      } catch {
        // Table may not exist yet
      }

      return {
        totalLeads: totalLeads || 0,
        hotLeads: hotLeads || 0,
        openTickets: openTickets || 0,
        pendingQuotes: pendingQuotes || 0,
        availableEquipment,
        quotePipeline,
      };
    },
  });
}

export function useLeadsByWeek() {
  return useQuery({
    queryKey: ["leads-by-week"],
    queryFn: async (): Promise<LeadsByWeek[]> => {
      const weeks: LeadsByWeek[] = [];
      
      for (let i = 5; i >= 0; i--) {
        const weekStart = startOfWeek(subWeeks(new Date(), i));
        const weekEnd = endOfWeek(subWeeks(new Date(), i));
        
        const { count } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .gte("created_at", weekStart.toISOString())
          .lte("created_at", weekEnd.toISOString());
        
        weeks.push({
          week: format(weekStart, "MMM d"),
          count: count || 0,
        });
      }
      
      return weeks;
    },
  });
}

export function useLeadsBySource() {
  return useQuery({
    queryKey: ["leads-by-source"],
    queryFn: async (): Promise<LeadsBySource[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("source_page");
      
      if (error) throw error;
      
      // Group by source
      const sourceMap = new Map<string, number>();
      data?.forEach((lead) => {
        const source = lead.source_page || "Unknown";
        sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
      });
      
      return Array.from(sourceMap.entries())
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    },
  });
}

export function useRecentLeads() {
  return useQuery({
    queryKey: ["recent-leads"],
    queryFn: async (): Promise<RecentLead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, company, email, status, lead_score, is_hot, created_at, interest, urgency")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useRecentTickets() {
  return useQuery({
    queryKey: ["recent-tickets"],
    queryFn: async (): Promise<ServiceTicket[]> => {
      const { data, error } = await supabase
        .from("service_tickets")
        .select("id, ticket_number, equipment_type, status, priority, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
  });
}
