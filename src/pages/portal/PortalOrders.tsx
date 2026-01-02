import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Package, Calendar, Truck, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { Skeleton } from "@/components/ui/skeleton";

interface Order {
  id: string;
  order_number: string;
  status: string;
  equipment_description: string | null;
  total_amount: number | null;
  estimated_delivery: string | null;
  installation_date: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
}

const statusSteps = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "in_transit", label: "In Transit", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Package },
  { key: "installed", label: "Installed", icon: CheckCircle },
];

const PortalOrders = () => {
  const { profile } = useCustomerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchOrders();
    }
  }, [profile]);

  const fetchOrders = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", profile.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const getStatusIndex = (status: string) => {
    const index = statusSteps.findIndex(s => s.key === status);
    return index === -1 ? 0 : index;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "confirmed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "in_transit":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "delivered":
      case "installed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground mt-1">
          Track your equipment orders and delivery status
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground">
              When you place an order, it will appear here for tracking.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const currentStep = getStatusIndex(order.status);
            
            return (
              <Card key={order.id}>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">{order.order_number}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ordered {format(new Date(order.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Equipment Description */}
                  {order.equipment_description && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Equipment</p>
                      <p className="text-foreground">{order.equipment_description}</p>
                    </div>
                  )}

                  {/* Progress Timeline */}
                  <div className="relative">
                    <div className="flex justify-between mb-2">
                      {statusSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;
                        
                        return (
                          <div key={step.key} className="flex flex-col items-center flex-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCompleted
                                  ? "bg-success text-success-foreground"
                                  : "bg-muted text-muted-foreground"
                              } ${isCurrent ? "ring-2 ring-success ring-offset-2" : ""}`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className={`text-xs mt-2 ${isCompleted ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Progress Line */}
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-10">
                      <div
                        className="h-full bg-success transition-all"
                        style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                    {order.total_amount && (
                      <div>
                        <p className="text-xs text-muted-foreground">Total Amount</p>
                        <p className="font-semibold text-foreground">
                          ${order.total_amount.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {order.estimated_delivery && (
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Delivery</p>
                        <p className="font-semibold text-foreground">
                          {format(new Date(order.estimated_delivery), "MMM d, yyyy")}
                        </p>
                      </div>
                    )}
                    {order.installation_date && (
                      <div>
                        <p className="text-xs text-muted-foreground">Installation</p>
                        <p className="font-semibold text-foreground">
                          {format(new Date(order.installation_date), "MMM d, yyyy")}
                        </p>
                      </div>
                    )}
                    {order.tracking_number && (
                      <div>
                        <p className="text-xs text-muted-foreground">Tracking #</p>
                        <p className="font-semibold text-foreground font-mono text-sm">
                          {order.tracking_number}
                        </p>
                      </div>
                    )}
                  </div>

                  {order.notes && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortalOrders;
