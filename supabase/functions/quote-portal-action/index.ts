import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteActionRequest {
  action: "view" | "accept" | "reject";
  token: string;
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // GET request - fetch quote by token
    if (req.method === "GET") {
      const url = new URL(req.url);
      const token = url.searchParams.get("token");

      if (!token) {
        return new Response(
          JSON.stringify({ error: "Token is required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log("Fetching quote with token:", token);

      const { data: quote, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("acceptance_token", token)
        .single();

      if (error || !quote) {
        console.error("Quote not found:", error);
        return new Response(
          JSON.stringify({ error: "Quote not found or invalid token" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ quote }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // POST request - perform action
    if (req.method === "POST") {
      const { action, token, rejectionReason }: QuoteActionRequest = await req.json();

      if (!action || !token) {
        return new Response(
          JSON.stringify({ error: "Action and token are required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      console.log(`Processing ${action} action for token:`, token);

      // First, get the quote
      const { data: quote, error: fetchError } = await supabase
        .from("quotes")
        .select("*")
        .eq("acceptance_token", token)
        .single();

      if (fetchError || !quote) {
        return new Response(
          JSON.stringify({ error: "Quote not found" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      let updateData: Record<string, any> = {};
      let activityType = "";
      let activityContent = "";

      switch (action) {
        case "view":
          // Only update if not already viewed
          if (!quote.viewed_at) {
            updateData = { viewed_at: new Date().toISOString() };
            activityType = "Contract Viewed";
            activityContent = `Quote ${quote.quote_number} was viewed by the customer`;
          }
          break;

        case "accept":
          if (quote.accepted_at) {
            return new Response(
              JSON.stringify({ error: "Quote already accepted" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
          if (quote.rejected_at) {
            return new Response(
              JSON.stringify({ error: "Quote was previously rejected" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
          updateData = {
            accepted_at: new Date().toISOString(),
            status: "Accepted",
          };
          activityType = "Quote Accepted";
          activityContent = `Quote ${quote.quote_number} was accepted by the customer. Total: $${quote.total_amount?.toLocaleString()}`;
          break;

        case "reject":
          if (quote.rejected_at) {
            return new Response(
              JSON.stringify({ error: "Quote already rejected" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
          if (quote.accepted_at) {
            return new Response(
              JSON.stringify({ error: "Quote was previously accepted" }),
              { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
            );
          }
          updateData = {
            rejected_at: new Date().toISOString(),
            rejection_reason: rejectionReason || null,
            status: "Rejected",
          };
          activityType = "Quote Rejected";
          activityContent = `Quote ${quote.quote_number} was declined by the customer${rejectionReason ? `. Reason: ${rejectionReason}` : ""}`;
          break;

        default:
          return new Response(
            JSON.stringify({ error: "Invalid action" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
      }

      // Update quote
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from("quotes")
          .update(updateData)
          .eq("id", quote.id);

        if (updateError) {
          console.error("Failed to update quote:", updateError);
          return new Response(
            JSON.stringify({ error: "Failed to update quote" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Log activity if there's a lead_id
        if (quote.lead_id && activityType) {
          await supabase.from("activities").insert({
            lead_id: quote.lead_id,
            activity_type: activityType,
            content: activityContent,
            direction: "inbound",
            metadata: {
              quote_id: quote.id,
              quote_number: quote.quote_number,
              action: action,
            },
          });
        }
      }

      return new Response(
        JSON.stringify({ success: true, action }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in quote-portal-action function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
