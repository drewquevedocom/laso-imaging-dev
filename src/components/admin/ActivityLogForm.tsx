import { useState } from "react";
import { Phone, Mail, MessageSquare, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCreateActivity } from "@/hooks/useActivities";
import { Activity } from "@/types/database";

interface ActivityLogFormProps {
  leadId: string;
}

type ActivityType = Activity["activity_type"];

const ACTIVITY_TYPES: { value: ActivityType; label: string; icon: typeof Phone }[] = [
  { value: "Call", label: "Call", icon: Phone },
  { value: "Email", label: "Email", icon: Mail },
  { value: "Note", label: "Note", icon: MessageSquare },
  { value: "Meeting", label: "Meeting", icon: Calendar },
];

export const ActivityLogForm = ({ leadId }: ActivityLogFormProps) => {
  const [activityType, setActivityType] = useState<ActivityType>("Note");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  
  const createActivity = useCreateActivity();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    await createActivity.mutateAsync({
      lead_id: leadId,
      activity_type: activityType,
      content: content.trim(),
      metadata: activityType === "Call" && duration ? { duration: parseInt(duration) } : {},
    });

    setContent("");
    setDuration("");
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => setIsExpanded(true)}
      >
        <Plus className="h-4 w-4" />
        Log Activity
      </Button>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Log Activity</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
        >
          Cancel
        </Button>
      </div>

      <ToggleGroup
        type="single"
        value={activityType}
        onValueChange={(value) => value && setActivityType(value as ActivityType)}
        className="justify-start"
      >
        {ACTIVITY_TYPES.map((type) => (
          <ToggleGroupItem
            key={type.value}
            value={type.value}
            aria-label={type.label}
            className="gap-1.5"
          >
            <type.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{type.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="space-y-3">
        {activityType === "Call" && (
          <div className="space-y-1">
            <Label htmlFor="duration" className="text-xs text-muted-foreground">
              Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              placeholder="e.g., 15"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-8"
            />
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="content" className="text-xs text-muted-foreground">
            {activityType === "Call" ? "Call Notes" :
             activityType === "Email" ? "Email Summary" :
             activityType === "Meeting" ? "Meeting Notes" : "Note Content"}
          </Label>
          <Textarea
            id="content"
            placeholder={
              activityType === "Call" ? "What was discussed..." :
              activityType === "Email" ? "Brief summary of the email..." :
              activityType === "Meeting" ? "Meeting discussion and outcomes..." :
              "Add a note about this lead..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!content.trim() || createActivity.isPending}
        className="w-full"
      >
        {createActivity.isPending ? "Saving..." : "Log Activity"}
      </Button>
    </div>
  );
};

export default ActivityLogForm;
