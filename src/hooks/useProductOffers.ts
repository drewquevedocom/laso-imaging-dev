import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProductOffer {
  id: string;
  inventory_id: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_company?: string;
  list_price?: number;
  offer_amount: number;
  target_price?: number;
  offer_type: 'soft' | 'firm' | 'final';
  validity_days: number;
  expires_at?: string;
  reason?: string;
  competitor_info?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'countered';
  margin_percentage?: number;
  requires_approval: boolean;
  approved_by?: string;
  approved_at?: string;
  created_by?: string;
  created_by_email?: string;
  created_at: string;
  updated_at: string;
}

export function useProductOffers(inventoryId?: string) {
  return useQuery({
    queryKey: ["product-offers", inventoryId],
    queryFn: async (): Promise<ProductOffer[]> => {
      let query = supabase
        .from("product_offers" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (inventoryId) {
        query = query.eq("inventory_id", inventoryId);
      }

      const { data, error } = await query as any;
      if (error) throw error;
      return (data || []) as ProductOffer[];
    },
  });
}

export function useOpenOffersCount() {
  return useQuery({
    queryKey: ["open-offers-count"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("product_offers" as any)
        .select("inventory_id, status")
        .eq("status", "pending") as any);

      if (error) throw error;
      
      const counts: Record<string, number> = {};
      (data || []).forEach((offer: any) => {
        counts[offer.inventory_id] = (counts[offer.inventory_id] || 0) + 1;
      });
      return counts;
    },
  });
}

export function useCreateProductOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offer: Omit<ProductOffer, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await (supabase
        .from("product_offers" as any)
        .insert([{
          ...offer,
          expires_at: new Date(Date.now() + offer.validity_days * 24 * 60 * 60 * 1000).toISOString()
        }])
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-offers"] });
      queryClient.invalidateQueries({ queryKey: ["open-offers-count"] });
      toast.success("Offer created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create offer: " + error.message);
    },
  });
}

export function useUpdateProductOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProductOffer> & { id: string }) => {
      const { data, error } = await (supabase
        .from("product_offers" as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-offers"] });
      queryClient.invalidateQueries({ queryKey: ["open-offers-count"] });
      toast.success("Offer updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update offer: " + error.message);
    },
  });
}
