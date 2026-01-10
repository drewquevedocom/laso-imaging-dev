import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CryogenicQuoteRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType: string;
  manufacturer: string;
  model: string;
  issueType?: string;
  isEmergency?: boolean;
  preferredDate?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: CryogenicQuoteRequest = await req.json();
    console.log("Received cryogenic quote request:", data);

    const emergencyBadge = data.isEmergency 
      ? '<span style="background-color: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">🚨 EMERGENCY</span>' 
      : '';

    // Send notification to admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Cryogenic Service Request</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%); padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New ${data.serviceType} Request</h1>
          ${emergencyBadge ? `<div style="margin-top: 12px;">${emergencyBadge}</div>` : ''}
        </div>
        
        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
          <h2 style="color: #0c4a6e; margin-top: 0;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b;">Name:</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Phone:</td><td style="padding: 8px 0;">${data.phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Company:</td><td style="padding: 8px 0;">${data.company || 'Not provided'}</td></tr>
          </table>
          
          <h2 style="color: #0c4a6e; margin-top: 24px;">Service Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b;">Service Type:</td><td style="padding: 8px 0; font-weight: 600; color: #3b82f6;">${data.serviceType}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Manufacturer:</td><td style="padding: 8px 0; font-weight: 600;">${data.manufacturer}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Model:</td><td style="padding: 8px 0; font-weight: 600;">${data.model}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Issue Type:</td><td style="padding: 8px 0;">${data.issueType || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Preferred Date:</td><td style="padding: 8px 0;">${data.preferredDate || 'Flexible'}</td></tr>
          </table>
          
          ${data.message ? `
          <h2 style="color: #0c4a6e; margin-top: 24px;">Additional Notes</h2>
          <p style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">${data.message}</p>
          ` : ''}
          
          <div style="margin-top: 30px; padding: 20px; background: #e8f4ff; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #0c4a6e;">📧 Quick Reply</p>
            <p style="margin: 10px 0 0;">
              <a href="mailto:${data.email}?subject=RE: ${data.serviceType} Quote - ${data.manufacturer} ${data.model}" style="color: #0c4a6e;">
                Click here to reply to ${data.name}
              </a>
            </p>
          </div>
        </div>
        
        <div style="background: #0c4a6e; padding: 16px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">LASO Imaging Solutions | 1-800-MRI-LASO</p>
        </div>
      </body>
      </html>
    `;

    // Send confirmation to customer
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Service Request - LASO Imaging</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%); padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Your Request</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
          <p>Dear ${data.name},</p>
          
          <p>Thank you for contacting LASO Imaging Solutions regarding <strong>${data.serviceType}</strong> for your <strong>${data.manufacturer} ${data.model}</strong>.</p>
          
          <p>We have received your request and our team will review it promptly. ${data.isEmergency ? '<strong style="color: #dc2626;">Since this is marked as an emergency, we will prioritize your request.</strong>' : 'You can expect to hear from us within 24 hours.'}</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="margin-top: 0; color: #0c4a6e;">What's Next?</h3>
            <ul style="margin-bottom: 0; padding-left: 20px;">
              <li>Our cryogenic specialists will review your request</li>
              <li>We'll contact you to discuss your specific needs</li>
              <li>You'll receive a detailed quote for the requested service</li>
            </ul>
          </div>
          
          <p>If you need immediate assistance, please call us at <strong>1-800-MRI-LASO (1-800-674-5276)</strong>. We're available 24/7 for emergencies.</p>
          
          <p>Best regards,<br><strong>The LASO Imaging Team</strong></p>
        </div>
        
        <div style="background: #0c4a6e; padding: 16px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">LASO Imaging Solutions | 8129 Clybourn Ave, Sun Valley, CA 91352</p>
          <p style="color: white; margin: 5px 0 0 0; font-size: 14px;">1-800-MRI-LASO (1-800-674-5276) | info@lasoimaging.com</p>
        </div>
      </body>
      </html>
    `;

    // Send email to LASO team using fetch
    const adminResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LASO Imaging <hello@noreply.lasoimaging.com>",
        to: ["info@lasoimaging.com"],
        subject: `${data.isEmergency ? '🚨 EMERGENCY: ' : ''}${data.serviceType} Quote Request - ${data.manufacturer} ${data.model}`,
        html: adminEmailHtml,
      }),
    });

    if (!adminResponse.ok) {
      const errorText = await adminResponse.text();
      console.error("Failed to send admin email:", errorText);
    }

    // Send confirmation to customer
    const customerResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LASO Imaging <hello@noreply.lasoimaging.com>",
        to: [data.email],
        subject: `Your ${data.serviceType} Quote Request - LASO Imaging`,
        html: customerEmailHtml,
      }),
    });

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      console.error("Failed to send customer confirmation:", errorText);
    }

    console.log("Cryogenic quote notification emails sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-cryogenic-quote-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
