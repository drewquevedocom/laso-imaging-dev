import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PendingOffer {
  id: string;
  customer_name: string;
  customer_company: string | null;
  offer_amount: number;
  list_price: number | null;
  margin_percentage: number | null;
  reason: string | null;
  created_at: string;
  inventory_id: string | null;
}

interface PendingOfferWithInventory extends PendingOffer {
  inventory: {
    product_name: string;
    oem: string;
  } | null;
}

export function usePendingApprovals() {
  return useQuery({
    queryKey: ["pending-approvals"],
    queryFn: async (): Promise<PendingOfferWithInventory[]> => {
      const { data, error } = await supabase
        .from("product_offers")
        .select(`
          id,
          customer_name,
          customer_company,
          offer_amount,
          list_price,
          margin_percentage,
          reason,
          created_at,
          inventory_id,
          inventory:inventory_id (
            product_name,
            oem
          )
        `)
        .eq("requires_approval", true)
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        inventory: item.inventory as { product_name: string; oem: string } | null
      }));
    },
  });
}

export function usePendingApprovalsCount() {
  return useQuery({
    queryKey: ["pending-approvals-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("product_offers")
        .select("id", { count: "exact", head: true })
        .eq("requires_approval", true)
        .eq("status", "pending");

      if (error) throw error;
      return count || 0;
    },
  });
}

export function useApproveOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ offerId, notes }: { offerId: string; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("product_offers")
        .update({
          status: "approved",
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", offerId);

      if (error) throw error;

      // Log approval activity if notes provided
      if (notes) {
        const { data: offer } = await supabase
          .from("product_offers")
          .select("customer_name, offer_amount")
          .eq("id", offerId)
          .single();

        if (offer) {
          // Could add to activities table if needed
          console.log("Offer approved with notes:", notes);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["pending-approvals-count"] });
      queryClient.invalidateQueries({ queryKey: ["product-offers"] });
      toast.success("Offer approved successfully");
    },
    onError: (error) => {
      console.error("Error approving offer:", error);
      toast.error("Failed to approve offer");
    },
  });
}

export function useRejectOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ offerId, reason }: { offerId: string; reason?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("product_offers")
        .update({
          status: "rejected",
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
          reason: reason ? `REJECTED: ${reason}` : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", offerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["pending-approvals-count"] });
      queryClient.invalidateQueries({ queryKey: ["product-offers"] });
      toast.success("Offer rejected");
    },
    onError: (error) => {
      console.error("Error rejecting offer:", error);
      toast.error("Failed to reject offer");
    },
  });
}
