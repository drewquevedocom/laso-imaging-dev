import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HeliumQuoteRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  siteAddress: string;
  city: string;
  state: string;
  customerPO?: string;
  manufacturer: string;
  model: string;
  heliumLevel?: string;
  lastRefillDate?: string;
  heliumTypeLH?: boolean;
  heliumTypeHG?: boolean;
  quantityNeeded?: string;
  dewarSize?: string;
  isEmergency: boolean;
  preferredDate?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: HeliumQuoteRequest = await req.json();
    console.log("Received helium quote request:", data);

    // Build helium type string
    const heliumTypes = [];
    if (data.heliumTypeLH) heliumTypes.push('Liquid Helium (LH)');
    if (data.heliumTypeHG) heliumTypes.push('Helium Gas (HG)');
    const heliumTypeStr = heliumTypes.length > 0 ? heliumTypes.join(', ') : 'Not specified';

    const emergencyBadge = data.isEmergency 
      ? '<span style="background: #dc2626; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;">🚨 EMERGENCY REQUEST</span>' 
      : '';

    // Send notification to admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Helium Fill Quote Request</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%); padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Helium Fill Quote Request</h1>
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
          
          <h2 style="color: #0c4a6e; margin-top: 24px;">Delivery Location</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b;">Site Address:</td><td style="padding: 8px 0; font-weight: 600;">${data.siteAddress}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">City, State:</td><td style="padding: 8px 0;">${data.city}, ${data.state}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Customer PO #:</td><td style="padding: 8px 0;">${data.customerPO || 'N/A'}</td></tr>
          </table>
          
          <h2 style="color: #0c4a6e; margin-top: 24px;">Equipment Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b;">Manufacturer:</td><td style="padding: 8px 0; font-weight: 600;">${data.manufacturer}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Model:</td><td style="padding: 8px 0; font-weight: 600;">${data.model}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Current Helium Level:</td><td style="padding: 8px 0;">${data.heliumLevel ? `${data.heliumLevel}%` : 'Not specified'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Last Refill Date:</td><td style="padding: 8px 0;">${data.lastRefillDate || 'Not specified'}</td></tr>
          </table>
          
          <h2 style="color: #0c4a6e; margin-top: 24px;">Helium Requirements</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b;">Helium Type:</td><td style="padding: 8px 0; font-weight: 600; color: #3b82f6;">${heliumTypeStr}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Quantity Needed:</td><td style="padding: 8px 0;">${data.quantityNeeded || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Dewar Size:</td><td style="padding: 8px 0;">${data.dewarSize || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Preferred Delivery Date:</td><td style="padding: 8px 0;">${data.preferredDate || 'Flexible'}</td></tr>
          </table>
          
          ${data.message ? `
          <h2 style="color: #0c4a6e; margin-top: 24px;">Additional Notes</h2>
          <p style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">${data.message}</p>
          ` : ''}
          
          <div style="margin-top: 30px; padding: 20px; background: #e8f4ff; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #0c4a6e;">📧 Quick Reply</p>
            <p style="margin: 10px 0 0;">
              <a href="mailto:${data.email}?subject=RE: Helium Fill Quote - ${data.manufacturer} ${data.model}" style="color: #0c4a6e;">
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
        <title>Helium Fill Quote Request Received</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%); padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Helium Fill Quote Request Received</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="font-size: 16px; color: #334155;">Dear ${data.name},</p>
          
          <p style="color: #64748b;">Thank you for requesting a helium fill quote from LASO Imaging Solutions. We have received your request for:</p>
          
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 16px 0;">
            <p style="margin: 0; font-weight: 600; color: #0c4a6e;">${data.manufacturer} ${data.model}</p>
            <p style="margin: 8px 0 0 0; color: #64748b;">Delivery to: ${data.city}, ${data.state}</p>
            ${data.heliumLevel ? `<p style="margin: 8px 0 0 0; color: #64748b;">Current Helium Level: ${data.heliumLevel}%</p>` : ''}
            <p style="margin: 8px 0 0 0; color: #3b82f6; font-weight: 500;">Helium Type: ${heliumTypeStr}</p>
            ${data.quantityNeeded ? `<p style="margin: 8px 0 0 0; color: #64748b;">Quantity: ${data.quantityNeeded}</p>` : ''}
            ${data.customerPO ? `<p style="margin: 8px 0 0 0; color: #64748b;">Your PO #: ${data.customerPO}</p>` : ''}
          </div>
          
          <p style="color: #64748b;">Our cryogenics team will review your request and provide a quote within <strong>24 hours</strong>. ${data.isEmergency ? 'Since you marked this as an emergency, we will prioritize your request.' : ''}</p>
          
          <p style="color: #64748b;">If you need immediate assistance, please call us at:</p>
          
          <div style="text-align: center; margin: 24px 0;">
            <a href="tel:18006745276" style="display: inline-block; background: #0284c7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              1-800-MRI-LASO (1-800-674-5276)
            </a>
          </div>
          
          <p style="color: #64748b;">Best regards,<br><strong>The LASO Imaging Cryogenics Team</strong></p>
        </div>
        
        <div style="background: #0c4a6e; padding: 16px; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">8129 Clybourn Ave, Sun Valley, CA 91352</p>
          <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 12px;">© LASO Imaging Solutions. All rights reserved.</p>
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
        subject: `${data.isEmergency ? '🚨 EMERGENCY: ' : ''}Helium Fill Quote Request - ${data.manufacturer} ${data.model} (${data.city}, ${data.state})`,
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
        subject: "Your Helium Fill Quote Request - LASO Imaging",
        html: customerEmailHtml,
      }),
    });

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      console.error("Failed to send customer confirmation:", errorText);
    }

    console.log("Helium quote notification emails sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-helium-quote-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
