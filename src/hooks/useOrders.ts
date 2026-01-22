import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  status: string;
  equipment_description: string | null;
  total_amount: number | null;
  estimated_delivery: string | null;
  installation_date: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer_profiles?: {
    contact_name: string | null;
    company_name: string | null;
  } | null;
}

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  inTransit: number;
  delivered: number;
  installed: number;
  totalValue: number;
}

export const useOrders = (statusFilter?: string) => {
  return useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select(`
          *,
          customer_profiles (
            contact_name,
            company_name
          )
        `)
        .order("created_at", { ascending: false });
      
      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ["admin-orders-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("status, total_amount");
      
      if (error) throw error;
      
      const stats: OrderStats = {
        total: data.length,
        pending: data.filter(o => o.status === "pending").length,
        confirmed: data.filter(o => o.status === "confirmed").length,
        inTransit: data.filter(o => o.status === "in_transit").length,
        delivered: data.filter(o => o.status === "delivered").length,
        installed: data.filter(o => o.status === "installed").length,
        totalValue: data.reduce((sum, o) => sum + (o.total_amount || 0), 0),
      };
      
      return stats;
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      orderId, 
      newStatus, 
      trackingNumber, 
      notes, 
      sendNotification = true 
    }: {
      orderId: string;
      newStatus: string;
      trackingNumber?: string;
      notes?: string;
      sendNotification?: boolean;
    }) => {
      if (sendNotification) {
        // Use edge function to update + notify customer
        const { error } = await supabase.functions.invoke("send-order-notification", {
          body: { orderId, newStatus, trackingNumber, notes }
        });
        if (error) throw error;
      } else {
        // Direct update without notification
        const updateData: Record<string, unknown> = {
          status: newStatus,
          updated_at: new Date().toISOString(),
        };
        
        if (trackingNumber !== undefined) {
          updateData.tracking_number = trackingNumber;
        }
        if (notes !== undefined) {
          updateData.notes = notes;
        }
        
        const { error } = await supabase
          .from("orders")
          .update(updateData)
          .eq("id", orderId);
          
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders-stats"] });
      
      if (variables.sendNotification) {
        toast.success("Order updated and customer notified");
      } else {
        toast.success("Order updated");
      }
    },
    onError: (error) => {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order");
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: {
      customer_id: string;
      equipment_description?: string;
      total_amount?: number;
      estimated_delivery?: string;
      notes?: string;
    }) => {
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from("orders")
        .insert({
          ...orderData,
          order_number: orderNumber,
          status: "pending",
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders-stats"] });
      toast.success("Order created successfully");
    },
    onError: (error) => {
      console.error("Failed to create order:", error);
      toast.error("Failed to create order");
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders-stats"] });
      toast.success("Order deleted");
    },
    onError: (error) => {
      console.error("Failed to delete order:", error);
      toast.error("Failed to delete order");
    },
  });
};
