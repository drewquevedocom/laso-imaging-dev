import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  interest: string;
  source_page: string;
}

interface ScoringRule {
  rule_name: string;
  points: number;
  condition_field: string;
  condition_value: string;
  is_active: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { leadId } = await req.json();
    
    if (!leadId) {
      console.error('No leadId provided');
      return new Response(
        JSON.stringify({ error: 'leadId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Calculating score for lead:', leadId);

    // Fetch the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch active scoring rules
    const { data: rules, error: rulesError } = await supabase
      .from('lead_scoring_rules')
      .select('*')
      .eq('is_active', true);

    if (rulesError) {
      console.error('Error fetching rules:', rulesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch scoring rules' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate score based on rules
    let totalScore = 0;
    const appliedRules: string[] = [];

    for (const rule of rules as ScoringRule[]) {
      const fieldValue = lead[rule.condition_field as keyof Lead];
      
      if (rule.condition_value === 'not_empty') {
        // Check if field has a value
        if (fieldValue && String(fieldValue).trim() !== '') {
          totalScore += rule.points;
          appliedRules.push(rule.rule_name);
          console.log(`Applied rule: ${rule.rule_name} (+${rule.points})`);
        }
      } else {
        // Check if field matches the condition value
        if (fieldValue && String(fieldValue).toLowerCase().includes(rule.condition_value.toLowerCase())) {
          totalScore += rule.points;
          appliedRules.push(rule.rule_name);
          console.log(`Applied rule: ${rule.rule_name} (+${rule.points})`);
        }
      }
    }

    // Determine if this is a hot lead (score >= 50)
    const isHot = totalScore >= 50;

    console.log(`Final score: ${totalScore}, Is hot: ${isHot}`);

    // Update the lead with the calculated score
    const { error: updateError } = await supabase
      .from('leads')
      .update({ 
        lead_score: totalScore,
        is_hot: isHot
      })
      .eq('id', leadId);

    if (updateError) {
      console.error('Error updating lead:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update lead score' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        leadId,
        score: totalScore,
        isHot,
        appliedRules
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
