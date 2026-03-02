import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OfferNotificationRequest {
  productName: string;
  productPrice?: string;
  name: string;
  email: string;
  phone?: string;
  offerAmount: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-offer-notification function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: OfferNotificationRequest = await req.json();
    console.log("Received offer notification:", { 
      product: data.productName, 
      from: data.name, 
      offer: data.offerAmount 
    });

    // Format the admin notification email
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; }
          .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #16a34a; }
          .section-title { font-weight: bold; color: #16a34a; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
          .field { margin: 8px 0; }
          .field-label { font-weight: 600; color: #555; }
          .field-value { color: #333; }
          .offer-amount { font-size: 24px; font-weight: bold; color: #16a34a; }
          .footer { padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .cta { display: inline-block; background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">💰 New Offer Received</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">${data.productName}</p>
          </div>
          
          <div class="content">
            <div class="section" style="text-align: center; border-left-color: #16a34a;">
              <div class="section-title">Offer Amount</div>
              <div class="offer-amount">$${data.offerAmount}</div>
              ${data.productPrice ? `<p style="margin: 5px 0 0 0; color: #666;">Listed Price: ${data.productPrice}</p>` : ''}
            </div>

            <div class="section">
              <div class="section-title">Contact Information</div>
              <div class="field"><span class="field-label">Name:</span> <span class="field-value">${data.name}</span></div>
              <div class="field"><span class="field-label">Email:</span> <span class="field-value"><a href="mailto:${data.email}">${data.email}</a></span></div>
              ${data.phone ? `<div class="field"><span class="field-label">Phone:</span> <span class="field-value"><a href="tel:${data.phone}">${data.phone}</a></span></div>` : ''}
            </div>

            <div class="section">
              <div class="section-title">Product Details</div>
              <div class="field"><span class="field-label">Product:</span> <span class="field-value">${data.productName}</span></div>
              ${data.productPrice ? `<div class="field"><span class="field-label">Listed Price:</span> <span class="field-value">${data.productPrice}</span></div>` : ''}
            </div>

            ${data.message ? `
            <div class="section">
              <div class="section-title">Additional Notes</div>
              <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin-top: 20px;">
              <a href="mailto:${data.email}?subject=Re: Your Offer for ${encodeURIComponent(data.productName)}" class="cta">
                Reply to ${data.name}
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>This notification was sent from the LASO Medical Imaging website.</p>
            <p>© ${new Date().getFullYear()} LASO Medical Imaging. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send admin notification
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LASO Medical <hello@noreply.lasoimaging.com>",
        to: ["info@lasoimaging.com"],
        reply_to: data.email,
        subject: `New Offer: $${data.offerAmount} for ${data.productName}`,
        html: adminEmailHtml,
      }),
    });

    const emailResult = await response.json();
    
    if (!response.ok) {
      console.error("Resend API error:", emailResult);
      throw new Error(emailResult.message || "Failed to send email");
    }

    console.log("Admin email sent successfully:", emailResult);

    // Send customer confirmation email
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0077b6 0%, #00a8e8 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8f9fa; padding: 25px; border: 1px solid #e9ecef; }
          .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; }
          .highlight { background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .offer-amount { font-size: 28px; font-weight: bold; color: #16a34a; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; background: #f1f1f1; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Offer Received!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">We've received your offer</p>
          </div>
          
          <div class="content">
            <p style="font-size: 16px;">Dear ${data.name},</p>
            
            <p>Thank you for your interest! We've received your offer and our team will review it promptly.</p>
            
            <div class="highlight">
              <h3 style="margin: 0 0 10px 0; color: #0077b6;">Your Offer Summary</h3>
              <p style="margin: 5px 0;"><strong>Product:</strong> ${data.productName}</p>
              <div class="offer-amount">$${data.offerAmount}</div>
            </div>

            <div class="section">
              <h3 style="margin: 0 0 15px 0;">What Happens Next?</h3>
              <p style="margin: 0;">Our sales team will review your offer and reach out to you within 24-48 business hours to discuss next steps.</p>
            </div>

            <p><strong>Questions?</strong></p>
            <p>
              📞 Call: <a href="tel:18445115276" style="color: #0077b6;">(844) 511-5276</a><br>
              📧 Email: <a href="mailto:info@lasoimaging.com" style="color: #0077b6;">info@lasoimaging.com</a>
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 0;">Best regards,<br><strong>The LASO Imaging Team</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 11px;">© ${new Date().getFullYear()} LASO Medical Imaging. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const customerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LASO Medical <hello@noreply.lasoimaging.com>",
        to: [data.email],
        subject: `Your Offer for ${data.productName} - LASO Imaging`,
        html: customerEmailHtml,
      }),
    });

    const customerResult = await customerEmailResponse.json();
    
    if (!customerEmailResponse.ok) {
      console.error("Customer confirmation email error:", customerResult);
    } else {
      console.log("Customer confirmation email sent:", customerResult);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      adminEmailId: emailResult.id,
      customerEmailId: customerResult.id
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-offer-notification function:", error);
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
