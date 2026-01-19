import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DecisionNotificationRequest {
  offerId: string;
  decision: "approved" | "rejected";
  salesRepEmail: string;
  salesRepName?: string;
  managerNotes?: string;
  rejectionReason?: string;
  productName: string;
  productOem: string;
  customerName: string;
  customerCompany?: string;
  offerAmount: number;
  listPrice: number;
  discountPercent: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-offer-decision-notification function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: DecisionNotificationRequest = await req.json();
    console.log("Decision notification data:", data);

    const {
      decision,
      salesRepEmail,
      salesRepName,
      managerNotes,
      rejectionReason,
      productName,
      productOem,
      customerName,
      customerCompany,
      offerAmount,
      listPrice,
      discountPercent,
    } = data;

    if (!salesRepEmail) {
      console.log("No sales rep email provided, skipping notification");
      return new Response(
        JSON.stringify({ success: true, message: "No sales rep email provided" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const isApproved = decision === "approved";
    const subjectLine = isApproved
      ? `✅ Your offer for ${productName} has been approved!`
      : `⚠️ Your offer for ${productName} requires revision`;

    const headerColor = isApproved ? "#22c55e" : "#f59e0b";
    const headerIcon = isApproved ? "✓" : "⚠";
    const headerText = isApproved ? "Offer Approved" : "Offer Needs Revision";
    const mainMessage = isApproved
      ? "Great news! Your offer has been approved by management."
      : "Your offer requires revision before it can proceed.";

    const nextStepsHtml = isApproved
      ? `
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-top: 20px;">
          <h3 style="color: #15803d; margin: 0 0 8px 0; font-size: 14px;">Next Steps</h3>
          <ul style="color: #166534; margin: 0; padding-left: 20px; font-size: 14px;">
            <li>You can now proceed with the customer</li>
            <li>Send the official quote or finalize the deal</li>
            <li>Update the offer status in the system</li>
          </ul>
        </div>
      `
      : `
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-top: 20px;">
          <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 14px;">Suggestions</h3>
          <ul style="color: #a16207; margin: 0; padding-left: 20px; font-size: 14px;">
            <li>Review the rejection reason provided</li>
            <li>Consider adjusting the price or terms</li>
            <li>Add additional justification if needed</li>
            <li>Submit a revised offer</li>
          </ul>
        </div>
      `;

    const notesSection = (isApproved ? managerNotes : rejectionReason)
      ? `
        <div style="background-color: #f8fafc; border-left: 4px solid ${headerColor}; padding: 12px 16px; margin-top: 20px;">
          <p style="color: #64748b; margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
            ${isApproved ? "Manager Notes" : "Reason for Rejection"}
          </p>
          <p style="color: #1e293b; margin: 0; font-size: 14px;">
            ${isApproved ? managerNotes : rejectionReason}
          </p>
        </div>
      `
      : "";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subjectLine}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background-color: ${headerColor}; border-radius: 12px 12px 0 0; padding: 24px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: white; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px; color: ${headerColor};">${headerIcon}</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
                ${headerText}
              </h1>
            </div>
            
            <!-- Content -->
            <div style="background-color: white; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="color: #1e293b; font-size: 16px; margin: 0 0 24px 0;">
                ${salesRepName ? `Hi ${salesRepName},` : "Hi,"}
              </p>
              
              <p style="color: #475569; font-size: 15px; margin: 0 0 24px 0; line-height: 1.6;">
                ${mainMessage}
              </p>
              
              <!-- Offer Details -->
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #334155; margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Offer Details
                </h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Product</td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right; font-weight: 500;">
                      ${productOem} ${productName}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Customer</td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right; font-weight: 500;">
                      ${customerName}${customerCompany ? ` (${customerCompany})` : ""}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">List Price</td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">
                      ${formatCurrency(listPrice)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Your Offer</td>
                    <td style="padding: 8px 0; color: ${isApproved ? "#22c55e" : "#f59e0b"}; font-size: 16px; text-align: right; font-weight: 600;">
                      ${formatCurrency(offerAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Discount</td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">
                      ${discountPercent.toFixed(1)}%
                    </td>
                  </tr>
                </table>
              </div>
              
              ${notesSection}
              ${nextStepsHtml}
              
              <!-- Footer -->
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                  This is an automated notification from LASO Imaging Solutions
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log(`Sending ${decision} notification email to ${salesRepEmail}`);

    const emailResponse = await resend.emails.send({
      from: "LASO Sales <offers@lasoimaging.com>",
      to: [salesRepEmail],
      subject: subjectLine,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.data?.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-offer-decision-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
