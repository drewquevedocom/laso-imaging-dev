

# Fix: Make Offer Submission Failing

## Root Cause
In `src/components/offer/MakeOfferModal.tsx` (lines 72-82), the edge function call is awaited and errors are thrown:
```typescript
const { error } = await supabase.functions.invoke("send-offer-notification", {...});
if (error) throw error;
```

If the email notification fails (Resend API issue, domain verification, etc.), the user sees "Failed to submit offer" even though the lead data was already saved to the database. The `QuoteForm.tsx` handles this correctly by making the notification non-blocking.

## Fix
In `src/components/offer/MakeOfferModal.tsx`, change the edge function invocation from a blocking `await` + `throw` pattern to a non-blocking fire-and-forget pattern (matching `QuoteForm.tsx`):

```typescript
// Before (blocking - causes false failure):
const { error } = await supabase.functions.invoke("send-offer-notification", { body: {...} });
if (error) throw error;

// After (non-blocking - offer succeeds regardless of email):
supabase.functions.invoke("send-offer-notification", { body: {...} })
  .catch(err => console.error('Offer notification email failed:', err));
```

This is the only change needed. One file, ~5 lines replaced.

