import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useOrderNotifications = () => {
  const { toast } = useToast();
  const [isNotifying, setIsNotifying] = useState(false);

  const notifyOrderUpdate = async (
    orderId: string,
    newStatus: string,
    trackingNumber?: string,
    notes?: string
  ) => {
    setIsNotifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-order-notification", {
        body: { orderId, newStatus, trackingNumber, notes },
      });

      if (error) throw error;

      toast({
        title: "Customer Notified",
        description: `Customer has been notified of the order status update.`,
      });

      return data;
    } catch (error) {
      console.error("Failed to send order notification:", error);
      toast({
        title: "Notification Failed",
        description: "Failed to notify customer. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsNotifying(false);
    }
  };

  return {
    notifyOrderUpdate,
    isNotifying,
  };
};
