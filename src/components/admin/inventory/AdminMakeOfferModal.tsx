import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CustomerSearchSelect from "@/components/admin/CustomerSearchSelect";
import { InventoryItem } from "@/types/database";
import { useCreateProductOffer } from "@/hooks/useProductOffers";
import { useMinMargin, useApprovalThreshold } from "@/hooks/usePricingRules";
import { AlertTriangle, ShieldAlert, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminMakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

const OFFER_REASONS = [
  { value: 'competitive', label: 'Competitive Pressure' },
  { value: 'volume', label: 'Volume/Bulk Deal' },
  { value: 'relationship', label: 'Key Relationship' },
  { value: 'closeout', label: 'Closeout/Clearance' },
  { value: 'trade_in', label: 'Trade-In Deal' },
  { value: 'other', label: 'Other' },
];

export function AdminMakeOfferModal({ isOpen, onClose, item }: AdminMakeOfferModalProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [offerAmount, setOfferAmount] = useState(0);
  const [targetPrice, setTargetPrice] = useState(0);
  const [offerType, setOfferType] = useState<'soft' | 'firm' | 'final'>('soft');
  const [validityDays, setValidityDays] = useState(7);
  const [reason, setReason] = useState('competitive');
  const [competitorInfo, setCompetitorInfo] = useState('');
  
  const createOffer = useCreateProductOffer();
  const minMargin = useMinMargin(item?.modality);
  const approvalThreshold = useApprovalThreshold();
  
  const listPrice = item?.price || 0;
  const discountPercent = listPrice > 0 ? ((listPrice - offerAmount) / listPrice) * 100 : 0;
  const marginPercent = 100 - discountPercent;
  
  const isBelowMargin = marginPercent < minMargin;
  const requiresApproval = discountPercent > approvalThreshold;
  
  useEffect(() => {
    if (item?.price) {
      setOfferAmount(item.price);
      setTargetPrice(item.price * 0.9); // Default target 10% below list
    }
  }, [item]);
  
  const handleSubmit = async () => {
    if (!selectedCustomer || !item) return;
    
    const offerResult = await createOffer.mutateAsync({
      inventory_id: item.id,
      customer_id: selectedCustomer.id,
      customer_name: selectedCustomer.name,
      customer_email: selectedCustomer.email,
      customer_company: selectedCustomer.company,
      list_price: listPrice,
      offer_amount: offerAmount,
      target_price: targetPrice,
      offer_type: offerType,
      validity_days: validityDays,
      reason,
      competitor_info: competitorInfo,
      status: 'pending',
      margin_percentage: marginPercent,
      requires_approval: requiresApproval,
    });
    
    // Send approval notification if required
    if (requiresApproval) {
      try {
        const reasonLabel = OFFER_REASONS.find(r => r.value === reason)?.label || reason;
        await supabase.functions.invoke('notify-offer-approval', {
          body: {
            offerId: offerResult?.id || 'unknown',
            productName: item.product_name,
            productOem: item.oem,
            listPrice,
            offerAmount,
            discountPercent,
            marginPercent,
            customerName: selectedCustomer.name,
            customerEmail: selectedCustomer.email,
            customerCompany: selectedCustomer.company,
            reason: reasonLabel,
            competitorInfo,
          }
        });
        toast.info("Offer submitted for manager approval");
      } catch (error) {
        console.error("Failed to send approval notification:", error);
      }
    }
    
    onClose();
    resetForm();
  };
  
  const resetForm = () => {
    setSelectedCustomer(null);
    setOfferAmount(0);
    setTargetPrice(0);
    setOfferType('soft');
    setReason('competitive');
    setCompetitorInfo('');
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Make Offer
          </DialogTitle>
          <DialogDescription>
            Create a formal offer for this equipment
          </DialogDescription>
        </DialogHeader>
        
        {item && (
          <div className="space-y-6">
            {/* Product Info */}
            <div className="rounded-lg bg-muted p-3">
              <p className="font-medium">{item.product_name}</p>
              <p className="text-sm text-muted-foreground">
                {item.oem} • {item.modality} • List: {formatCurrency(listPrice)}
              </p>
            </div>
            
            {/* Customer Selection */}
            <div className="space-y-2">
              <Label>Customer</Label>
              <CustomerSearchSelect
                value={selectedCustomer || { name: '', email: '', company: '', phone: '' }}
                onChange={setSelectedCustomer}
              />
            </div>
            
            {/* Offer Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Offer Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(parseFloat(e.target.value) || 0)}
                    className="pl-7"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Target Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
            
            {/* Margin Warnings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Discount</span>
                <span className={discountPercent > 15 ? 'text-amber-600 font-medium' : ''}>
                  {discountPercent.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Margin</span>
                <span className={isBelowMargin ? 'text-red-600 font-medium' : 'text-green-600'}>
                  {marginPercent.toFixed(1)}%
                </span>
              </div>
              
              {isBelowMargin && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>Below minimum margin of {minMargin}%</span>
                </div>
              )}
              
              {requiresApproval && (
                <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                  <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                  <span>Requires manager approval (discount &gt; {approvalThreshold}%)</span>
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Offer Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Offer Type</Label>
                <Select value={offerType} onValueChange={(v: any) => setOfferType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soft">Soft</SelectItem>
                    <SelectItem value="firm">Firm</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Valid For</Label>
                <Select value={validityDays.toString()} onValueChange={(v) => setValidityDays(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OFFER_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Competitor Info (Optional)</Label>
              <Textarea
                placeholder="Competitor name, their price, or other relevant info..."
                value={competitorInfo}
                onChange={(e) => setCompetitorInfo(e.target.value)}
                rows={2}
              />
            </div>
            
            {/* Offer Type Legend */}
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">Soft = Negotiable</Badge>
              <Badge variant="outline" className="text-xs">Firm = Limited flexibility</Badge>
              <Badge variant="outline" className="text-xs">Final = Take or leave</Badge>
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={createOffer.isPending || !selectedCustomer}
          >
            {requiresApproval ? 'Submit for Approval' : 'Create Offer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
