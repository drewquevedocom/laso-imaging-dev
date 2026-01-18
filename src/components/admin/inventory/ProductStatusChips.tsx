import { Badge } from "@/components/ui/badge";
import { FileText, DollarSign, Trophy, Clock, Zap } from "lucide-react";

interface ProductStatusChipsProps {
  openQuotesCount?: number;
  openOffersCount?: number;
  wonViaOffer?: boolean;
  isRentable?: boolean;
  salesStrategy?: string;
}

export function ProductStatusChips({
  openQuotesCount = 0,
  openOffersCount = 0,
  wonViaOffer,
  isRentable,
  salesStrategy,
}: ProductStatusChipsProps) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {openQuotesCount > 0 && (
        <Badge variant="secondary" className="text-xs gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          <FileText className="h-3 w-3" />
          {openQuotesCount} Quote{openQuotesCount > 1 ? 's' : ''}
        </Badge>
      )}
      
      {openOffersCount > 0 && (
        <Badge variant="secondary" className="text-xs gap-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
          <DollarSign className="h-3 w-3" />
          {openOffersCount} Offer{openOffersCount > 1 ? 's' : ''}
        </Badge>
      )}
      
      {wonViaOffer && (
        <Badge variant="secondary" className="text-xs gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <Trophy className="h-3 w-3" />
          Won via Offer
        </Badge>
      )}
      
      {isRentable && (
        <Badge variant="secondary" className="text-xs gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
          <Clock className="h-3 w-3" />
          Rentable
        </Badge>
      )}
      
      {salesStrategy === 'offer_enabled' && (
        <Badge variant="secondary" className="text-xs gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Zap className="h-3 w-3" />
          Offer Enabled
        </Badge>
      )}
    </div>
  );
}
