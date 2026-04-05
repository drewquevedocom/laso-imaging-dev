import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
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
  Send,
  Mail,
  MessageCircle,
  Eye,
  FileText,
  StickyNote,
  Archive,
  Calendar,
  DollarSign,
  Reply
} from "lucide-react";
import QuoteResponseModal from "./QuoteResponseModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLeadTypeInfo, getTimeInStage, useToggleLeadHot } from "@/hooks/useLeadTriage";

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
  sms_opt_in?: boolean;
  email_opt_in?: boolean;
  created_at: string;
  updated_at?: string;
}

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (leadId: string, status: string) => void;
  onViewDetails?: (lead: Lead) => void;
  onAddNote?: (lead: Lead) => void;
  variant?: "default" | "compact" | "mobile";
  onMakeOffer?: (lead: Lead) => void;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-200",
  contacted: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  qualified: "bg-green-500/10 text-green-600 border-green-200",
  converted: "bg-purple-500/10 text-purple-600 border-purple-200",
  closed: "bg-gray-500/10 text-gray-600 border-gray-200",
};

const LeadCard = ({ lead, onStatusChange, onViewDetails, onAddNote, onMakeOffer, variant = "default" }: LeadCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quoteResponseOpen, setQuoteResponseOpen] = useState(false);
  const navigate = useNavigate();
  const toggleHot = useToggleLeadHot();
  
  const isMobile = variant === "mobile";
  const isCompact = variant === "compact";
  
  const typeInfo = getLeadTypeInfo(lead.interest);
  const timeInStage = lead.updated_at ? getTimeInStage(lead.updated_at) : null;

  const scoreColor = lead.lead_score >= 50 
    ? "text-orange-500" 
    : lead.lead_score >= 30 
      ? "text-yellow-500" 
      : "text-muted-foreground";

  const handleToggleHot = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHot.mutate({ leadId: lead.id, isHot: !lead.is_hot });
  };

  const handleCreateQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/quote-builder?leadId=${lead.id}`);
  };

  // Compact Kanban card with dropdown
  if (isCompact) {
    return (
      <div 
        className={`bg-card border-2 rounded-lg p-3 transition-all hover:shadow-md ${
          lead.is_hot 
            ? "border-red-400 shadow-[0_0_10px_-3px_rgba(239,68,68,0.3)]" 
            : `${typeInfo.borderColor} border-opacity-50`
        }`}
      >
        {/* Header with Name & Dropdown */}
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
          
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setQuoteResponseOpen(true); }}>
                <Reply className="h-4 w-4 mr-2 text-amber-500" />
                <span className="font-medium text-amber-700 dark:text-amber-400">Respond to Quote</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewDetails?.(lead); }}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              
              {lead.phone && (
                <DropdownMenuItem asChild>
                  <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()}>
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Call
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </a>
              </DropdownMenuItem>
              {lead.phone && lead.sms_opt_in && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewDetails?.(lead); }}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send SMS
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleToggleHot}>
                <Flame className={`h-4 w-4 mr-2 ${lead.is_hot ? 'text-orange-500' : ''}`} />
                {lead.is_hot ? 'Remove from Hot List' : 'Add to Hot List'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAddNote?.(lead); }}>
                <StickyNote className="h-4 w-4 mr-2" />
                Add Note
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleCreateQuote}>
                <FileText className="h-4 w-4 mr-2" />
                Create Quote
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, "contacted"); }}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Contacted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, "qualified"); }}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Quoting
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, "converted"); }}>
                <Send className="h-4 w-4 mr-2" />
                Mark Contract Sent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, "closed"); }}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Type Badge & Opt-in indicators */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <Badge className={`text-xs ${typeInfo.color}`}>
            {lead.is_hot && "🔥 "}{typeInfo.label}
          </Badge>
          {lead.sms_opt_in && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 text-green-600 border-green-300">
              <MessageCircle className="h-2.5 w-2.5 mr-0.5" />
              SMS
            </Badge>
          )}
          {lead.email_opt_in && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 text-blue-600 border-blue-300">
              <Mail className="h-2.5 w-2.5 mr-0.5" />
              Email
            </Badge>
          )}
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

        {/* Quote CTA Buttons — only shown for leads in Quoting column */}
        {lead.status === "qualified" && (
          <div className="flex gap-1.5 mt-2 pt-2 border-t border-dashed border-amber-300">
            <Button
              size="sm"
              className="flex-1 h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => { e.stopPropagation(); handleCreateQuote(e); }}
            >
              <FileText className="h-3 w-3 mr-1" />
              Send Quote
            </Button>
            <Button
              size="sm"
              className="flex-1 h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={(e) => { e.stopPropagation(); onMakeOffer ? onMakeOffer(lead) : setQuoteResponseOpen(true); }}
            >
              <DollarSign className="h-3 w-3 mr-1" />
              Make Offer
            </Button>
          </div>
        )}

        {/* Quote Response Modal */}
        <QuoteResponseModal
          open={quoteResponseOpen}
          onOpenChange={setQuoteResponseOpen}
          lead={lead}
          onStatusChange={onStatusChange}
        />
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
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onViewDetails?.(lead)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {lead.phone && (
                <DropdownMenuItem asChild>
                  <a href={`tel:${lead.phone}`}>
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Call
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <a href={`mailto:${lead.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </a>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleToggleHot}>
                <Flame className={`h-4 w-4 mr-2 ${lead.is_hot ? 'text-orange-500' : ''}`} />
                {lead.is_hot ? 'Remove from Hot List' : 'Add to Hot List'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreateQuote}>
                <FileText className="h-4 w-4 mr-2" />
                Create Quote
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
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
                <Archive className="h-4 w-4 mr-2" />
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
