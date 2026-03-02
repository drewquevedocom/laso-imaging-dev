

# Plan: Update Phone Number Globally to (844) 511-5276

## Summary
Replace all instances of old phone numbers across the entire codebase with the new number **(844) 511-5276** and update all `tel:` links to `tel:18445115276`.

## Scope of Changes

Based on a thorough search, **45+ files** contain phone number references that need updating. The old numbers being replaced:
- `(818) 916-9503` / `8189169503` / `+1-818-916-9503`
- `1-800-MRI-LASO` / `1-800-674-5276` / `18006745276` / `+1-800-674-5276` / `+18006745276`
- `(713) 357-2749`

All will become: **(844) 511-5276** with `tel:18445115276` links.

---

## Files to Update

### Frontend Pages (16 files)
| File | What changes |
|------|-------------|
| `src/pages/Contact.tsx` | Phone display and tel: links |
| `src/pages/About.tsx` | CTA phone button |
| `src/pages/BuySell.tsx` | CTA phone button |
| `src/pages/ComingSoon.tsx` | Contact phone link |
| `src/pages/NotFound.tsx` | Help phone link |
| `src/pages/Quote.tsx` | Help text phone |
| `src/pages/FAQs.tsx` | Phone references |
| `src/pages/TrackOrder.tsx` | Phone number display |
| `src/pages/auth/CustomerAuth.tsx` | Help phone link |
| `src/pages/guides/Guides.tsx` | CTA phone button |
| `src/pages/guides/MobileRentalRates.tsx` | Phone links |
| `src/pages/guides/MRIMachineCost.tsx` | Phone references |
| `src/pages/guides/CTScannerCost.tsx` | Phone references |
| `src/pages/mobile-rentals/MobileRentals.tsx` | CTA phone buttons |
| `src/pages/mobile-rentals/MobileMRI.tsx` | Phone links |
| `src/pages/mobile-rentals/MobilePETCT.tsx` | Phone links |
| `src/pages/mobile-rentals/MobileCT.tsx` | Phone links |
| `src/pages/service-areas/ServiceAreas.tsx` | CTA phone button |
| `src/pages/services/ServicePage.tsx` | Phone links |

### Layout & Shared Components (7 files)
| File | What changes |
|------|-------------|
| `src/components/layout/Header.tsx` | Top bar phone display |
| `src/components/layout/Footer.tsx` | Footer phone numbers |
| `src/components/layout/MegaMenu.tsx` | Help text phone |
| `src/components/home/CTASection.tsx` | CTA button text |
| `src/components/chat/ChatbotWidget.tsx` | Fallback error message |
| `src/components/quote/QuoteWizard.tsx` | Help text |
| `src/components/quote/steps/StepReview.tsx` | Support info |

### SEO Schema Components (2 files)
| File | What changes |
|------|-------------|
| `src/components/seo/ServiceSchema.tsx` | telephone array |
| `src/components/seo/LocalBusinessSchema.tsx` | telephone fields, contactPoint entries |

### Data Files (1 file)
| File | What changes |
|------|-------------|
| `src/data/serviceAreas.ts` | phoneNumber fields for all 3 regions |

### Edge Functions (~15 files)
All email notification functions that include phone numbers in HTML templates:
- `ai-chatbot/index.ts` - system prompt and error messages
- `send-offer-notification/index.ts`
- `send-quote-notification/index.ts`
- `send-cryogenic-quote-notification/index.ts`
- `send-helium-quote-notification/index.ts`
- `send-customer-offer-approved/index.ts`
- `send-customer-offer-rejected/index.ts`
- `send-contact-notification/index.ts`
- `send-sell-notification/index.ts`
- `send-service-request-notification/index.ts`
- `send-offer-decision-notification/index.ts`
- `send-quote-email/index.ts`
- `send-drip-email/index.ts`
- `send-rental-request-notification/index.ts`
- `send-order-notification/index.ts`
- `send-timecard-notification/index.ts`

---

## Replacement Rules

| Old Value | New Value |
|-----------|-----------|
| `1-800-MRI-LASO (674-5276)` | `(844) 511-5276` |
| `1-800-MRI-LASO (1-800-674-5276)` | `(844) 511-5276` |
| `1-800-MRI-LASO` | `(844) 511-5276` |
| `Call 1-800-MRI-LASO` | `Call (844) 511-5276` |
| `(818) 916-9503` | `(844) 511-5276` |
| `(713) 357-2749` | `(844) 511-5276` |
| `tel:8189169503` | `tel:18445115276` |
| `tel:18006745276` | `tel:18445115276` |
| `tel:+18006745276` | `tel:+18445115276` |
| `tel:1-800-674-5276` | `tel:18445115276` |
| `tel:1-800-MRI-LASO` | `tel:18445115276` |
| `tel:+17133572749` | `tel:18445115276` |
| `+1-818-916-9503` (schema) | `+1-844-511-5276` |
| `+1-800-674-5276` (schema) | `+1-844-511-5276` |
| `1-800-674-5276` (data) | `1-844-511-5276` |

Note: Dynamic `tel:` links for customer/lead phone numbers (e.g., `tel:${lead.phone}`) will NOT be changed -- those are user-entered data, not company phone numbers.

