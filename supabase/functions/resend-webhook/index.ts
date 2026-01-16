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
    // email.opened, email.bounced, email.complained
    const { type, data } = payload;
    
    console.log(`Resend webhook received: ${type}`, JSON.stringify(data));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Extract recipient email
    const recipient = data.to?.[0] || data.email || "unknown";
    
    // Store the event
    const { error } = await supabase.from("email_delivery_events").insert({
      email_id: data.email_id,
      event_type: type,
      recipient: recipient,
      payload: payload,
    });

    if (error) {
      console.error("Error storing webhook event:", error);
    } else {
      console.log(`Email delivery event stored: ${type} for ${data.email_id}`);
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
