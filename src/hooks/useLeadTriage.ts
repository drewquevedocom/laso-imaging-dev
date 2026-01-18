import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isAfter, isBefore, startOfDay, endOfDay } from "date-fns";

export interface TriageLead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string;
  message: string | null;
  source_page: string;
  lead_score: number;
  status: string;
  is_hot: boolean;
  sms_opt_in: boolean;
  email_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadFilters {
  search: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  scoreMin: number;
  scoreMax: number;
  types: string[];
}

// Map Kanban columns to database status values
export const KANBAN_COLUMNS = [
  { id: "new", label: "New Inquiry", dbStatus: "new" },
  { id: "contacted", label: "Contacted", dbStatus: "contacted" },
  { id: "quoting", label: "Quoting", dbStatus: "qualified" },
  { id: "contract_sent", label: "Contract Sent", dbStatus: "converted" },
  { id: "closed", label: "Closed", dbStatus: "closed" },
] as const;

export function useTriageLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: ["triage-leads", filters],
    queryFn: async (): Promise<TriageLead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      let filteredData = data || [];
      
      if (filters) {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(lead =>
            lead.name.toLowerCase().includes(searchLower) ||
            lead.email.toLowerCase().includes(searchLower) ||
            lead.company?.toLowerCase().includes(searchLower) ||
            lead.message?.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.dateFrom) {
          filteredData = filteredData.filter(lead =>
            isAfter(new Date(lead.created_at), startOfDay(filters.dateFrom!))
          );
        }
        if (filters.dateTo) {
          filteredData = filteredData.filter(lead =>
            isBefore(new Date(lead.created_at), endOfDay(filters.dateTo!))
          );
        }
        
        if (filters.scoreMin > 0 || filters.scoreMax < 100) {
          filteredData = filteredData.filter(lead =>
            lead.lead_score >= filters.scoreMin && lead.lead_score <= filters.scoreMax
          );
        }
        
        if (filters.types.length > 0) {
          filteredData = filteredData.filter(lead =>
            filters.types.some(type => 
              lead.interest.toLowerCase().includes(type.toLowerCase())
            )
          );
        }
      }
      
      return filteredData;
    },
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: string }) => {
      const { error } = await supabase
        .from("leads")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["triage-leads"] });
      queryClient.invalidateQueries({ queryKey: ["recent-leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update lead status",
        variant: "destructive",
      });
      console.error("Update lead status error:", error);
    },
  });
}

export function useToggleLeadHot() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ leadId, isHot }: { leadId: string; isHot: boolean }) => {
      const { error } = await supabase
        .from("leads")
        .update({ is_hot: isHot, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["triage-leads"] });
      queryClient.invalidateQueries({ queryKey: ["hot-list"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast({
        title: variables.isHot ? "Added to Hot List" : "Removed from Hot List",
        description: variables.isHot 
          ? "Lead has been marked as hot priority" 
          : "Lead has been removed from hot priority",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update lead priority",
        variant: "destructive",
      });
      console.error("Toggle lead hot error:", error);
    },
  });
}

export function getLeadTypeInfo(interest: string): { label: string; color: string; borderColor: string } {
  const lowerInterest = interest.toLowerCase();
  
  if (lowerInterest.includes("mobile") || lowerInterest.includes("rental")) {
    return { 
      label: "Mobile/Rental", 
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      borderColor: "border-red-400"
    };
  }
  
  if (lowerInterest.includes("service") || lowerInterest.includes("repair") || lowerInterest.includes("maintenance")) {
    return { 
      label: "Service", 
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      borderColor: "border-yellow-400"
    };
  }
  
  if (lowerInterest.includes("part") || lowerInterest.includes("component")) {
    return { 
      label: "Parts", 
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      borderColor: "border-purple-400"
    };
  }
  
  return { 
    label: "Equipment Sale", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    borderColor: "border-green-400"
  };
}

export function getTimeInStage(updatedAt: string): string {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diffMs = now.getTime() - updated.getTime();
  
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}
