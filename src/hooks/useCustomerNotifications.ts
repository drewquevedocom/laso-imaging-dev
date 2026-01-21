import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "./useCustomerAuth";
import { useToast } from "./use-toast";

interface CustomerNotification {
  id: string;
  customer_id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
}

export const useCustomerNotifications = () => {
  const { profile, isAuthenticated } = useCustomerAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Request browser notification permission
  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("Browser doesn't support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      setPermissionGranted(true);
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      setPermissionGranted(granted);
      return granted;
    }

    return false;
  }, []);

  // Show browser notification
  const showBrowserNotification = useCallback((notification: CustomerNotification) => {
    if (!permissionGranted) return;

    const browserNotif = new Notification(notification.title, {
      body: notification.body,
      icon: "/favicon.png",
      tag: notification.id,
    });

    browserNotif.onclick = () => {
      window.focus();
      // Navigate based on notification type
      const data = notification.data as Record<string, string> | null;
      if (notification.type === "quote_sent" && data?.quote_id) {
        window.location.href = `/portal/quotes/${data.quote_id}`;
      } else if (notification.type === "order_update" && data?.order_id) {
        window.location.href = `/portal/orders`;
      } else if (notification.type === "message_received") {
        window.location.href = `/portal/messages`;
      }
    };
  }, [permissionGranted]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from("customer_notifications")
        .select("*")
        .eq("customer_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data as CustomerNotification[]);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("customer_notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!profile?.id) return;

    try {
      const { error } = await supabase
        .from("customer_notifications")
        .update({ read: true })
        .eq("customer_id", profile.id)
        .eq("read", false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      toast({
        title: "All Caught Up!",
        description: "All notifications marked as read.",
      });
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, [profile?.id, toast]);

  // Set up realtime subscription
  useEffect(() => {
    if (!profile?.id || !isAuthenticated) return;

    fetchNotifications();
    requestPermission();

    const channel = supabase
      .channel(`customer-notifications-${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "customer_notifications",
          filter: `customer_id=eq.${profile.id}`,
        },
        (payload) => {
          const newNotification = payload.new as CustomerNotification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          showBrowserNotification(newNotification);
          
          toast({
            title: newNotification.title,
            description: newNotification.body,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, isAuthenticated, fetchNotifications, requestPermission, showBrowserNotification, toast]);

  return {
    notifications,
    unreadCount,
    loading,
    permissionGranted,
    requestPermission,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
