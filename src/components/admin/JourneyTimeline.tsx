import { formatDistanceToNow, format } from "date-fns";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  FileText, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  Flame,
  Send,
  MailOpen,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JourneyEvent } from "@/hooks/useLeadJourney";

interface JourneyTimelineProps {
  events: JourneyEvent[];
  isLoading?: boolean;
}

const getEventIcon = (type: JourneyEvent['type']) => {
  switch (type) {
    case 'lead_created':
      return <User className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'sms':
      return <MessageSquare className="h-4 w-4" />;
    case 'call':
      return <Phone className="h-4 w-4" />;
    case 'note':
      return <FileText className="h-4 w-4" />;
    case 'quote_sent':
      return <Send className="h-4 w-4" />;
    case 'quote_viewed':
      return <Eye className="h-4 w-4" />;
    case 'quote_accepted':
      return <CheckCircle className="h-4 w-4" />;
    case 'quote_rejected':
      return <XCircle className="h-4 w-4" />;
    case 'email_delivered':
      return <Mail className="h-4 w-4" />;
    case 'email_opened':
      return <MailOpen className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getEventColor = (type: JourneyEvent['type']) => {
  switch (type) {
    case 'lead_created':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    case 'email':
    case 'email_delivered':
      return 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400';
    case 'email_opened':
      return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    case 'sms':
      return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400';
    case 'call':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
    case 'note':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    case 'quote_sent':
      return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
    case 'quote_viewed':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    case 'quote_accepted':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'quote_rejected':
      return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const JourneyTimeline = ({ events, isLoading }: JourneyTimelineProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No journey events recorded yet.
      </p>
    );
  }

  // Group events by date
  const groupedEvents: Record<string, JourneyEvent[]> = {};
  events.forEach(event => {
    const date = format(new Date(event.timestamp), 'MMM d, yyyy');
    if (!groupedEvents[date]) groupedEvents[date] = [];
    groupedEvents[date].push(event);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([date, dateEvents]) => (
        <div key={date}>
          <div className="sticky top-0 bg-background py-1 mb-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {date}
            </p>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            
            <div className="space-y-4">
              {dateEvents.map((event, index) => (
                <div key={event.id} className="relative flex gap-3 pl-1">
                  {/* Icon */}
                  <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">
                          {event.title}
                          {event.metadata?.isHot && (
                            <Flame className="h-3 w-3 text-orange-500" />
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {event.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(event.timestamp), 'h:mm a')}
                      </span>
                    </div>
                    
                    {/* Metadata badges */}
                    {event.metadata && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.metadata.score && (
                          <Badge variant="outline" className="text-[10px]">
                            Score: {event.metadata.score}
                          </Badge>
                        )}
                        {event.metadata.amount && (
                          <Badge variant="outline" className="text-[10px]">
                            ${event.metadata.amount.toLocaleString()}
                          </Badge>
                        )}
                        {event.metadata.direction && (
                          <Badge variant="outline" className="text-[10px]">
                            {event.metadata.direction}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JourneyTimeline;
