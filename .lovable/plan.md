

# Production Handoff: LASO Imaging -- Execution Plan

## Phase 1: Database Sanitization

Wipe all demo/test data from every operational table while preserving schema, RLS policies, triggers, and scoring rules. Execute DELETE statements (via insert tool) against these tables in order (respecting foreign key dependencies):

1. `email_delivery_events` -- clear email tracking
2. `email_sends` -- clear email send logs  
3. `email_sequence_enrollments` -- clear drip enrollments
4. `email_sequence_steps` -- clear sequence steps
5. `email_sequences` -- clear sequences
6. `activities` -- clear lead timeline events
7. `chat_messages` -- clear all chat messages
8. `chat_conversations` -- clear conversations
9. `product_offers` -- clear offers
10. `equipment_rentals` -- clear rentals
11. `site_visits` -- clear site visits
12. `quotes` -- clear quotes
13. `customer_notifications` -- clear notifications
14. `customer_saved_equipment` -- clear saved equipment
15. `customer_documents` -- clear documents
16. `service_tickets` -- clear tickets
17. `orders` -- clear orders
18. `equipment_images` -- clear images
19. `equipment_sell_requests` -- clear sell requests
20. `leads` -- clear all leads
21. `customers` -- clear CRM customers
22. `contractor_timecards` -- clear timecards
23. `inventory` -- clear inventory items
24. `email_templates` -- clear templates
25. `quote_templates` -- clear quote templates

**NOT touched:** `admin_users`, `user_roles`, `customer_profiles`, `lead_scoring_rules`, `pricing_rules` (configuration/auth tables stay intact).

## Phase 2: Frontend Fixes on `/services/preventive-maintenance`

### Fix 1: White box next to CTAs
In `src/pages/services/ServicePage.tsx` lines 547-598, the bottom CTA section renders a `<div className="bg-card rounded-xl p-6 md:p-8 shadow-xl">` containing a QuoteForm for non-helium/non-financing pages. This creates a visible white card box next to the text CTAs. For the preventive-maintenance page this is fine (it's the quote form), but the user sees an unwanted white box -- likely the `bg-card` container is rendering even when empty or the layout creates a visual gap. 

**Fix:** The `#financing-form` div wraps the form with `bg-card` styling. On pages like preventive-maintenance, it renders a QuoteForm inside it. The white box is the card container itself. I'll conditionally hide the `shadow-xl` background styling when it's not needed, or more likely the issue is that the card container is too prominent. Looking at the structure: the grid layout puts text on the left and the form card on the right. The "white box" the user sees IS the quote form card. Since they want it removed "next to CTAs," I'll need to check if there's an empty container rendering. Let me re-examine -- the `{slug === 'financing' && <TradeInCalculator />}` on line 548-549 renders nothing for PM page, but the `div id="financing-form"` still renders with `bg-card` styling containing the QuoteForm. This is intentional. The user might be seeing the TradeInCalculator empty space or a styling artifact.

Actually, looking more carefully: the user said "Remove white box next to CTAs." The CTA section (lines 522-601) has a 2-column grid. Left column has the "Ready to Get Started?" text + phone + address. Right column has the form card. The "white box" IS the form card background (`bg-card rounded-xl shadow-xl`). But removing it would remove the quote form. More likely the issue is an empty `TradeInCalculator` slot (line 548-549) that only renders for financing but the conditional might leave empty space, OR the `bg-card` is rendering with too much contrast against the `bg-primary` parent.

Most likely fix: make the card background transparent/blend with the primary section, or the user literally means the card styling is too harsh. I'll make the form card background semi-transparent with a glassmorphism effect on `bg-primary` sections, using `bg-white/10 backdrop-blur` instead of `bg-card`.

### Fix 2: Phone number label
In `src/pages/services/ServicePage.tsx`, update the phone display at line 538:
- Change `{ctaPhone}` to `EMERGENCY NUMBER {ctaPhone}` (for the pages that use the alt phone)
- Also update the hero CTA button (line 154-155) similarly
- Ensure all phone instances are wrapped in `<a href="tel:...">` (most already are)

## Phase 3: Helium Refill Modal Form

The helium-refills page already has a dedicated `HeliumQuoteForm` component rendered inline in the CTA section (line 583-584). The user wants it as a **modal/popup** triggered by the CTA button instead of inline.

**Changes to `src/pages/services/ServicePage.tsx`:**
- Import `Dialog` components
- For `helium-refills` slug, wrap the HeliumQuoteForm in a Dialog modal
- CTA buttons trigger the modal open state instead of scrolling to `#helium-quote-form`
- Add `helium_emergency` flag to the form submission when `isEmergency` is checked

**Changes to `src/components/helium/HeliumQuoteForm.tsx`:**
- When `isEmergency` is true, add urgency `'Emergency'` and set `is_hot: true` equivalent via lead score (the existing lead scoring trigger handles this, but we should set urgency explicitly)
- Add `lead_type: 'helium_emergency'` concept -- store in the `interest` field as "Helium Emergency" when emergency is checked

## Phase 4: Dashboard Pulsating Alert for Helium Emergency

**Changes to `src/pages/admin/Dashboard.tsx` (or `src/hooks/useAdminDashboardData.ts`):**
- In the Recent Leads table, detect leads with `interest = 'Helium Emergency'` or urgency = 'Emergency'
- Apply a CSS `@keyframes` pulsating red border animation to those table rows

**Changes to `src/index.css`:**
- Add `@keyframes pulse-emergency` animation
- Add `.emergency-pulse` utility class with red border + animation

## Phase 5: Testing Guide Cleanup
The user mentioned "the Testing Guide section" -- this is the `/admin/testing-guide` page. No specific action requested beyond awareness. Will leave as-is unless clarified.

## Files to Edit
1. `src/pages/services/ServicePage.tsx` -- phone label, white box fix, helium modal
2. `src/components/helium/HeliumQuoteForm.tsx` -- emergency flag in submission
3. `src/pages/admin/Dashboard.tsx` -- pulsating red border for emergency leads
4. `src/index.css` -- keyframes animation
5. Database: DELETE operations on all demo data tables (via insert tool)

## Execution Order
1. Database wipe (all DELETE statements)
2. Frontend fixes (phone label + white box)
3. Helium modal conversion
4. Dashboard emergency animation
5. End-to-end verification

