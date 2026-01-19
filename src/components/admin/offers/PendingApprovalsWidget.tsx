import { useState } from "react";
import { AlertTriangle, Check, X, DollarSign, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePendingApprovals, useApproveOffer, useRejectOffer } from "@/hooks/useOfferApprovals";
import ApprovalActionModal from "./ApprovalActionModal";

interface PendingOffer {
  id: string;
  customer_name: string;
  customer_company: string | null;
  offer_amount: number;
  list_price: number | null;
  margin_percentage: number | null;
  reason: string | null;
  created_at: string;
  inventory?: {
    product_name: string;
    oem: string;
  } | null;
}

const PendingApprovalsWidget = () => {
  const { data: pendingOffers = [], isLoading } = usePendingApprovals();
  const approveOffer = useApproveOffer();
  const rejectOffer = useRejectOffer();
  
  const [selectedOffer, setSelectedOffer] = useState<PendingOffer | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAction = (offer: PendingOffer, action: "approve" | "reject") => {
    setSelectedOffer(offer);
    setActionType(action);
  };

  const handleConfirmAction = (notes?: string) => {
    if (!selectedOffer || !actionType) return;

    if (actionType === "approve") {
      approveOffer.mutate({ offerId: selectedOffer.id, notes });
    } else {
      rejectOffer.mutate({ offerId: selectedOffer.id, reason: notes });
    }

    setSelectedOffer(null);
    setActionType(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingOffers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Pending Approvals
          </CardTitle>
          <CardDescription>All caught up!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No offers pending approval
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Pending Approvals
            <Badge variant="destructive" className="ml-auto">
              {pendingOffers.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Offers requiring manager approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingOffers.slice(0, 5).map((offer) => {
              const discountPercent = offer.list_price 
                ? Math.round(((offer.list_price - offer.offer_amount) / offer.list_price) * 100)
                : null;

              return (
                <div
                  key={offer.id}
                  className="p-3 bg-muted/50 rounded-lg border border-amber-200/50 dark:border-amber-800/50"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {offer.customer_name}
                      </h4>
                      {offer.customer_company && (
                        <p className="text-xs text-muted-foreground truncate">
                          {offer.customer_company}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                    </Badge>
                  </div>

                  {offer.inventory && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {offer.inventory.oem} {offer.inventory.product_name}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-semibold">
                        {formatCurrency(offer.offer_amount)}
                      </span>
                    </div>
                    {discountPercent !== null && (
                      <Badge 
                        variant="outline"
                        className={discountPercent > 20 
                          ? "text-red-600 border-red-300" 
                          : "text-amber-600 border-amber-300"
                        }
                      >
                        {discountPercent}% off
                      </Badge>
                    )}
                    {offer.margin_percentage !== null && (
                      <Badge variant="secondary" className="text-xs">
                        {offer.margin_percentage.toFixed(1)}% margin
                      </Badge>
                    )}
                  </div>

                  {offer.reason && (
                    <p className="text-xs text-muted-foreground mb-3 italic">
                      "{offer.reason}"
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleAction(offer, "reject")}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 h-8 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction(offer, "approve")}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              );
            })}

            {pendingOffers.length > 5 && (
              <Button 
                variant="ghost" 
                className="w-full text-sm"
                onClick={() => window.location.href = '/admin/offer-approvals?status=pending'}
              >
                View all {pendingOffers.length} pending approvals
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ApprovalActionModal
        open={!!selectedOffer && !!actionType}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOffer(null);
            setActionType(null);
          }
        }}
        offer={selectedOffer}
        actionType={actionType}
        onConfirm={handleConfirmAction}
        isLoading={approveOffer.isPending || rejectOffer.isPending}
      />
    </>
  );
};

export default PendingApprovalsWidget;
