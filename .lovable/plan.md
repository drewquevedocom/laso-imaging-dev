

## Expert Assessment -- Mobile Navigation Audit

As someone who's spent decades optimizing medical equipment e-commerce for engineers and resellers, here's the blunt truth: **your mobile nav is currently losing you sales.** Engineers searching on tablets between service calls and resellers browsing on phones need the same precision filtering as desktop users. Right now, the mobile menu uses vague search queries (`query=MRI+Coils`) while desktop uses exact Shopify product_type filters -- meaning mobile users get worse results.

### Critical Gaps Found

| Area | Desktop (Mega Menu) | Mobile Nav | Impact |
|------|---------------------|------------|--------|
| Equipment | 1.5T, 3.0T, Mobile MRI, 8/16/64-Slice CT, C-Arms with `product_type` filters | Generic `/equipment/...` links with no CT scanners at all | Engineers can't find CT on mobile |
| Parts | MRI Parts, RF Coils, Power Supplies with `product_type` + vendor filters | Generic `query=MRI+Coils` text search | Resellers get imprecise results |
| Parts Coils | Head, Body, Shoulder, Spine, CTL with `product_type:"RF Coils"` filter | Head, Body, Knee, Spine with generic query | Wrong coil types listed |
| Parts Support | Parts Request, Technical Support, Warranty, Returns | Missing entirely | No mobile path to support |
| Services | 4 columns: Install, Maintenance, Cryo, Training + Service Areas footer | 3 columns missing De-install, Remote Diagnostics, Compressor Service, Training | Incomplete service offering |
| Service Areas | Footer links: California, West Coast, Nationwide | Separate section but no connection to Services | Disjointed experience |
| Quick Actions | "Browse All Parts", "Request Quick Quote" footers | No equivalent CTAs within sections | No urgency drivers |

### Plan: Mirror Desktop Navigation in Mobile

**1. Rewrite EQUIPMENT section** to match MegaMenu exactly:
- BY FIELD STRENGTH: 1.5T MRI, 3.0T MRI, Mobile MRI, All MRI (using `product_type:` queries)
- CT SCANNERS: 8-Slice, 16-Slice, 64-Slice, Portable C-Arms (using `product_type:` queries)
- MOBILE RENTALS: MRI, CT, PET/CT rental pages + Mobile MRI Systems
- BY BRAND: GE, Siemens, Philips, Canon with vendor-filtered queries
- Footer link: "Browse All Imaging Systems" -> `/products?category=imaging-systems`

**2. Rewrite PARTS section** to match PartsMegaMenu exactly:
- BY CATEGORY: MRI Parts, RF Coils, Power Supplies, Cold Heads, Compressors
- BY MANUFACTURER: GE, Siemens, Philips, Canon/Toshiba (vendor-filtered)
- COILS & ACCESSORIES: Head, Body, Shoulder, Spine, CTL
- SUPPORT: Parts Request, Technical Support, Warranty, Returns, Documentation
- Footer link: "Browse All Parts" + "Request Quick Quote"

**3. Rewrite SERVICES section** to match ServicesMegaMenu exactly:
- INSTALLATION: New System Install, Relocation, Site Planning, De-installation
- MAINTENANCE: Preventive Maintenance, Emergency Repairs, Software Updates, Remote Diagnostics
- CRYOGENIC: Helium Refills, Cold Head Service, Compressor Service, System Recovery
- TRAINING & MOBILE: Operator Training, Safety Certification, Mobile MRI Rental, Nationwide Coverage
- Footer: Service Areas links (California, West Coast, Nationwide)

**4. Add "Ask LASO AI" button** to mobile nav (currently only on desktop/tablet header).

**5. Add quick-action CTAs** inside each collapsible section footer matching the desktop mega menu footers.

### Pro Tips from 50 Years in Medical Equipment Web Marketing

1. **Engineers search by part number and product type, not brand first.** The category-first structure (BY CATEGORY before BY MANUFACTURER) is correct. Keep it.
2. **Resellers need vendor-filtered views** to compare inventory across OEMs. The vendor+product_type combo queries are essential.
3. **"Cold Heads" and "Compressors" are high-margin, high-search items.** They deserve top-level visibility, not buried under Power Supplies.
4. **The Support column in Parts is a conversion driver.** "Parts Request" and "Warranty Info" are trust signals that reduce friction. Missing them on mobile is leaving money on the table.
5. **Service Areas in the Services section footer** tell mobile users "we're local" -- critical for emergency repair inquiries which are almost always made on phones.

### Files to Edit

- `src/components/layout/MobileNav.tsx` -- Complete rewrite of all navigation data arrays to mirror the three desktop mega menus exactly, plus add section footer CTAs and Ask LASO AI button.

Single file change, all data-driven.

