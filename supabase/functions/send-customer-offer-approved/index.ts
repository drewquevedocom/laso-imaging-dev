import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CustomerOfferApprovedRequest {
  customerEmail: string;
  customerName: string;
  productName: string;
  productOem: string;
  approvedAmount: number;
  listPrice: number;
  discountPercent: number;
  salesRepName?: string;
  salesRepEmail?: string;
  validityDays?: number;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-customer-offer-approved function invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerEmail,
      customerName,
      productName,
      productOem,
      approvedAmount,
      listPrice,
      discountPercent,
      salesRepName,
      salesRepEmail,
      validityDays = 30,
    }: CustomerOfferApprovedRequest = await req.json();

    console.log("Processing customer offer approval notification:", { customerEmail, productName });

    const savings = listPrice - approvedAmount;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Offer Has Been Approved!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 16px; line-height: 60px; font-size: 28px;">
                ✓
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Great News, ${customerName}!
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">
                Your offer has been approved
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                We're excited to let you know that your offer for the equipment below has been approved! You've secured an excellent price.
              </p>
              
              <!-- Product Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;">Equipment</p>
                    <h3 style="color: #111827; margin: 0 0 4px; font-size: 18px;">${productName}</h3>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">${productOem}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Pricing Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280; font-size: 14px;">List Price</span>
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    <span style="color: #6b7280; font-size: 14px; text-decoration: line-through;">${formatCurrency(listPrice)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280; font-size: 14px;">Your Discount</span>
                  </td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    <span style="color: #10B981; font-size: 14px; font-weight: 600;">${discountPercent.toFixed(1)}% OFF</span>
                  </td>
                </tr>
                <tr style="background-color: #ecfdf5;">
                  <td style="padding: 16px;">
                    <span style="color: #047857; font-size: 16px; font-weight: 600;">Your Approved Price</span>
                  </td>
                  <td style="padding: 16px; text-align: right;">
                    <span style="color: #047857; font-size: 20px; font-weight: bold;">${formatCurrency(approvedAmount)}</span>
                  </td>
                </tr>
              </table>
              
              <!-- Savings Badge -->
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
                <p style="color: #92400e; margin: 0; font-size: 16px;">
                  💰 <strong>You're saving ${formatCurrency(savings)}</strong> on this purchase!
                </p>
              </div>
              
              <!-- Next Steps -->
              <h3 style="color: #111827; font-size: 16px; margin: 0 0 16px;">Next Steps to Complete Your Purchase:</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #dbeafe; border-radius: 50%; text-align: center; line-height: 24px; color: #1d4ed8; font-weight: bold; font-size: 12px; margin-right: 12px;">1</span>
                    <span style="color: #374151; font-size: 14px;">Review the final terms and specifications</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #dbeafe; border-radius: 50%; text-align: center; line-height: 24px; color: #1d4ed8; font-weight: bold; font-size: 12px; margin-right: 12px;">2</span>
                    <span style="color: #374151; font-size: 14px;">Complete payment or financing arrangements</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <span style="display: inline-block; width: 24px; height: 24px; background-color: #dbeafe; border-radius: 50%; text-align: center; line-height: 24px; color: #1d4ed8; font-weight: bold; font-size: 12px; margin-right: 12px;">3</span>
                    <span style="color: #374151; font-size: 14px;">Schedule delivery and installation</span>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 24px 0;">
                    <a href="mailto:sales@lasoimaging.com?subject=Ready%20to%20Complete%20Purchase%20-%20${encodeURIComponent(productName)}" 
                       style="display: inline-block; background-color: #0F766E; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Complete Your Purchase →
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Validity Notice -->
              <div style="background-color: #fef2f2; border-left: 4px solid #f87171; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-top: 16px;">
                <p style="color: #991b1b; margin: 0; font-size: 14px;">
                  ⏰ <strong>Important:</strong> This approved price is valid for ${validityDays} days. Please complete your purchase before the offer expires.
                </p>
              </div>
              
              ${salesRepEmail ? `
              <!-- Contact Info -->
              <div style="border-top: 1px solid #e5e7eb; margin-top: 24px; padding-top: 24px;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Your Sales Representative:</p>
                <p style="color: #111827; font-size: 14px; margin: 0;">
                  <strong>${salesRepName || 'LASO Sales Team'}</strong><br>
                  <a href="mailto:${salesRepEmail}" style="color: #0F766E;">${salesRepEmail}</a>
                </p>
              </div>
              ` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">
                <strong>LASO Imaging Solutions</strong>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Your Trusted Partner in Medical Imaging Equipment<br>
                <a href="tel:18445115276" style="color: #0F766E;">(844) 511-5276</a> • 
                <a href="mailto:sales@lasoimaging.com" style="color: #0F766E;">sales@lasoimaging.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailResponse = await resend.emails.send({
      from: "LASO Imaging <sales@lasoimaging.com>",
      to: [customerEmail],
      subject: `Great News! Your Offer for ${productName} Has Been Approved`,
      html: emailHtml,
    });

    console.log("Customer notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-customer-offer-approved function:", error);
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
