import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Calendar, MapPin, Clock, ArrowRight, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUpcomingSiteVisits } from "@/hooks/useSiteVisits";

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  confirmed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

export function UpcomingSiteVisitsWidget() {
  const { data: visits = [], isLoading } = useUpcomingSiteVisits(7);
  const displayVisits = visits.slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Upcoming Site Visits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Loading...
          </div>
        ) : displayVisits.length === 0 ? (
          <div className="text-center py-4">
            <CalendarCheck className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              No upcoming site visits
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Schedule visits from MRI/CT Manage
            </p>
          </div>
        ) : (
          <>
            {displayVisits.map((visit) => (
              <div
                key={visit.id}
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span>
                        {format(parseISO(visit.scheduled_date), "MMM d")}
                      </span>
                      {visit.scheduled_time && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{visit.scheduled_time.slice(0, 5)}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate" title={visit.title}>
                      {visit.title}
                    </p>
                    {visit.location_address && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{visit.location_address}</span>
                      </div>
                    )}
                  </div>
                  <Badge className={`${statusColors[visit.status] || statusColors.scheduled} text-xs shrink-0`}>
                    {visit.status}
                  </Badge>
                </div>
              </div>
            ))}
            
            {visits.length > 5 && (
              <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                <Link to="/admin/sell-requests">
                  View All ({visits.length}) <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default UpcomingSiteVisitsWidget;
