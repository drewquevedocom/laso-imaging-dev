import { useState, useEffect } from "react";
import { DollarSign, CheckCircle, ArrowLeftRight, XCircle, Send, Loader2 } from "lucide-react";
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
import { useCreateQuote } from "@/hooks/useQuotes";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [isSending, setIsSending] = useState(false);
  const createQuote = useCreateQuote();
  const { toast } = useToast();

  // Sync defaultAction when modal opens with a new value
  useEffect(() => {
    if (defaultAction) setAction(defaultAction);
  }, [defaultAction]);

  const handleSend = async () => {
    setIsSending(true);

    try {
      // Build email content
      const subject =
        action === "accept"
          ? "Your Quote is Confirmed — LASO Imaging Solutions"
          : action === "counter"
          ? "Counter-Offer from LASO Imaging Solutions"
          : "Regarding Your Quote Request — LASO Imaging Solutions";

      const priceFormatted = price ? `$${parseFloat(price).toLocaleString()}` : null;
      const interestLine = lead.interest ? `<p style="margin:0 0 6px 0;"><strong>Service Requested:</strong> ${lead.interest}</p>` : "";
      const notesHtml = notes
        ? `<div style="background:#f0f9ff;border-left:4px solid #0066CC;padding:12px 16px;margin:16px 0;border-radius:0 6px 6px 0;">
            <p style="margin:0;color:#1e40af;font-size:15px;">${notes.replace(/\n/g, "<br>")}</p>
           </div>`
        : "";

      let body: string;

      if (action === "accept") {
        body = `
<p style="font-size:17px;margin:0 0 20px 0;">Hi ${lead.name},</p>
<p style="margin:0 0 16px 0;">Great news — we are pleased to <strong>confirm and accept your quote request</strong>${priceFormatted ? ` at <strong style="color:#16a34a;font-size:18px;">${priceFormatted}</strong>` : ""}. We look forward to working with you.</p>
${interestLine ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px 16px;margin:0 0 20px 0;">${interestLine}</div>` : ""}
${notesHtml}
<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:20px 0;">
  <p style="margin:0 0 10px 0;font-weight:700;font-size:15px;color:#15803d;">✅ What Happens Next</p>
  <ol style="margin:0;padding-left:20px;color:#166534;font-size:14px;line-height:1.8;">
    <li>Our team will prepare a formal agreement and send it to you within <strong>1–2 business days</strong>.</li>
    <li>Once you review and sign, we will schedule delivery, installation, or service at a time that works best for you.</li>
    <li>A dedicated LASO representative will be your point of contact throughout the entire process.</li>
    <li>After completion, our team remains available for ongoing support, maintenance, and follow-up service.</li>
  </ol>
</div>
<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin:20px 0;">
  <p style="margin:0 0 10px 0;font-weight:700;font-size:15px;color:#1d4ed8;">About LASO Imaging Solutions</p>
  <p style="margin:0 0 10px 0;font-size:14px;color:#1e3a8a;">We are a full-service medical imaging company specializing in:</p>
  <ul style="margin:0;padding-left:20px;color:#1e3a8a;font-size:14px;line-height:1.8;">
    <li><strong>MRI & CT Equipment Sales</strong> — new and refurbished systems from leading manufacturers</li>
    <li><strong>Mobile MRI Rental</strong> — flexible short- and long-term mobile solutions for your facility</li>
    <li><strong>Service & Maintenance</strong> — preventive maintenance, emergency repairs, and full-service contracts</li>
    <li><strong>Parts & Components</strong> — OEM and aftermarket parts with fast delivery</li>
    <li><strong>Helium Fills & Cryogen Services</strong> — scheduled and emergency helium services</li>
  </ul>
</div>
<p style="margin:20px 0 8px 0;font-size:14px;color:#374151;">If you have any questions before we send the formal agreement, don't hesitate to reach out — we're here to help.</p>
<p style="margin:0;font-size:14px;color:#374151;">📞 Call us directly or reply to this email and a specialist will respond promptly.</p>
<p style="margin:24px 0 0 0;">Warm regards,<br><strong>The LASO Imaging Solutions Team</strong><br><a href="https://lasoimaging.com" style="color:#0066CC;">lasoimaging.com</a> | <a href="mailto:info@lasoimaging.com" style="color:#0066CC;">info@lasoimaging.com</a></p>`;
      } else if (action === "counter") {
        body = `
<p style="font-size:17px;margin:0 0 20px 0;">Hi ${lead.name},</p>
<p style="margin:0 0 16px 0;">Thank you for your interest in LASO Imaging Solutions. After reviewing your request, we would like to present you with a <strong>counter-offer</strong>${priceFormatted ? ` of <strong style="color:#d97706;font-size:18px;">${priceFormatted}</strong>` : ""}.</p>
${interestLine ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px 16px;margin:0 0 20px 0;">${interestLine}</div>` : ""}
${notesHtml}
<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:20px;margin:20px 0;">
  <p style="margin:0 0 10px 0;font-weight:700;font-size:15px;color:#92400e;">↔ Why This Pricing</p>
  <p style="margin:0;font-size:14px;color:#78350f;line-height:1.7;">Our pricing reflects the quality of equipment, the expertise of our certified technicians, and our commitment to providing comprehensive post-sale support. We stand behind every solution we deliver — from installation through long-term service.</p>
</div>
<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:20px 0;">
  <p style="margin:0 0 10px 0;font-weight:700;font-size:15px;color:#15803d;">How to Respond</p>
  <ul style="margin:0;padding-left:20px;color:#166534;font-size:14px;line-height:1.8;">
    <li><strong>Accept this offer</strong> — simply reply "I accept" and we will send a formal agreement right away.</li>
    <li><strong>Request a call</strong> — reply to this email or call us and we can discuss further to find a solution that works for your budget.</li>
    <li><strong>Ask questions</strong> — we are happy to clarify exactly what is included in this price.</li>
  </ul>
</div>
<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin:20px 0;">
  <p style="margin:0 0 10px 0;font-weight:700;font-size:15px;color:#1d4ed8;">What We Offer Beyond This Quote</p>
  <ul style="margin:0;padding-left:20px;color:#1e3a8a;font-size:14px;line-height:1.8;">
    <li>MRI & CT Equipment Sales — new and certified refurbished</li>
    <li>Mobile MRI Rental for short- and long-term needs</li>
    <li>Full-service maintenance contracts and emergency repairs</li>
    <li>OEM and aftermarket parts with fast delivery</li>
    <li>Helium fills and cryogen management</li>
  </ul>
</div>
<p style="margin:20px 0 8px 0;font-size:14px;color:#374151;">We value the opportunity to earn your business and are flexible in finding the right solution for you. Please don't hesitate to reach out with any questions.</p>
<p style="margin:0;font-size:14px;color:#374151;">📞 Reply to this email or call us — a specialist is ready to assist you.</p>
<p style="margin:24px 0 0 0;">Best regards,<br><strong>The LASO Imaging Solutions Team</strong><br><a href="https://lasoimaging.com" style="color:#0066CC;">lasoimaging.com</a> | <a href="mailto:info@lasoimaging.com" style="color:#0066CC;">info@lasoimaging.com</a></p>`;
      } else {
        body = `
<p style="font-size:17px;margin:0 0 20px 0;">Hi ${lead.name},</p>
<p style="margin:0 0 16px 0;">Thank you for considering LASO Imaging Solutions for your medical imaging needs. After carefully reviewing your request, we are unfortunately <strong>unable to fulfill this particular quote</strong> at this time.</p>
${interestLine ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px 16px;margin:0 0 20px 0;">${interestLine}</div>` : ""}
${notesHtml}
<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin:20px 0;">
  <p style="margin:0 0 10px 0;font-weight:700;font-size:15px;color:#1d4ed8;">Other Ways We Can Help You</p>
  <p style="margin:0 0 10px 0;font-size:14px;color:#1e3a8a;">Even if we cannot accommodate this specific request, our team offers a wide range of medical imaging services that may meet your needs:</p>
  <ul style="margin:0;padding-left:20px;color:#1e3a8a;font-size:14px;line-height:1.8;">
    <li><strong>MRI & CT Equipment Sales</strong> — new and certified refurbished systems at competitive prices</li>
    <li><strong>Mobile MRI Rental</strong> — short- and long-term mobile units while you explore permanent solutions</li>
    <li><strong>Service & Maintenance Contracts</strong> — keep your existing equipment running at peak performance</li>
    <li><strong>Parts & Components</strong> — OEM and aftermarket parts with rapid delivery</li>
    <li><strong>Helium & Cryogen Services</strong> — scheduled fills and emergency response</li>
  </ul>
</div>
<p style="margin:0 0 16px 0;font-size:14px;color:#374151;">We genuinely appreciate your inquiry and encourage you to reach out in the future — circumstances change, and we would love the opportunity to work with you.</p>
<p style="margin:0;font-size:14px;color:#374151;">📞 Feel free to call us or visit <a href="https://lasoimaging.com" style="color:#0066CC;">lasoimaging.com</a> to learn more about our full range of services.</p>
<p style="margin:24px 0 0 0;">Thank you again,<br><strong>The LASO Imaging Solutions Team</strong><br><a href="https://lasoimaging.com" style="color:#0066CC;">lasoimaging.com</a> | <a href="mailto:info@lasoimaging.com" style="color:#0066CC;">info@lasoimaging.com</a></p>`;
      }

      // Send email via edge function (same as CommunicationHub)
      const { error: emailError } = await supabase.functions.invoke("send-lead-email", {
        body: {
          to: lead.email,
          cc: ["info@lasoimaging.com"],
          subject,
          body,
          leadId: lead.id,
        },
      });

      if (emailError) throw emailError;

      // Create quote record so it appears in /admin/quotes
      const quoteStatus =
        action === "accept" ? "Accepted" : action === "counter" ? "Sent" : "Rejected";
      const amount = parseFloat(price) || 0;

      createQuote.mutate({
        customer_name: lead.name,
        customer_email: lead.email,
        customer_company: lead.company || undefined,
        customer_phone: lead.phone || undefined,
        lead_id: lead.id,
        items: [],
        subtotal: amount,
        tax: 0,
        total_amount: amount,
        status: quoteStatus as any,
        notes: notes || undefined,
      });

      // Update lead status (single call — no duplicate)
      const newStatus =
        action === "accept" ? "converted" : action === "decline" ? "closed" : "qualified";
      onStatusChange(lead.id, newStatus);

      toast({
        title:
          action === "accept"
            ? "Quote Accepted & Sent"
            : action === "counter"
            ? "Counter-Offer Sent"
            : "Quote Declined & Sent",
        description: `Email sent to ${lead.email}. Quote recorded.`,
      });

      setPrice("");
      setNotes("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Quote response error:", error);
      toast({
        title: "Failed to send response",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const actionConfig = {
    accept: {
      label: "Accept",
      icon: <CheckCircle className="h-4 w-4" />,
      activeClass: "bg-green-600 hover:bg-green-700 text-white border-green-600",
      inactiveClass: "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950",
      showPrice: true,
      priceLabel: "Agreed Price ($)",
    },
    counter: {
      label: "Counter-Offer",
      icon: <ArrowLeftRight className="h-4 w-4" />,
      activeClass: "bg-amber-500 hover:bg-amber-600 text-white border-amber-500",
      inactiveClass: "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950",
      showPrice: true,
      priceLabel: "Your Counter Price ($)",
    },
    decline: {
      label: "Decline",
      icon: <XCircle className="h-4 w-4" />,
      activeClass: "bg-red-600 hover:bg-red-700 text-white border-red-600",
      inactiveClass: "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950",
      showPrice: false,
      priceLabel: "",
    },
  };

  const current = actionConfig[action];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
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
          <Badge variant="secondary" className="mt-1">
            {lead.interest}
          </Badge>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending} className={current.activeClass}>
            {isSending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {isSending ? "Sending..." : "Send Response"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteResponseModal;
