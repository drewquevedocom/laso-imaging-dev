

# Plan: Fix Dashboard KPI Cards, Restore Email Templates, Update Testing Guide

## 1. Dashboard KPI Cards -- Equal Sizing

The screenshot shows the 6 KPI cards have inconsistent heights because the title text wraps differently ("Available Equipment" is 2 lines vs others at 1 line, "Quote Pipeline" label wraps too). 

**Fix in `src/pages/admin/Dashboard.tsx`:**
- Add `h-full` to each Card and a `min-h-[140px]` to standardize card height
- Add `min-h-[40px]` to the CardTitle area so single-line and double-line titles occupy the same vertical space
- This ensures all 6 cards in the grid render at identical height regardless of text wrapping

## 2. Restore Email Templates

The database wipe cleared `email_templates`. Insert the standard starter templates via a migration:

**Database migration -- INSERT 6 templates:**
1. **First Contact Follow-Up** (follow_up) -- "Following up on your {{equipment_type}} inquiry"
2. **Pricing Proposal** (pricing) -- "{{equipment_type}} Pricing for {{company}}"
3. **Shipping Confirmation** (shipping) -- "Your {{equipment_type}} is on its way"
4. **Site Visit Confirmation** (site_visit) -- "Site Visit Scheduled - {{date}}"
5. **Asset Request** (asset_request) -- "Photos & Documentation for {{equipment_type}}"
6. **General Outreach** (general) -- "LASO Medical Imaging - {{equipment_type}}"

Each template will have professional body HTML with the LASO brand voice, correct variable placeholders, and `is_active = true`.

## 3. Update Testing Guide -- Add Missing Sections

The current Testing Guide covers 7 sections but is missing several admin features visible in the sidebar. Add these sections to the checklist in `src/pages/admin/TestingGuide.tsx`:

**New sections to add:**
- **Customers** -- CRM customer list, search, profile view
- **Product Search** -- Shopify-integrated product search for sales reps  
- **Orders** -- Order tracking and management
- **Offer Approvals** -- Pricing rule enforcement, approve/reject offers
- **Communication Hub** -- Unified messaging center
- **Customer Portal** -- End-to-end portal for customers (quotes, orders, messages, saved equipment)
- **Helium Emergency Modal** -- New helium refill modal with emergency flag
- **Mobile Navigation** -- Verify mobile mega menu mirrors desktop links
- **AI Chatbot (Ask LASO)** -- Chatbot widget functionality

Also add corresponding workflow cards for:
- **Helium Emergency Flow** -- Customer submits emergency helium request, admin sees pulsating alert
- **Customer Portal Flow** -- Customer signs up, views quotes, messages admin

**Files to edit:**
1. `src/pages/admin/Dashboard.tsx` -- KPI card sizing
2. `src/pages/admin/TestingGuide.tsx` -- Add 9 missing feature sections + 2 workflow cards
3. Database migration -- INSERT 6 email templates

