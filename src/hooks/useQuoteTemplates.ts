import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface QuoteTemplateItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteTemplate {
  id: string;
  name: string;
  description: string | null;
  items: QuoteTemplateItem[];
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

type QuoteTemplateRow = Omit<QuoteTemplate, 'items'> & { items: QuoteTemplate['items'] | null };

export function useQuoteTemplates() {
  return useQuery({
    queryKey: ["quote-templates"],
    queryFn: async (): Promise<QuoteTemplate[]> => {
      const { data, error } = await (supabase
        .from("quote_templates" as any)
        .select("*")
        .order("created_at", { ascending: false }) as any);

      if (error) throw error;
      return (data || []).map((template: QuoteTemplateRow) => ({
        ...template,
        items: Array.isArray(template.items) ? template.items : [],
      }));
    },
  });
}

export function useCreateQuoteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: {
      name: string;
      description?: string;
      items: QuoteTemplateItem[];
      notes?: string;
    }) => {
      const { data, error } = await (supabase
        .from("quote_templates" as any)
        .insert([{
          name: template.name,
          description: template.description || null,
          items: template.items,
          notes: template.notes || null,
        }])
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quote-templates"] });
      toast.success("Template saved successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to save template: " + error.message);
    },
  });
}

export function useDeleteQuoteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase
        .from("quote_templates" as any)
        .delete()
        .eq("id", id) as any);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quote-templates"] });
      toast.success("Template deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete template: " + error.message);
    },
  });
}
