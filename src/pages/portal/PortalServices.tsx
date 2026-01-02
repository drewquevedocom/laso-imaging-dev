import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Wrench, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceTicket {
  id: string;
  ticket_number: string;
  equipment_type: string | null;
  equipment_serial: string | null;
  issue_description: string | null;
  status: string;
  priority: string;
  assigned_technician: string | null;
  scheduled_date: string | null;
  resolution_notes: string | null;
  created_at: string;
}

const PortalServices = () => {
  const { profile } = useCustomerAuth();
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchTickets();
    }
  }, [profile]);

  const fetchTickets = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from("service_tickets")
      .select("*")
      .eq("customer_id", profile.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tickets:", error);
    } else {
      setTickets(data || []);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "in_progress":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "scheduled":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "completed":
      case "closed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "normal":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "low":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "scheduled":
        return <Calendar className="h-4 w-4" />;
      case "completed":
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Wrench className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Service History</h1>
        <p className="text-muted-foreground mt-1">
          View your service requests and maintenance history
        </p>
      </div>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Wrench className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Service Tickets</h3>
            <p className="text-muted-foreground">
              Your service history will appear here when you request support.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{ticket.ticket_number}</CardTitle>
                      <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Opened {format(new Date(ticket.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Badge variant="outline" className={`gap-1 ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    {ticket.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Equipment Info */}
                {(ticket.equipment_type || ticket.equipment_serial) && (
                  <div className="flex gap-6">
                    {ticket.equipment_type && (
                      <div>
                        <p className="text-xs text-muted-foreground">Equipment</p>
                        <p className="font-medium text-foreground">{ticket.equipment_type}</p>
                      </div>
                    )}
                    {ticket.equipment_serial && (
                      <div>
                        <p className="text-xs text-muted-foreground">Serial Number</p>
                        <p className="font-mono text-sm text-foreground">{ticket.equipment_serial}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Issue Description */}
                {ticket.issue_description && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Issue Description</p>
                    <p className="text-foreground">{ticket.issue_description}</p>
                  </div>
                )}

                {/* Service Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  {ticket.assigned_technician && (
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned Technician</p>
                      <p className="font-medium text-foreground">{ticket.assigned_technician}</p>
                    </div>
                  )}
                  {ticket.scheduled_date && (
                    <div>
                      <p className="text-xs text-muted-foreground">Scheduled Date</p>
                      <p className="font-medium text-foreground">
                        {format(new Date(ticket.scheduled_date), "MMM d, yyyy")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Resolution Notes */}
                {ticket.resolution_notes && (
                  <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                    <p className="text-xs text-success font-medium mb-1">Resolution</p>
                    <p className="text-sm text-foreground">{ticket.resolution_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalServices;
