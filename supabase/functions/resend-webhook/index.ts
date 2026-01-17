import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    // Resend webhook event types: email.sent, email.delivered, 
    // email.opened, email.clicked, email.bounced, email.complained
    const { type, data } = payload;
    
    console.log(`Resend webhook received: ${type}`, JSON.stringify(data));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Extract recipient email
    const recipient = data.to?.[0] || data.email || "unknown";
    const emailId = data.email_id;
    
    // Look up the quote by resend_email_id to link the event
    let quoteId: string | null = null;
    let timecardId: string | null = null;
    
    if (emailId) {
      // Check quotes table first
      const { data: quote } = await supabase
        .from("quotes")
        .select("id")
        .eq("resend_email_id", emailId)
        .maybeSingle();
      
      if (quote) {
        quoteId = quote.id;
        console.log(`Linked email event to quote: ${quoteId}`);
      } else {
        // Check contractor_timecards table
        const { data: timecard } = await supabase
          .from("contractor_timecards")
          .select("id")
          .eq("resend_email_id", emailId)
          .maybeSingle();
        
        if (timecard) {
          timecardId = timecard.id;
          console.log(`Linked email event to timecard: ${timecardId}`);
        }
      }
    }
    
    // Store the event with the linked quote_id or timecard_id
    const { error } = await supabase.from("email_delivery_events").insert({
      email_id: emailId,
      event_type: type,
      recipient: recipient,
      quote_id: quoteId,
      timecard_id: timecardId,
      payload: payload,
    });

    if (error) {
      console.error("Error storing webhook event:", error);
    } else {
      console.log(`Email delivery event stored: ${type} for ${emailId}${quoteId ? ` (quote: ${quoteId})` : ''}${timecardId ? ` (timecard: ${timecardId})` : ''}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
