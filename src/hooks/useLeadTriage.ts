import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  created_at: string;
  updated_at: string;
}

// Map Kanban columns to database status values
export const KANBAN_COLUMNS = [
  { id: "new", label: "New Inquiry", dbStatus: "new" },
  { id: "contacted", label: "Contacted", dbStatus: "contacted" },
  { id: "quoting", label: "Quoting", dbStatus: "qualified" },
  { id: "contract_sent", label: "Contract Sent", dbStatus: "converted" },
  { id: "closed", label: "Closed", dbStatus: "closed" },
] as const;

export function useTriageLeads() {
  return useQuery({
    queryKey: ["triage-leads"],
    queryFn: async (): Promise<TriageLead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
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

// Get lead type badge color based on interest field
export function getLeadTypeInfo(interest: string): { label: string; color: string; borderColor: string } {
  const lowerInterest = interest.toLowerCase();
  
  if (lowerInterest.includes("mobile") || lowerInterest.includes("rental")) {
    return { 
      label: "Mobile MRI", 
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
  
  return { 
    label: "Equipment Sale", 
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    borderColor: "border-green-400"
  };
}

// Calculate time in stage
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
