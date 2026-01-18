import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CustomerSearchSelect from "@/components/admin/CustomerSearchSelect";
import { InventoryItem } from "@/types/database";
import { useCreateQuote } from "@/hooks/useQuotes";
import { useMinMargin } from "@/hooks/usePricingRules";
import { toast } from "sonner";
import { Copy, Mail, AlertTriangle } from "lucide-react";

interface CustomerInfo {
  id?: string;
  name: string;
  email: string;
  company: string;
  phone: string;
}

interface QuickQuoteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

export function QuickQuoteSheet({ isOpen, onClose, item }: QuickQuoteSheetProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('percent');
  const [terms, setTerms] = useState('net30');
  const [validDays, setValidDays] = useState(30);
  const [notes, setNotes] = useState('');
  
  const createQuote = useCreateQuote();
  const minMargin = useMinMargin(item?.modality);
  
  const listPrice = item?.price || 0;
  const discountAmount = discountType === 'percent' 
    ? (listPrice * quantity * discount / 100)
    : discount;
  const subtotal = (listPrice * quantity) - discountAmount;
  const discountPercent = discountType === 'percent' 
    ? discount 
    : (listPrice > 0 ? (discount / (listPrice * quantity)) * 100 : 0);
  
  const isBelowMargin = discountPercent > (100 - minMargin);
  
  const handleSubmit = async (action: 'email' | 'copy') => {
    if (!selectedCustomer || !item) {
      toast.error("Please select a customer");
      return;
    }
    
    const quoteNumber = `Q-${Date.now().toString(36).toUpperCase()}`;
    
    try {
      await createQuote.mutateAsync({
        customer_name: selectedCustomer.name,
        customer_email: selectedCustomer.email,
        customer_company: selectedCustomer.company,
        customer_phone: selectedCustomer.phone,
        items: [{
          id: crypto.randomUUID(),
          description: `${item.product_name} - ${item.oem} ${item.modality}`,
          quantity,
          unit_price: listPrice,
          total: listPrice * quantity,
        }],
        subtotal: listPrice * quantity,
        discount: discountAmount,
        tax: 0,
        total_amount: subtotal,
        notes: `Terms: ${terms}\n${notes}`,
        valid_until: new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: action === 'email' ? 'Sent' : 'Draft',
      });
      
      if (action === 'copy') {
        const quoteUrl = `${window.location.origin}/quote/${quoteNumber}`;
        await navigator.clipboard.writeText(quoteUrl);
        toast.success("Quote created and link copied!");
      } else {
        toast.success("Quote created and sent!");
      }
      
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error creating quote:", error);
    }
  };
  
  const resetForm = () => {
    setSelectedCustomer(null);
    setQuantity(1);
    setDiscount(0);
    setNotes('');
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Quick Quote</SheetTitle>
          <SheetDescription>Create a quote for this equipment</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Customer Selection */}
          <div className="space-y-2">
            <CustomerSearchSelect
              value={selectedCustomer || { name: '', email: '', company: '', phone: '' }}
              onChange={setSelectedCustomer}
            />
          </div>
          
          {/* Line Item */}
          {item && (
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.oem} • {item.modality}
                  </p>
                </div>
                <Badge variant="outline">{formatCurrency(listPrice)}</Badge>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Label className="text-sm">Qty:</Label>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 h-8"
                />
              </div>
            </div>
          )}
          
          {/* Discount */}
          <div className="space-y-2">
            <Label>Discount</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <Select value={discountType} onValueChange={(v: any) => setDiscountType(v)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">%</SelectItem>
                  <SelectItem value="amount">$</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isBelowMargin && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Below {minMargin}% margin threshold</span>
              </div>
            )}
          </div>
          
          {/* Terms */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Terms</Label>
              <Select value={terms} onValueChange={setTerms}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net15">Net 15</SelectItem>
                  <SelectItem value="net30">Net 30</SelectItem>
                  <SelectItem value="net60">Net 60</SelectItem>
                  <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Valid for</Label>
              <Select value={validDays.toString()} onValueChange={(v) => setValidDays(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Additional notes for the quote..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <Separator />
          
          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(listPrice * quantity)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discountPercent.toFixed(1)}%)</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={() => handleSubmit('copy')}
              disabled={createQuote.isPending}
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Button 
              className="flex-1 gap-2"
              onClick={() => handleSubmit('email')}
              disabled={createQuote.isPending || !selectedCustomer}
            >
              <Mail className="h-4 w-4" />
              Email Quote
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
