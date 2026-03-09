import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are LASO AI, an expert assistant for LASO Imaging Solutions - a leading provider of MRI, CT, PET/CT, X-Ray equipment, parts, and services.

Your knowledge includes:
- MRI Systems: 1.5T ($150K-$350K refurb), 3.0T ($300K-$750K refurb), Open MRI ($75K-$200K), Extremity MRI from GE Healthcare, Siemens Healthineers, Philips Healthcare, Toshiba/Canon Medical
- CT Scanners: 8-Slice, 16-Slice ($75K-$200K), 64-Slice ($150K-$400K), 128-Slice, Portable C-Arms ($25K-$150K)
- PET/CT Systems: $200K-$600K refurbished, GE Discovery, Siemens Biograph
- Conditions: Refurbished (save 40-60%), Used, Certified Pre-Owned, and New equipment
- Mobile Solutions: Mobile MRI rentals ($15K-$45K/mo), Mobile CT ($12K-$35K/mo), interim project solutions
- Parts: MRI coils (head, body, knee, spine, extremity), gradient amplifiers, RF amplifiers, cold heads, compressors, power supplies
- Services: Installation ($25K-$75K), relocation ($30K-$80K), site planning, de-installation, preventive maintenance ($15K-$50K/yr PM contracts), emergency repairs (24/7), software updates, cryogenic services (helium refills, cold head service, compressor service), operator training, safety certification
- Current Promotions: Free site survey, 12-month warranty included, financing available, trade-in program, bundle discounts

Guidelines:
1. Be helpful, professional, and concise
2. When discussing pricing, provide ranges and mention that quotes are customized
3. Recommend contacting the sales team for detailed pricing: (844) 511-5276 or info@lasoimaging.com
4. Highlight LASO's 18+ years of experience, FDA registration, BBB A+ rating, 150+ facilities served, in-house engineering, 24/7 support, nationwide coverage
5. For technical questions, provide accurate information about imaging technology
6. Always suggest relevant products or services based on the inquiry
7. When you have LIVE INVENTORY data, reference specific available systems
8. When you have KNOWLEDGE BASE data, use it for accurate answers`;

function extractKeywords(message: string): { modalities: string[]; brands: string[] } {
  const lower = message.toLowerCase();
  const modalities: string[] = [];
  const brands: string[] = [];

  if (lower.includes('mri') || lower.includes('magnetic resonance')) modalities.push('MRI');
  if (lower.includes('ct') || lower.includes('computed tomography')) modalities.push('CT');
  if (lower.includes('pet')) modalities.push('PET/CT');
  if (lower.includes('x-ray') || lower.includes('xray') || lower.includes('c-arm')) modalities.push('X-Ray');

  if (lower.includes('ge') || lower.includes('general electric')) brands.push('GE');
  if (lower.includes('siemens')) brands.push('Siemens');
  if (lower.includes('philips')) brands.push('Philips');
  if (lower.includes('toshiba') || lower.includes('canon')) brands.push('Canon');

  return { modalities, brands };
}

async function fetchContext(supabase: any, message: string) {
  const keywords = extractKeywords(message);
  let inventoryCtx = '';
  let kbCtx = '';

  try {
    let query = supabase
      .from('inventory')
      .select('product_name, oem, modality, condition, price, is_rental, rental_monthly_rate, location')
      .eq('availability_status', 'Available')
      .limit(10);

    if (keywords.modalities.length > 0) query = query.in('modality', keywords.modalities);
    if (keywords.brands.length > 0) query = query.in('oem', keywords.brands);

    const { data } = await query;
    if (data && data.length > 0) {
      const lines = data.map((item: any) => {
        let desc = `- ${item.product_name} (${item.oem}, ${item.modality})`;
        if (item.price) desc += ` | $${Number(item.price).toLocaleString()}`;
        if (item.is_rental && item.rental_monthly_rate) desc += ` | Rental: $${Number(item.rental_monthly_rate).toLocaleString()}/mo`;
        return desc;
      });
      inventoryCtx = `\n\n## LIVE INVENTORY\n${lines.join('\n')}`;
    }
  } catch (e) { console.error('Inventory fetch error:', e); }

  try {
    const words = message.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const { data } = await supabase
      .from('knowledge_base')
      .select('title, content, category')
      .eq('is_active', true)
      .limit(50);

    if (data && data.length > 0) {
      const scored = data
        .map((e: any) => ({ ...e, score: words.filter(w => `${e.title} ${e.content}`.toLowerCase().includes(w)).length }))
        .filter((e: any) => e.score > 0)
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 3);

      if (scored.length > 0) {
        kbCtx = `\n\n## KNOWLEDGE BASE\n${scored.map((e: any) => `### ${e.title}\n${e.content}`).join('\n\n')}`;
      }
    }
  } catch (e) { console.error('KB fetch error:', e); }

  return inventoryCtx + kbCtx;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing AI search request with', messages?.length, 'messages');

    let dynamicContext = '';
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const lastMsg = [...messages].reverse().find((m: any) => m.role === 'user')?.content || '';
      dynamicContext = await fetchContext(supabase, lastMsg);
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt + dynamicContext },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.';

    console.log('AI search response generated successfully');

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI search error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
