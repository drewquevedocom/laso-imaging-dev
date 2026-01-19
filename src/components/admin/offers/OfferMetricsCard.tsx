import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { differenceInDays } from "date-fns";
import { TrendingUp, Percent, Clock, DollarSign, AlertTriangle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface OfferMetrics {
  approvalRate: number;
  avgDiscount: number;
  pendingByAge: {
    recent: number;
    moderate: number;
    urgent: number;
  };
  pipelineValue: number;
  totalPending: number;
}

export const useOfferMetrics = () => {
  return useQuery({
    queryKey: ["offer-metrics"],
    queryFn: async (): Promise<OfferMetrics> => {
      const { data: offers, error } = await supabase
        .from("product_offers")
        .select("status, offer_amount, list_price, created_at, requires_approval");

      if (error) throw error;

      const approved = offers?.filter(o => o.status === "approved").length || 0;
      const rejected = offers?.filter(o => o.status === "rejected").length || 0;
      const pending = offers?.filter(o => o.status === "pending" && o.requires_approval) || [];

      // Calculate approval rate
      const decided = approved + rejected;
      const approvalRate = decided > 0 ? (approved / decided) * 100 : 0;

      // Calculate average discount
      const offersWithPrice = offers?.filter(o => o.list_price && o.list_price > 0) || [];
      const discounts = offersWithPrice.map(o => 
        ((o.list_price! - o.offer_amount) / o.list_price!) * 100
      );
      const avgDiscount = discounts.length > 0 
        ? discounts.reduce((a, b) => a + b, 0) / discounts.length 
        : 0;

      // Pending by age
      const now = new Date();
      const pendingByAge = {
        recent: pending.filter(o => differenceInDays(now, new Date(o.created_at)) <= 7).length,
        moderate: pending.filter(o => {
          const days = differenceInDays(now, new Date(o.created_at));
          return days > 7 && days <= 14;
        }).length,
        urgent: pending.filter(o => differenceInDays(now, new Date(o.created_at)) > 14).length,
      };

      // Pipeline value
      const pipelineValue = pending.reduce((sum, o) => sum + o.offer_amount, 0);

      return {
        approvalRate,
        avgDiscount,
        pendingByAge,
        pipelineValue,
        totalPending: pending.length,
      };
    },
    staleTime: 30000,
  });
};

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

const OfferMetricsCard = () => {
  const { data: metrics, isLoading } = useOfferMetrics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Offer Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const hasUrgent = metrics.pendingByAge.urgent > 0;

  return (
    <Card className={hasUrgent ? "border-amber-300 dark:border-amber-700" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Offer Metrics
          </CardTitle>
          {hasUrgent && (
            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-900/20">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {metrics.pendingByAge.urgent} Overdue
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Approval Rate */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              Approval Rate
            </div>
            <div className="text-xl font-bold text-green-600">
              {metrics.approvalRate.toFixed(0)}%
            </div>
            <Progress 
              value={metrics.approvalRate} 
              className="h-1.5 mt-2"
            />
          </div>

          {/* Average Discount */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Percent className="h-3 w-3" />
              Avg Discount
            </div>
            <div className={`text-xl font-bold ${metrics.avgDiscount > 20 ? "text-amber-600" : "text-foreground"}`}>
              {metrics.avgDiscount.toFixed(1)}%
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">across all offers</p>
          </div>

          {/* Pipeline Value */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <DollarSign className="h-3 w-3" />
              Pipeline Value
            </div>
            <div className="text-xl font-bold text-primary">
              {formatCurrency(metrics.pipelineValue)}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{metrics.totalPending} pending</p>
          </div>

          {/* Pending by Age */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              Pending Age
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                {metrics.pendingByAge.recent} new
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                {metrics.pendingByAge.moderate} 7-14d
              </Badge>
              {metrics.pendingByAge.urgent > 0 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                  {metrics.pendingByAge.urgent} 14d+
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* View All Link */}
        <Link to="/admin/offer-approvals">
          <Button variant="outline" size="sm" className="w-full mt-2">
            View All Offers
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default OfferMetricsCard;
