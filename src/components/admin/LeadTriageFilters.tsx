import { useState } from "react";
import { Search, Calendar, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export interface LeadFilters {
  search: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  scoreMin: number;
  scoreMax: number;
  types: string[];
}

interface LeadTriageFiltersProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
}

const LEAD_TYPES = [
  { value: "Mobile MRI", label: "Mobile MRI", color: "bg-red-500" },
  { value: "Service", label: "Service", color: "bg-yellow-500" },
  { value: "Equipment Sale", label: "Equipment Sale", color: "bg-green-500" },
  { value: "Helium", label: "Helium", color: "bg-blue-500" },
  { value: "Parts", label: "Parts", color: "bg-purple-500" },
];

const LeadTriageFilters = ({ filters, onFiltersChange }: LeadTriageFiltersProps) => {
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [scorePopoverOpen, setScorePopoverOpen] = useState(false);
  const [typePopoverOpen, setTypePopoverOpen] = useState(false);

  const hasActiveFilters = 
    filters.search || 
    filters.dateFrom || 
    filters.dateTo || 
    filters.scoreMin > 0 || 
    filters.scoreMax < 100 ||
    filters.types.length > 0;

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      dateFrom: undefined,
      dateTo: undefined,
      scoreMin: 0,
      scoreMax: 100,
      types: [],
    });
  };

  const toggleType = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onFiltersChange({ ...filters, types: newTypes });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-9 h-9"
        />
      </div>

      {/* Date Filter */}
      <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-9 gap-2 ${filters.dateFrom || filters.dateTo ? "border-primary text-primary" : ""}`}
          >
            <Calendar className="h-4 w-4" />
            {filters.dateFrom || filters.dateTo ? (
              <span>
                {filters.dateFrom ? format(filters.dateFrom, "MMM d") : "Start"} 
                {" - "} 
                {filters.dateTo ? format(filters.dateTo, "MMM d") : "End"}
              </span>
            ) : (
              "Date"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">From</Label>
              <CalendarComponent
                mode="single"
                selected={filters.dateFrom}
                onSelect={(date) => onFiltersChange({ ...filters, dateFrom: date })}
                className="rounded-md border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">To</Label>
              <CalendarComponent
                mode="single"
                selected={filters.dateTo}
                onSelect={(date) => onFiltersChange({ ...filters, dateTo: date })}
                className="rounded-md border"
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onFiltersChange({ ...filters, dateFrom: undefined, dateTo: undefined })}
              className="w-full"
            >
              Clear Dates
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Score Filter */}
      <Popover open={scorePopoverOpen} onOpenChange={setScorePopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-9 gap-2 ${filters.scoreMin > 0 || filters.scoreMax < 100 ? "border-primary text-primary" : ""}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {filters.scoreMin > 0 || filters.scoreMax < 100 ? (
              <span>Score: {filters.scoreMin}-{filters.scoreMax}</span>
            ) : (
              "Score"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start">
          <div className="space-y-4">
            <Label className="text-sm font-medium">Lead Score Range</Label>
            <div className="px-2">
              <Slider
                value={[filters.scoreMin, filters.scoreMax]}
                onValueChange={([min, max]) => onFiltersChange({ ...filters, scoreMin: min, scoreMax: max })}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{filters.scoreMin}</span>
              <span>{filters.scoreMax}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onFiltersChange({ ...filters, scoreMin: 0, scoreMax: 100 })}
              className="w-full"
            >
              Reset Score
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Type Filter */}
      <Popover open={typePopoverOpen} onOpenChange={setTypePopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-9 gap-2 ${filters.types.length > 0 ? "border-primary text-primary" : ""}`}
          >
            Type
            {filters.types.length > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {filters.types.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-4" align="start">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Lead Types</Label>
            {LEAD_TYPES.map((type) => (
              <div key={type.value} className="flex items-center gap-2">
                <Checkbox
                  id={type.value}
                  checked={filters.types.includes(type.value)}
                  onCheckedChange={() => toggleType(type.value)}
                />
                <Label htmlFor={type.value} className="flex items-center gap-2 text-sm cursor-pointer">
                  <span className={`w-2 h-2 rounded-full ${type.color}`} />
                  {type.label}
                </Label>
              </div>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onFiltersChange({ ...filters, types: [] })}
              className="w-full"
            >
              Clear Types
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Tags */}
      {filters.types.map((type) => (
        <Badge 
          key={type} 
          variant="secondary" 
          className="h-7 gap-1 cursor-pointer"
          onClick={() => toggleType(type)}
        >
          {type}
          <X className="h-3 w-3" />
        </Badge>
      ))}

      {/* Clear All Button */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-muted-foreground">
          Clear all
        </Button>
      )}
    </div>
  );
};

export default LeadTriageFilters;
