import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  Mail, 
  Phone, 
  Building2, 
  Clock, 
  MapPin,
  Flame,
  PhoneCall,
  Send,
  MessageSquare,
  Calendar,
  AlertCircle,
  Route
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TriageLead, getLeadTypeInfo, getTimeInStage, KANBAN_COLUMNS } from "@/hooks/useLeadTriage";
import { useActivities } from "@/hooks/useActivities";
import { useLeadJourney } from "@/hooks/useLeadJourney";
import ActivityLogForm from "./ActivityLogForm";
import CommunicationHub from "./CommunicationHub";
import JourneyTimeline from "./JourneyTimeline";

interface LeadDetailPanelProps {
  lead: TriageLead | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (leadId: string, status: string) => void;
}

const LeadDetailPanel = ({ lead, isOpen, onClose, onStatusChange }: LeadDetailPanelProps) => {
  const { data: activities = [] } = useActivities(lead?.id);
  const { data: journeyEvents = [], isLoading: journeyLoading } = useLeadJourney(lead?.id);
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!lead) return null;

  const typeInfo = getLeadTypeInfo(lead.interest);
  const timeInStage = getTimeInStage(lead.updated_at);

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "call":
        return <PhoneCall className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {lead.is_hot && (
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                </div>
              )}
              <div>
                <SheetTitle className="text-left">{lead.name}</SheetTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {lead.company || "No company"}
                </p>
              </div>
            </div>
          </div>

          {/* Type & Status Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className={typeInfo.color}>
              {lead.is_hot && "🔥 "}{typeInfo.label}
            </Badge>
            <Badge variant="outline">
              Score: {lead.lead_score}
            </Badge>
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              {timeInStage} in stage
            </Badge>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6 pt-2 border-b">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="journey" className="text-xs">
                <Route className="h-3 w-3 mr-1" />
                Journey
              </TabsTrigger>
              <TabsTrigger value="communication" className="text-xs">Comms</TabsTrigger>
              <TabsTrigger value="activities" className="text-xs">Log</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100vh-230px)]">
            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0 p-6 space-y-6">
              {/* Status Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={lead.status}
                  onValueChange={(value) => onStatusChange(lead.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KANBAN_COLUMNS.map((col) => (
                      <SelectItem key={col.id} value={col.dbStatus}>
                        {col.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Contact Information</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                      {lead.email}
                    </a>
                  </div>
                  
                  {lead.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                  
                  {lead.company && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.company}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Source: {lead.source_page}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Interest */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Interest</h3>
                <p className="text-sm text-muted-foreground">{lead.interest}</p>
              </div>

              {/* Message */}
              {lead.message && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Message</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {lead.message}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Quick Actions</h3>
                <div className="flex gap-2">
                  {lead.phone && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${lead.phone}`}>
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${lead.email}`}>
                      <Send className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                </div>
              </div>

              {/* Created At */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Created {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                </p>
              </div>
            </TabsContent>

            {/* Journey Tab - NEW */}
            <TabsContent value="journey" className="m-0 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Customer Journey</h3>
                  <Badge variant="outline" className="text-xs">
                    {journeyEvents.length} events
                  </Badge>
                </div>
                <JourneyTimeline events={journeyEvents} isLoading={journeyLoading} />
              </div>
            </TabsContent>

            {/* Communication Hub Tab */}
            <TabsContent value="communication" className="m-0 p-6 h-[calc(100vh-280px)]">
              <CommunicationHub
                leadId={lead.id}
                leadEmail={lead.email}
                leadPhone={lead.phone}
                leadCreatedAt={lead.created_at}
              />
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="m-0 p-6 space-y-6">
              {/* Activity Logging Form */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Log Activity</h3>
                <ActivityLogForm leadId={lead.id} />
              </div>

              <Separator />

              {/* Activity Timeline */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Activity Timeline</h3>
                
                {activities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activities recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getActivityIcon(activity.activity_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium capitalize">
                              {activity.activity_type}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5 truncate">
                            {activity.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetailPanel;
