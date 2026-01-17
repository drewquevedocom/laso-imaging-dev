import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, User } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface SiteVisit {
  id: string;
  title: string;
  scheduled_date: string;
  scheduled_time: string | null;
  duration_hours: number;
  location_address: string | null;
  contact_name: string | null;
  status: string;
  sell_request_id: string | null;
  lead_id: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-500",
  confirmed: "bg-green-500",
  completed: "bg-gray-500",
  cancelled: "bg-red-500",
  rescheduled: "bg-yellow-500",
};

export function SiteVisitCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: visits, isLoading } = useQuery({
    queryKey: ["site-visits", format(currentMonth, "yyyy-MM")],
    queryFn: async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);

      const { data, error } = await supabase
        .from("site_visits")
        .select("*")
        .gte("scheduled_date", format(start, "yyyy-MM-dd"))
        .lte("scheduled_date", format(end, "yyyy-MM-dd"))
        .order("scheduled_date", { ascending: true });

      if (error) throw error;
      return data as SiteVisit[];
    },
  });

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getVisitsForDate = (date: Date) => {
    return visits?.filter((v) => isSameDay(new Date(v.scheduled_date), date)) || [];
  };

  const selectedVisits = selectedDate ? getVisitsForDate(selectedDate) : [];

  // Add padding days at the start
  const startDay = days[0].getDay();
  const paddingDays = Array.from({ length: startDay }, (_, i) => null);

  return (
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
              const dayVisits = getVisitsForDate(day);
              const hasVisits = dayVisits.length > 0;
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
                  {hasVisits && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayVisits.slice(0, 3).map((visit) => (
                        <div
                          key={visit.id}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            STATUS_COLORS[visit.status] || "bg-blue-500"
                          )}
                        />
                      ))}
                      {dayVisits.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{dayVisits.length - 3}
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
            selectedVisits.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {selectedVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{visit.title}</h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-white text-xs",
                            STATUS_COLORS[visit.status]
                          )}
                        >
                          {visit.status}
                        </Badge>
                      </div>

                      {visit.scheduled_time && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {visit.scheduled_time} ({visit.duration_hours}h)
                        </div>
                      )}

                      {visit.location_address && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {visit.location_address}
                        </div>
                      )}

                      {visit.contact_name && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          {visit.contact_name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Calendar className="h-8 w-8 mb-2" />
                <p className="text-sm">No visits scheduled</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Calendar className="h-8 w-8 mb-2" />
              <p className="text-sm">Click a date to view visits</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
