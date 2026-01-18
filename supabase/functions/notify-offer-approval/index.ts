import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApprovalNotificationRequest {
  offerId: string;
  productName: string;
  productOem: string;
  listPrice: number;
  offerAmount: number;
  discountPercent: number;
  marginPercent: number;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  reason?: string;
  competitorInfo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ApprovalNotificationRequest = await req.json();
    
    console.log("Received offer approval notification request:", data);

    const {
      offerId,
      productName,
      productOem,
      listPrice,
      offerAmount,
      discountPercent,
      marginPercent,
      customerName,
      customerEmail,
      customerCompany,
      reason,
      competitorInfo,
    } = data;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const dashboardUrl = `https://laso-ver1.lovable.app/admin/dashboard`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offer Approval Required</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background-color: #f59e0b; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Offer Approval Required</h1>
            </div>
            
            <!-- Main Content -->
            <div style="background-color: white; padding: 32px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
                An offer has been submitted that exceeds the discount threshold and requires manager approval.
              </p>
              
              <!-- Product Details -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <h3 style="color: #111827; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Equipment</h3>
                <p style="color: #374151; margin: 0; font-size: 18px; font-weight: 600;">${productOem} ${productName}</p>
              </div>
              
              <!-- Customer Details -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <h3 style="color: #111827; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Customer</h3>
                <p style="color: #374151; margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">${customerName}</p>
                ${customerCompany ? `<p style="color: #6b7280; margin: 0 0 4px 0; font-size: 14px;">${customerCompany}</p>` : ''}
                <p style="color: #6b7280; margin: 0; font-size: 14px;">${customerEmail}</p>
              </div>
              
              <!-- Pricing Details -->
              <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <h3 style="color: #92400e; margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Offer Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #374151;">List Price:</td>
                    <td style="padding: 8px 0; color: #374151; text-align: right; font-weight: 600;">${formatCurrency(listPrice)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #374151;">Offer Amount:</td>
                    <td style="padding: 8px 0; color: #059669; text-align: right; font-weight: 600; font-size: 18px;">${formatCurrency(offerAmount)}</td>
                  </tr>
                  <tr style="border-top: 1px solid #fcd34d;">
                    <td style="padding: 8px 0; color: #b45309;">Discount:</td>
                    <td style="padding: 8px 0; color: #b45309; text-align: right; font-weight: 600;">${discountPercent.toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #374151;">Margin:</td>
                    <td style="padding: 8px 0; color: ${marginPercent < 20 ? '#dc2626' : '#059669'}; text-align: right; font-weight: 600;">${marginPercent.toFixed(1)}%</td>
                  </tr>
                </table>
              </div>
              
              <!-- Reason -->
              ${reason ? `
              <div style="margin-bottom: 24px;">
                <h3 style="color: #111827; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Reason</h3>
                <p style="color: #374151; margin: 0; font-style: italic;">"${reason}"</p>
              </div>
              ` : ''}
              
              <!-- Competitor Info -->
              ${competitorInfo ? `
              <div style="margin-bottom: 24px;">
                <h3 style="color: #111827; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Competitor Information</h3>
                <p style="color: #374151; margin: 0;">${competitorInfo}</p>
              </div>
              ` : ''}
              
              <!-- Action Buttons -->
              <div style="text-align: center; margin-top: 32px;">
                <a href="${dashboardUrl}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Review in Dashboard
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 24px;">
                Please review this offer and approve or reject it in the admin dashboard.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 24px; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">LASO Imaging Solutions</p>
              <p style="margin: 4px 0 0 0;">This is an automated notification from the LASO Admin System</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LASO Admin <onboarding@resend.dev>",
        to: ["info@lasoimaging.com"],
        subject: `⚠️ Offer Approval Required: ${productOem} ${productName} - ${discountPercent.toFixed(0)}% Discount`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Approval notification email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-offer-approval function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
