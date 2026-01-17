import { Mail, Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import logoLaso from "@/assets/logo-laso.png";

interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface QuotePreviewData {
  customer: {
    name: string;
    email: string;
    company: string;
    phone: string;
  };
  items: QuoteItem[];
  notes: string;
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
}

interface QuotePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: QuotePreviewData;
}

const QuotePreviewModal = ({ open, onOpenChange, data }: QuotePreviewModalProps) => {
  const { customer, items, notes, totals } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const quoteNumber = `Q-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadPDF = () => {
    toast.info("PDF download will be available soon");
  };

  const handleSendEmail = () => {
    toast.success("Quote email functionality coming soon!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Quote Preview</DialogTitle>
          </div>
        </DialogHeader>

        {/* PDF Preview */}
        <div className="mx-6 mb-4 border rounded-lg shadow-lg bg-white text-black">
          {/* Header */}
          <div className="flex items-start justify-between p-8 border-b">
            <div>
              <img src={logoLaso} alt="LASO Imaging Solutions" className="h-12 mb-2" />
              <p className="text-sm text-gray-600">
                1234 Medical Equipment Dr.<br />
                Houston, TX 77001<br />
                1-800-MRI-LASO
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-primary mb-1">QUOTE</h2>
              <p className="text-sm text-gray-600">
                Quote #: <span className="font-medium text-black">{quoteNumber}</span>
              </p>
              <p className="text-sm text-gray-600">
                Date: <span className="font-medium text-black">{today}</span>
              </p>
            </div>
          </div>

          {/* Bill To */}
          <div className="p-8 border-b bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
            <p className="font-medium">{customer.name || "Customer Name"}</p>
            {customer.company && <p>{customer.company}</p>}
            <p className="text-gray-600">{customer.email || "email@example.com"}</p>
            {customer.phone && <p className="text-gray-600">{customer.phone}</p>}
          </div>

          {/* Line Items */}
          <div className="p-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-semibold text-gray-500 uppercase">Description</th>
                  <th className="text-center py-2 text-sm font-semibold text-gray-500 uppercase w-20">Qty</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-500 uppercase w-32">Unit Price</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-500 uppercase w-32">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      No items added yet
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-3">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 text-right font-medium">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-6 flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
                {totals.tax > 0 && (
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatCurrency(totals.tax)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between py-2 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="px-8 pb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notes</h3>
              <p className="text-sm text-gray-600">{notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="p-8 border-t bg-gray-50 text-center text-sm text-gray-500">
            <p className="font-medium text-gray-700 mb-2">Valid Until: {validUntil}</p>
            <p>
              This quote is valid for 30 days from the date of issue. Payment terms: Net 30.
              All equipment is subject to availability. Prices are subject to change.
            </p>
            <p className="mt-4">
              Thank you for your business! | www.lasoimaging.com
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-6 pt-0 border-t bg-muted/30">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Send via Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuotePreviewModal;
