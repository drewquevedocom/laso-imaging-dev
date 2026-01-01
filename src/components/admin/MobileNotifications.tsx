import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import LeadCard from "./LeadCard";
import { Bell, Flame, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string;
  message: string | null;
  source_page: string;
  lead_score: number;
  status: string;
  is_hot: boolean;
  created_at: string;
}

const MobileNotifications = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showHotOnly, setShowHotOnly] = useState(false);
  const { toast } = useToast();

  const fetchLeads = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("is_hot", { ascending: false })
        .order("lead_score", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Error",
        description: "Failed to load leads.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", leadId);

      if (error) throw error;

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status } : lead
        )
      );

      toast({
        title: "Updated",
        description: `Lead marked as ${status}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLeads();

    // Real-time subscription
    const channel = supabase
      .channel("leads-mobile-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newLead = payload.new as Lead;
            setLeads((prev) => [newLead, ...prev]);
            
            // Vibrate on new lead (if supported)
            if ("vibrate" in navigator) {
              navigator.vibrate(200);
            }
            
            toast({
              title: newLead.is_hot ? "🔥 Hot Lead!" : "New Lead",
              description: `${newLead.name} - ${newLead.interest}`,
            });
          } else if (payload.eventType === "UPDATE") {
            setLeads((prev) =>
              prev.map((lead) =>
                lead.id === (payload.new as Lead).id ? (payload.new as Lead) : lead
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeads, toast]);

  const filteredLeads = showHotOnly 
    ? leads.filter((lead) => lead.is_hot) 
    : leads;

  const hotLeadsCount = leads.filter((l) => l.is_hot && l.status === "new").length;
  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="min-h-screen bg-secondary pb-safe">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-foreground" />
              {newLeadsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {newLeadsCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="font-bold text-foreground">Leads</h1>
              {hotLeadsCount > 0 && (
                <p className="text-xs text-orange-500 font-medium flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  {hotLeadsCount} hot
                </p>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => fetchLeads(true)}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Filter Toggle */}
        <div className="flex gap-2 mt-3">
          <Button
            variant={showHotOnly ? "outline" : "default"}
            size="sm"
            className="flex-1"
            onClick={() => setShowHotOnly(false)}
          >
            All ({leads.length})
          </Button>
          <Button
            variant={showHotOnly ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setShowHotOnly(true)}
          >
            <Flame className="h-4 w-4 mr-1" />
            Hot ({leads.filter((l) => l.is_hot).length})
          </Button>
        </div>
      </header>

      {/* Pull to Refresh Indicator */}
      {isRefreshing && (
        <div className="flex items-center justify-center py-4 bg-muted">
          <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">Refreshing...</span>
        </div>
      )}

      {/* Leads List */}
      <main className="p-4 space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-56 w-full rounded-xl" />
            ))}
          </>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              {showHotOnly ? "No hot leads" : "No leads yet"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {showHotOnly 
                ? "Hot leads will appear here when scored 50+." 
                : "New leads will appear here in real-time."}
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onStatusChange={handleStatusChange}
              variant="mobile"
            />
          ))
        )}
      </main>
    </div>
  );
};

export default MobileNotifications;
