import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  Flame, 
  Phone, 
  Building2, 
  MessageSquare, 
  MapPin,
  CheckCircle2,
  Clock,
  MoreVertical,
  PhoneCall,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLeadTypeInfo, getTimeInStage } from "@/hooks/useLeadTriage";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string;
  message: string | null;
  source_page: string;
  lead_score: number;
  status: string;
  is_hot: boolean;
  created_at: string;
  updated_at?: string;
}

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (leadId: string, status: string) => void;
  variant?: "default" | "compact" | "mobile";
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-200",
  contacted: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  qualified: "bg-green-500/10 text-green-600 border-green-200",
  converted: "bg-purple-500/10 text-purple-600 border-purple-200",
  closed: "bg-gray-500/10 text-gray-600 border-gray-200",
};

const LeadCard = ({ lead, onStatusChange, variant = "default" }: LeadCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isMobile = variant === "mobile";
  const isCompact = variant === "compact";
  
  const typeInfo = getLeadTypeInfo(lead.interest);
  const timeInStage = lead.updated_at ? getTimeInStage(lead.updated_at) : null;

  const scoreColor = lead.lead_score >= 50 
    ? "text-orange-500" 
    : lead.lead_score >= 30 
      ? "text-yellow-500" 
      : "text-muted-foreground";

  // Compact Kanban card
  if (isCompact) {
    return (
      <div 
        className={`bg-card border-2 rounded-lg p-3 transition-all hover:shadow-md ${
          lead.is_hot 
            ? "border-red-400 shadow-[0_0_10px_-3px_rgba(239,68,68,0.3)]" 
            : `${typeInfo.borderColor} border-opacity-50`
        }`}
      >
        {/* Header with Name & Type Badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {lead.is_hot && <Flame className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
              <h4 className="font-medium text-sm truncate">{lead.name}</h4>
            </div>
            {lead.company && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {lead.company}
              </p>
            )}
          </div>
        </div>

        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-2">
          <Badge className={`text-xs ${typeInfo.color}`}>
            {lead.is_hot && "🔥 "}{typeInfo.label}
          </Badge>
        </div>

        {/* Score & Time */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className={`font-medium ${scoreColor}`}>{lead.lead_score} pts</span>
          {timeInStage && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeInStage}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-card border rounded-xl transition-all ${
        lead.is_hot 
          ? "border-orange-300 shadow-[0_0_15px_-3px_rgba(249,115,22,0.2)]" 
          : "border-border shadow-card"
      } ${isMobile ? "p-4" : "p-5"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {lead.is_hot && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{lead.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge 
            variant="outline" 
            className={`${statusColors[lead.status]} font-medium`}
          >
            {lead.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusChange(lead.id, "contacted")}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Contacted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(lead.id, "qualified")}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Qualified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(lead.id, "converted")}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Converted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(lead.id, "closed")}>
                <Clock className="h-4 w-4 mr-2" />
                Close Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Score & Time */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold ${scoreColor}`}>{lead.lead_score}</span>
          <span className="text-muted-foreground">pts</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</span>
        </div>
      </div>

      {/* Details */}
      <div className={`grid gap-2 text-sm ${isCompact ? "" : "mb-4"}`}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span>Source: {lead.source_page}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground">
          <Badge variant="secondary" className="font-medium">
            {lead.interest}
          </Badge>
        </div>
        
        {lead.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{lead.phone}</span>
          </div>
        )}
        
        {lead.company && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span>{lead.company}</span>
          </div>
        )}
      </div>

      {/* Message (expandable) */}
      {lead.message && !isCompact && (
        <div className="mb-4">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{isExpanded ? "Hide message" : "View message"}</span>
          </button>
          {isExpanded && (
            <p className="mt-2 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
              {lead.message}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      {!isCompact && (
        <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
          {lead.phone && (
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "sm"}
              className={isMobile ? "w-full" : ""}
              asChild
            >
              <a href={`tel:${lead.phone}`}>
                <PhoneCall className="h-4 w-4 mr-2" />
                Call
              </a>
            </Button>
          )}
          <Button 
            variant="outline" 
            size={isMobile ? "default" : "sm"}
            className={isMobile ? "w-full" : ""}
            asChild
          >
            <a href={`mailto:${lead.email}`}>
              <Send className="h-4 w-4 mr-2" />
              Email
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeadCard;
