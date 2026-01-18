import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, subWeeks, format } from "date-fns";

interface QuoteAnalytics {
  total: number;
  sent: number;
  accepted: number;
  rejected: number;
  conversionRate: number;
  avgDiscount: number;
}

interface OfferAnalytics {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  expired: number;
  acceptanceRate: number;
  avgMargin: number;
}

interface WeeklyQuoteData {
  week: string;
  quotes: number;
  accepted: number;
}

interface ModalityOfferData {
  name: string;
  value: number;
  acceptanceRate: number;
}

export function useQuoteAnalytics() {
  return useQuery({
    queryKey: ["quote-analytics"],
    queryFn: async (): Promise<QuoteAnalytics> => {
      const { data: quotes, error } = await supabase
        .from("quotes")
        .select("status, discount, total_amount");

      if (error) throw error;

      const total = quotes?.length || 0;
      const sent = quotes?.filter(q => q.status !== "Draft").length || 0;
      const accepted = quotes?.filter(q => q.status === "Accepted").length || 0;
      const rejected = quotes?.filter(q => q.status === "Rejected").length || 0;
      
      const conversionRate = sent > 0 ? Math.round((accepted / sent) * 100) : 0;
      
      // Calculate average discount percentage
      const quotesWithDiscount = quotes?.filter(q => q.discount && q.total_amount);
      let avgDiscount = 0;
      if (quotesWithDiscount && quotesWithDiscount.length > 0) {
        const totalDiscountPct = quotesWithDiscount.reduce((sum, q) => {
          const originalAmount = (q.total_amount || 0) + (q.discount || 0);
          const discountPct = originalAmount > 0 ? ((q.discount || 0) / originalAmount) * 100 : 0;
          return sum + discountPct;
        }, 0);
        avgDiscount = Math.round((totalDiscountPct / quotesWithDiscount.length) * 10) / 10;
      }

      return { total, sent, accepted, rejected, conversionRate, avgDiscount };
    },
  });
}

export function useOfferAnalytics() {
  return useQuery({
    queryKey: ["offer-analytics"],
    queryFn: async (): Promise<OfferAnalytics> => {
      const { data: offers, error } = await (supabase
        .from("product_offers")
        .select("status, margin_percentage") as any);

      if (error) throw error;

      const offersData = (offers || []) as Array<{ status: string; margin_percentage: number | null }>;
      
      const total = offersData.length;
      const pending = offersData.filter(o => o.status === "pending").length;
      const accepted = offersData.filter(o => o.status === "accepted").length;
      const rejected = offersData.filter(o => o.status === "rejected").length;
      const expired = offersData.filter(o => o.status === "expired").length;
      
      const completedOffers = accepted + rejected;
      const acceptanceRate = completedOffers > 0 ? Math.round((accepted / completedOffers) * 100) : 0;
      
      // Calculate average margin
      const offersWithMargin = offersData.filter(o => o.margin_percentage !== null);
      const avgMargin = offersWithMargin.length > 0 
        ? Math.round((offersWithMargin.reduce((sum, o) => sum + (o.margin_percentage || 0), 0) / offersWithMargin.length) * 10) / 10
        : 0;

      return { total, pending, accepted, rejected, expired, acceptanceRate, avgMargin };
    },
  });
}

export function useQuotesByWeek() {
  return useQuery({
    queryKey: ["quotes-by-week"],
    queryFn: async (): Promise<WeeklyQuoteData[]> => {
      const { data: quotes, error } = await supabase
        .from("quotes")
        .select("created_at, status")
        .gte("created_at", subWeeks(new Date(), 6).toISOString());

      if (error) throw error;

      // Group by week
      const weeks: Record<string, { quotes: number; accepted: number }> = {};
      
      for (let i = 5; i >= 0; i--) {
        const weekStart = startOfWeek(subWeeks(new Date(), i));
        const weekLabel = format(weekStart, "MMM d");
        weeks[weekLabel] = { quotes: 0, accepted: 0 };
      }

      quotes?.forEach(quote => {
        const weekStart = startOfWeek(new Date(quote.created_at));
        const weekLabel = format(weekStart, "MMM d");
        if (weeks[weekLabel]) {
          weeks[weekLabel].quotes++;
          if (quote.status === "Accepted") {
            weeks[weekLabel].accepted++;
          }
        }
      });

      return Object.entries(weeks).map(([week, data]) => ({
        week,
        quotes: data.quotes,
        accepted: data.accepted,
      }));
    },
  });
}

export function useOffersByModality() {
  return useQuery({
    queryKey: ["offers-by-modality"],
    queryFn: async (): Promise<ModalityOfferData[]> => {
      const { data: offers, error } = await (supabase
        .from("product_offers")
        .select(`
          status,
          inventory:inventory_id (modality)
        `) as any);

      if (error) throw error;

      const offersData = (offers || []) as Array<{ 
        status: string; 
        inventory: { modality: string } | null 
      }>;

      // Group by modality
      const byModality: Record<string, { total: number; accepted: number }> = {};

      offersData.forEach(offer => {
        const modality = offer.inventory?.modality || "Unknown";
        if (!byModality[modality]) {
          byModality[modality] = { total: 0, accepted: 0 };
        }
        byModality[modality].total++;
        if (offer.status === "accepted") {
          byModality[modality].accepted++;
        }
      });

      return Object.entries(byModality).map(([name, data]) => ({
        name,
        value: data.total,
        acceptanceRate: data.total > 0 ? Math.round((data.accepted / data.total) * 100) : 0,
      }));
    },
  });
}
