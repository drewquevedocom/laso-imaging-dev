import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting offer follow-up reminder job...");

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate the date range: offers approved between 7-14 days ago
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Fetch approved offers that haven't completed purchase and haven't exceeded follow-up limit
    const { data: offers, error: fetchError } = await supabase
      .from("product_offers")
      .select(`
        id,
        customer_name,
        customer_email,
        offer_amount,
        list_price,
        approved_at,
        follow_up_count,
        purchase_completed,
        inventory:inventory_id (
          product_name,
          oem
        )
      `)
      .eq("status", "approved")
      .eq("purchase_completed", false)
      .lt("follow_up_count", 3)
      .gte("approved_at", fourteenDaysAgo.toISOString())
      .lte("approved_at", sevenDaysAgo.toISOString());

    if (fetchError) {
      console.error("Error fetching offers:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${offers?.length || 0} offers requiring follow-up`);

    const results: { offerId: string; success: boolean; error?: string }[] = [];

    for (const offer of offers || []) {
      try {
        const inventoryData = offer.inventory as { product_name: string; oem: string }[] | null;
        const inventory = inventoryData?.[0] || null;
        const firstName = offer.customer_name.split(' ')[0];
        const daysSinceApproval = Math.floor(
          (now.getTime() - new Date(offer.approved_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        const followUpNumber = (offer.follow_up_count || 0) + 1;

        const subjectLines = [
          `Your approved offer for ${inventory?.product_name || 'equipment'} is waiting`,
          `Don't miss out! Your ${inventory?.oem || ''} offer expires soon`,
          `Final reminder: Complete your ${inventory?.product_name || 'equipment'} purchase`,
        ];

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Purchase</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">LASO Medical</h1>
        <p style="color: #a3c2e0; margin: 10px 0 0; font-size: 14px;">Premium Medical Imaging Equipment</p>
      </td>
    </tr>
    
    <!-- Urgency Banner -->
    ${followUpNumber >= 3 ? `
    <tr>
      <td style="background-color: #fef3cd; padding: 15px 30px; text-align: center; border-bottom: 2px solid #f0ad4e;">
        <p style="color: #856404; margin: 0; font-weight: 600;">
          ⚠️ Final Reminder - Offer expires in 7 days!
        </p>
      </td>
    </tr>
    ` : ''}
    
    <!-- Main Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1e3a5f; margin: 0 0 20px; font-size: 24px;">Hi ${firstName},</h2>
        
        <p style="color: #5a6c7d; line-height: 1.6; margin: 0 0 25px;">
          ${followUpNumber === 1 
            ? `It's been a week since we approved your offer, and we wanted to check in! We're excited about the opportunity to provide you with quality imaging equipment.`
            : followUpNumber === 2 
            ? `Just a friendly reminder that your approved offer is still waiting for you. We don't want you to miss this opportunity!`
            : `This is our final reminder about your approved offer. We'd hate to see this deal expire without hearing from you.`
          }
        </p>

        <!-- Approved Offer Box -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 25px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="background-color: #28a745; color: white; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 600;">✓ APPROVED</span>
                    <h3 style="color: #155724; margin: 15px 0 10px; font-size: 20px;">${inventory?.oem || ''} ${inventory?.product_name || 'Medical Equipment'}</h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 15px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #155724; padding: 8px 0;">Your Approved Price:</td>
                        <td style="color: #155724; padding: 8px 0; text-align: right; font-size: 28px; font-weight: bold;">${formatCurrency(offer.offer_amount)}</td>
                      </tr>
                      ${offer.list_price ? `
                      <tr>
                        <td style="color: #6c757d; padding: 8px 0; font-size: 14px;">Original Price:</td>
                        <td style="color: #6c757d; padding: 8px 0; text-align: right; font-size: 14px; text-decoration: line-through;">${formatCurrency(offer.list_price)}</td>
                      </tr>
                      <tr>
                        <td style="color: #28a745; padding: 8px 0; font-weight: 600;">Your Savings:</td>
                        <td style="color: #28a745; padding: 8px 0; text-align: right; font-weight: 600;">${formatCurrency(offer.list_price - offer.offer_amount)}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Timeline Info -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fb; border-radius: 8px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px;">
              <p style="color: #5a6c7d; margin: 0; font-size: 14px;">
                📅 <strong>Offer approved:</strong> ${new Date(offer.approved_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br>
                ⏰ <strong>Days since approval:</strong> ${daysSinceApproval} days
              </p>
            </td>
          </tr>
        </table>

        <!-- CTA Buttons -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="https://laso-ver1.lovable.app/contact" 
                 style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #218838 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-right: 10px;">
                Complete Purchase
              </a>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 10px 0;">
              <a href="mailto:sales@lasomedical.com?subject=Question about my approved offer" 
                 style="color: #2980b9; text-decoration: none; font-size: 14px;">
                Have questions? Contact us
              </a>
            </td>
          </tr>
        </table>

        <!-- Contact Info -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e5e9ed; margin-top: 25px; padding-top: 25px;">
          <tr>
            <td>
              <p style="color: #5a6c7d; margin: 0; font-size: 14px;">
                📞 <a href="tel:+18779525278" style="color: #2980b9; text-decoration: none;">877-952-5278</a> • 
                ✉️ <a href="mailto:sales@lasomedical.com" style="color: #2980b9; text-decoration: none;">sales@lasomedical.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f4f7fa; padding: 30px; text-align: center; border-top: 1px solid #e5e9ed;">
        <p style="color: #8a9bab; margin: 0 0 10px; font-size: 12px;">
          © ${new Date().getFullYear()} LASO Medical. All rights reserved.
        </p>
        <p style="color: #a3b1bf; margin: 0; font-size: 11px;">
          This is reminder ${followUpNumber} of 3 for your approved offer.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        // Send the email
        const emailResponse = await resend.emails.send({
          from: "LASO Medical <sales@lasomedical.com>",
          to: [offer.customer_email],
          subject: subjectLines[Math.min(followUpNumber - 1, 2)],
          html: emailHtml,
        });

        console.log(`Follow-up email sent for offer ${offer.id}:`, emailResponse);

        // Update the offer with follow-up tracking
        const { error: updateError } = await supabase
          .from("product_offers")
          .update({
            follow_up_sent_at: new Date().toISOString(),
            follow_up_count: followUpNumber,
            updated_at: new Date().toISOString(),
          })
          .eq("id", offer.id);

        if (updateError) {
          console.error(`Error updating offer ${offer.id}:`, updateError);
          results.push({ offerId: offer.id, success: false, error: updateError.message });
        } else {
          results.push({ offerId: offer.id, success: true });
        }
      } catch (offerError: any) {
        console.error(`Error processing offer ${offer.id}:`, offerError);
        results.push({ offerId: offer.id, success: false, error: offerError.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Follow-up job complete. Success: ${successCount}, Failed: ${failCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: results.length,
        successCount,
        failCount,
        results 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in follow-up reminder job:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
