import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Portal URL for quote acceptance
const PORTAL_URL = "https://laso-ver1.lovable.app";

interface SendQuoteRequest {
  quoteId: string;
  to: string;
  subject: string;
  message: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const generateEmailHtml = (quote: any, message: string, acceptanceToken: string): string => {
  const lineItemsHtml = (quote.items || [])
    .map(
      (item: LineItem) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.unit_price)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.total)}</td>
      </tr>
    `
    )
    .join("");

  const messageHtml = message.replace(/\n/g, "<br>");
  const portalLink = `${PORTAL_URL}/quote/${acceptanceToken}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #1f2937; line-height: 1.6; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">LASO Imaging Solutions</h1>
            <p style="color: #bfdbfe; margin: 8px 0 0 0;">Medical Imaging Equipment & Services</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <div style="background: #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
              <h2 style="color: #1e40af; margin: 0; font-size: 24px;">${quote.quote_number}</h2>
              <p style="color: #6b7280; margin: 4px 0 0 0;">Quote Date: ${formatDate(quote.created_at)}</p>
            </div>

            <div style="margin-bottom: 24px;">
              <p style="white-space: pre-wrap;">${messageHtml}</p>
            </div>

            <!-- Quote Summary -->
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 16px 0; color: #1e40af;">Quote Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #1e40af; color: white;">
                    <th style="padding: 10px; text-align: left; border-radius: 4px 0 0 0;">Description</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                    <th style="padding: 10px; text-align: right; border-radius: 0 4px 0 0;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItemsHtml}
                </tbody>
              </table>
              
              <div style="margin-top: 16px; text-align: right;">
                <p style="margin: 4px 0; color: #6b7280;">Subtotal: ${formatCurrency(quote.subtotal)}</p>
                <p style="margin: 4px 0; color: #6b7280;">Tax: ${formatCurrency(quote.tax)}</p>
                <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #1e40af;">Total: ${formatCurrency(quote.total_amount)}</p>
              </div>
            </div>

            <!-- Validity -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
              <p style="margin: 0; color: #92400e;">
                <strong>Valid Until:</strong> ${quote.valid_until ? formatDate(quote.valid_until) : "30 days from quote date"}
              </p>
            </div>

            <!-- CTA Buttons -->
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${portalLink}" 
                 style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 12px; margin-bottom: 12px;">
                ✓ View & Accept Quote
              </a>
              <a href="mailto:info@lasoimaging.com?subject=RE: ${quote.quote_number}" 
                 style="display: inline-block; background: #1e40af; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Reply with Questions
              </a>
            </div>

            <!-- Portal Link Notice -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="margin: 0; color: #166534; font-size: 14px; text-align: center;">
                <strong>Quick Access:</strong> Click the button above to view your quote online, accept it, or request changes.
              </p>
              <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 12px; text-align: center; word-break: break-all;">
                ${portalLink}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #1f2937; padding: 24px; text-align: center;">
            <p style="color: #9ca3af; margin: 0 0 8px 0;">LASO Imaging Solutions</p>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">info@lasoimaging.com | (818) 555-1234</p>
            <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 12px;">Mailing Address: 14900 Magnolia Blvd #56323, Sherman Oaks, CA 91413</p>
            <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 12px;">Thank you for your business!</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId, to, subject, message }: SendQuoteRequest = await req.json();

    console.log("Sending quote email for quoteId:", quoteId, "to:", to);

    if (!quoteId || !to) {
      return new Response(
        JSON.stringify({ error: "Quote ID and recipient email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the quote with acceptance_token
    const { data: quote, error: fetchError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", quoteId)
      .single();

    if (fetchError || !quote) {
      console.error("Error fetching quote:", fetchError);
      return new Response(
        JSON.stringify({ error: "Quote not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Quote found:", quote.quote_number, "Token:", quote.acceptance_token);

    // Generate email HTML with acceptance portal link
    const emailHtml = generateEmailHtml(quote, message, quote.acceptance_token);

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "LASO Imaging Solutions <hello@noreply.lasoimaging.com>",
      to: [to],
      subject: subject || `Quote ${quote.quote_number} from LASO Imaging Solutions`,
      html: emailHtml,
    });

    console.log("Quote email sent successfully:", emailResponse);

    // Update quote status to 'Sent' and store Resend email ID for tracking
    const { error: updateError } = await supabase
      .from("quotes")
      .update({
        status: "Sent",
        resend_email_id: emailResponse.data?.id || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", quoteId);

    if (updateError) {
      console.error("Error updating quote status:", updateError);
    }

    // Log activity if quote is linked to a lead
    if (quote.lead_id) {
      await supabase.from("activities").insert({
        lead_id: quote.lead_id,
        activity_type: "quote_sent",
        content: `Quote ${quote.quote_number} sent to ${to}`,
        direction: "outbound",
        metadata: {
          quote_id: quote.id,
          quote_number: quote.quote_number,
          recipient: to,
          total_amount: quote.total_amount,
        },
      });
    }

    // Create customer notification if quote has customer_id
    if (quote.customer_id) {
      const { error: notifError } = await supabase.from("customer_notifications").insert({
        customer_id: quote.customer_id,
        type: "quote_sent",
        title: "New Quote Received",
        body: `Quote ${quote.quote_number} for ${formatCurrency(quote.total_amount)} has been sent to you.`,
        data: {
          quote_id: quote.id,
          quote_number: quote.quote_number,
          total_amount: quote.total_amount,
        },
      });
      
      if (notifError) {
        console.error("Error creating customer notification:", notifError);
      } else {
        console.log("Customer notification created for quote:", quote.quote_number);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Quote sent successfully",
        emailId: emailResponse.data?.id,
        portalLink: `${PORTAL_URL}/quote/${quote.acceptance_token}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
