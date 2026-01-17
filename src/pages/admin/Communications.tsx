import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isYesterday, parseISO, startOfDay } from "date-fns";
import {
  Mail,
  MessageSquare,
  Phone,
  FileText,
  Eye,
  Search,
  Filter,
  User,
  Calendar,
  ArrowUpRight,
  StickyNote,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  lead_id: string;
  activity_type: string;
  content: string;
  direction: string | null;
  subject: string | null;
  created_at: string;
  metadata: any;
  lead_name?: string;
  lead_email?: string;
  lead_company?: string;
}

const Communications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [directionFilter, setDirectionFilter] = useState<string>("all");

  // Fetch all activities with lead info
  const { data: activities, isLoading } = useQuery({
    queryKey: ["all-activities"],
    queryFn: async () => {
      // First get all activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (activitiesError) throw activitiesError;

      // Get unique lead IDs
      const leadIds = [...new Set(activitiesData?.map((a) => a.lead_id) || [])];

      // Fetch leads for these activities
      const { data: leadsData } = await supabase
        .from("leads")
        .select("id, name, email, company")
        .in("id", leadIds);

      const leadsMap = new Map(leadsData?.map((l) => [l.id, l]) || []);

      // Merge lead info into activities
      return (activitiesData || []).map((activity) => {
        const lead = leadsMap.get(activity.lead_id);
        return {
          ...activity,
          lead_name: lead?.name || "Unknown",
          lead_email: lead?.email || "",
          lead_company: lead?.company || "",
        };
      }) as Activity[];
    },
  });

  // Filter activities
  const filteredActivities = useMemo(() => {
    if (!activities) return [];

    return activities.filter((activity) => {
      const matchesSearch =
        searchTerm === "" ||
        activity.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.lead_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.subject?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "all" || activity.activity_type === typeFilter;

      const matchesDirection =
        directionFilter === "all" || activity.direction === directionFilter;

      return matchesSearch && matchesType && matchesDirection;
    });
  }, [activities, searchTerm, typeFilter, directionFilter]);

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: { [key: string]: Activity[] } = {};

    filteredActivities.forEach((activity) => {
      const date = startOfDay(parseISO(activity.created_at)).toISOString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });

    return groups;
  }, [filteredActivities]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      case "note":
        return <StickyNote className="h-4 w-4" />;
      case "quote_sent":
        return <FileText className="h-4 w-4" />;
      case "contract_viewed":
        return <Eye className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string, direction?: string | null) => {
    if (type === "quote_sent" || type === "contract_viewed") {
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
    }
    if (direction === "inbound") {
      return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
    }
    return "bg-primary/10 text-primary";
  };

  const formatDateHeader = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d, yyyy");
  };

  const handleViewLead = (leadId: string) => {
    // Navigate to lead triage with the lead selected
    navigate(`/admin/notifications?lead=${leadId}`);
  };

  return (
    <>
      <Helmet>
        <title>Communications | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Communications Center</h1>
          <p className="text-muted-foreground">
            View and manage all communication history across leads.
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages, leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="quote_sent">Quote Sent</SelectItem>
                  <SelectItem value="contract_viewed">Contract Viewed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={directionFilter} onValueChange={setDirectionFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Directions</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {activities?.filter((a) => a.activity_type === "email").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Emails</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {activities?.filter((a) => a.activity_type === "sms").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">SMS</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <FileText className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {activities?.filter((a) => a.activity_type === "quote_sent").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Quotes Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <StickyNote className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {activities?.filter((a) => a.activity_type === "note").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Notes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activity Timeline
              {filteredActivities.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filteredActivities.length} activities
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold">No communications found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm || typeFilter !== "all" || directionFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Communication history will appear here"}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-8">
                  {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                    <div key={date}>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4 sticky top-0 bg-card py-2">
                        {formatDateHeader(date)}
                      </h3>
                      <div className="space-y-4">
                        {dateActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getActivityColor(
                                activity.activity_type,
                                activity.direction
                              )}`}
                            >
                              {getActivityIcon(activity.activity_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium capitalize">
                                      {activity.activity_type.replace("_", " ")}
                                    </span>
                                    {activity.direction && (
                                      <Badge variant="outline" className="text-xs">
                                        {activity.direction}
                                      </Badge>
                                    )}
                                  </div>
                                  {activity.subject && (
                                    <p className="text-sm font-medium mt-1">{activity.subject}</p>
                                  )}
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {activity.content}
                                  </p>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {format(parseISO(activity.created_at), "h:mm a")}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  <span className="font-medium">{activity.lead_name}</span>
                                  {activity.lead_company && (
                                    <>
                                      <span>•</span>
                                      <span>{activity.lead_company}</span>
                                    </>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewLead(activity.lead_id)}
                                  className="text-xs h-7"
                                >
                                  View Lead
                                  <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Communications;
