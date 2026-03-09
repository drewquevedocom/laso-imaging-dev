

# LASO AI Chatbot Enhancement Plan

Three enhancements to make the chatbot smarter: live inventory awareness, a knowledge base system, and an enriched system prompt.

## 1. Live Inventory Integration (RAG-style)

**What:** Before sending the user's message to the AI, the edge function queries the `inventory` table for relevant equipment based on keywords in the user's message, then injects the results into the system prompt as context.

**How (in `ai-chatbot/index.ts`):**
- Create a Supabase admin client inside the edge function using `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- Extract keywords from the latest user message (modality terms like "MRI", "CT", brand names like "GE", "Siemens", condition terms)
- Query `inventory` table filtering by `availability_status = 'Available'`, matching on `modality`, `oem`, `product_name` using `ilike`
- Format matching inventory as a `## LIVE INVENTORY` section appended to the system prompt (product name, OEM, modality, condition, price range, location)
- Also query `inventory` where `is_rental = true` for rental-specific questions

## 2. Knowledge Base / FAQ Document System

**What:** A new `knowledge_base` table where staff can upload/manage FAQ entries, product guides, and policy documents. The chatbot queries this table for relevant content before each response.

**Database migration:**
```sql
CREATE TABLE public.knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage knowledge base"
  ON public.knowledge_base FOR ALL
  USING (is_admin());

CREATE POLICY "Public can read active entries"
  ON public.knowledge_base FOR SELECT
  USING (is_active = true);
```

**Edge function changes:**
- Query `knowledge_base` for entries matching user message keywords (search `title`, `content`, `tags`)
- Inject top 5 matching entries as `## KNOWLEDGE BASE CONTEXT` in the system prompt

**Admin UI:**
- New page at `/admin/knowledge-base` with CRUD for entries
- Fields: title, content (markdown textarea), category dropdown (FAQ, Product Guide, Policy, Promotion), tags
- Add to admin sidebar navigation

## 3. Enhanced System Prompt

Update the static system prompt in both `ai-chatbot` and `ai-search` edge functions with:

- **Expanded product catalog**: CT scanners, PET/CT, X-Ray systems (not just MRI)
- **Pricing ranges**: Refurbished 1.5T MRI ($150K-$350K), 3T MRI ($300K-$750K), CT ($75K-$400K), Mobile MRI rentals ($15K-$45K/month)
- **Current promotions**: Free site survey, 12-month warranty included, financing available
- **Service pricing context**: PM contracts ($15K-$50K/year), cryogenic service, installation ($25K-$75K)
- **Competitive differentiators**: In-house engineering team, 24/7 emergency support, nationwide coverage

## Files to Create/Edit

| File | Action |
|------|--------|
| `supabase/functions/ai-chatbot/index.ts` | Add inventory + knowledge base queries, enrich system prompt |
| `supabase/functions/ai-search/index.ts` | Same inventory + knowledge base integration |
| `src/pages/admin/KnowledgeBase.tsx` | New admin CRUD page |
| `src/components/admin/AdminSidebar.tsx` | Add knowledge base nav link |
| `src/App.tsx` | Add route for knowledge base page |
| Database migration | Create `knowledge_base` table with RLS |

## Architecture

```text
User Message
    │
    ▼
Edge Function (ai-chatbot)
    │
    ├─► Query inventory (keyword match)
    ├─► Query knowledge_base (keyword match)
    │
    ▼
Build Dynamic System Prompt
  = Static prompt
  + Live Inventory context
  + Knowledge Base context
    │
    ▼
Lovable AI Gateway (Gemini)
    │
    ▼
Response to User
```

