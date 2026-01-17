import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AssetRequestPayload {
  sellRequestId: string;
}

interface SellRequest {
  id: string;
  name: string;
  email: string;
  company: string | null;
  equipment_type: string;
  manufacturer: string | null;
  model: string | null;
  has_mri: boolean | null;
  has_ct: boolean | null;
}

const generateAssetRequestEmail = (request: SellRequest): string => {
  const equipmentDescription = request.manufacturer && request.model
    ? `${request.manufacturer} ${request.model}`
    : request.equipment_type;

  const mriSpecificItems = request.has_mri ? `
        <li>Coil cabinet with all RF coils visible</li>
        <li>Cold head display showing helium level</li>
        <li>Magnet room overview</li>
  ` : '';

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
            <p style="color: #bfdbfe; margin: 8px 0 0 0;">Equipment Documentation Request</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #1e40af; margin: 0 0 16px 0;">Hi ${request.name},</h2>
            
            <p style="margin-bottom: 16px;">
              Thank you for your interest in selling your <strong>${equipmentDescription}</strong>. 
              To provide you with an accurate valuation and expedite our evaluation process, we need some visual documentation of your equipment.
            </p>

            <!-- Photos Section -->
            <div style="background: #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #1e40af; margin: 0 0 12px 0; display: flex; align-items: center;">
                📷 Photos Requested
              </h3>
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li>Full system exterior (all 4 sides)</li>
                <li>Console/operator workstation</li>
                <li>Serial number and model plates</li>
                <li>Any areas with visible wear or damage</li>
                ${mriSpecificItems}
              </ul>
            </div>

            <!-- Video Section -->
            <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #92400e; margin: 0 0 12px 0;">
                🎥 Video Requested (Optional)
              </h3>
              <p style="margin: 0; color: #374151;">
                A 30-60 second walkthrough showing the system powering on and general condition would be very helpful for our technical evaluation.
              </p>
            </div>

            <!-- Upload Instructions -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #166534; margin: 0 0 12px 0;">
                📤 How to Send
              </h3>
              <p style="margin: 0 0 12px 0; color: #374151;">
                You can share your photos and videos by:
              </p>
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li>Replying directly to this email with attachments</li>
                <li>Using a file sharing service (Dropbox, Google Drive, WeTransfer)</li>
                <li>Contacting us to arrange an on-site photo session</li>
              </ul>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="mailto:acquisitions@lasoimaging.com?subject=Photos for ${encodeURIComponent(equipmentDescription)}" 
                 style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Reply with Photos & Video
              </a>
            </div>

            <p style="color: #6b7280; margin: 0;">
              If you have any questions, please don't hesitate to reach out. We're here to make this process as smooth as possible.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #1f2937; padding: 24px; text-align: center;">
            <p style="color: #9ca3af; margin: 0 0 8px 0;">LASO Imaging Solutions</p>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">acquisitions@lasoimaging.com | (818) 555-1234</p>
            <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 12px;">14900 Magnolia Blvd #5442, Sherman Oaks, CA 91413</p>
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
    const { sellRequestId }: AssetRequestPayload = await req.json();

    console.log("Sending asset request email for sell request:", sellRequestId);

    if (!sellRequestId) {
      return new Response(
        JSON.stringify({ error: "Sell request ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the sell request
    const { data: sellRequest, error: fetchError } = await supabase
      .from("equipment_sell_requests")
      .select("id, name, email, company, equipment_type, manufacturer, model, has_mri, has_ct")
      .eq("id", sellRequestId)
      .single();

    if (fetchError || !sellRequest) {
      console.error("Error fetching sell request:", fetchError);
      return new Response(
        JSON.stringify({ error: "Sell request not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const equipmentDescription = sellRequest.manufacturer && sellRequest.model
      ? `${sellRequest.manufacturer} ${sellRequest.model}`
      : sellRequest.equipment_type;

    // Generate email HTML
    const emailHtml = generateAssetRequestEmail(sellRequest as SellRequest);

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "LASO Imaging Solutions <hello@noreply.lasoimaging.com>",
      to: [sellRequest.email],
      subject: `Photo & Video Request - ${equipmentDescription} | LASO Imaging`,
      html: emailHtml,
    });

    console.log("Asset request email sent successfully:", emailResponse);

    // Update sell request status to 'contacted' if it was pending
    const { error: updateError } = await supabase
      .from("equipment_sell_requests")
      .update({
        status: "contacted",
      })
      .eq("id", sellRequestId)
      .eq("status", "pending");

    if (updateError) {
      console.error("Error updating sell request status:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Asset request email sent successfully",
        emailId: emailResponse.data?.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-asset-request function:", error);
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
