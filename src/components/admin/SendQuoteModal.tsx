import { useState, useEffect } from "react";
import { Loader2, Send, FileText, Mail, Copy, Check, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_company?: string;
  items: any[];
  subtotal: number;
  tax: number;
  total_amount: number;
  notes?: string;
  valid_until?: string;
  status: string;
  acceptance_token?: string;
}

interface SendQuoteModalProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PORTAL_BASE_URL = "https://laso-ver1.lovable.app";

const SendQuoteModal = ({ quote, open, onOpenChange, onSuccess }: SendQuoteModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Reset form when quote changes
  useEffect(() => {
    if (quote) {
      setEmailTo(quote.customer_email || "");
      setEmailSubject(`Quote ${quote.quote_number} from LASO Imaging Solutions`);
      setEmailMessage(`Dear ${quote.customer_name},\n\nPlease find attached your quote ${quote.quote_number} for the requested equipment and services.\n\nThe total amount is $${quote.total_amount?.toLocaleString() || "0"}.\n\nThis quote is valid until ${quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : "30 days from issue date"}.\n\nPlease don't hesitate to contact us if you have any questions.\n\nBest regards,\nLASO Imaging Solutions Team`);
      setCopied(false);
    }
  }, [quote]);

  const portalLink = quote?.acceptance_token 
    ? `${PORTAL_BASE_URL}/quote/${quote.acceptance_token}` 
    : null;

  const handleCopyLink = async () => {
    if (!portalLink) return;
    
    try {
      await navigator.clipboard.writeText(portalLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleGeneratePDF = async () => {
    if (!quote) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quote-pdf", {
        body: { quoteId: quote.id },
      });

      if (error) throw error;

      toast.success("PDF generated successfully!", {
        description: "The quote PDF has been created.",
      });
      
      // If we got a download URL, open it
      if (data?.pdfUrl) {
        window.open(data.pdfUrl, "_blank");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF", {
        description: "Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendQuote = async () => {
    if (!quote || !emailTo) return;

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          quoteId: quote.id,
          to: emailTo,
          subject: emailSubject,
          message: emailMessage,
        },
      });

      if (error) throw error;

      toast.success("Quote sent successfully!", {
        description: `Email sent to ${emailTo}`,
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending quote:", error);
      toast.error("Failed to send quote", {
        description: "Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!quote) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Quote {quote.quote_number}
          </DialogTitle>
          <DialogDescription>
            Generate a PDF and send the quote via email to the customer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quote Summary */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Customer:</span>
              <span className="font-medium">{quote.customer_name}</span>
            </div>
            {quote.customer_company && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Company:</span>
                <span>{quote.customer_company}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Items:</span>
              <span>{quote.items?.length || 0} line items</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span className="text-lg">{formatCurrency(quote.total_amount)}</span>
            </div>
          </div>

          {/* Quote Acceptance Portal Link */}
          {portalLink && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-success" />
                <span className="font-medium text-success">Customer Acceptance Portal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This link allows the customer to view, accept, or decline the quote online.
              </p>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={portalLink}
                  className="flex-1 text-xs bg-background"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(portalLink, "_blank")}
                  className="shrink-0"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
          )}

          {/* Generate PDF Button */}
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="font-medium">Generate Quote PDF</p>
              <p className="text-sm text-muted-foreground">
                Create a professional PDF document of this quote
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleGeneratePDF}
              disabled={isGenerating}
            >
              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isGenerating ? "Generating..." : "Generate PDF"}
            </Button>
          </div>

          <Separator />

          {/* Email Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Email Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="emailTo">Recipient Email *</Label>
              <Input
                id="emailTo"
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailSubject">Subject</Label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Quote from LASO Imaging Solutions"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailMessage">Message</Label>
              <Textarea
                id="emailMessage"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                The email will automatically include a "View & Accept Quote" button linking to the acceptance portal.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendQuote}
              disabled={isSending || !emailTo}
            >
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" />
              Send Quote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendQuoteModal;
