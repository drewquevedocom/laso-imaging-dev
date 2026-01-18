import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, Filter, LayoutGrid } from "lucide-react";

export interface QuickFilters {
  hasQuotes: boolean;
  hasOffers: boolean;
  lowStock: boolean;
  rentalEligible: boolean;
}

interface InventoryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  oemFilter: string;
  onOemChange: (value: string) => void;
  modalityFilter: string;
  onModalityChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  quickFilters: QuickFilters;
  onQuickFilterToggle: (filter: keyof QuickFilters) => void;
  groupBy: 'none' | 'modality' | 'strategy';
  onGroupByChange: (value: 'none' | 'modality' | 'strategy') => void;
  oemOptions: string[];
  modalityOptions: string[];
  statusOptions: string[];
}

export function InventoryFilters({
  searchQuery,
  onSearchChange,
  oemFilter,
  onOemChange,
  modalityFilter,
  onModalityChange,
  statusFilter,
  onStatusChange,
  quickFilters,
  onQuickFilterToggle,
  groupBy,
  onGroupByChange,
  oemOptions,
  modalityOptions,
  statusOptions,
}: InventoryFiltersProps) {
  const hasActiveFilters = oemFilter !== 'all' || modalityFilter !== 'all' || statusFilter !== 'all' ||
    Object.values(quickFilters).some(v => v);

  const clearFilters = () => {
    onOemChange('all');
    onModalityChange('all');
    onStatusChange('all');
    onSearchChange('');
    Object.keys(quickFilters).forEach(k => {
      if (quickFilters[k as keyof typeof quickFilters]) {
        onQuickFilterToggle(k as keyof typeof quickFilters);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, serial..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={oemFilter} onValueChange={onOemChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="OEM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All OEMs</SelectItem>
            {oemOptions.map((oem) => (
              <SelectItem key={oem} value={oem}>{oem}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={modalityFilter} onValueChange={onModalityChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Modality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modalities</SelectItem>
            {modalityOptions.map((mod) => (
              <SelectItem key={mod} value={mod}>{mod}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={groupBy} onValueChange={(v: any) => onGroupByChange(v)}>
          <SelectTrigger className="w-[130px]">
            <LayoutGrid className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Grouping</SelectItem>
            <SelectItem value="modality">By Modality</SelectItem>
            <SelectItem value="strategy">By Strategy</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={quickFilters.hasQuotes ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/80 transition-colors"
          onClick={() => onQuickFilterToggle('hasQuotes')}
        >
          <Filter className="h-3 w-3 mr-1" />
          Has Open Quotes
        </Badge>
        <Badge
          variant={quickFilters.hasOffers ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/80 transition-colors"
          onClick={() => onQuickFilterToggle('hasOffers')}
        >
          <Filter className="h-3 w-3 mr-1" />
          Has Open Offers
        </Badge>
        <Badge
          variant={quickFilters.rentalEligible ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/80 transition-colors"
          onClick={() => onQuickFilterToggle('rentalEligible')}
        >
          <Filter className="h-3 w-3 mr-1" />
          Rental Eligible
        </Badge>
        <Badge
          variant={quickFilters.lowStock ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/80 transition-colors"
          onClick={() => onQuickFilterToggle('lowStock')}
        >
          <Filter className="h-3 w-3 mr-1" />
          Low Stock
        </Badge>
      </div>
    </div>
  );
}
