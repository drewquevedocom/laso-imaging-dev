import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRentableInventory, useEquipmentRentals } from "@/hooks/useEquipmentRentals";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MODALITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  MRI: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  CT: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  "PET/CT": { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
  "X-Ray": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  Ultrasound: { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-300" },
  default: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" },
};

interface EquipmentAvailability {
  id: string;
  name: string;
  modality: string;
  oem: string;
  isAvailable: boolean;
  nextAvailable?: string;
  currentRental?: {
    start: string;
    end: string;
    customer: string;
  };
}

export const RentalAvailabilityCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalityFilter, setModalityFilter] = useState<string>("all");

  const { data: rentableInventory, isLoading: inventoryLoading } = useRentableInventory();
  const { data: rentals, isLoading: rentalsLoading } = useEquipmentRentals();

  const isLoading = inventoryLoading || rentalsLoading;

  // Get unique modalities for filter
  const modalities = useMemo(() => {
    if (!rentableInventory) return [];
    const unique = [...new Set(rentableInventory.map((item) => item.modality))];
    return unique.sort();
  }, [rentableInventory]);

  // Filter inventory by modality
  const filteredInventory = useMemo(() => {
    if (!rentableInventory) return [];
    if (modalityFilter === "all") return rentableInventory;
    return rentableInventory.filter((item) => item.modality === modalityFilter);
  }, [rentableInventory, modalityFilter]);

  // Calculate equipment availability for a specific date
  const getEquipmentAvailability = (date: Date): EquipmentAvailability[] => {
    if (!filteredInventory || !rentals) return [];

    return filteredInventory.map((item) => {
      // Find any rental that overlaps with this date for this inventory item
      const overlappingRental = rentals.find((rental) => {
        if (rental.inventory_id !== item.id) return false;
        if (rental.status === "cancelled" || rental.status === "completed") return false;
        
        const rentalStart = parseISO(rental.start_date);
        const rentalEnd = parseISO(rental.end_date);
        
        return isWithinInterval(date, { start: rentalStart, end: rentalEnd });
      });

      // Find next available date if currently rented
      const futureRentals = rentals
        .filter((rental) => {
          if (rental.inventory_id !== item.id) return false;
          if (rental.status === "cancelled" || rental.status === "completed") return false;
          return parseISO(rental.end_date) >= date;
        })
        .sort((a, b) => parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime());

      return {
        id: item.id,
        name: item.product_name,
        modality: item.modality,
        oem: item.oem,
        isAvailable: !overlappingRental,
        nextAvailable: overlappingRental ? overlappingRental.end_date : undefined,
        currentRental: overlappingRental
          ? {
              start: overlappingRental.start_date,
              end: overlappingRental.end_date,
              customer: overlappingRental.customer_name,
            }
          : undefined,
      };
    });
  };

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    // Add padding days for the first week
    const startDay = start.getDay();
    const paddingDays = Array(startDay).fill(null);

    return [...paddingDays, ...days];
  }, [currentMonth]);

  // Get availability summary for a date (for calendar display)
  const getDateSummary = (date: Date) => {
    const availability = getEquipmentAvailability(date);
    const available = availability.filter((e) => e.isAvailable).length;
    const total = availability.length;
    return { available, total };
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const selectedDateAvailability = selectedDate ? getEquipmentAvailability(selectedDate) : [];
  const availableCount = selectedDateAvailability.filter((e) => e.isAvailable).length;

  const getModalityColor = (modality: string) => {
    return MODALITY_COLORS[modality] || MODALITY_COLORS.default;
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[180px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleToday}>
            Today
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Select value={modalityFilter} onValueChange={setModalityFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              {modalities.map((modality: string) => (
                <SelectItem key={modality} value={modality}>
                  {modality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              {/* Days of week header */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const summary = getDateSummary(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());
                  const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                  const availabilityPercent = summary.total > 0 ? (summary.available / summary.total) * 100 : 0;

                  return (
                    <TooltipProvider key={day.toISOString()}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setSelectedDate(day)}
                            disabled={isPast}
                            className={`
                              aspect-square p-1 rounded-lg transition-all relative
                              ${isSelected ? "ring-2 ring-primary bg-primary/10" : "hover:bg-muted"}
                              ${isToday ? "font-bold" : ""}
                              ${isPast ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            `}
                          >
                            <div className="text-sm">{format(day, "d")}</div>
                            {summary.total > 0 && !isPast && (
                              <div className="mt-1">
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${
                                      availabilityPercent === 100
                                        ? "bg-green-500"
                                        : availabilityPercent > 50
                                        ? "bg-amber-500"
                                        : availabilityPercent > 0
                                        ? "bg-orange-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${availabilityPercent}%` }}
                                  />
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                  {summary.available}/{summary.total}
                                </div>
                              </div>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{format(day, "MMMM d, yyyy")}</p>
                          <p className="text-sm text-muted-foreground">
                            {summary.available} of {summary.total} available
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span>All Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded" />
                  <span>Some Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  <span>None Available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5" />
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a Date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <p className="text-muted-foreground text-sm">
                  Click on a date to see equipment availability
                </p>
              ) : selectedDateAvailability.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No rentable equipment found
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Available:</span>
                    <Badge variant={availableCount > 0 ? "default" : "destructive"}>
                      {availableCount} of {selectedDateAvailability.length}
                    </Badge>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {selectedDateAvailability.map((equipment) => {
                      const colors = getModalityColor(equipment.modality);
                      return (
                        <div
                          key={equipment.id}
                          className={`p-3 rounded-lg border ${
                            equipment.isAvailable
                              ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                              : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">{equipment.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className={`${colors.bg} ${colors.text} ${colors.border} text-xs`}
                                >
                                  {equipment.modality}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{equipment.oem}</span>
                              </div>
                            </div>
                            <Badge
                              variant={equipment.isAvailable ? "default" : "secondary"}
                              className={equipment.isAvailable ? "bg-green-600" : "bg-red-600 text-white"}
                            >
                              {equipment.isAvailable ? "Available" : "Rented"}
                            </Badge>
                          </div>

                          {!equipment.isAvailable && equipment.currentRental && (
                            <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                              <p>
                                Rented until {format(parseISO(equipment.currentRental.end), "MMM d, yyyy")}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {availableCount > 0 && (
                    <Button className="w-full" asChild>
                      <a href="/rentals">Request Rental</a>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-800 dark:text-blue-200">Looking for specific equipment?</p>
          <p className="text-blue-700 dark:text-blue-300 mt-1">
            Contact us directly if you need equipment not shown here or have specific requirements. We can source additional rental units from our network.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RentalAvailabilityCalendar;
