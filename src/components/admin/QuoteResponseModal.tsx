import { useState } from "react";
import { DollarSign, CheckCircle, ArrowLeftRight, XCircle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TriageLead } from "@/hooks/useLeadTriage";
import { useUpdateLeadStatus } from "@/hooks/useLeadTriage";
import { useToast } from "@/hooks/use-toast";

type ResponseAction = "accept" | "counter" | "decline";

interface QuoteResponseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: TriageLead;
  onStatusChange: (leadId: string, status: string) => void;
  defaultAction?: ResponseAction;
}

const QuoteResponseModal = ({
  open,
  onOpenChange,
  lead,
  onStatusChange,
  defaultAction,
}: QuoteResponseModalProps) => {
  const [action, setAction] = useState<ResponseAction>(defaultAction ?? "accept");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const updateStatus = useUpdateLeadStatus();
  const { toast } = useToast();

  const handleSend = () => {
    const subject = encodeURIComponent(
      action === "accept"
        ? `Quote Accepted — LASO Imaging Solutions`
        : action === "counter"
        ? `Counter-Offer from LASO Imaging Solutions`
        : `Regarding Your Quote Request — LASO Imaging Solutions`
    );

    let body = `Hi ${lead.name},\n\n`;

    if (action === "accept") {
      body += `We are pleased to accept your quote request`;
      if (price) body += ` at $${parseFloat(price).toLocaleString()}`;
      body += `.\n\n`;
    } else if (action === "counter") {
      body += `Thank you for your interest. We'd like to offer a counter-proposal`;
      if (price) body += ` at $${parseFloat(price).toLocaleString()}`;
      body += `.\n\n`;
    } else {
      body += `Thank you for reaching out to LASO Imaging Solutions. After careful review, we are unable to fulfill this quote request at this time.\n\n`;
    }

    if (notes) body += `${notes}\n\n`;
    body += `Best regards,\nLASO Imaging Solutions Team\nhttps://lasoimaging.com`;

    const mailtoLink = `mailto:${lead.email}?subject=${subject}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");

    const newStatus =
      action === "accept" ? "converted" : action === "decline" ? "closed" : "qualified";
    onStatusChange(lead.id, newStatus);
    updateStatus.mutate({ leadId: lead.id, status: newStatus });

    toast({
      title:
        action === "accept"
          ? "Quote Accepted"
          : action === "counter"
          ? "Counter-Offer Sent"
          : "Quote Declined",
      description: `Email drafted for ${lead.name}. Lead status updated.`,
    });

    setPrice("");
    setNotes("");
    onOpenChange(false);
  };

  const actionConfig = {
    accept: {
      label: "Accept",
      icon: <CheckCircle className="h-4 w-4" />,
      activeClass: "bg-green-600 hover:bg-green-700 text-white border-green-600",
      inactiveClass: "border-green-300 text-green-700 hover:bg-green-50",
      showPrice: true,
      priceLabel: "Agreed Price ($)",
    },
    counter: {
      label: "Counter-Offer",
      icon: <ArrowLeftRight className="h-4 w-4" />,
      activeClass: "bg-amber-500 hover:bg-amber-600 text-white border-amber-500",
      inactiveClass: "border-amber-300 text-amber-700 hover:bg-amber-50",
      showPrice: true,
      priceLabel: "Your Counter Price ($)",
    },
    decline: {
      label: "Decline",
      icon: <XCircle className="h-4 w-4" />,
      activeClass: "bg-red-600 hover:bg-red-700 text-white border-red-600",
      inactiveClass: "border-red-300 text-red-700 hover:bg-red-50",
      showPrice: false,
      priceLabel: "",
    },
  };

  const current = actionConfig[action];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-amber-500" />
            Respond to Quote Request
          </DialogTitle>
        </DialogHeader>

        {/* Customer Info */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
          <div className="font-semibold">{lead.name}</div>
          {lead.company && <div className="text-muted-foreground">{lead.company}</div>}
          <div className="text-muted-foreground">{lead.email}</div>
          <Badge variant="secondary" className="mt-1">{lead.interest}</Badge>
          {lead.message && (
            <p className="text-muted-foreground mt-2 italic border-l-2 border-muted pl-2">
              "{lead.message}"
            </p>
          )}
        </div>

        {/* Action Selector — 3 big buttons */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Your Response</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["accept", "counter", "decline"] as ResponseAction[]).map((a) => {
              const cfg = actionConfig[a];
              const isActive = action === a;
              return (
                <button
                  key={a}
                  onClick={() => setAction(a)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border-2 font-medium text-sm transition-all ${
                    isActive ? cfg.activeClass : cfg.inactiveClass
                  }`}
                >
                  {cfg.icon}
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Input (conditional) */}
        {current.showPrice && (
          <div className="space-y-1.5">
            <Label htmlFor="quote-price">{current.priceLabel}</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="quote-price"
                type="number"
                min="0"
                step="100"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="quote-notes">Notes / Message to Customer</Label>
          <Textarea
            id="quote-notes"
            placeholder={
              action === "decline"
                ? "Optionally explain why (e.g. out of stock, budget mismatch)..."
                : "Add any additional details, terms, or conditions..."
            }
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className={current.activeClass}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Response
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteResponseModal;
