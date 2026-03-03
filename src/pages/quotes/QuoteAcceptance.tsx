import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Check, X, Loader2, FileText, Calendar, Building, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import logoLaso from "@/assets/logo-laso.png";

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_company?: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total_amount: number;
  notes?: string;
  valid_until?: string;
  status: string;
  accepted_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  viewed_at?: string;
  created_at: string;
}

const QuoteAcceptance = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const urlToken = token || searchParams.get("token");
  
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (urlToken) {
      fetchQuote();
    }
  }, [urlToken]);

  const fetchQuote = async () => {
    if (!urlToken) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quote-portal-action?token=${urlToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Quote not found");
        return;
      }

      setQuote(result.quote);

      // Mark as viewed
      if (!result.quote.viewed_at) {
        await supabase.functions.invoke("quote-portal-action", {
          body: { action: "view", token: urlToken },
        });
      }
    } catch (err: any) {
      console.error("Error fetching quote:", err);
      setError("Failed to load quote");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!urlToken) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase.functions.invoke("quote-portal-action", {
        body: { action: "accept", token: urlToken },
      });

      if (error) throw error;

      toast.success("Quote accepted!", {
        description: "Thank you for your business. We'll be in touch shortly.",
      });
      
      // Refresh quote data
      await fetchQuote();
    } catch (err: any) {
      console.error("Error accepting quote:", err);
      toast.error("Failed to accept quote", {
        description: err.message || "Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!urlToken) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase.functions.invoke("quote-portal-action", {
        body: { action: "reject", token: urlToken, rejectionReason },
      });

      if (error) throw error;

      toast.info("Quote declined", {
        description: "We appreciate your consideration.",
      });
      
      setShowRejectDialog(false);
      await fetchQuote();
    } catch (err: any) {
      console.error("Error rejecting quote:", err);
      toast.error("Failed to decline quote", {
        description: err.message || "Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const getStatusBadge = () => {
    if (quote?.accepted_at) {
      return <Badge className="bg-green-500">Accepted</Badge>;
    }
    if (quote?.rejected_at) {
      return <Badge variant="destructive">Declined</Badge>;
    }
    if (quote?.valid_until && new Date(quote.valid_until) < new Date()) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    return <Badge variant="outline">Pending Response</Badge>;
  };

  const isActionable = () => {
    if (!quote) return false;
    if (quote.accepted_at || quote.rejected_at) return false;
    if (quote.valid_until && new Date(quote.valid_until) < new Date()) return false;
    return true;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Quote Not Found</h2>
            <p className="text-muted-foreground">
              {error || "The quote you're looking for doesn't exist or has expired."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Quote {quote.quote_number} | LASO Imaging Solutions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <img src={logoLaso} alt="LASO Imaging" className="h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Quote Review</h1>
          </div>

          {/* Quote Card */}
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Quote {quote.quote_number}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Issued on {format(new Date(quote.created_at), "MMMM d, yyyy")}
                  </p>
                </div>
                {getStatusBadge()}
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prepared For</p>
                  <p className="font-medium">{quote.customer_name}</p>
                  {quote.customer_company && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {quote.customer_company}
                    </p>
                  )}
                </div>
                {quote.valid_until && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Valid Until</p>
                    <p className="font-medium flex items-center gap-1 justify-end">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(quote.valid_until), "MMMM d, yyyy")}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Line Items */}
              <div>
                <h3 className="font-semibold mb-4">Quote Details</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Description</th>
                        <th className="text-center p-3 text-sm font-medium w-20">Qty</th>
                        <th className="text-right p-3 text-sm font-medium w-28">Price</th>
                        <th className="text-right p-3 text-sm font-medium w-28">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.items?.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{item.description}</td>
                          <td className="p-3 text-center">{item.quantity}</td>
                          <td className="p-3 text-right">{formatCurrency(item.unit_price)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-4 flex flex-col items-end space-y-2">
                  <div className="flex justify-between w-48 text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>{formatCurrency(quote.subtotal)}</span>
                  </div>
                  <div className="flex justify-between w-48 text-sm">
                    <span className="text-muted-foreground">Tax:</span>
                    <span>{formatCurrency(quote.tax)}</span>
                  </div>
                  <Separator className="w-48" />
                  <div className="flex justify-between w-48 font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{formatCurrency(quote.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {quote.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {quote.notes}
                    </p>
                  </div>
                </>
              )}

              {/* Status Message */}
              {quote.accepted_at && (
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <p className="text-green-700 dark:text-green-400 font-medium flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Quote Accepted on {format(new Date(quote.accepted_at), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              )}

              {quote.rejected_at && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-400 font-medium flex items-center gap-2">
                    <X className="h-5 w-5" />
                    Quote Declined on {format(new Date(quote.rejected_at), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                  {quote.rejection_reason && (
                    <p className="text-sm text-red-600 dark:text-red-300 mt-2">
                      Reason: {quote.rejection_reason}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {isActionable() && (
                <>
                  <Separator />
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleAccept}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Accept Quote
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setShowRejectDialog(true)}
                      disabled={isProcessing}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline Quote
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Questions? Contact us at{" "}
            <a href="mailto:info@lasoimaging.com" className="text-primary hover:underline">
              info@lasoimaging.com
            </a>
          </p>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Quote</DialogTitle>
            <DialogDescription>
              We're sorry to hear that. Would you like to share why you're declining this quote?
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for declining (optional)"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
              {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Confirm Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuoteAcceptance;
