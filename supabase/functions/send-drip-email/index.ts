import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailEnrollment {
  id: string;
  sequence_id: string;
  lead_id: string | null;
  current_step: number;
  next_email_at: string;
  status: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string;
  total_sent: number;
}

const replaceVariables = (content: string, variables: Record<string, string>): string => {
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'gi'), value || '');
  }
  return result;
};

const sendEmail = async (to: string, subject: string, html: string) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "LASO Imaging <updates@updates.lasoimaging.com>",
      to: [to],
      subject: subject,
      html: html,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to send email");
  }
  return data;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all enrollments that need to be processed
    const now = new Date().toISOString();
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("email_sequence_enrollments")
      .select("*")
      .eq("status", "active")
      .lte("next_email_at", now);

    if (enrollmentsError) {
      console.error("Error fetching enrollments:", enrollmentsError);
      throw enrollmentsError;
    }

    console.log(`Found ${enrollments?.length || 0} enrollments to process`);

    const results: { success: number; failed: number; completed: number } = {
      success: 0,
      failed: 0,
      completed: 0,
    };

    for (const enrollment of (enrollments || []) as EmailEnrollment[]) {
      try {
        // Get the next step for this enrollment
        const { data: steps, error: stepsError } = await supabase
          .from("email_sequence_steps")
          .select("*, email_templates(*)")
          .eq("sequence_id", enrollment.sequence_id)
          .eq("step_order", enrollment.current_step + 1)
          .eq("is_active", true)
          .single();

        if (stepsError || !steps) {
          // No more steps - mark as completed
          await supabase
            .from("email_sequence_enrollments")
            .update({
              status: "completed",
              completed_at: now,
            })
            .eq("id", enrollment.id);

          results.completed++;
          console.log(`Enrollment ${enrollment.id} completed - no more steps`);
          continue;
        }

        // Get customer info - check if this is from a lead or customer_profile
        let recipientEmail: string | null = null;
        let recipientName: string | null = null;

        if (enrollment.lead_id) {
          // Check if it's a lead
          const { data: lead } = await supabase
            .from("leads")
            .select("email, name")
            .eq("id", enrollment.lead_id)
            .single();

          if (lead) {
            recipientEmail = lead.email;
            recipientName = lead.name;
          } else {
            // Check if it's a customer profile
            const { data: profile } = await supabase
              .from("customer_profiles")
              .select("id, contact_name, user_id")
              .eq("id", enrollment.lead_id)
              .single();

            if (profile) {
              recipientName = profile.contact_name;
              // Get email from auth.users via admin API
              const { data: authData } = await supabase.auth.admin.getUserById(profile.user_id);
              recipientEmail = authData?.user?.email || null;
            }
          }
        }

        if (!recipientEmail) {
          console.log(`Enrollment ${enrollment.id}: No email found, skipping`);
          results.failed++;
          continue;
        }

        const template = steps.email_templates as EmailTemplate;
        if (!template) {
          console.log(`Enrollment ${enrollment.id}: No template found for step`);
          results.failed++;
          continue;
        }

        // Prepare variables for template
        const variables = {
          name: recipientName || "Valued Customer",
          email: recipientEmail,
        };

        const subject = replaceVariables(template.subject, variables);
        const htmlContent = replaceVariables(template.body_html, variables);

        // Send the email
        const emailResult = await sendEmail(recipientEmail, subject, htmlContent);
        console.log(`Email sent for enrollment ${enrollment.id}:`, emailResult);

        // Calculate next email time
        const { data: nextStepData } = await supabase
          .from("email_sequence_steps")
          .select("delay_days, delay_hours")
          .eq("sequence_id", enrollment.sequence_id)
          .eq("step_order", enrollment.current_step + 2)
          .single();

        let nextEmailAt: string | null = null;
        if (nextStepData) {
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + (nextStepData.delay_days || 0));
          nextDate.setHours(nextDate.getHours() + (nextStepData.delay_hours || 0));
          nextEmailAt = nextDate.toISOString();
        }

        // Update enrollment
        await supabase
          .from("email_sequence_enrollments")
          .update({
            current_step: enrollment.current_step + 1,
            next_email_at: nextEmailAt,
            status: nextEmailAt ? "active" : "completed",
            completed_at: nextEmailAt ? null : now,
          })
          .eq("id", enrollment.id);

        // Log the send in email_sends table
        await supabase.from("email_sends").insert({
          template_id: template.id,
          lead_id: enrollment.lead_id,
          recipient: recipientEmail,
          subject: subject,
          resend_email_id: emailResult?.id,
          status: "sent",
        });

        // Update template stats
        await supabase
          .from("email_templates")
          .update({ total_sent: (template.total_sent || 0) + 1 })
          .eq("id", template.id);

        results.success++;
      } catch (err) {
        console.error(`Error processing enrollment ${enrollment.id}:`, err);
        results.failed++;
      }
    }

    console.log("Drip email processing complete:", results);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-drip-email function:", error);
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