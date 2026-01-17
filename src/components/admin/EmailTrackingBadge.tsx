import { Mail, Check, Eye, MousePointer, XCircle, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

interface EmailTrackingBadgeProps {
  status: string | null;
  eventType?: string;
  timestamp?: string | null;
}

const getEmailStatus = (eventType?: string, quoteStatus?: string | null) => {
  if (!eventType && !quoteStatus) {
    return { label: "Not Sent", icon: Mail, className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" };
  }
  
  switch (eventType) {
    case "email.clicked":
      return { label: "Clicked", icon: MousePointer, className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" };
    case "email.opened":
      return { label: "Opened", icon: Eye, className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" };
    case "email.delivered":
      return { label: "Delivered", icon: Check, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" };
    case "email.sent":
      return { label: "Sent", icon: Send, className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" };
    case "email.bounced":
      return { label: "Bounced", icon: XCircle, className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" };
    case "email.complained":
      return { label: "Spam", icon: XCircle, className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" };
    default:
      // Check quote status if no event
      if (quoteStatus === "Sent") {
        return { label: "Sent", icon: Send, className: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" };
      }
      return { label: "Not Sent", icon: Mail, className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" };
  }
};

export const EmailTrackingBadge = ({ status, eventType, timestamp }: EmailTrackingBadgeProps) => {
  const emailStatus = getEmailStatus(eventType, status);
  const Icon = emailStatus.icon;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="secondary" className={`gap-1 ${emailStatus.className}`}>
          <Icon className="h-3 w-3" />
          <span className="text-xs">{emailStatus.label}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{emailStatus.label}</p>
        {timestamp && (
          <p className="text-xs text-muted-foreground">
            {format(new Date(timestamp), "MMM d, yyyy 'at' h:mm a")}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export const EmailTrackingBadgeLoading = () => (
  <Badge variant="secondary" className="gap-1 bg-gray-100 text-gray-500">
    <Loader2 className="h-3 w-3 animate-spin" />
    <span className="text-xs">...</span>
  </Badge>
);

export default EmailTrackingBadge;
