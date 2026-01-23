import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SellEquipmentRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  equipment_type: string;
  manufacturer?: string;
  model?: string;
  year_manufactured?: string;
  condition?: string;
  software_version?: string;
  location?: string;
  reason_for_selling?: string;
  timeline?: string;
  has_service_history?: boolean;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: SellEquipmentRequest = await req.json();

    // Build equipment details HTML
    const equipmentDetails = `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Equipment Type</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.equipment_type}</td>
        </tr>
        ${data.manufacturer ? `
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Manufacturer</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.manufacturer}</td>
        </tr>
        ` : ''}
        ${data.model ? `
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Model</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.model}</td>
        </tr>
        ` : ''}
        ${data.year_manufactured ? `
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Year Manufactured</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.year_manufactured}</td>
        </tr>
        ` : ''}
        ${data.condition ? `
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Condition</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.condition}</td>
        </tr>
        ` : ''}
        ${data.software_version ? `
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Software Version</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.software_version}</td>
        </tr>
        ` : ''}
        ${data.location ? `
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Location</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.location}</td>
        </tr>
        ` : ''}
        ${data.reason_for_selling ? `
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Reason for Selling</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.reason_for_selling}</td>
        </tr>
        ` : ''}
        ${data.timeline ? `
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Timeline</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.timeline}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Service History Available</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">${data.has_service_history ? 'Yes' : 'No'}</td>
        </tr>
      </table>
    `;

    // Send notification to LASO team
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Equipment Sell Request</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0052A5 0%, #003d7a 100%); padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🔔 New Equipment Sell Request</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #0052A5; margin-top: 0;">Contact Information</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ''}
          ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
          
          <h2 style="color: #0052A5; margin-top: 30px;">Equipment Details</h2>
          ${equipmentDetails}
          
          ${data.message ? `
          <h2 style="color: #0052A5; margin-top: 30px;">Additional Notes</h2>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #0052A5;">
            ${data.message}
          </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding: 20px; background: #e8f4ff; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #0052A5;">📧 Quick Reply</p>
            <p style="margin: 10px 0 0;">
              <a href="mailto:${data.email}?subject=RE: Your Equipment Sell Request - ${data.equipment_type}" style="color: #0052A5;">
                Click here to reply to ${data.name}
              </a>
            </p>
          </div>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
          This is an automated notification from LASO Imaging Solutions website.
        </p>
      </body>
      </html>
    `;

    // Send confirmation to seller
    const sellerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Equipment Sell Request Received</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0052A5 0%, #003d7a 100%); padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Thank You, ${data.name}!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <p>We've received your equipment sell request and our team is reviewing the details.</p>
          
          <h2 style="color: #0052A5;">What Happens Next?</h2>
          <ol>
            <li>Our equipment specialists will review your submission</li>
            <li>We'll research current market values for your ${data.equipment_type}</li>
            <li>You'll receive a preliminary evaluation within 24-48 hours</li>
            <li>If we're a good fit, we'll schedule a detailed assessment</li>
          </ol>
          
          <h2 style="color: #0052A5; margin-top: 30px;">Your Submission Summary</h2>
          ${equipmentDetails}
          
          <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 10px; font-weight: bold;">Have questions?</p>
            <p style="margin: 0;">
              Call us at <a href="tel:1-800-674-5276" style="color: #0052A5; font-weight: bold;">1-800-MRI-LASO</a><br>
              or email <a href="mailto:info@lasoimaging.com" style="color: #0052A5;">info@lasoimaging.com</a>
            </p>
          </div>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
          © ${new Date().getFullYear()} LASO Imaging Solutions. All rights reserved.<br>
          Mailing Address: 14900 Magnolia Blvd #56323, Sherman Oaks, CA 91413
        </p>
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
        subject: `🔔 New Equipment Sell Request: ${data.equipment_type} from ${data.name}`,
        html: adminEmailHtml,
      }),
    });

    if (!adminResponse.ok) {
      const errorText = await adminResponse.text();
      console.error("Failed to send admin email:", errorText);
    }

    // Send confirmation to seller
    const sellerResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LASO Imaging <hello@noreply.lasoimaging.com>",
        to: [data.email],
        subject: "We've Received Your Equipment Sell Request - LASO Imaging",
        html: sellerEmailHtml,
      }),
    });

    if (!sellerResponse.ok) {
      const errorText = await sellerResponse.text();
      console.error("Failed to send seller confirmation:", errorText);
    }

    console.log("Sell notification emails sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-sell-notification function:", error);
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
