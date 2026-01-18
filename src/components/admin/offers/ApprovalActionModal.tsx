import { useState } from "react";
import { Check, X, DollarSign, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Offer {
  id: string;
  customer_name: string;
  customer_company: string | null;
  offer_amount: number;
  list_price: number | null;
  margin_percentage: number | null;
  reason: string | null;
  inventory?: {
    product_name: string;
    oem: string;
  } | null;
}

interface ApprovalActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Offer | null;
  actionType: "approve" | "reject" | null;
  onConfirm: (notes?: string) => void;
  isLoading?: boolean;
}

const ApprovalActionModal = ({
  open,
  onOpenChange,
  offer,
  actionType,
  onConfirm,
  isLoading = false,
}: ApprovalActionModalProps) => {
  const [notes, setNotes] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleConfirm = () => {
    onConfirm(notes.trim() || undefined);
    setNotes("");
  };

  const handleClose = () => {
    setNotes("");
    onOpenChange(false);
  };

  if (!offer || !actionType) return null;

  const isApprove = actionType === "approve";
  const discountPercent = offer.list_price
    ? Math.round(((offer.list_price - offer.offer_amount) / offer.list_price) * 100)
    : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                Approve Offer
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-red-500" />
                Reject Offer
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isApprove
              ? "Confirm approval for this discounted offer"
              : "Provide a reason for rejecting this offer"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Offer Details */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Customer</span>
              <span className="font-medium">
                {offer.customer_name}
                {offer.customer_company && ` (${offer.customer_company})`}
              </span>
            </div>

            {offer.inventory && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Equipment</span>
                <span className="font-medium">
                  {offer.inventory.oem} {offer.inventory.product_name}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Offer Amount</span>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-bold text-lg">
                  {formatCurrency(offer.offer_amount)}
                </span>
              </div>
            </div>

            {offer.list_price && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">List Price</span>
                <span className="text-muted-foreground line-through">
                  {formatCurrency(offer.list_price)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Discount</span>
              <div className="flex items-center gap-2">
                {discountPercent !== null && (
                  <Badge
                    variant="outline"
                    className={
                      discountPercent > 20
                        ? "text-red-600 border-red-300"
                        : "text-amber-600 border-amber-300"
                    }
                  >
                    {discountPercent}% off
                  </Badge>
                )}
                {offer.margin_percentage !== null && (
                  <Badge variant="secondary">
                    {offer.margin_percentage.toFixed(1)}% margin
                  </Badge>
                )}
              </div>
            </div>

            {offer.reason && (
              <div className="pt-2 border-t">
                <span className="text-sm text-muted-foreground block mb-1">
                  Sales Rep Note
                </span>
                <p className="text-sm italic">"{offer.reason}"</p>
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              {isApprove ? "Approval Notes (optional)" : "Rejection Reason"}
            </Label>
            <Textarea
              id="notes"
              placeholder={
                isApprove
                  ? "Add any notes about this approval..."
                  : "Explain why this offer is being rejected..."
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={!isApprove && !notes ? "border-red-300" : ""}
            />
            {!isApprove && !notes && (
              <p className="text-xs text-red-500">
                Please provide a reason for rejection
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || (!isApprove && !notes.trim())}
            className={
              isApprove
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isApprove ? "Approve Offer" : "Reject Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalActionModal;
