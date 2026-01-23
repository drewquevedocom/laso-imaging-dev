import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SiteVisitConfirmationRequest {
  siteVisitId: string;
  recipientEmail: string;
  recipientName: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: string;
  location: string;
}

const generateConfirmationEmail = (data: SiteVisitConfirmationRequest): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Site Visit Confirmed</h1>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
        Dear ${data.recipientName},
      </p>
      
      <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
        This email confirms your scheduled site visit for equipment inspection.
      </p>
      
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">📅 Visit Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date:</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.scheduledDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time:</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.scheduledTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Duration:</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.duration} hours</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location:</td>
            <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.location || 'To be confirmed'}</td>
          </tr>
        </table>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">🔍 What to Expect</h3>
        <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0;">Our team will:</p>
        <ul style="color: #374151; font-size: 14px; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 5px;">Conduct a thorough visual inspection</li>
          <li style="margin-bottom: 5px;">Review system functionality and performance</li>
          <li style="margin-bottom: 5px;">Document current condition with photos/video</li>
          <li style="margin-bottom: 5px;">Assess logistics for removal and transportation</li>
        </ul>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">📋 Please Have Ready</h3>
        <ul style="color: #374151; font-size: 14px; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 5px;">Service history and maintenance records</li>
          <li style="margin-bottom: 5px;">Access to the equipment room</li>
          <li style="margin-bottom: 5px;">Any relevant documentation (manuals, certificates)</li>
          <li style="margin-bottom: 5px;">Site contact available during the visit</li>
        </ul>
      </div>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: #92400e; font-size: 14px; margin: 0;">
          <strong>Need to reschedule?</strong> Reply to this email at least 24 hours before the scheduled visit.
        </p>
      </div>
      
      <p style="color: #374151; font-size: 16px; margin-bottom: 10px;">
        Best regards,<br/>
        <strong>LASO Imaging Acquisitions Team</strong>
      </p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      
      <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
        LASO Imaging Solutions<br/>
        Mailing Address: 14900 Magnolia Blvd #56323<br/>
        Sherman Oaks, CA 91413<br/>
        <a href="mailto:acquisitions@lasoimaging.com" style="color: #3b82f6;">acquisitions@lasoimaging.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const data: SiteVisitConfirmationRequest = await req.json();
    console.log("Sending site visit confirmation to:", data.recipientEmail);

    const emailHtml = generateConfirmationEmail(data);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LASO Imaging <noreply@lasoimaging.com>",
        to: [data.recipientEmail],
        subject: `Site Visit Confirmed - ${data.scheduledDate}`,
        html: emailHtml,
      }),
    });

    const resendData = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", resendData);
      throw new Error(resendData.message || "Failed to send email");
    }

    console.log("Site visit confirmation sent successfully:", resendData.id);

    return new Response(
      JSON.stringify({ success: true, emailId: resendData.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending site visit confirmation:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
