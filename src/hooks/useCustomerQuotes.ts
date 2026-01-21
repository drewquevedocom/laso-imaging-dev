import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "./useCustomerAuth";

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface CustomerQuote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_company: string | null;
  items: QuoteItem[] | null;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  status: string;
  valid_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useCustomerQuotes = () => {
  const { profile, isAuthenticated } = useCustomerAuth();
  const [quotes, setQuotes] = useState<CustomerQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuotes = useCallback(async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("customer_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedQuotes = (data || []).map(quote => ({
        ...quote,
        items: (quote.items as unknown as QuoteItem[]) || [],
      })) as CustomerQuote[];
      
      setQuotes(transformedQuotes);
    } catch (err) {
      console.error("Error fetching quotes:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (isAuthenticated && profile?.id) {
      fetchQuotes();
    }
  }, [isAuthenticated, profile?.id, fetchQuotes]);

  const getQuoteById = useCallback((quoteId: string) => {
    return quotes.find(q => q.id === quoteId);
  }, [quotes]);

  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === "Sent" || q.status === "Viewed").length,
    accepted: quotes.filter(q => q.status === "Accepted").length,
    totalValue: quotes.reduce((sum, q) => sum + (q.total_amount || 0), 0),
  };

  return {
    quotes,
    loading,
    error,
    stats,
    getQuoteById,
    refetch: fetchQuotes,
  };
};
