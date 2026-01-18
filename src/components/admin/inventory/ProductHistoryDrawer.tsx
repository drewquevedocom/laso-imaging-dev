import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InventoryItem } from "@/types/database";
import { useProductOffers } from "@/hooks/useProductOffers";
import { useQuotes } from "@/hooks/useQuotes";
import { format } from "date-fns";
import { FileText, DollarSign, Clock, CheckCircle, XCircle, Mail } from "lucide-react";

interface ProductHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

export function ProductHistoryDrawer({ isOpen, onClose, item }: ProductHistoryDrawerProps) {
  const { data: offers, isLoading: offersLoading } = useProductOffers(item?.id);
  const { data: allQuotes } = useQuotes();
  
  // Filter quotes that include this product
  const quotes = allQuotes?.filter(quote => {
    const items = quote.items as any[];
    return items?.some(i => 
      i.name?.toLowerCase().includes(item?.product_name?.toLowerCase() || '')
    );
  }) || [];
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'Accepted':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>;
      case 'rejected':
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'pending':
      case 'Sent':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'expired':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Deal History</DrawerTitle>
          <DrawerDescription>
            {item?.product_name} - {item?.oem} {item?.modality}
          </DrawerDescription>
        </DrawerHeader>
        
        <ScrollArea className="px-4 pb-6 max-h-[60vh]">
          <div className="space-y-6">
            {/* Quotes Section */}
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4" />
                Quotes ({quotes.length})
              </h4>
              
              {quotes.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No quotes found</p>
              ) : (
                <div className="space-y-3">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{quote.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{quote.customer_company}</p>
                        </div>
                        {getStatusBadge(quote.status || 'Draft')}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {format(new Date(quote.created_at), 'MMM d, yyyy')}
                        </span>
                        <span className="font-medium">{formatCurrency(quote.total_amount || 0)}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <Mail className="h-3 w-3 mr-1" />
                          Follow Up
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Separator />
            
            {/* Offers Section */}
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4" />
                Offers ({offers?.length || 0})
              </h4>
              
              {offersLoading ? (
                <p className="text-sm text-muted-foreground py-4">Loading...</p>
              ) : offers?.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No offers found</p>
              ) : (
                <div className="space-y-3">
                  {offers?.map((offer) => (
                    <div key={offer.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{offer.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{offer.customer_company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs capitalize">{offer.offer_type}</Badge>
                          {getStatusBadge(offer.status)}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">List</p>
                          <p>{formatCurrency(offer.list_price || 0)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Offer</p>
                          <p className="font-medium">{formatCurrency(offer.offer_amount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Discount</p>
                          <p className={offer.margin_percentage && offer.margin_percentage < 15 ? 'text-amber-600' : ''}>
                            {(100 - (offer.margin_percentage || 0)).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                        <span>{format(new Date(offer.created_at), 'MMM d, yyyy')}</span>
                        {offer.reason && <span className="capitalize">{offer.reason.replace('_', ' ')}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
