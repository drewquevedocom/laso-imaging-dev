import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendSMSRequest {
  to: string;
  message: string;
  leadId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELNYX_API_KEY = Deno.env.get("TELNYX_API_KEY");
    const TELNYX_PHONE_NUMBER = Deno.env.get("TELNYX_PHONE_NUMBER");

    if (!TELNYX_API_KEY || !TELNYX_PHONE_NUMBER) {
      console.error("Missing Telnyx configuration");
      return new Response(
        JSON.stringify({ error: "SMS service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { to, message, leadId }: SendSMSRequest = await req.json();

    if (!to || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, message" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Format phone number (ensure E.164 format)
    let formattedTo = to.replace(/\D/g, "");
    if (!formattedTo.startsWith("1") && formattedTo.length === 10) {
      formattedTo = "1" + formattedTo;
    }
    formattedTo = "+" + formattedTo;

    console.log(`Sending SMS to ${formattedTo} from ${TELNYX_PHONE_NUMBER}`);

    // Send SMS via Telnyx API
    const telnyxResponse = await fetch("https://api.telnyx.com/v2/messages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TELNYX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: TELNYX_PHONE_NUMBER,
        to: formattedTo,
        text: message,
      }),
    });

    const telnyxData = await telnyxResponse.json();

    if (!telnyxResponse.ok) {
      console.error("Telnyx API error:", telnyxData);
      
      // Check for specific error codes and provide better messages
      const errorCode = telnyxData?.errors?.[0]?.code;
      let userMessage = "Failed to send SMS";
      
      if (errorCode === "10039") {
        userMessage = "SMS service is in trial mode. The destination number must be pre-verified in Telnyx, or upgrade your account.";
      } else if (errorCode === "40013") {
        userMessage = "Invalid source phone number. Please check your Telnyx configuration.";
      }
      
      return new Response(
        JSON.stringify({ error: userMessage, details: telnyxData }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("SMS sent successfully:", telnyxData.data?.id);

    // Log activity to database if leadId provided
    if (leadId) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        await supabase.from("activities").insert({
          lead_id: leadId,
          activity_type: "SMS",
          content: message,
          direction: "outbound",
          metadata: {
            to: formattedTo,
            message_id: telnyxData.data?.id,
            carrier: telnyxData.data?.carrier || null,
          },
        });

        console.log("Activity logged for lead:", leadId);
      } catch (dbError) {
        console.error("Failed to log activity:", dbError);
        // Don't fail the request if logging fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageId: telnyxData.data?.id,
        to: formattedTo,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-sms function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
