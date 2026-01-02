import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Wrench, FileText, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";

interface DashboardStats {
  activeOrders: number;
  openTickets: number;
  totalDocuments: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  status: string;
  equipment_description: string | null;
  created_at: string;
}

interface RecentTicket {
  id: string;
  ticket_number: string;
  status: string;
  issue_description: string | null;
  created_at: string;
}

const PortalDashboard = () => {
  const { profile } = useCustomerAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeOrders: 0,
    openTickets: 0,
    totalDocuments: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    if (!profile) return;

    try {
      // Fetch orders
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(3);

      // Fetch service tickets
      const { data: tickets } = await supabase
        .from("service_tickets")
        .select("*")
        .eq("customer_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(3);

      // Fetch documents count
      const { count: docCount } = await supabase
        .from("customer_documents")
        .select("*", { count: "exact", head: true })
        .eq("customer_id", profile.id);

      // Calculate stats
      const activeOrders = orders?.filter(o => 
        !["delivered", "installed", "cancelled"].includes(o.status)
      ).length || 0;
      
      const openTickets = tickets?.filter(t => 
        !["completed", "closed"].includes(t.status)
      ).length || 0;

      setStats({
        activeOrders,
        openTickets,
        totalDocuments: docCount || 0,
      });

      setRecentOrders(orders || []);
      setRecentTickets(tickets || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "open":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "confirmed":
      case "in_progress":
      case "scheduled":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "in_transit":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "delivered":
      case "installed":
      case "completed":
      case "closed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {profile?.contact_name?.split(" ")[0] || "Customer"}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your account activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.activeOrders}</p>
                <p className="text-sm text-muted-foreground">Active Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Wrench className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.openTickets}</p>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <FileText className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalDocuments}</p>
                <p className="text-sm text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/portal/orders" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link to="/quote">Request a Quote</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {order.order_number}
                      </p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {order.equipment_description || "Equipment Order"}
                      </p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Service Tickets</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/portal/services" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No service tickets</p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {ticket.ticket_number}
                      </p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {ticket.issue_description || "Service Request"}
                      </p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/quote">
                <Package className="h-5 w-5" />
                <span>Request Quote</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/contact">
                <Wrench className="h-5 w-5" />
                <span>Service Request</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/portal/documents">
                <FileText className="h-5 w-5" />
                <span>View Documents</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <a href="tel:+18552545363">
                <Clock className="h-5 w-5" />
                <span>Call Support</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalDashboard;
