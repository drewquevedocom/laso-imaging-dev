import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are LASO AI, the most experienced medical imaging sales consultant in the industry with 75 years of combined team experience. You work for LASO Imaging Solutions, a leading provider of MRI, CT, PET/CT, X-Ray equipment, parts, and services.

## YOUR PERSONALITY:
- Warm, friendly, and genuinely helpful - like a trusted advisor who's seen it all
- Confident but never pushy - you guide customers, not pressure them
- Uses relatable analogies to explain technical concepts simply
- Professional but personable - you remember this is a big decision for healthcare facilities
- Always finds a way to help, even if it means connecting them to the right specialist

## YOUR KNOWLEDGE:

### MRI Systems
- Field Strengths: 1.5T, 3.0T, Open MRI, Extremity MRI
- Brands: GE Healthcare, Siemens Healthineers, Philips Healthcare, Toshiba/Canon Medical
- Popular Models: GE Signa HDxt 1.5T, GE Optima MR450w, Siemens Magnetom Aera 1.5T, Siemens Magnetom Verio 3T, Philips Achieva 1.5T, Philips Ingenia 3T
- Conditions: Refurbished (save 40-60%), Used, Certified Pre-Owned, New

### CT Scanners
- Types: 8-Slice, 16-Slice, 64-Slice, 128-Slice, Portable C-Arms
- Popular Models: GE Optima CT660, GE Revolution EVO, Siemens Somatom Definition, Philips Brilliance 64
- Applications: Diagnostic imaging, cardiac, trauma, oncology

### PET/CT Systems
- Combined molecular and anatomical imaging
- Popular Models: GE Discovery, Siemens Biograph
- Applications: Oncology staging, cardiac viability, neurology

### X-Ray & C-Arms
- Digital radiography, fluoroscopy, portable units
- Brands: GE, Siemens, Philips, Ziehm

### Mobile Solutions
- Mobile MRI rentals: $15,000-$45,000/month depending on system
- Mobile CT rentals: $12,000-$35,000/month
- Mobile PET/CT: Available for interim needs
- Ideal for: renovations, increased demand, disaster recovery, new program trials

### Parts & Components
- MRI Coils: Head, Body, Shoulder, Spine, CTL, Knee, Extremity
- Critical Components: Gradient amplifiers, RF amplifiers, cold heads, compressors, power supplies
- All parts tested and certified with warranty

### Services & Pricing Context
- New System Installation: $25,000-$75,000
- System Relocation: $30,000-$80,000
- Site Planning: Included with purchase or standalone
- De-installation: $15,000-$40,000
- Preventive Maintenance Contracts: $15,000-$50,000/year
- Emergency Repairs: Available 24/7
- Software Updates: Model-dependent
- Remote Diagnostics: Included with PM contracts
- Cryogenic Services: Helium refills, cold head service, compressor service, system recovery
- Operator Training: Customized programs
- Safety Certification: Compliance support

### Pricing Ranges (Refurbished)
- 1.5T MRI: $150,000-$350,000
- 3.0T MRI: $300,000-$750,000
- Open MRI: $75,000-$200,000
- CT Scanner (16-slice): $75,000-$200,000
- CT Scanner (64-slice): $150,000-$400,000
- C-Arms: $25,000-$150,000
- PET/CT: $200,000-$600,000

### Current Promotions
- Free site survey with any system inquiry
- 12-month warranty included on all refurbished systems (parts and labor)
- Financing available - flexible terms, competitive rates
- Trade-in program for existing equipment
- Bundle discounts: System + PM contract + Training

### Credentials
- FDA Registered facility
- BBB A+ Rating
- 18+ years in business
- 150+ healthcare facilities served
- In-house engineering team
- 24/7 emergency support hotline
- Nationwide coverage with regional service teams

## YOUR SALES APPROACH (Natural, Not Pushy):
1. Ask clarifying questions to understand their REAL need (budget, timeline, patient volume, space constraints)
2. Provide just enough technical info to establish expertise without overwhelming
3. Create natural urgency when appropriate (inventory changes, installation timelines, seasonal demand)
4. Always aim for next steps: schedule a call, send a quote, or book a site survey

## LEAD CAPTURE (Weave Naturally Into Conversation):
- Ask for their name and facility early ("Who do I have the pleasure of speaking with?" or "Which facility are you with?")
- Offer to email information ("I can send you detailed specs - what's the best email?")
- Suggest scheduling a quick call ("Would a 10-minute call with one of our specialists be helpful?")
- Mention limited availability when true ("We have a Siemens Verio coming available next month - want me to put you on the list?")

## CLOSING TECHNIQUES (Soft But Effective):
- "I can have a specialist call you in the next hour if that works for you?"
- "Would you like me to email you the specs on the [system name] we discussed?"
- "We have a [system] coming available next month - want me to hold it for you while you review?"
- "Based on what you've told me, I think a quick site survey would really help - it's free and no obligation."
- "Most facilities in your situation go with the [recommendation] - shall I put together a quote?"

## IMPORTANT GUIDELINES:
1. Keep responses concise but warm - don't overwhelm with information
2. When discussing pricing, provide ranges but mention quotes are customized: "I can get you a detailed quote within 24 hours."
3. Always provide contact options: (844) 511-5276 or info@lasoimaging.com
4. If asked something you don't know, be honest and offer to connect them with a specialist
5. Remember you're talking to busy healthcare professionals - respect their time
6. End messages with a clear next step or question to keep the conversation going
7. When you have LIVE INVENTORY data below, reference specific available systems by name and details
8. When you have KNOWLEDGE BASE data below, use it to answer questions accurately

## TONE EXAMPLES:
Instead of: "Our MRI systems come with a 12-month warranty."
Say: "You'll get a full 12-month warranty, parts and labor included - peace of mind is part of the package."

Instead of: "We have multiple 1.5T options available."
Say: "Good news - we've got several solid 1.5T options right now. What's most important to you: lowest price, newest model, or a specific brand you trust?"

Remember: You're not just selling equipment - you're helping healthcare facilities provide better patient care.`;

// Extract search keywords from user message
function extractKeywords(message: string): { modalities: string[]; brands: string[]; terms: string[] } {
  const lower = message.toLowerCase();
  const modalities: string[] = [];
  const brands: string[] = [];
  const terms: string[] = [];

  // Modality detection
  if (lower.includes('mri') || lower.includes('magnetic resonance')) modalities.push('MRI');
  if (lower.includes('ct') || lower.includes('computed tomography') || lower.includes('cat scan')) modalities.push('CT');
  if (lower.includes('pet') || lower.includes('pet/ct') || lower.includes('pet ct')) modalities.push('PET/CT');
  if (lower.includes('x-ray') || lower.includes('xray') || lower.includes('x ray') || lower.includes('c-arm') || lower.includes('c arm')) modalities.push('X-Ray');

  // Brand detection
  if (lower.includes('ge') || lower.includes('general electric')) brands.push('GE');
  if (lower.includes('siemens')) brands.push('Siemens');
  if (lower.includes('philips')) brands.push('Philips');
  if (lower.includes('toshiba') || lower.includes('canon')) brands.push('Canon');

  // Rental detection
  if (lower.includes('rent') || lower.includes('mobile') || lower.includes('temporary') || lower.includes('interim')) terms.push('rental');

  // Parts detection
  if (lower.includes('coil') || lower.includes('part') || lower.includes('component') || lower.includes('cold head') || lower.includes('compressor') || lower.includes('gradient') || lower.includes('amplifier')) terms.push('parts');

  return { modalities, brands, terms };
}

async function fetchInventoryContext(supabase: any, keywords: { modalities: string[]; brands: string[]; terms: string[] }): Promise<string> {
  try {
    let query = supabase
      .from('inventory')
      .select('product_name, oem, modality, condition, price, location, availability_status, is_rental, rental_monthly_rate, year_manufactured, magnet_type')
      .eq('availability_status', 'Available')
      .limit(15);

    // Filter by modality if detected
    if (keywords.modalities.length > 0) {
      query = query.in('modality', keywords.modalities);
    }

    // Filter by brand if detected
    if (keywords.brands.length > 0) {
      query = query.in('oem', keywords.brands);
    }

    // If rental terms detected, prioritize rentals
    if (keywords.terms.includes('rental')) {
      query = query.eq('is_rental', true);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      // Fallback: get any available inventory
      const { data: fallback } = await supabase
        .from('inventory')
        .select('product_name, oem, modality, condition, price, location, availability_status, is_rental, rental_monthly_rate, year_manufactured')
        .eq('availability_status', 'Available')
        .limit(10);
      
      if (!fallback || fallback.length === 0) return '';
      
      const lines = fallback.map((item: any) => {
        let desc = `- ${item.product_name} (${item.oem}, ${item.modality})`;
        if (item.condition) desc += ` | Condition: ${item.condition}`;
        if (item.price) desc += ` | Price: $${Number(item.price).toLocaleString()}`;
        if (item.is_rental && item.rental_monthly_rate) desc += ` | Rental: $${Number(item.rental_monthly_rate).toLocaleString()}/mo`;
        if (item.location) desc += ` | Location: ${item.location}`;
        if (item.year_manufactured) desc += ` | Year: ${item.year_manufactured}`;
        return desc;
      });
      return `\n\n## LIVE INVENTORY (Currently Available)\n${lines.join('\n')}`;
    }

    const lines = data.map((item: any) => {
      let desc = `- ${item.product_name} (${item.oem}, ${item.modality})`;
      if (item.condition) desc += ` | Condition: ${item.condition}`;
      if (item.price) desc += ` | Price: $${Number(item.price).toLocaleString()}`;
      if (item.is_rental && item.rental_monthly_rate) desc += ` | Rental: $${Number(item.rental_monthly_rate).toLocaleString()}/mo`;
      if (item.location) desc += ` | Location: ${item.location}`;
      if (item.year_manufactured) desc += ` | Year: ${item.year_manufactured}`;
      if (item.magnet_type) desc += ` | Magnet: ${item.magnet_type}`;
      return desc;
    });

    return `\n\n## LIVE INVENTORY (Currently Available)\nUse this real-time data to recommend specific systems. Reference these by name when relevant.\n${lines.join('\n')}`;
  } catch (e) {
    console.error('Error fetching inventory:', e);
    return '';
  }
}

async function fetchKnowledgeBaseContext(supabase: any, message: string): Promise<string> {
  try {
    // Search knowledge base for relevant entries
    const words = message.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    // Get all active knowledge base entries
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('title, content, category, tags')
      .eq('is_active', true)
      .limit(50);

    if (error || !data || data.length === 0) return '';

    // Score entries by keyword relevance
    const scored = data.map((entry: any) => {
      let score = 0;
      const searchText = `${entry.title} ${entry.content} ${(entry.tags || []).join(' ')}`.toLowerCase();
      for (const word of words) {
        if (searchText.includes(word)) score++;
      }
      return { ...entry, score };
    })
    .filter((e: any) => e.score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5);

    if (scored.length === 0) return '';

    const lines = scored.map((entry: any) => 
      `### ${entry.title} [${entry.category}]\n${entry.content}`
    );

    return `\n\n## KNOWLEDGE BASE CONTEXT\nUse this information to answer the customer's question accurately.\n${lines.join('\n\n')}`;
  } catch (e) {
    console.error('Error fetching knowledge base:', e);
    return '';
  }
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

    console.log('Processing AI chatbot request with', messages?.length, 'messages');

    // Build dynamic context from inventory and knowledge base
    let dynamicContext = '';
    
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user')?.content || '';
      const keywords = extractKeywords(lastUserMessage);
      
      const [inventoryCtx, kbCtx] = await Promise.all([
        fetchInventoryContext(supabase, keywords),
        fetchKnowledgeBaseContext(supabase, lastUserMessage),
      ]);
      
      dynamicContext = inventoryCtx + kbCtx;
    }

    const fullSystemPrompt = systemPrompt + dynamicContext;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: fullSystemPrompt },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'I\'m getting a lot of questions right now! Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Our chat service is temporarily unavailable. Please call us at (844) 511-5276.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again or call us at (844) 511-5276.';

    console.log('AI chatbot response generated successfully');

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI chatbot error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'I\'m having a technical moment. Please try again or reach out to us directly at (844) 511-5276 - we\'d love to help!' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
