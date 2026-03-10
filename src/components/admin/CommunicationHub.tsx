import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import {
  Mail,
  MessageSquare,
  StickyNote,
  FileText,
  Eye,
  User,
  Send,
  Phone,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useActivities, useCreateActivity } from "@/hooks/useActivities";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmailTemplateSelector } from "@/components/admin/EmailTemplateSelector";

interface CommunicationHubProps {
  leadId: string;
  leadEmail: string;
  leadPhone?: string | null;
  leadCreatedAt: string;
  defaultTab?: ComposeMode;
  smsOptIn?: boolean;
  emailOptIn?: boolean;
}

type ComposeMode = "email" | "sms" | "note";

interface TimelineItem {
  id: string;
  type: "email" | "sms" | "note" | "quote_sent" | "contract_viewed" | "lead_created";
  direction: "outbound" | "inbound" | "system";
  subject?: string;
  content: string;
  timestamp: string;
}

const CommunicationHub = ({
  leadId,
  leadEmail,
  leadPhone,
  leadCreatedAt,
  defaultTab = "note",
  smsOptIn = false,
  emailOptIn = true,
}: CommunicationHubProps) => {
  const { data: activities = [] } = useActivities(leadId);
  const createActivity = useCreateActivity();

  const [composeMode, setComposeMode] = useState<ComposeMode>(defaultTab);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Map activity type to timeline type
  const mapActivityType = (activityType: string): TimelineItem["type"] => {
    const lowerType = activityType.toLowerCase();
    if (lowerType === "email") return "email";
    if (lowerType === "sms") return "sms";
    if (lowerType === "note") return "note";
    if (lowerType === "quote sent") return "quote_sent";
    if (lowerType === "contract viewed") return "contract_viewed";
    return "note";
  };

  // Build timeline from activities
  const activityItems: TimelineItem[] = activities.map((activity) => ({
    id: activity.id,
    type: mapActivityType(activity.activity_type),
    direction: ((activity as any).direction || "outbound") as "outbound" | "inbound",
    subject: (activity as any).subject,
    content: activity.content,
    timestamp: activity.created_at,
  }));

  const leadCreatedItem: TimelineItem = {
    id: "lead-created",
    type: "lead_created",
    direction: "system",
    content: "Lead created",
    timestamp: leadCreatedAt,
  };

  const timeline: TimelineItem[] = [leadCreatedItem, ...activityItems].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);

    try {
      if (composeMode === "email") {
        // Send real email via edge function
        const { error } = await supabase.functions.invoke("send-lead-email", {
          body: {
            to: leadEmail,
            subject: subject || "Message from LASO Imaging",
            body: message,
            leadId: leadId,
          },
        });

        if (error) throw error;

        toast.success(`Email sent to ${leadEmail}`);
      } else if (composeMode === "sms") {
        if (!leadPhone) {
          toast.error("No phone number available");
          setIsSending(false);
          return;
        }

        // Send real SMS via edge function
        const { error } = await supabase.functions.invoke("send-sms", {
          body: {
            to: leadPhone,
            message: message,
            leadId: leadId,
          },
        });

        if (error) throw error;

        toast.success(`SMS sent to ${leadPhone}`);
      } else {
        // Just log the note
        const activityData: any = {
          lead_id: leadId,
          activity_type: "Note",
          content: message,
          metadata: {},
          direction: "outbound",
        };

        await createActivity.mutateAsync(activityData);
        toast.success("Note added");
      }

      // Reset form
      setMessage("");
      setSubject("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(`Failed to send ${composeMode}`, {
        description: error.message || "Please try again",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getTimelineIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "note":
        return <StickyNote className="h-4 w-4" />;
      case "quote_sent":
        return <FileText className="h-4 w-4" />;
      case "contract_viewed":
        return <Eye className="h-4 w-4" />;
      case "lead_created":
        return <User className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getTimelineLabel = (type: TimelineItem["type"]) => {
    switch (type) {
      case "email":
        return "Email";
      case "sms":
        return "SMS";
      case "note":
        return "Note";
      case "quote_sent":
        return "Quote Sent";
      case "contract_viewed":
        return "Contract Viewed";
      case "lead_created":
        return "Lead Created";
      default:
        return type;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Timeline */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4 pb-4">
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No communications yet. Start by adding a note or sending a message.
            </p>
          ) : (
            timeline.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex",
                  item.direction === "outbound" && "justify-end",
                  item.direction === "inbound" && "justify-start",
                  item.direction === "system" && "justify-center"
                )}
              >
                {item.direction === "system" ? (
                  // System message - centered
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                    {getTimelineIcon(item.type)}
                    <span>{getTimelineLabel(item.type)}</span>
                    <span>•</span>
                    <span>{format(new Date(item.timestamp), "MMM d, h:mm a")}</span>
                  </div>
                ) : (
                  // Message bubble
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 space-y-1",
                      item.direction === "outbound"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    )}
                  >
                    {/* Header */}
                    <div
                      className={cn(
                        "flex items-center gap-2 text-xs",
                        item.direction === "outbound"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {getTimelineIcon(item.type)}
                      <span className="font-medium">
                        {getTimelineLabel(item.type)}
                        {item.direction === "outbound" ? " Sent" : " Received"}
                      </span>
                    </div>

                    {/* Subject (if email) */}
                    {item.subject && (
                      <p
                        className={cn(
                          "text-sm font-medium",
                          item.direction === "outbound"
                            ? "text-primary-foreground"
                            : "text-foreground"
                        )}
                      >
                        {item.subject}
                      </p>
                    )}

                    {/* Content */}
                    <p
                      className={cn(
                        "text-sm",
                        item.direction === "outbound"
                          ? "text-primary-foreground"
                          : "text-foreground"
                      )}
                    >
                      {item.content}
                    </p>

                    {/* Timestamp */}
                    <p
                      className={cn(
                        "text-xs",
                        item.direction === "outbound"
                          ? "text-primary-foreground/60"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Compose Section */}
      <div className="border-t pt-4 space-y-3">
        <Tabs value={composeMode} onValueChange={(v) => setComposeMode(v as ComposeMode)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email" className="text-xs">
              <Mail className="h-3 w-3 mr-1" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="text-xs" disabled={!leadPhone}>
              <Phone className="h-3 w-3 mr-1" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="note" className="text-xs">
              <StickyNote className="h-3 w-3 mr-1" />
              Note
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {composeMode === "email" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>To:</span>
              <span className="font-medium">{leadEmail}</span>
              {!emailOptIn && (
                <Badge variant="outline" className="text-[10px] px-1 py-0 text-amber-600 border-amber-300">
                  Not opted in
                </Badge>
              )}
            </div>
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-8 text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1"
              onClick={() => setShowTemplateSelector(true)}
            >
              <FileText className="h-3 w-3" />
              Use Template
            </Button>
          </div>
        )}

        {composeMode === "sms" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>To:</span>
              <span className="font-medium">{leadPhone || "No phone number"}</span>
              {leadPhone && !smsOptIn && (
                <Badge variant="outline" className="text-[10px] px-1 py-0 text-amber-600 border-amber-300">
                  Not opted in
                </Badge>
              )}
            </div>
            {leadPhone && !smsOptIn && (
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                ⚠️ This contact has not opted in for SMS. Proceed with caution.
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Textarea
            placeholder={
              composeMode === "note"
                ? "Add an internal note..."
                : `Type your ${composeMode === "email" ? "email" : "message"}...`
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="flex-1 text-sm resize-none"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!message.trim() || isSending}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <EmailTemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        recipientEmail={leadEmail}
        recipientName=""
      />
    </div>
  );
};

export default CommunicationHub;
