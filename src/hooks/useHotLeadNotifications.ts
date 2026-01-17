import { useEffect, useRef, useCallback } from "react";
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

export function useHotLeadNotifications(enabled: boolean = true) {
  const queryClient = useQueryClient();
  const playSound = useRef(createNotificationSound());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const handleNewHotLead = useCallback((payload: HotLeadPayload) => {
    const lead = payload.new;
    
    // Only notify for hot leads
    if (!lead.is_hot) return;

    // Play sound
    playSound.current();

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
  }, [queryClient]);

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
        (payload) => {
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
    playSound.current();
    toast.success("🔥 Test Hot Lead Notification", {
      description: "This is a test notification",
      duration: 5000,
    });
  }, []);

  return { testNotification };
}
