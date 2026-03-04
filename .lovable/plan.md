

## Plan: Sticky Mobile "Request Quote" Button + End-to-End Testing

### What's Already Done
The mobile navigation overhaul (mirroring desktop mega menus with `product_type` queries, vendor filters, Support column, Ask LASO AI button, section footer CTAs) was **already implemented** in the previous message. No changes needed there.

### What's New

**1. Sticky "Request Quote" Floating Button on Mobile**

Add a fixed-position CTA button at the bottom of the screen, visible only on mobile (`lg:hidden`), that appears on the product listing page. This keeps the highest-value conversion action always one tap away for engineers and resellers scrolling through inventory.

- **File:** `src/pages/products/ProductListing.tsx`
- Add a `<Link to="/quote">` button with:
  - `fixed bottom-4 right-4 z-40 lg:hidden` positioning
  - `shadow-xl` for visual prominence
  - Uses the existing `cta` button variant
  - `FileText` icon + "Get Quote" label (short for mobile)
  - Rounded pill shape for thumb-friendly tapping

**2. End-to-End Mobile Navigation Test**

After implementation, test on a 390x844 (iPhone) viewport:
- Open mobile nav hamburger menu
- Expand Equipment, Parts, Services sections
- Verify links navigate to correct filtered product listings
- Confirm the sticky quote button appears on the product listing page

### Files to Edit
- `src/pages/products/ProductListing.tsx` -- add sticky mobile CTA button

