

# MASTER LAUNCH READINESS AUDIT

---

## CRITICAL (Blocks Launch)

### C1. Broken Legal Links on Signup Page
`src/pages/SignUp.tsx` line 262-264 links to `/terms` and `/privacy` which are **404 pages**. Actual routes are `/terms-of-service` and `/privacy-policy`. Users creating accounts see broken legal links — potential legal liability.

### C2. "Your Messages" Links to Coming Soon Placeholder
Both `Header.tsx` (line 164) and `MobileNav.tsx` (line 273) link "Your Messages" to `/coming-soon`. This is a dead-end page for users expecting a messaging feature. Either wire it to `/portal/messages` (which exists) or remove the link entirely.

### C3. Security: product_offers Table Leaks Pricing to Competitors
RLS policy on `product_offers` uses JWT email claim matching (`customer_email = jwt.email`). Anyone who knows a customer's email could view all offers, margins, and pricing strategy. Must switch to proper `user_id` matching via `customer_profiles`.

### C4. Security: Contractor Timecards Allow Unauthenticated Public Inserts
`contractor_timecards` has `WITH CHECK (true)` on INSERT — anyone can submit fraudulent timecards with arbitrary pay rates and amounts. This is a direct financial fraud risk. Needs authentication requirement.

### C5. Duplicate Supabase Client (Console Warning)
`src/hooks/useChatPersistence.ts` creates its own `createClient()` instance instead of importing from `@/integrations/supabase/client`. This causes the "Multiple GoTrueClient instances" warning and can lead to undefined auth behavior (race conditions, session conflicts).

### C6. No Password Reset Flow
There is no `/reset-password` route or "Forgot Password" functionality. Once a customer forgets their password, they are locked out with no recovery path.

---

## HIGH (Needed for Launch)

### H1. Contact Page: "Interactive map coming soon" Placeholder
`src/pages/Contact.tsx` line 384-394 shows a grey box saying "Interactive map coming soon / Requires Mapbox API key". This looks unfinished. Either add a static Google Maps embed or remove the placeholder.

### H2. Parts Category & Brand Pages Show "Coming Soon"
- `src/pages/parts/PartsCategory.tsx` — all parts category pages display "Coming Soon" with no actual product listings
- `src/pages/parts/PartsBrand.tsx` — all parts brand pages display "Coming Soon"

These pages ARE linked from the mobile nav and footer. Users clicking "MRI Coils", "Gradient Amplifiers", etc. hit empty placeholders.

### H3. Support Pages Show "Coming Soon"
`src/pages/support/SupportPage.tsx` shows a "Coming Soon" template for all support slugs. These are linked from service pages.

### H4. Track Order Page Has No Actual Tracking
`src/pages/TrackOrder.tsx` is just a static page with "Contact us" and a link to the customer portal. There's no order number input or lookup. Fine for MVP, but the navigation prominently features "Track Order" which sets wrong expectations.

### H5. Security: XSS Risk in Product Detail
`ProductDetail.tsx` uses `dangerouslySetInnerHTML` for Shopify product descriptions without DOMPurify sanitization. If a Shopify admin account is compromised, malicious scripts could execute on customer browsers.

### H6. Security: Unrestricted Image Uploads
`equipment_images` table allows anonymous inserts — could be abused for storage attacks.

### H7. Security: Leaked Password Protection Disabled
The authentication system does not check passwords against known breach databases.

### H8. Cart Goes to Shopify Checkout
The cart/checkout flow redirects to Shopify's hosted checkout. This works but means the user leaves the site entirely. Ensure the Shopify store is properly configured and the billing plan is active — a 402 error is already handled in code, which suggests it may not be.

### H9. `calculate_sell_request_priority()` Function Has Mutable Search Path
Database linter flags this function's search_path is not set, which is a security concern.

---

## MEDIUM (Nice to Have)

### M1. No Email Verification Requirement
`useCustomerAuth.ts` `signUp()` does not enforce email verification before granting access. The user is immediately redirected to `/portal` after signup. This means fake/typo emails get full portal access.

### M2. Shopify Storefront Token Hardcoded
`src/lib/shopify.ts` has the Shopify Storefront token and domain hardcoded. While Storefront tokens are designed to be public, moving to env vars would enable rotation.

### M3. Missing `<Helmet>` on Several Pages
Some pages use `SEOHead`, some use `Helmet` directly, and some have neither. Inconsistent SEO metadata.

### M4. Mobile Nav "Your Cart" Links to `/products`
`MobileNav.tsx` line 280-285: "Your Cart" link goes to `/products` instead of opening the cart drawer. This is misleading — it should open the CartDrawer or link to a cart page.

### M5. Admin Components Bundled with Public App
All admin dashboard code is included in the main JavaScript bundle. This increases bundle size for all users and leaks admin UI structure. Should use `React.lazy()` for code splitting.

### M6. No 404 Handling for Dynamic Service/Equipment Slugs
If a user navigates to `/services/nonexistent-slug` or `/equipment/nonexistent-category`, the pages likely render with empty/broken content rather than a proper 404.

---

## LOW (Post-Launch)

### L1. Tailwind CDN Warning in Console
`cdn.tailwindcss.com should not be used in production` — this warning appears in console. May be from a third-party script or the preview environment.

### L2. Dual Google Analytics Tags
Two GA4 tags are loaded (`G-EL3T622HQP` and `G-EBT85C8L44`). Confirm both are needed, or consolidate to avoid double-counting sessions/pageviews.

### L3. PostHog Also Loaded
PostHog analytics is running alongside dual GA4 tags. Three analytics services may impact page load performance.

### L4. No robots.txt Content Audit
`public/robots.txt` exists but content wasn't verified for proper crawl rules.

### L5. Blog/Case Study Content is Static Data Files
All blog articles and case studies come from `src/data/` files, not a CMS or database. Adding/editing content requires code deploys.

---

## COMPLETE ROUTE MAP (60+ routes)

| Route | Status | Wired to Backend? |
|-------|--------|-------------------|
| `/` | Working | Shopify products |
| `/contact` | Working | Supabase leads + edge function |
| `/products` | Working | Shopify Storefront API |
| `/product/:handle` | Working | Shopify (XSS risk) |
| `/quote` | Working | Supabase leads + edge function |
| `/about` | Working | Static |
| `/track-order` | Static only | Links to portal, no tracking |
| `/faqs` | Working | Static |
| `/signup` | Working | Supabase auth (broken legal links) |
| `/buy-sell` | Working | Supabase sell requests |
| `/privacy-policy` | Working | Static |
| `/terms-of-service` | Working | Static |
| `/cookie-policy` | Working | Static |
| `/coming-soon` | Placeholder | N/A |
| `/services` | Working | Static catalog |
| `/services/:slug` | Working | Static + quote form |
| `/parts` | Redirect | → /products filtered |
| `/parts/:category` | Coming Soon | Empty placeholder |
| `/parts/brand/:brand` | Coming Soon | Empty placeholder |
| `/blog` | Working | Static data |
| `/blog/:slug` | Working | Static data |
| `/case-studies` | Working | Static data |
| `/mobile-rentals/*` | Working | Static + CTA forms |
| `/service-areas/*` | Working | Static |
| `/guides/*` | Working | Static |
| `/rentals` | Working | Supabase leads |
| `/auth/customer` | Working | Supabase auth |
| `/portal/*` | Working | Supabase (requires auth) |
| `/admin/*` | Working | Supabase (admin auth) |
| `/internal/timecard` | Working | Supabase (security issue) |
| `/review` | Working | Supabase reviews |
| `/quote/:token` | Working | Supabase quote acceptance |

---

## FORMS AUDIT

| Form | Location | Backend Wired? |
|------|----------|----------------|
| Contact Form | `/contact` | Yes — leads table + email notification |
| Quote Wizard | `/quote` | Yes — leads table + edge function |
| Sell Equipment | `/buy-sell` | Yes — equipment_sell_requests + edge function |
| Signup | `/signup` | Yes — Supabase auth + drip enrollment |
| Customer Login | `/auth/customer` | Yes — Supabase auth |
| Admin Login | `/admin/login` | Yes — Supabase auth |
| Service Request | Service pages | Yes — leads table + edge function |
| Make Offer | Product detail | Yes — product_offers + edge function |
| Rental Request | `/rentals` | Yes — leads table |
| Helium Quote | Helium service | Yes — leads table + edge function |
| Cryogenic Quote | Cryo service | Yes — leads table + edge function |
| Contractor Timecard | `/internal/timecard` | Yes — contractor_timecards (security issue) |
| Customer Review | `/review` | Yes — customer_reviews |

**All primary forms are wired to the backend.** No UI-only shells found.

---

## SUMMARY

- **6 Critical issues** that should be fixed before launch
- **9 High priority items** needed for a polished launch
- **6 Medium items** for improvement
- **5 Low items** for post-launch

The site is substantially functional with a working Shopify catalog, Supabase backend, auth system, admin dashboard, customer portal, and 15+ edge functions for email/SMS notifications. The biggest gaps are security hardening, broken legal links, and several "Coming Soon" placeholder pages that are actively linked in navigation.

