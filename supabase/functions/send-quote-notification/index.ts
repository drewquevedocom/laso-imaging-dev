import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  equipmentType: string;
  specificModel?: string;
  facilityType?: string;
  patientVolume?: string;
  timeline?: string;
  budget?: string;
  additionalRequirements?: string;
  sourcePage: string;
  leadScore?: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-quote-notification function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: QuoteNotificationRequest = await req.json();
    console.log("Received quote notification request:", { name: data.name, email: data.email, equipment: data.equipmentType });

    // Format the email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0077b6 0%, #00a8e8 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; }
          .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #0077b6; }
          .section-title { font-weight: bold; color: #0077b6; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
          .field { margin: 8px 0; }
          .field-label { font-weight: 600; color: #555; }
          .field-value { color: #333; }
          .footer { padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .cta { display: inline-block; background: #0077b6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">🏥 New Quote Request</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">${data.equipmentType} from ${data.name}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">Contact Information</div>
              <div class="field"><span class="field-label">Name:</span> <span class="field-value">${data.name}</span></div>
              <div class="field"><span class="field-label">Email:</span> <span class="field-value"><a href="mailto:${data.email}">${data.email}</a></span></div>
              ${data.phone ? `<div class="field"><span class="field-label">Phone:</span> <span class="field-value"><a href="tel:${data.phone}">${data.phone}</a></span></div>` : ''}
              ${data.company ? `<div class="field"><span class="field-label">Company:</span> <span class="field-value">${data.company}</span></div>` : ''}
              ${data.role ? `<div class="field"><span class="field-label">Role:</span> <span class="field-value">${data.role}</span></div>` : ''}
            </div>

            <div class="section">
              <div class="section-title">Equipment Request</div>
              <div class="field"><span class="field-label">Equipment Type:</span> <span class="field-value">${data.equipmentType}</span></div>
              ${data.specificModel ? `<div class="field"><span class="field-label">Specific Model:</span> <span class="field-value">${data.specificModel}</span></div>` : ''}
            </div>

            ${data.facilityType || data.patientVolume || data.timeline || data.budget ? `
            <div class="section">
              <div class="section-title">Facility Details</div>
              ${data.facilityType ? `<div class="field"><span class="field-label">Facility Type:</span> <span class="field-value">${data.facilityType}</span></div>` : ''}
              ${data.patientVolume ? `<div class="field"><span class="field-label">Patient Volume:</span> <span class="field-value">${data.patientVolume}</span></div>` : ''}
              ${data.timeline ? `<div class="field"><span class="field-label">Timeline:</span> <span class="field-value">${data.timeline}</span></div>` : ''}
              ${data.budget ? `<div class="field"><span class="field-label">Budget Range:</span> <span class="field-value">${data.budget}</span></div>` : ''}
            </div>
            ` : ''}

            ${data.additionalRequirements ? `
            <div class="section">
              <div class="section-title">Additional Requirements</div>
              <p style="margin: 0; white-space: pre-wrap;">${data.additionalRequirements}</p>
            </div>
            ` : ''}

            <div class="section" style="background: #e8f4f8; border-left-color: #00a8e8;">
              <div class="section-title">Lead Details</div>
              <div class="field"><span class="field-label">Source:</span> <span class="field-value">${data.sourcePage}</span></div>
              ${data.leadScore ? `<div class="field"><span class="field-label">Lead Score:</span> <span class="field-value">${data.leadScore} points</span></div>` : ''}
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <a href="mailto:${data.email}?subject=Re: Your Quote Request for ${encodeURIComponent(data.equipmentType)}" class="cta">
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

    // Send email using Resend API directly
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
        subject: `New Quote Request: ${data.equipmentType} from ${data.name}`,
        html: emailHtml,
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
          .highlight { background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; background: #f1f1f1; border-radius: 0 0 8px 8px; }
          .step { display: flex; align-items: flex-start; margin: 10px 0; }
          .step-icon { width: 24px; height: 24px; background: #0077b6; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Thank You!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">We've received your quote request</p>
          </div>
          
          <div class="content">
            <p style="font-size: 16px;">Dear ${data.name},</p>
            
            <p>Thank you for your interest in LASO Imaging. Our team has received your quote request and is already reviewing your requirements.</p>
            
            <div class="highlight">
              <h3 style="margin: 0 0 15px 0; color: #0077b6;">Your Request Summary</h3>
              <p style="margin: 5px 0;"><strong>Equipment:</strong> ${data.equipmentType}</p>
              ${data.specificModel ? `<p style="margin: 5px 0;"><strong>Model:</strong> ${data.specificModel}</p>` : ''}
              ${data.facilityType ? `<p style="margin: 5px 0;"><strong>Facility:</strong> ${data.facilityType}</p>` : ''}
              ${data.timeline ? `<p style="margin: 5px 0;"><strong>Timeline:</strong> ${data.timeline}</p>` : ''}
              ${data.budget ? `<p style="margin: 5px 0;"><strong>Budget:</strong> ${data.budget}</p>` : ''}
            </div>

            <div class="section">
              <h3 style="margin: 0 0 15px 0;">What Happens Next?</h3>
              <div class="step">
                <span class="step-icon">1</span>
                <span>Our specialists will review your requirements</span>
              </div>
              <div class="step">
                <span class="step-icon">2</span>
                <span>You'll receive a detailed quote within 24 hours</span>
              </div>
              <div class="step">
                <span class="step-icon">3</span>
                <span>We'll include financing options if applicable</span>
              </div>
            </div>

            <p><strong>Need immediate assistance?</strong></p>
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
        subject: `Thank You for Your Quote Request - LASO Imaging`,
        html: customerEmailHtml,
      }),
    });

    const customerResult = await customerEmailResponse.json();
    
    if (!customerEmailResponse.ok) {
      console.error("Customer confirmation email error:", customerResult);
    } else {
      console.log("Customer confirmation email sent:", customerResult);
    }

    return new Response(JSON.stringify({ success: true, adminEmailId: emailResult.id, customerEmailId: customerResult.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-quote-notification function:", error);
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
