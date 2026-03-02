import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyOrderRequest {
  orderId: string;
  newStatus: string;
  trackingNumber?: string;
  notes?: string;
}

interface NotificationConfig {
  type: string;
  title: string;
  body: string;
  emailSubject: string;
  emailBody: string;
}

const getNotificationConfig = (
  status: string,
  orderNumber: string,
  trackingNumber?: string
): NotificationConfig => {
  switch (status) {
    case "confirmed":
      return {
        type: "order_confirmed",
        title: "Order Confirmed",
        body: `Your order ${orderNumber} has been confirmed and is being prepared for shipment.`,
        emailSubject: `Order Confirmed - ${orderNumber}`,
        emailBody: `Great news! Your order ${orderNumber} has been confirmed and our team is preparing it for shipment. We'll notify you once it's on the way.`,
      };
    case "in_transit":
      return {
        type: "order_shipped",
        title: "Order Shipped",
        body: `Your order ${orderNumber} is on its way!${trackingNumber ? ` Tracking: ${trackingNumber}` : ""}`,
        emailSubject: `Your Order Has Shipped - ${orderNumber}`,
        emailBody: `Your order ${orderNumber} has been shipped and is on its way to you.${trackingNumber ? ` You can track your shipment using tracking number: ${trackingNumber}` : ""} We'll let you know when it arrives.`,
      };
    case "delivered":
      return {
        type: "order_delivered",
        title: "Order Delivered",
        body: `Your order ${orderNumber} has been delivered. Thank you for your business!`,
        emailSubject: `Order Delivered - ${orderNumber}`,
        emailBody: `Your order ${orderNumber} has been successfully delivered. Thank you for choosing LASO Imaging Solutions! If you have any questions about your equipment, please don't hesitate to reach out.`,
      };
    case "installed":
      return {
        type: "order_installed",
        title: "Installation Complete",
        body: `Your equipment from order ${orderNumber} has been installed and is ready to use!`,
        emailSubject: `Installation Complete - ${orderNumber}`,
        emailBody: `Congratulations! The equipment from your order ${orderNumber} has been successfully installed and is ready for use. Our team has completed all necessary configurations and testing.`,
      };
    default:
      return {
        type: "order_update",
        title: "Order Update",
        body: `Your order ${orderNumber} status has been updated to: ${status}`,
        emailSubject: `Order Update - ${orderNumber}`,
        emailBody: `Your order ${orderNumber} has been updated. Current status: ${status}`,
      };
  }
};

const generateEmailHtml = (
  config: NotificationConfig,
  orderNumber: string,
  customerName: string,
  trackingNumber?: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #1f2937; line-height: 1.6; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">LASO Imaging Solutions</h1>
            <p style="color: #bfdbfe; margin: 8px 0 0 0;">Order Update</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <div style="background: #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
              <h2 style="color: #1e40af; margin: 0; font-size: 24px;">${config.title}</h2>
              <p style="color: #6b7280; margin: 4px 0 0 0;">Order: ${orderNumber}</p>
            </div>

            <p style="margin-bottom: 16px;">Dear ${customerName},</p>
            <p style="margin-bottom: 24px;">${config.emailBody}</p>

            ${trackingNumber ? `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="margin: 0; color: #166534; font-size: 14px;">
                <strong>Tracking Number:</strong> ${trackingNumber}
              </p>
            </div>
            ` : ""}

            <div style="text-align: center; margin-top: 24px;">
              <a href="https://laso-ver1.lovable.app/portal/orders" 
                 style="display: inline-block; background: #1e40af; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                View Order Details
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #1f2937; padding: 24px; text-align: center;">
            <p style="color: #9ca3af; margin: 0 0 8px 0;">LASO Imaging Solutions</p>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">info@lasoimaging.com | (844) 511-5276</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { orderId, newStatus, trackingNumber, notes }: NotifyOrderRequest = await req.json();

    if (!orderId || !newStatus) {
      return new Response(
        JSON.stringify({ error: "Order ID and new status are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing order notification for order ${orderId}, status: ${newStatus}`);

    // Fetch order with customer info
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select(`
        *,
        customer_profiles!orders_customer_id_fkey (
          id,
          user_id,
          contact_name,
          company_name
        )
      `)
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      console.error("Order not found:", fetchError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get customer email from auth.users via the customer profile
    let customerEmail = null;
    if (order.customer_profiles?.user_id) {
      const { data: authUser } = await supabase.auth.admin.getUserById(order.customer_profiles.user_id);
      customerEmail = authUser?.user?.email;
    }

    const customerName = order.customer_profiles?.contact_name || "Valued Customer";
    const customerId = order.customer_profiles?.id;

    // Get notification configuration
    const notifConfig = getNotificationConfig(newStatus, order.order_number, trackingNumber);

    // Update order status and tracking number
    const updateData: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }
    if (notes) {
      updateData.notes = notes;
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (updateError) {
      console.error("Failed to update order:", updateError);
    }

    // Create customer notification if customer exists
    if (customerId) {
      const { error: notifError } = await supabase.from("customer_notifications").insert({
        customer_id: customerId,
        type: notifConfig.type,
        title: notifConfig.title,
        body: notifConfig.body,
        data: {
          order_id: orderId,
          order_number: order.order_number,
          status: newStatus,
          tracking_number: trackingNumber,
        },
      });

      if (notifError) {
        console.error("Failed to create notification:", notifError);
      } else {
        console.log("Customer notification created successfully");
      }
    }

    // Send email notification if we have customer email
    if (customerEmail) {
      try {
        const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
        const emailHtml = generateEmailHtml(notifConfig, order.order_number, customerName, trackingNumber);

        await resend.emails.send({
          from: "LASO Imaging Solutions <hello@noreply.lasoimaging.com>",
          to: [customerEmail],
          subject: notifConfig.emailSubject,
          html: emailHtml,
        });

        console.log("Email notification sent to:", customerEmail);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the whole request if email fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order notification sent successfully",
        notification: notifConfig,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in send-order-notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
