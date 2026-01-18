import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PricingRule {
  id: string;
  rule_type: 'min_margin' | 'auto_expiration' | 'discount_threshold' | 'approval_threshold';
  modality?: string;
  value: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePricingRules() {
  return useQuery({
    queryKey: ["pricing-rules"],
    queryFn: async (): Promise<PricingRule[]> => {
      const { data, error } = await (supabase
        .from("pricing_rules" as any)
        .select("*")
        .order("rule_type", { ascending: true }) as any);

      if (error) throw error;
      return (data || []) as PricingRule[];
    },
  });
}

export function useActivePricingRules() {
  return useQuery({
    queryKey: ["pricing-rules", "active"],
    queryFn: async (): Promise<PricingRule[]> => {
      const { data, error } = await (supabase
        .from("pricing_rules" as any)
        .select("*")
        .eq("is_active", true) as any);

      if (error) throw error;
      return (data || []) as PricingRule[];
    },
  });
}

export function useMinMargin(modality?: string) {
  const { data: rules } = useActivePricingRules();
  
  if (!rules) return 15; // Default fallback
  
  // Look for modality-specific rule first
  const modalityRule = rules.find(r => r.rule_type === 'min_margin' && r.modality === modality);
  if (modalityRule) return modalityRule.value;
  
  // Fall back to general rule
  const generalRule = rules.find(r => r.rule_type === 'min_margin' && !r.modality);
  return generalRule?.value || 15;
}

export function useApprovalThreshold() {
  const { data: rules } = useActivePricingRules();
  const rule = rules?.find(r => r.rule_type === 'approval_threshold');
  return rule?.value || 20;
}

export function useCreatePricingRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rule: Omit<PricingRule, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await (supabase
        .from("pricing_rules" as any)
        .insert([rule])
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-rules"] });
      toast.success("Pricing rule created");
    },
    onError: (error: Error) => {
      toast.error("Failed to create rule: " + error.message);
    },
  });
}

export function useUpdatePricingRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PricingRule> & { id: string }) => {
      const { data, error } = await (supabase
        .from("pricing_rules" as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-rules"] });
      toast.success("Pricing rule updated");
    },
    onError: (error: Error) => {
      toast.error("Failed to update rule: " + error.message);
    },
  });
}

export function useDeletePricingRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase
        .from("pricing_rules" as any)
        .delete()
        .eq("id", id) as any);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing-rules"] });
      toast.success("Pricing rule deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete rule: " + error.message);
    },
  });
}
