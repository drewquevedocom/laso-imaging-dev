import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-contact-notification function invoked");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactNotificationRequest = await req.json();
    console.log("Received contact notification:", { name: data.name, email: data.email, subject: data.subject });

    const adminEmailHtml = `
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
          .message-box { background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0; white-space: pre-wrap; }
          .footer { padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .cta { display: inline-block; background: #0077b6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">📬 New Contact Form Submission</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">${data.subject} from ${data.name}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">Contact Information</div>
              <div class="field"><span class="field-label">Name:</span> ${data.name}</div>
              <div class="field"><span class="field-label">Email:</span> <a href="mailto:${data.email}">${data.email}</a></div>
              ${data.phone ? `<div class="field"><span class="field-label">Phone:</span> <a href="tel:${data.phone}">${data.phone}</a></div>` : ''}
              ${data.company ? `<div class="field"><span class="field-label">Company:</span> ${data.company}</div>` : ''}
            </div>

            <div class="section">
              <div class="section-title">Subject</div>
              <p style="margin: 0; font-size: 16px;">${data.subject}</p>
            </div>

            <div class="section">
              <div class="section-title">Message</div>
              <div class="message-box">${data.message}</div>
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" class="cta">
                Reply to ${data.name}
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>This notification was sent from the LASO Medical Imaging Contact Page.</p>
            <p>© ${new Date().getFullYear()} LASO Medical Imaging. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

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
        subject: `New Contact: ${data.subject} from ${data.name}`,
        html: adminEmailHtml,
      }),
    });

    const emailResult = await response.json();
    
    if (!response.ok) {
      console.error("Resend API error:", emailResult);
      throw new Error(emailResult.message || "Failed to send email");
    }

    console.log("Contact notification email sent:", emailResult);

    return new Response(JSON.stringify({ success: true, emailId: emailResult.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-notification:", error);
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
