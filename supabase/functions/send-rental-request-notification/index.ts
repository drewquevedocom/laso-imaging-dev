import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RentalRequestData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  equipment_type: string;
  specific_model?: string;
  rental_duration: string;
  start_date: string;
  delivery_address: string;
  facility_type?: string;
  notes?: string;
  email_opt_in?: boolean;
  sms_opt_in?: boolean;
}

async function sendEmail(to: string[], subject: string, html: string): Promise<any> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "LASO Imaging <rentals@lasoimaging.com>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return response.json();
}

async function sendSMS(to: string, message: string): Promise<void> {
  const telnyxApiKey = Deno.env.get("TELNYX_API_KEY");
  const telnyxPhoneNumber = Deno.env.get("TELNYX_PHONE_NUMBER");

  if (!telnyxApiKey || !telnyxPhoneNumber) {
    console.log("Telnyx credentials not configured, skipping SMS");
    return;
  }

  // Format phone number to E.164
  let formattedPhone = to.replace(/\D/g, "");
  if (formattedPhone.length === 10) {
    formattedPhone = `+1${formattedPhone}`;
  } else if (!formattedPhone.startsWith("+")) {
    formattedPhone = `+${formattedPhone}`;
  }

  try {
    const response = await fetch("https://api.telnyx.com/v2/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${telnyxApiKey}`,
      },
      body: JSON.stringify({
        from: telnyxPhoneNumber,
        to: formattedPhone,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telnyx SMS error:", errorData);
    } else {
      console.log("SMS sent successfully to:", formattedPhone);
    }
  } catch (error) {
    console.error("Failed to send SMS:", error);
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: RentalRequestData = await req.json();
    console.log("Processing rental request notification for:", data.email);

    const formattedDate = data.start_date 
      ? new Date(data.start_date).toLocaleDateString("en-US", { 
          weekday: "long", 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        })
      : "Not specified";

    // Send customer confirmation email
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">LASO Imaging Solutions</h1>
          <p style="color: #b8d4e8; margin: 10px 0 0 0;">Equipment Rental Services</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; border-top: none;">
          <h2 style="color: #1e3a5f; margin-top: 0;">Thank You for Your Rental Request!</h2>
          
          <p>Dear ${data.name},</p>
          
          <p>We've received your equipment rental inquiry and our team is reviewing it now. Here's a summary of your request:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5a87; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>📋 Equipment:</strong> ${data.equipment_type}${data.specific_model ? ` - ${data.specific_model}` : ""}</p>
            <p style="margin: 8px 0;"><strong>📅 Start Date:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong>⏱️ Duration:</strong> ${data.rental_duration}</p>
            <p style="margin: 8px 0;"><strong>📍 Delivery Location:</strong> ${data.delivery_address}</p>
            ${data.facility_type ? `<p style="margin: 8px 0;"><strong>🏥 Facility Type:</strong> ${data.facility_type}</p>` : ""}
            ${data.company ? `<p style="margin: 8px 0;"><strong>🏢 Company:</strong> ${data.company}</p>` : ""}
          </div>
          
          <h3 style="color: #1e3a5f;">What Happens Next?</h3>
          <ol style="padding-left: 20px;">
            <li style="margin-bottom: 10px;">Our rental team reviews your request for equipment availability</li>
            <li style="margin-bottom: 10px;">We prepare a detailed quote with pricing and terms</li>
            <li style="margin-bottom: 10px;">You'll receive a response within <strong>4 business hours</strong></li>
          </ol>
          
          <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;"><strong>Need immediate assistance?</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">📞 Call: 1-800-MRI-LASO | ✉️ Email: rentals@lasoimaging.com</p>
          </div>
        </div>
        
        <div style="background: #1e3a5f; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #b8d4e8; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} LASO Imaging Solutions. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const customerEmailResponse = await sendEmail(
      [data.email],
      "We've Received Your Rental Request - LASO Imaging",
      customerEmailHtml
    );
    console.log("Customer email sent:", customerEmailResponse);

    // Send SMS confirmation if opted in and phone provided
    if (data.sms_opt_in && data.phone) {
      const smsMessage = `LASO Imaging: Thanks for your rental request for ${data.equipment_type}! We'll contact you within 4 hours with availability & pricing. Questions? Call 1-800-MRI-LASO`;
      await sendSMS(data.phone, smsMessage);
    }

    // Send admin notification email
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #dc3545; padding: 15px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0;">🔔 New Rental Request</h2>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 8px 8px;">
          <h3 style="color: #1e3a5f; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          ${data.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>` : ""}
          ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
          
          <h3 style="color: #1e3a5f;">Rental Details</h3>
          <p><strong>Equipment:</strong> ${data.equipment_type}${data.specific_model ? ` - ${data.specific_model}` : ""}</p>
          <p><strong>Start Date:</strong> ${formattedDate}</p>
          <p><strong>Duration:</strong> ${data.rental_duration}</p>
          <p><strong>Delivery Address:</strong> ${data.delivery_address}</p>
          ${data.facility_type ? `<p><strong>Facility Type:</strong> ${data.facility_type}</p>` : ""}
          
          ${data.notes ? `<h3 style="color: #1e3a5f;">Additional Notes</h3><p>${data.notes}</p>` : ""}
          
          <h3 style="color: #1e3a5f;">Communication Preferences</h3>
          <p>📧 Email Opt-in: ${data.email_opt_in ? "✅ Yes" : "❌ No"}</p>
          <p>📱 SMS Opt-in: ${data.sms_opt_in ? "✅ Yes" : "❌ No"}</p>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 12px;">Submitted: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminEmailResponse = await sendEmail(
      ["sales@lasoimaging.com"],
      `🆕 New Rental Request: ${data.equipment_type} - ${data.name}`,
      adminEmailHtml
    );
    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmailId: customerEmailResponse.id,
        adminEmailId: adminEmailResponse.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-rental-request-notification:", error);
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
