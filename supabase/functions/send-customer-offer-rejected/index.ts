import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CustomerOfferRejectedRequest {
  customerEmail: string;
  customerName: string;
  productName: string;
  productOem: string;
  offerAmount: number;
  listPrice: number;
  rejectionReason?: string;
  salesRepEmail?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: CustomerOfferRejectedRequest = await req.json();
    console.log("Sending customer rejection notification:", data);

    const {
      customerEmail,
      customerName,
      productName,
      productOem,
      offerAmount,
      listPrice,
      rejectionReason,
      salesRepEmail,
    } = data;

    const firstName = customerName.split(' ')[0];
    const discountRequested = listPrice > 0 
      ? Math.round(((listPrice - offerAmount) / listPrice) * 100) 
      : 0;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update on Your Offer</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">LASO Medical</h1>
        <p style="color: #a3c2e0; margin: 10px 0 0; font-size: 14px;">Premium Medical Imaging Equipment</p>
      </td>
    </tr>
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1e3a5f; margin: 0 0 20px; font-size: 24px;">Thank You for Your Interest, ${firstName}</h2>
        
        <p style="color: #5a6c7d; line-height: 1.6; margin: 0 0 25px;">
          We appreciate you taking the time to submit an offer for the ${productOem} ${productName}. 
          After careful review by our team, we're unable to accept this particular offer at this time.
        </p>

        <!-- Offer Details Box -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fb; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="color: #1e3a5f; margin: 0 0 15px; font-size: 16px;">Your Offer Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color: #5a6c7d; padding: 8px 0; border-bottom: 1px solid #e5e9ed;">Equipment</td>
                  <td style="color: #1e3a5f; padding: 8px 0; border-bottom: 1px solid #e5e9ed; text-align: right; font-weight: 600;">${productOem} ${productName}</td>
                </tr>
                <tr>
                  <td style="color: #5a6c7d; padding: 8px 0; border-bottom: 1px solid #e5e9ed;">Your Offer</td>
                  <td style="color: #1e3a5f; padding: 8px 0; border-bottom: 1px solid #e5e9ed; text-align: right; font-weight: 600;">${formatCurrency(offerAmount)}</td>
                </tr>
                <tr>
                  <td style="color: #5a6c7d; padding: 8px 0;">List Price</td>
                  <td style="color: #1e3a5f; padding: 8px 0; text-align: right;">${formatCurrency(listPrice)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${rejectionReason ? `
        <!-- Reason Box -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff8f0; border-left: 4px solid #e67e22; border-radius: 0 8px 8px 0; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px;">
              <p style="color: #5a6c7d; margin: 0; font-size: 14px;">
                <strong style="color: #1e3a5f;">Additional Information:</strong><br>
                ${rejectionReason}
              </p>
            </td>
          </tr>
        </table>
        ` : ''}

        <!-- What's Next Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eef6ff; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 25px;">
              <h3 style="color: #1e3a5f; margin: 0 0 15px; font-size: 18px;">🚀 Here's What You Can Do Next</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 10px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 30px; vertical-align: top;">
                          <span style="color: #2980b9; font-weight: bold;">1.</span>
                        </td>
                        <td>
                          <strong style="color: #1e3a5f;">Submit a Revised Offer</strong>
                          <p style="color: #5a6c7d; margin: 5px 0 0; font-size: 14px;">
                            We'd be happy to consider a new offer closer to our asking price.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 30px; vertical-align: top;">
                          <span style="color: #2980b9; font-weight: bold;">2.</span>
                        </td>
                        <td>
                          <strong style="color: #1e3a5f;">Request a Custom Quote</strong>
                          <p style="color: #5a6c7d; margin: 5px 0 0; font-size: 14px;">
                            Let us put together a tailored package that fits your budget.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 30px; vertical-align: top;">
                          <span style="color: #2980b9; font-weight: bold;">3.</span>
                        </td>
                        <td>
                          <strong style="color: #1e3a5f;">Explore Financing Options</strong>
                          <p style="color: #5a6c7d; margin: 5px 0 0; font-size: 14px;">
                            We offer flexible financing to make your purchase more manageable.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 30px; vertical-align: top;">
                          <span style="color: #2980b9; font-weight: bold;">4.</span>
                        </td>
                        <td>
                          <strong style="color: #1e3a5f;">Browse Similar Equipment</strong>
                          <p style="color: #5a6c7d; margin: 5px 0 0; font-size: 14px;">
                            We may have alternative systems that better fit your budget.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="https://laso-ver1.lovable.app/contact" 
                 style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Contact Our Team
              </a>
            </td>
          </tr>
        </table>

        <!-- Contact Info -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e5e9ed; margin-top: 25px; padding-top: 25px;">
          <tr>
            <td>
              <p style="color: #5a6c7d; margin: 0 0 15px; font-size: 14px;">
                <strong style="color: #1e3a5f;">Have questions? We're here to help:</strong>
              </p>
              <p style="color: #5a6c7d; margin: 0; font-size: 14px;">
                📞 <a href="tel:+18779525278" style="color: #2980b9; text-decoration: none;">877-952-5278</a><br>
                ✉️ <a href="mailto:sales@lasomedical.com" style="color: #2980b9; text-decoration: none;">sales@lasomedical.com</a><br>
                🌐 <a href="https://laso-ver1.lovable.app" style="color: #2980b9; text-decoration: none;">lasomedical.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f4f7fa; padding: 30px; text-align: center; border-top: 1px solid #e5e9ed;">
        <p style="color: #8a9bab; margin: 0 0 10px; font-size: 12px;">
          © ${new Date().getFullYear()} LASO Medical. All rights reserved.
        </p>
        <p style="color: #a3b1bf; margin: 0; font-size: 11px;">
          This email was sent regarding your offer on our medical imaging equipment.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailResponse = await resend.emails.send({
      from: "LASO Medical <sales@lasomedical.com>",
      to: [customerEmail],
      subject: `Update on Your Offer for ${productName}`,
      html: emailHtml,
    });

    console.log("Customer rejection email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.data?.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending customer rejection email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
