import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Plus,
  MoreHorizontal,
  Package,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth, 
  addMonths, 
  subMonths, 
  isToday 
} from "date-fns";
import { cn } from "@/lib/utils";
import { useRentalsByDateRange, useUpdateRental, useRentalStats } from "@/hooks/useEquipmentRentals";
import { RentalBookingForm } from "./RentalBookingForm";
import { EquipmentRental } from "@/types/database";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  active: "bg-green-500",
  completed: "bg-gray-500",
  cancelled: "bg-red-500",
};

export function RentalCalendarTab() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);

  const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

  const { data: rentals = [], isLoading } = useRentalsByDateRange(monthStart, monthEnd);
  const { data: stats } = useRentalStats();
  const updateRental = useUpdateRental();

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getRentalsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return rentals.filter((r) => {
      return dateStr >= r.start_date && dateStr <= r.end_date;
    });
  };

  const selectedRentals = selectedDate ? getRentalsForDate(selectedDate) : [];

  // Add padding days at the start
  const startDay = days[0].getDay();
  const paddingDays = Array.from({ length: startDay }, (_, i) => null);

  const handleStatusChange = async (rental: EquipmentRental, newStatus: string) => {
    await updateRental.mutateAsync({ id: rental.id, status: newStatus as any });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats?.completed || 0}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(stats?.monthlyRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {format(currentMonth, "MMMM yyyy")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button onClick={() => setBookingFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Rental
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {paddingDays.map((_, index) => (
                <div key={`padding-${index}`} className="aspect-square" />
              ))}
              {days.map((day) => {
                const dayRentals = getRentalsForDate(day);
                const hasRentals = dayRentals.length > 0;
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "aspect-square p-1 rounded-lg border transition-colors relative",
                      isToday(day) && "border-primary",
                      isSelected && "bg-primary/10 border-primary",
                      !isSelected && "hover:bg-accent",
                      !isSameMonth(day, currentMonth) && "opacity-50"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm",
                        isToday(day) && "font-bold text-primary"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {hasRentals && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayRentals.slice(0, 3).map((rental) => (
                          <div
                            key={rental.id}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              STATUS_COLORS[rental.status] || "bg-blue-500"
                            )}
                          />
                        ))}
                        {dayRentals.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{dayRentals.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2 text-sm">
                  <div className={cn("w-2 h-2 rounded-full", color)} />
                  <span className="capitalize">{status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate
                ? format(selectedDate, "EEEE, MMMM d")
                : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : selectedDate ? (
              selectedRentals.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {selectedRentals.map((rental) => (
                      <div
                        key={rental.id}
                        className="p-3 border rounded-lg space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">
                              {(rental.inventory as any)?.product_name || "Equipment"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {(rental.inventory as any)?.oem} - {(rental.inventory as any)?.modality}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={cn(
                                "text-white text-xs",
                                STATUS_COLORS[rental.status]
                              )}
                            >
                              {rental.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {rental.status === 'pending' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(rental, 'confirmed')}>
                                    <CheckCircle className="h-4 w-4 mr-2" /> Confirm
                                  </DropdownMenuItem>
                                )}
                                {rental.status === 'confirmed' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(rental, 'active')}>
                                    <CheckCircle className="h-4 w-4 mr-2" /> Mark Active
                                  </DropdownMenuItem>
                                )}
                                {rental.status === 'active' && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(rental, 'completed')}>
                                    <CheckCircle className="h-4 w-4 mr-2" /> Complete
                                  </DropdownMenuItem>
                                )}
                                {rental.status !== 'cancelled' && rental.status !== 'completed' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(rental, 'cancelled')}
                                    className="text-destructive"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" /> Cancel
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(rental.start_date), "MMM d")} - {format(new Date(rental.end_date), "MMM d, yyyy")}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          {rental.customer_name}
                          {rental.customer_company && ` (${rental.customer_company})`}
                        </div>

                        {rental.delivery_address && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {rental.delivery_address}
                          </div>
                        )}

                        {rental.total_amount && (
                          <div className="pt-2 border-t">
                            <span className="font-medium text-primary">
                              {formatCurrency(rental.total_amount)}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.location.href = `mailto:${rental.customer_email}`}
                          >
                            <Mail className="h-3 w-3 mr-1" /> Email
                          </Button>
                          {rental.customer_phone && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.location.href = `tel:${rental.customer_phone}`}
                            >
                              <Phone className="h-3 w-3 mr-1" /> Call
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Calendar className="h-8 w-8 mb-2" />
                  <p className="text-sm">No rentals on this date</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => setBookingFormOpen(true)}
                  >
                    Book a rental
                  </Button>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Calendar className="h-8 w-8 mb-2" />
                <p className="text-sm">Click a date to view rentals</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <RentalBookingForm 
        open={bookingFormOpen} 
        onOpenChange={setBookingFormOpen}
      />
    </div>
  );
}
