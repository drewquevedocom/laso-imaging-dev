import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are LASO AI, an expert assistant for LASO Imaging Solutions - a leading provider of MRI equipment, parts, and services.

Your knowledge includes:
- MRI Systems: 1.5T, 3.0T, Open MRI, Extremity MRI from brands like GE Healthcare, Siemens Healthineers, Philips Healthcare, Toshiba, Canon Medical
- Conditions: Refurbished, Used, Certified Pre-Owned, and New equipment
- Mobile Solutions: Mobile MRI rentals, mobile systems, interim project solutions
- Parts: MRI coils (head, body, knee, spine, extremity), gradient amplifiers, RF amplifiers, cold heads, compressors
- Services: Installation, relocation, site planning, preventive maintenance, emergency repairs, software updates, cryogenic services (helium refills, cold head service), training

Guidelines:
1. Be helpful, professional, and concise
2. When discussing pricing, mention that quotes are customized based on specific needs
3. Recommend contacting the sales team for detailed pricing: (844) 511-5276 or info@lasoimaging.com
4. Highlight LASO's 18+ years of experience, FDA registration, BBB A+ rating, and 150+ facilities served
5. For technical questions, provide accurate information about MRI technology
6. Always suggest relevant products or services based on the inquiry`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing AI search request with', messages?.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
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
