import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// SMS sending via Telnyx
async function sendSMS(to: string, message: string): Promise<boolean> {
  const TELNYX_API_KEY = Deno.env.get("TELNYX_API_KEY");
  const TELNYX_PHONE_NUMBER = Deno.env.get("TELNYX_PHONE_NUMBER");

  if (!TELNYX_API_KEY || !TELNYX_PHONE_NUMBER || !to) {
    console.log("SMS not sent - missing API key, phone number, or recipient");
    return false;
  }

  try {
    // Format phone number to E.164
    let formattedTo = to.replace(/\D/g, "");
    if (!formattedTo.startsWith("1") && formattedTo.length === 10) {
      formattedTo = "1" + formattedTo;
    }
    formattedTo = "+" + formattedTo;

    console.log(`Sending SMS to ${formattedTo}`);

    const response = await fetch("https://api.telnyx.com/v2/messages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TELNYX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: TELNYX_PHONE_NUMBER,
        to: formattedTo,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telnyx API error:", errorData);
      return false;
    }

    console.log(`SMS sent successfully to ${formattedTo}`);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting rental reminder check...");

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate pickup reminder date (3 days from now)
    const pickupDate = new Date(today);
    pickupDate.setDate(pickupDate.getDate() + 3);
    const pickupDateStr = pickupDate.toISOString().split('T')[0];
    console.log(`Looking for pickup reminders for date: ${pickupDateStr}`);

    // Calculate return reminder date (1 day from now)
    const returnDate = new Date(today);
    returnDate.setDate(returnDate.getDate() + 1);
    const returnDateStr = returnDate.toISOString().split('T')[0];
    console.log(`Looking for return reminders for date: ${returnDateStr}`);

    // Fetch rentals needing pickup reminder
    const { data: pickupRentals, error: pickupError } = await supabase
      .from("equipment_rentals")
      .select(`
        id, customer_name, customer_email, customer_phone, 
        start_date, end_date, delivery_address, total_amount,
        inventory:inventory_id(product_name, oem, modality)
      `)
      .eq("start_date", pickupDateStr)
      .eq("pickup_reminder_sent", false)
      .in("status", ["pending", "confirmed"]);

    if (pickupError) {
      console.error("Error fetching pickup rentals:", pickupError);
    }

    console.log(`Found ${pickupRentals?.length || 0} rentals needing pickup reminder`);

    let pickupEmailsSent = 0;
    let pickupSMSSent = 0;
    
    for (const rental of pickupRentals || []) {
      try {
        const invArray = rental.inventory as unknown as Array<{ product_name: string; oem: string; modality: string }> | null;
        const inv = invArray?.[0] || null;
        const equipmentName = inv?.product_name || "Equipment";
        const oem = inv?.oem || "";
        
        console.log(`Sending pickup reminder to ${rental.customer_email} for ${equipmentName}`);

        // Send Email
        await resend.emails.send({
          from: "LASO Imaging <onboarding@resend.dev>",
          to: [rental.customer_email],
          subject: `Reminder: Equipment Pickup in 3 Days - ${equipmentName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a365d;">Equipment Rental Pickup Reminder</h1>
              
              <p>Hi ${rental.customer_name},</p>
              
              <p>This is a friendly reminder that your equipment rental is scheduled to begin in <strong>3 days</strong>.</p>
              
              <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #2d3748;">Rental Details</h3>
                <p><strong>Equipment:</strong> ${oem} ${equipmentName}</p>
                <p><strong>Start Date:</strong> ${new Date(rental.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>End Date:</strong> ${new Date(rental.end_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                ${rental.delivery_address ? `<p><strong>Delivery Address:</strong> ${rental.delivery_address}</p>` : ''}
                ${rental.total_amount ? `<p><strong>Total Amount:</strong> $${rental.total_amount.toLocaleString()}</p>` : ''}
              </div>
              
              <p>Please ensure you are prepared to receive the equipment on the scheduled date. If you have any questions or need to make changes, please contact us immediately.</p>
              
              <p>Best regards,<br>
              <strong>LASO Imaging Team</strong></p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #718096; font-size: 12px;">
                Phone: (800) 555-LASO | Email: rentals@lasoimaging.com
              </p>
            </div>
          `,
        });
        pickupEmailsSent++;

        // Send SMS if phone number available
        if (rental.customer_phone) {
          const startDateFormatted = new Date(rental.start_date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          const smsMessage = `LASO Imaging: Hi ${rental.customer_name.split(' ')[0]}, reminder that your ${equipmentName} rental begins in 3 days on ${startDateFormatted}. Questions? Call (800) 555-LASO`;
          
          const smsSent = await sendSMS(rental.customer_phone, smsMessage);
          if (smsSent) pickupSMSSent++;
        }

        // Mark reminder as sent
        await supabase
          .from("equipment_rentals")
          .update({ pickup_reminder_sent: true })
          .eq("id", rental.id);

        console.log(`Pickup reminder sent successfully for rental ${rental.id}`);
      } catch (emailError) {
        console.error(`Failed to send pickup reminder for rental ${rental.id}:`, emailError);
      }
    }

    // Fetch rentals needing return reminder
    const { data: returnRentals, error: returnError } = await supabase
      .from("equipment_rentals")
      .select(`
        id, customer_name, customer_email, customer_phone,
        start_date, end_date, delivery_address, total_amount,
        inventory:inventory_id(product_name, oem, modality)
      `)
      .eq("end_date", returnDateStr)
      .eq("return_reminder_sent", false)
      .eq("status", "active");

    if (returnError) {
      console.error("Error fetching return rentals:", returnError);
    }

    console.log(`Found ${returnRentals?.length || 0} rentals needing return reminder`);

    let returnEmailsSent = 0;
    let returnSMSSent = 0;
    
    for (const rental of returnRentals || []) {
      try {
        const invArray = rental.inventory as unknown as Array<{ product_name: string; oem: string; modality: string }> | null;
        const inv = invArray?.[0] || null;
        const equipmentName = inv?.product_name || "Equipment";
        const oem = inv?.oem || "";

        console.log(`Sending return reminder to ${rental.customer_email} for ${equipmentName}`);

        // Send Email
        await resend.emails.send({
          from: "LASO Imaging <onboarding@resend.dev>",
          to: [rental.customer_email],
          subject: `Reminder: Equipment Return Tomorrow - ${equipmentName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a365d;">Equipment Return Reminder</h1>
              
              <p>Hi ${rental.customer_name},</p>
              
              <p>This is a reminder that your equipment rental is scheduled to end <strong>tomorrow</strong>.</p>
              
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="margin-top: 0; color: #92400e;">Return Details</h3>
                <p><strong>Equipment:</strong> ${oem} ${equipmentName}</p>
                <p><strong>Return Date:</strong> ${new Date(rental.end_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              
              <h3>Return Instructions:</h3>
              <ol style="color: #4a5568;">
                <li>Ensure all accessories and components are included</li>
                <li>Clean the equipment before return</li>
                <li>Have the equipment ready for pickup at the scheduled time</li>
                <li>Prepare any required documentation</li>
              </ol>
              
              <p>If you need to extend your rental period, please contact us as soon as possible.</p>
              
              <p>Thank you for choosing LASO Imaging!</p>
              
              <p>Best regards,<br>
              <strong>LASO Imaging Team</strong></p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="color: #718096; font-size: 12px;">
                Phone: (800) 555-LASO | Email: rentals@lasoimaging.com
              </p>
            </div>
          `,
        });
        returnEmailsSent++;

        // Send SMS if phone number available
        if (rental.customer_phone) {
          const returnDateFormatted = new Date(rental.end_date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          const smsMessage = `LASO Imaging: Hi ${rental.customer_name.split(' ')[0]}, reminder your ${equipmentName} is due for return tomorrow (${returnDateFormatted}). Have it ready for pickup. Questions? (800) 555-LASO`;
          
          const smsSent = await sendSMS(rental.customer_phone, smsMessage);
          if (smsSent) returnSMSSent++;
        }

        // Mark reminder as sent
        await supabase
          .from("equipment_rentals")
          .update({ return_reminder_sent: true })
          .eq("id", rental.id);

        console.log(`Return reminder sent successfully for rental ${rental.id}`);
      } catch (emailError) {
        console.error(`Failed to send return reminder for rental ${rental.id}:`, emailError);
      }
    }

    const result = {
      success: true,
      pickup: {
        emails_sent: pickupEmailsSent,
        sms_sent: pickupSMSSent,
      },
      return: {
        emails_sent: returnEmailsSent,
        sms_sent: returnSMSSent,
      },
      total_emails: pickupEmailsSent + returnEmailsSent,
      total_sms: pickupSMSSent + returnSMSSent,
      timestamp: new Date().toISOString(),
    };

    console.log("Rental reminder check complete:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-rental-reminders function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
