import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import LeadCard from "./LeadCard";
import { Bell, Flame, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const NotificationFeed = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  const fetchLeads = async () => {
    setIsLoading(true);
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
        description: "Failed to load leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        title: "Status Updated",
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

    // Set up real-time subscription
    const channel = supabase
      .channel("leads-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          console.log("Lead change:", payload);
          if (payload.eventType === "INSERT") {
            setLeads((prev) => {
              const newLead = payload.new as Lead;
              // Insert in correct position based on score
              const newLeads = [...prev];
              const insertIndex = newLeads.findIndex(
                (l) =>
                  !l.is_hot ||
                  (l.is_hot === newLead.is_hot && l.lead_score < newLead.lead_score)
              );
              if (insertIndex === -1) {
                newLeads.push(newLead);
              } else {
                newLeads.splice(insertIndex, 0, newLead);
              }
              return newLeads;
            });
            
            toast({
              title: "New Lead!",
              description: `${(payload.new as Lead).name} submitted a quote request.`,
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
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (filter === "all") return true;
    if (filter === "hot") return lead.is_hot;
    return lead.status === filter;
  });

  const hotLeadsCount = leads.filter((l) => l.is_hot && l.status === "new").length;
  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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
            <h2 className="text-xl font-bold text-foreground">Lead Notifications</h2>
            <p className="text-sm text-muted-foreground">
              {hotLeadsCount > 0 && (
                <span className="text-orange-500 font-medium">
                  {hotLeadsCount} hot lead{hotLeadsCount !== 1 ? "s" : ""} waiting
                </span>
              )}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLeads}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter} className="mb-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all" className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            All
          </TabsTrigger>
          <TabsTrigger value="hot" className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5" />
            Hot Leads
          </TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="qualified">Qualified</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Leads List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No leads yet</h3>
            <p className="text-sm text-muted-foreground">
              New leads will appear here in real-time.
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationFeed;
