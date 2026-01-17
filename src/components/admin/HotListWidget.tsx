import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Phone, Flame, Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHotList, HotListLead } from "@/hooks/useHotList";
import { cn } from "@/lib/utils";

const HotListWidget = () => {
  const { data: leads = [], isLoading, count } = useHotList();
  const [isExpanded, setIsExpanded] = useState(true);

  const isStale = (lead: HotListLead) => {
    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
    return lead.status === "new" && new Date(lead.created_at) < twoHoursAgo;
  };

  const isEmergency = (lead: HotListLead) => lead.urgency === "Emergency";

  return (
    <Card className="border-red-200 dark:border-red-900/50 shadow-lg">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-500" />
            Hot List
            {count > 0 && (
              <Badge variant="destructive" className="ml-1">
                {count}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Loading...
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              🎉 No hot leads right now
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-2">
              <div className="space-y-2">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className={cn(
                      "p-3 rounded-lg border transition-colors",
                      isEmergency(lead)
                        ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900"
                        : "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{lead.name}</p>
                        {lead.company && (
                          <p className="text-xs text-muted-foreground truncate">
                            {lead.company}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {isEmergency(lead) ? (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                              <AlertTriangle className="h-3 w-3 mr-0.5" />
                              Emergency
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300">
                              <Clock className="h-3 w-3 mr-0.5" />
                              Stale
                            </Badge>
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      
                      {lead.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          asChild
                        >
                          <a href={`tel:${lead.phone}`} title={`Call ${lead.phone}`}>
                            <Phone className="h-4 w-4 text-green-600" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default HotListWidget;
