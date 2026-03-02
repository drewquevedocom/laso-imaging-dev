import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ServiceRequestNotificationPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType: string;
  equipmentType: string;
  manufacturer?: string;
  model?: string;
  urgency: "normal" | "urgent" | "emergency";
  preferredDate?: string;
  issueDescription: string;
  sourcePage: string;
  smsOptIn?: boolean;
  leadId?: string;
}

const getUrgencyStyles = (urgency: string) => {
  switch (urgency) {
    case "emergency":
      return {
        bannerColor: "#dc2626",
        bannerBg: "#fef2f2",
        label: "🚨 EMERGENCY",
        responseTime: "Same day / ASAP response required",
        subjectPrefix: "🚨 EMERGENCY: ",
      };
    case "urgent":
      return {
        bannerColor: "#d97706",
        bannerBg: "#fffbeb",
        label: "⚠️ URGENT",
        responseTime: "Response within 24-48 hours",
        subjectPrefix: "⚠️ URGENT: ",
      };
    default:
      return {
        bannerColor: "#059669",
        bannerBg: "#ecfdf5",
        label: "Normal Priority",
        responseTime: "Response within 5-7 business days",
        subjectPrefix: "",
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const payload: ServiceRequestNotificationPayload = await req.json();
    const {
      name,
      email,
      phone,
      company,
      serviceType,
      equipmentType,
      manufacturer,
      model,
      urgency,
      preferredDate,
      issueDescription,
      sourcePage,
      smsOptIn,
      leadId,
    } = payload;

    const urgencyStyles = getUrgencyStyles(urgency);

    // Build admin notification email
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Service Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Urgency Banner -->
          <tr>
            <td style="background-color: ${urgencyStyles.bannerBg}; padding: 16px 24px; border-bottom: 3px solid ${urgencyStyles.bannerColor}; border-radius: 8px 8px 0 0;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td>
                    <span style="color: ${urgencyStyles.bannerColor}; font-size: 18px; font-weight: bold;">${urgencyStyles.label}</span>
                    <br>
                    <span style="color: #6b7280; font-size: 12px;">${urgencyStyles.responseTime}</span>
                  </td>
                  <td align="right">
                    <span style="background-color: ${urgencyStyles.bannerColor}; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600;">
                      ${serviceType}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 24px 24px 0;">
              <h1 style="margin: 0; font-size: 24px; color: #111827;">New Service Request</h1>
              <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">Received from ${sourcePage}</p>
            </td>
          </tr>

          <!-- Customer Information -->
          <tr>
            <td style="padding: 24px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 6px;">
                <tr>
                  <td style="padding: 16px;">
                    <h3 style="margin: 0 0 12px; font-size: 14px; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">Customer Information</h3>
                    <p style="margin: 0 0 8px; color: #111827;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 0 0 8px; color: #111827;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
                    ${phone ? `<p style="margin: 0 0 8px; color: #111827;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #2563eb;">${phone}</a></p>` : ""}
                    ${company ? `<p style="margin: 0; color: #111827;"><strong>Company:</strong> ${company}</p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Equipment Details -->
          <tr>
            <td style="padding: 0 24px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eff6ff; border-radius: 6px;">
                <tr>
                  <td style="padding: 16px;">
                    <h3 style="margin: 0 0 12px; font-size: 14px; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">Equipment Details</h3>
                    <p style="margin: 0 0 8px; color: #111827;"><strong>Type:</strong> ${equipmentType}</p>
                    ${manufacturer ? `<p style="margin: 0 0 8px; color: #111827;"><strong>Manufacturer:</strong> ${manufacturer}</p>` : ""}
                    ${model ? `<p style="margin: 0 0 8px; color: #111827;"><strong>Model:</strong> ${model}</p>` : ""}
                    ${preferredDate ? `<p style="margin: 0; color: #111827;"><strong>Preferred Date:</strong> ${preferredDate}</p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Issue Description -->
          <tr>
            <td style="padding: 24px;">
              <h3 style="margin: 0 0 12px; font-size: 14px; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">Issue / Service Needs</h3>
              <div style="background-color: #fafafa; padding: 16px; border-radius: 6px; border-left: 4px solid ${urgencyStyles.bannerColor};">
                <p style="margin: 0; color: #374151; white-space: pre-wrap; line-height: 1.6;">${issueDescription}</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                This service request was submitted via LASO Imaging<br>
                <a href="https://laso-ver1.lovable.app/admin/dashboard" style="color: #2563eb;">View in Admin Dashboard</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Build customer confirmation email
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Request Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 24px; text-align: center; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; color: #ffffff;">Service Request Received</h1>
              <p style="margin: 8px 0 0; color: #bfdbfe; font-size: 14px;">Thank you for contacting LASO Imaging</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 24px 16px;">
              <p style="margin: 0; font-size: 16px; color: #374151;">Dear ${name},</p>
              <p style="margin: 16px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                We have received your ${serviceType.toLowerCase()} service request for your <strong>${equipmentType}</strong>${manufacturer ? ` (${manufacturer}${model ? ` ${model}` : ""})` : ""}.
              </p>
            </td>
          </tr>

          <!-- Priority Status -->
          <tr>
            <td style="padding: 0 24px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${urgencyStyles.bannerBg}; border-radius: 6px; border: 1px solid ${urgencyStyles.bannerColor}20;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 4px; color: ${urgencyStyles.bannerColor}; font-weight: 600; font-size: 14px;">${urgencyStyles.label}</p>
                    <p style="margin: 0; color: #6b7280; font-size: 13px;">${urgencyStyles.responseTime}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding: 24px;">
              <h3 style="margin: 0 0 16px; font-size: 16px; color: #111827;">What happens next?</h3>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; width: 32px;">
                    <div style="width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: bold;">1</div>
                  </td>
                  <td style="padding: 8px 0 8px 12px; color: #374151; font-size: 14px;">Our service team will review your request</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; width: 32px;">
                    <div style="width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: bold;">2</div>
                  </td>
                  <td style="padding: 8px 0 8px 12px; color: #374151; font-size: 14px;">A specialist will contact you to discuss details</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; width: 32px;">
                    <div style="width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 12px; font-weight: bold;">3</div>
                  </td>
                  <td style="padding: 8px 0 8px 12px; color: #374151; font-size: 14px;">We'll schedule service at your convenience</td>
                </tr>
              </table>
            </td>
          </tr>

          ${urgency === "emergency" ? `
          <!-- Emergency Hotline -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef2f2; border-radius: 6px; border: 2px solid #dc2626;">
                <tr>
                  <td style="padding: 16px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #dc2626; font-weight: 600; font-size: 14px;">Need Immediate Assistance?</p>
                    <p style="margin: 0; color: #374151; font-size: 20px; font-weight: bold;">
                      <a href="tel:18445115276" style="color: #dc2626; text-decoration: none;">(844) 511-5276</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ""}

          <!-- Request Summary -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 6px;">
                <tr>
                  <td style="padding: 16px;">
                    <h4 style="margin: 0 0 12px; font-size: 13px; color: #6b7280; text-transform: uppercase;">Your Request Summary</h4>
                    <p style="margin: 0 0 4px; color: #374151; font-size: 13px;"><strong>Service:</strong> ${serviceType}</p>
                    <p style="margin: 0 0 4px; color: #374151; font-size: 13px;"><strong>Equipment:</strong> ${equipmentType}</p>
                    ${preferredDate ? `<p style="margin: 0; color: #374151; font-size: 13px;"><strong>Preferred Date:</strong> ${preferredDate}</p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; background-color: #1e3a5f; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 8px; color: #ffffff; font-weight: 600;">LASO Imaging</p>
              <p style="margin: 0; color: #93c5fd; font-size: 12px;">Medical Imaging Equipment & Service Experts</p>
              <p style="margin: 16px 0 0; color: #64748b; font-size: 11px;">
                This email was sent because you submitted a service request.<br>
                © ${new Date().getFullYear()} LASO Imaging. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Send admin notification email
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LASO Service <service@updates.lasoimaging.com>",
        to: ["info@lasoimaging.com"],
        subject: `${urgencyStyles.subjectPrefix}Service Request: ${serviceType} - ${equipmentType}`,
        html: adminEmailHtml,
      }),
    });

    if (!adminEmailRes.ok) {
      const errorText = await adminEmailRes.text();
      console.error("Admin email failed:", errorText);
      throw new Error(`Failed to send admin notification: ${errorText}`);
    }

    const adminEmailData = await adminEmailRes.json();
    console.log("Admin email sent:", adminEmailData.id);

    // Send customer confirmation email
    const customerEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LASO Imaging <service@updates.lasoimaging.com>",
        to: [email],
        subject: "Your Service Request Has Been Received",
        html: customerEmailHtml,
      }),
    });

    if (!customerEmailRes.ok) {
      console.error("Customer email failed:", await customerEmailRes.text());
      // Don't throw - admin email was sent, log the failure but continue
    }

    const customerEmailData = customerEmailRes.ok ? await customerEmailRes.json() : null;
    console.log("Customer email sent:", customerEmailData?.id);

    // Send SMS for emergency requests if opted in and phone provided
    if (urgency === "emergency" && smsOptIn && phone && leadId) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase.functions.invoke("send-sms", {
          body: {
            to: phone,
            message: `LASO Service: We received your EMERGENCY request for ${equipmentType}. Our team is being notified immediately. Call (844) 511-5276 for faster response.`,
            leadId,
          },
        });
        console.log("Emergency SMS sent to:", phone);
      } catch (smsError) {
        console.error("SMS notification failed:", smsError);
        // Don't throw - emails were sent, SMS is supplementary
      }
    }

    // Log activity if leadId provided
    if (leadId) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase.from("activities").insert({
          lead_id: leadId,
          activity_type: "email",
          content: `Service request notifications sent (${urgency.toUpperCase()})`,
          direction: "outbound",
          subject: `${serviceType} - ${equipmentType}`,
          metadata: {
            admin_email_id: adminEmailData.id,
            customer_email_id: customerEmailData?.id,
            urgency,
            equipment: equipmentType,
          },
        });
        console.log("Activity logged for lead:", leadId);
      } catch (activityError) {
        console.error("Activity logging failed:", activityError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        adminEmailId: adminEmailData.id,
        customerEmailId: customerEmailData?.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-service-request-notification:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
