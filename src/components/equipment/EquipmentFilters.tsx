import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterState {
  search: string;
  brand: string;
  fieldStrength: string;
  availability: string;
}

interface EquipmentFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  showBrand?: boolean;
  showFieldStrength?: boolean;
  totalCount: number;
  filteredCount: number;
}

const brands = ["All", "GE", "Siemens", "Philips", "Toshiba", "Canon", "Hitachi"];
const fieldStrengths = ["All", "1.5T", "3.0T", "Open MRI"];
const availabilityOptions = ["All", "In Stock", "Available Soon"];

export const EquipmentFilters = ({
  filters,
  onFiltersChange,
  showBrand = true,
  showFieldStrength = true,
  totalCount,
  filteredCount,
}: EquipmentFiltersProps) => {
  const hasActiveFilters =
    filters.search ||
    filters.brand !== "All" ||
    filters.fieldStrength !== "All" ||
    filters.availability !== "All";

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      brand: "All",
      fieldStrength: "All",
      availability: "All",
    });
  };

  const activeFilterCount = [
    filters.search,
    filters.brand !== "All" ? filters.brand : null,
    filters.fieldStrength !== "All" ? filters.fieldStrength : null,
    filters.availability !== "All" ? filters.availability : null,
  ].filter(Boolean).length;

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by system name..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-10"
          />
        </div>

        {/* Brand Filter */}
        {showBrand && (
          <Select
            value={filters.brand}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, brand: value })
            }
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand === "All" ? "All Brands" : brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Field Strength Filter */}
        {showFieldStrength && (
          <Select
            value={filters.fieldStrength}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, fieldStrength: value })
            }
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Field Strength" />
            </SelectTrigger>
            <SelectContent>
              {fieldStrengths.map((strength) => (
                <SelectItem key={strength} value={strength}>
                  {strength === "All" ? "All Strengths" : strength}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Availability Filter */}
        <Select
          value={filters.availability}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, availability: value })
          }
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            {availabilityOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "All" ? "All Availability" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Count and Clear Filters */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{filteredCount}</span>{" "}
            of {totalCount} systems
          </span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
            </Badge>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default EquipmentFilters;
