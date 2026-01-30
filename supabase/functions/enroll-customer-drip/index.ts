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

interface EnrollmentRequest {
  customer_profile_id: string;
  email: string;
  name: string;
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
    const { customer_profile_id, email, name }: EnrollmentRequest = await req.json();

    if (!customer_profile_id || !email) {
      throw new Error("customer_profile_id and email are required");
    }

    if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the welcome drip sequence
    const { data: sequence, error: sequenceError } = await supabase
      .from("email_sequences")
      .select("id")
      .eq("trigger_type", "customer_signup")
      .eq("is_active", true)
      .single();

    if (sequenceError || !sequence) {
      console.log("No active customer_signup sequence found");
      return new Response(
        JSON.stringify({ success: false, message: "No active sequence found" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from("email_sequence_enrollments")
      .select("id")
      .eq("sequence_id", sequence.id)
      .eq("lead_id", customer_profile_id)
      .single();

    if (existing) {
      console.log(`Customer ${customer_profile_id} already enrolled in sequence`);
      return new Response(
        JSON.stringify({ success: true, message: "Already enrolled", enrolled: false }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get first step to send immediately
    const { data: firstStep, error: stepError } = await supabase
      .from("email_sequence_steps")
      .select("*, email_templates(*)")
      .eq("sequence_id", sequence.id)
      .eq("step_order", 1)
      .eq("is_active", true)
      .single();

    if (stepError || !firstStep || !firstStep.email_templates) {
      console.log("No first step found for sequence");
      return new Response(
        JSON.stringify({ success: false, message: "No first step configured" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const template = firstStep.email_templates as any;
    const variables = {
      name: name || "Valued Customer",
      email: email,
    };

    const subject = replaceVariables(template.subject, variables);
    const htmlContent = replaceVariables(template.body_html, variables);

    // Send welcome email immediately
    const emailResult = await sendEmail(email, subject, htmlContent);
    console.log("Welcome email sent:", emailResult);

    // Get next step timing
    const { data: nextStep } = await supabase
      .from("email_sequence_steps")
      .select("delay_days, delay_hours")
      .eq("sequence_id", sequence.id)
      .eq("step_order", 2)
      .single();

    let nextEmailAt: string | null = null;
    if (nextStep) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + (nextStep.delay_days || 0));
      nextDate.setHours(nextDate.getHours() + (nextStep.delay_hours || 0));
      nextEmailAt = nextDate.toISOString();
    }

    // Create enrollment
    const { data: enrollment, error: enrollError } = await supabase
      .from("email_sequence_enrollments")
      .insert({
        sequence_id: sequence.id,
        lead_id: customer_profile_id,
        current_step: 1,
        next_email_at: nextEmailAt,
        status: nextEmailAt ? "active" : "completed",
      })
      .select()
      .single();

    if (enrollError) {
      console.error("Error creating enrollment:", enrollError);
      throw enrollError;
    }

    // Log email send
    await supabase.from("email_sends").insert({
      template_id: template.id,
      lead_id: customer_profile_id,
      recipient: email,
      subject: subject,
      resend_email_id: emailResult?.id,
      status: "sent",
    });

    // Update template stats
    await supabase
      .from("email_templates")
      .update({ total_sent: (template.total_sent || 0) + 1 })
      .eq("id", template.id);

    console.log(`Customer ${customer_profile_id} enrolled in drip sequence:`, enrollment);

    return new Response(
      JSON.stringify({
        success: true,
        enrolled: true,
        enrollment_id: enrollment.id,
        welcome_email_sent: true,
        next_email_at: nextEmailAt,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in enroll-customer-drip function:", error);
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