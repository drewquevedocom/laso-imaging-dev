import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReviewNotification {
  name: string;
  email: string;
  company?: string;
  rating: number;
  serviceUsed?: string;
  reviewText: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ReviewNotification = await req.json();
    console.log("Received review notification request:", data);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Generate star rating display
    const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Customer Review</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Customer Review</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <!-- Rating -->
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="font-size: 32px; color: #fbbf24;">${stars}</span>
                <p style="margin: 5px 0 0 0; color: #666;">${data.rating} out of 5 stars</p>
              </div>
              
              <!-- Customer Info -->
              <table width="100%" style="margin-bottom: 20px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; width: 120px;">Name:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <a href="mailto:${data.email}" style="color: #1e3a5f;">${data.email}</a>
                  </td>
                </tr>
                ${data.company ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Company:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.company}</td>
                </tr>
                ` : ''}
                ${data.serviceUsed ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Service Used:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.serviceUsed}</td>
                </tr>
                ` : ''}
              </table>
              
              <!-- Review Text -->
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1e3a5f;">
                <p style="margin: 0; font-style: italic; color: #333; line-height: 1.6;">"${data.reviewText}"</p>
              </div>
              
              <!-- Action Note -->
              <p style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-radius: 4px; color: #856404; font-size: 14px;">
                <strong>Action Required:</strong> Log in to the admin dashboard to approve this review for display on the website.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                LASO Imaging Solutions<br>
                This is an automated notification from your website.
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

    console.log("Sending review notification email...");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LASO Imaging <hello@noreply.lasoimaging.com>",
        to: ["info@lasoimaging.com"],
        subject: `New ${data.rating}-Star Review from ${data.name}`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Resend API response:", emailResult);

    if (!emailResponse.ok) {
      throw new Error(`Failed to send email: ${JSON.stringify(emailResult)}`);
    }

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-review-notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
