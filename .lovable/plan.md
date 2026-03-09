

# Seed Knowledge Base & Test AI Chatbot

## What needs to happen

1. **Seed the knowledge base** with ~10-12 entries covering FAQs, pricing guides, service policies, and promotions so the chatbot has reference material
2. **Add some non-rental inventory** (systems for sale with prices) so the chatbot can recommend equipment for purchase, not just rentals
3. **Test the chatbot** end-to-end via the edge function to confirm it pulls live inventory and knowledge base data

## Knowledge Base Entries to Add

| Category | Title | Content Summary |
|----------|-------|-----------------|
| FAQ | What warranty is included? | 12-month parts & labor on refurbished systems |
| FAQ | How long does installation take? | 4-8 weeks typical timeline |
| FAQ | Do you offer financing? | Yes, flexible terms, lease-to-own, $0 down options |
| FAQ | What's included in a PM contract? | Quarterly visits, remote diagnostics, priority response |
| Pricing Guide | MRI System Pricing Guide | 1.5T/3T/Open price ranges by brand |
| Pricing Guide | CT Scanner Pricing Guide | 16/64/128-slice price ranges |
| Service Policy | Return & Warranty Policy | 12-month warranty, 30-day satisfaction guarantee |
| Service Policy | Site Survey Process | Free survey, what to expect, timeline |
| Promotion | Current Deals | Bundle discounts, trade-in program, free training |
| Product Guide | Choosing Between 1.5T and 3T MRI | Clinical use cases, cost comparison |
| Product Guide | Mobile Rental Guide | When to rent, what's included, deployment timeline |
| FAQ | What brands do you carry? | GE, Siemens, Philips, Canon/Toshiba |

## Inventory to Add (For-Sale Systems)

Add 6-8 systems with actual prices so the AI can reference purchasable equipment:
- GE Signa HDxt 1.5T (~$185,000)
- Siemens Magnetom Aera 1.5T (~$275,000)
- GE Optima CT660 64-Slice (~$195,000)
- Philips Achieva 1.5T (~$165,000)
- Siemens Biograph mCT PET/CT (~$385,000)
- GE Discovery 710 PET/CT (~$425,000)
- Philips Brilliance 64 CT (~$175,000)
- GE OEC 9900 C-Arm (~$45,000)

## Testing

After seeding, call the `ai-chatbot` edge function with test messages like:
- "What MRI systems do you have available?"
- "How much does a CT scanner cost?"
- "What's your warranty policy?"

This validates the RAG pipeline pulls both inventory and knowledge base context.

## Files to Edit

| File | Action |
|------|--------|
| Database: `knowledge_base` | Insert ~12 entries via data tool |
| Database: `inventory` | Insert ~8 for-sale systems via data tool |
| Edge function test | Curl `ai-chatbot` to verify |

No code file changes needed -- this is purely data seeding and verification.

