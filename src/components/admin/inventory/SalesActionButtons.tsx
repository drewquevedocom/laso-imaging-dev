import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText, DollarSign } from "lucide-react";
import { InventoryItem } from "@/types/database";

interface SalesActionButtonsProps {
  item: InventoryItem;
  onBuy: (item: InventoryItem) => void;
  onQuote: (item: InventoryItem) => void;
  onOffer: (item: InventoryItem) => void;
  hasOpenQuote?: boolean;
  hasOpenOffer?: boolean;
}

export function SalesActionButtons({
  item,
  onBuy,
  onQuote,
  onOffer,
  hasOpenQuote,
  hasOpenOffer,
}: SalesActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        size="sm" 
        onClick={() => onBuy(item)}
        className="gap-1"
      >
        <ShoppingCart className="h-3.5 w-3.5" />
        Buy
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onQuote(item)}
        className="text-muted-foreground hover:text-foreground gap-1"
      >
        <FileText className="h-3.5 w-3.5" />
        Quote
        {hasOpenQuote && (
          <span className="ml-1 h-2 w-2 rounded-full bg-blue-500" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onOffer(item)}
        className="text-muted-foreground hover:text-foreground gap-1"
      >
        <DollarSign className="h-3.5 w-3.5" />
        Offer
        {hasOpenOffer && (
          <span className="ml-1 h-2 w-2 rounded-full bg-orange-500" />
        )}
      </Button>
    </div>
  );
}
