import { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Audio notification using Web Audio API
function createNotificationSound(): () => void {
  return () => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      // Create a pleasant notification sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1); // C#6
      oscillator.frequency.setValueAtTime(1320, audioContext.currentTime + 0.2); // E6
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn("Could not play notification sound:", error);
    }
  };
}

interface HotLeadPayload {
  new: {
    id: string;
    name: string;
    email: string;
    company?: string;
    is_hot: boolean;
    lead_score: number;
    created_at: string;
  };
}

// Get notification preferences from localStorage
function getNotificationPreferences() {
  try {
    const stored = localStorage.getItem("laso-notification-prefs");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return {
    hotLeadAlerts: true,
    soundEnabled: true,
    browserPushEnabled: false,
  };
}

export function useHotLeadNotifications(enabled: boolean = true) {
  const queryClient = useQueryClient();
  const playSound = useRef(createNotificationSound());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");

  // Check push notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  // Request push notification permission
  const requestPushPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast.error("Browser doesn't support notifications");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      
      if (permission === "granted") {
        toast.success("Push notifications enabled!");
        // Save preference
        const prefs = getNotificationPreferences();
        prefs.browserPushEnabled = true;
        localStorage.setItem("laso-notification-prefs", JSON.stringify(prefs));
        return true;
      } else if (permission === "denied") {
        toast.error("Notification permission denied");
        return false;
      }
      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to request notification permission");
      return false;
    }
  }, []);

  // Send browser push notification
  const sendBrowserNotification = useCallback((title: string, body: string, onClick?: () => void) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const prefs = getNotificationPreferences();
    if (!prefs.browserPushEnabled) return;

    try {
      const notification = new Notification(title, {
        body,
        icon: "/favicon.png",
        tag: "hot-lead-notification",
      });

      if (onClick) {
        notification.onclick = () => {
          window.focus();
          onClick();
          notification.close();
        };
      }

      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    } catch (error) {
      console.warn("Could not send browser notification:", error);
    }
  }, []);

  const handleNewHotLead = useCallback((payload: HotLeadPayload) => {
    const lead = payload.new;
    const prefs = getNotificationPreferences();
    
    // Only notify for hot leads and if alerts are enabled
    if (!lead.is_hot || !prefs.hotLeadAlerts) return;

    // Play sound
    if (prefs.soundEnabled) {
      playSound.current();
    }

    // Browser push notification
    sendBrowserNotification(
      `🔥 Hot Lead: ${lead.name}`,
      lead.company ? `From ${lead.company} • Score: ${lead.lead_score}` : `Score: ${lead.lead_score}`,
      () => {
        window.location.href = "/admin/notifications";
      }
    );

    // Show toast notification
    toast.success(`🔥 Hot Lead: ${lead.name}`, {
      description: lead.company ? `From ${lead.company}` : lead.email,
      duration: 10000,
      action: {
        label: "View",
        onClick: () => {
          window.location.href = "/admin/notifications";
        },
      },
    });

    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    queryClient.invalidateQueries({ queryKey: ["recent-leads"] });
    queryClient.invalidateQueries({ queryKey: ["hot-leads-count"] });
  }, [queryClient, sendBrowserNotification]);

  useEffect(() => {
    if (!enabled) return;

    // Subscribe to new leads inserts
    channelRef.current = supabase
      .channel("hot-leads-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leads",
        },
        (payload) => handleNewHotLead(payload as unknown as HotLeadPayload)
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "leads",
          filter: "is_hot=eq.true",
        },
        () => {
          // Refresh queries on lead updates
          queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
          queryClient.invalidateQueries({ queryKey: ["recent-leads"] });
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [enabled, handleNewHotLead, queryClient]);

  // Return a function to manually trigger a test notification
  const testNotification = useCallback(() => {
    const prefs = getNotificationPreferences();
    
    if (prefs.soundEnabled) {
      playSound.current();
    }
    
    sendBrowserNotification(
      "🔥 Test Hot Lead Notification",
      "This is a test notification to verify settings",
    );
    
    toast.success("🔥 Test Hot Lead Notification", {
      description: "This is a test notification",
      duration: 5000,
    });
  }, [sendBrowserNotification]);

  return { 
    testNotification, 
    pushPermission, 
    requestPushPermission,
    getNotificationPreferences,
  };
}
