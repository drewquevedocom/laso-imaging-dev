import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity } from "@/types/database";
import { toast } from "sonner";

export function useActivities(leadId?: string) {
  return useQuery({
    queryKey: ["activities", leadId],
    queryFn: async (): Promise<Activity[]> => {
      let query = supabase
        .from("activities" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (leadId) {
        query = query.eq("lead_id", leadId);
      }

      const { data, error } = await (query as any);
      if (error) throw error;
      return (data || []).map((activity: any) => ({
        ...activity,
        metadata: typeof activity.metadata === 'object' ? activity.metadata : {}
      })) as Activity[];
    },
    enabled: leadId ? !!leadId : true,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: Omit<Activity, "id" | "created_at">) => {
      const { data, error } = await (supabase
        .from("activities" as any)
        .insert([activity])
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: (_: unknown, variables: Omit<Activity, "id" | "created_at">) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      if (variables.lead_id) {
        queryClient.invalidateQueries({ queryKey: ["activities", variables.lead_id] });
      }
      toast.success("Activity logged successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to log activity: " + error.message);
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("activities" as any).delete().eq("id", id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Activity deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete activity: " + error.message);
    },
  });
}
