import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface JourneyEvent {
  id: string;
  type: 'lead_created' | 'status_change' | 'email' | 'sms' | 'call' | 'note' | 'quote_sent' | 'quote_viewed' | 'quote_accepted' | 'quote_rejected' | 'email_delivered' | 'email_opened';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export function useLeadJourney(leadId: string | undefined) {
  return useQuery({
    queryKey: ["lead-journey", leadId],
    queryFn: async () => {
      if (!leadId) return [];
      
      const events: JourneyEvent[] = [];
      
      // 1. Get lead data (creation event)
      const { data: lead } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();
      
      if (lead) {
        events.push({
          id: `lead-${lead.id}`,
          type: 'lead_created',
          title: 'Lead Created',
          description: `Submitted via ${lead.source_page}. Interest: ${lead.interest}`,
          timestamp: lead.created_at,
          metadata: { 
            source: lead.source_page, 
            interest: lead.interest,
            score: lead.lead_score,
            isHot: lead.is_hot
          },
        });
      }
      
      // 2. Get all activities for this lead
      const { data: activities } = await supabase
        .from("activities")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: true });
      
      if (activities) {
        activities.forEach(activity => {
          let type: JourneyEvent['type'] = 'note';
          if (activity.activity_type.toLowerCase().includes('email')) type = 'email';
          else if (activity.activity_type.toLowerCase().includes('sms')) type = 'sms';
          else if (activity.activity_type.toLowerCase().includes('call')) type = 'call';
          
          events.push({
            id: `activity-${activity.id}`,
            type,
            title: activity.activity_type,
            description: activity.content,
            timestamp: activity.created_at || new Date().toISOString(),
            metadata: {
              direction: activity.direction,
              subject: activity.subject,
            },
          });
        });
      }
      
      // 3. Get quotes associated with this lead
      const { data: quotes } = await supabase
        .from("quotes")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: true });
      
      if (quotes) {
        quotes.forEach(quote => {
          // Quote created
          events.push({
            id: `quote-created-${quote.id}`,
            type: 'quote_sent',
            title: `Quote ${quote.quote_number} Created`,
            description: `Quote for $${quote.total_amount?.toLocaleString()} - Status: ${quote.status}`,
            timestamp: quote.created_at,
            metadata: { quoteId: quote.id, amount: quote.total_amount },
          });
          
          // Quote viewed
          if (quote.viewed_at) {
            events.push({
              id: `quote-viewed-${quote.id}`,
              type: 'quote_viewed',
              title: `Quote ${quote.quote_number} Viewed`,
              description: 'Customer opened the quote acceptance portal',
              timestamp: quote.viewed_at,
              metadata: { quoteId: quote.id },
            });
          }
          
          // Quote accepted
          if (quote.accepted_at) {
            events.push({
              id: `quote-accepted-${quote.id}`,
              type: 'quote_accepted',
              title: `Quote ${quote.quote_number} Accepted! 🎉`,
              description: `Customer accepted the $${quote.total_amount?.toLocaleString()} quote`,
              timestamp: quote.accepted_at,
              metadata: { quoteId: quote.id, amount: quote.total_amount },
            });
          }
          
          // Quote rejected
          if (quote.rejected_at) {
            events.push({
              id: `quote-rejected-${quote.id}`,
              type: 'quote_rejected',
              title: `Quote ${quote.quote_number} Declined`,
              description: quote.rejection_reason || 'Customer declined the quote',
              timestamp: quote.rejected_at,
              metadata: { quoteId: quote.id, reason: quote.rejection_reason },
            });
          }
        });
      }
      
      // 4. Get email delivery events (via quotes)
      if (quotes && quotes.length > 0) {
        const quoteIds = quotes.map(q => q.id);
        const { data: emailEvents } = await supabase
          .from("email_delivery_events")
          .select("*")
          .in("quote_id", quoteIds)
          .order("created_at", { ascending: true });
        
        if (emailEvents) {
          emailEvents.forEach(event => {
            const quote = quotes.find(q => q.id === event.quote_id);
            let type: JourneyEvent['type'] = 'email_delivered';
            let title = 'Email Delivered';
            
            if (event.event_type === 'email.opened') {
              type = 'email_opened';
              title = 'Email Opened';
            } else if (event.event_type === 'email.bounced') {
              title = 'Email Bounced';
            } else if (event.event_type === 'email.complained') {
              title = 'Email Marked as Spam';
            }
            
            events.push({
              id: `email-${event.id}`,
              type,
              title,
              description: `Quote ${quote?.quote_number || 'email'} ${event.event_type.replace('email.', '')}`,
              timestamp: event.created_at || new Date().toISOString(),
              metadata: { 
                emailId: event.email_id, 
                recipient: event.recipient,
                eventType: event.event_type 
              },
            });
          });
        }
      }
      
      // Sort all events by timestamp (newest first for display)
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return events;
    },
    enabled: !!leadId,
  });
}
