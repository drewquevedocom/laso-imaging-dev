import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/database";
import { toast } from "sonner";

type QuoteRow = Omit<Quote, 'items'> & { items: Quote['items'] | null };

export function useQuotes() {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async (): Promise<Quote[]> => {
      const { data, error } = await (supabase
        .from("quotes" as any)
        .select("*")
        .order("created_at", { ascending: false }) as any);

      if (error) throw error;
      return (data || []).map((quote: QuoteRow) => ({
        ...quote,
        items: Array.isArray(quote.items) ? quote.items : []
      })) as Quote[];
    },
  });
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: ["quotes", id],
    queryFn: async (): Promise<Quote | null> => {
      const { data, error } = await (supabase
        .from("quotes" as any)
        .select("*")
        .eq("id", id)
        .maybeSingle() as any);

      if (error) throw error;
      if (!data) return null;
      return {
        ...data,
        items: Array.isArray(data.items) ? data.items : []
      } as Quote;
    },
    enabled: !!id,
  });
}

function generateQuoteNumber(): string {
  const prefix = "Q";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quote: Omit<Quote, "id" | "quote_number" | "created_at" | "updated_at">) => {
      const { data, error } = await (supabase
        .from("quotes" as any)
        .insert([{ ...quote, quote_number: generateQuoteNumber() }])
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Quote created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create quote: " + error.message);
    },
  });
}

export function useUpdateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Quote> & { id: string }) => {
      const { data, error } = await (supabase
        .from("quotes" as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Quote updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update quote: " + error.message);
    },
  });
}

export function useDeleteQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("quotes" as any).delete().eq("id", id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Quote deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete quote: " + error.message);
    },
  });
}

type QuoteStatsRow = Pick<Quote, 'status' | 'total_amount'>;

export function useQuotesStats() {
  return useQuery({
    queryKey: ["quotes-stats"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("quotes" as any)
        .select("status, total_amount") as any);

      if (error) throw error;

      const total = data?.length || 0;
      const draft = data?.filter((q: QuoteStatsRow) => q.status === "Draft").length || 0;
      const sent = data?.filter((q: QuoteStatsRow) => q.status === "Sent").length || 0;
      const accepted = data?.filter((q: QuoteStatsRow) => q.status === "Accepted").length || 0;
      const totalValue = data?.reduce((sum: number, q: QuoteStatsRow) => sum + (q.total_amount || 0), 0) || 0;

      return { total, draft, sent, accepted, totalValue };
    },
  });
}
