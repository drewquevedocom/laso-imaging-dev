

# Fix: Timecard Submission Error

## Root Cause

The same pattern as the offer modal bug we just fixed. In `src/pages/internal/ContractorTimecard.tsx` (lines 152-174), the `send-timecard-notification` edge function call is inside the same `try/catch` block as the database insert. If the edge function throws a network-level error (e.g., CORS preflight failure), it's caught by the outer `catch` block, which shows "Failed to submit timecard" -- even though the database insert already succeeded on line 148.

Additionally, the edge function `supabase/functions/send-timecard-notification/index.ts` has incomplete CORS headers (missing `x-supabase-client-platform` and related headers), which can cause the preflight request to be rejected by the browser.

## Fix (2 files)

### 1. `src/pages/internal/ContractorTimecard.tsx`
Move the edge function call outside the try/catch and make it non-blocking (fire-and-forget), so the DB insert success is reported immediately regardless of email delivery:

```typescript
// After DB insert succeeds, show success immediately
toast.success("Timecard submitted successfully!");
form.reset();

// Fire-and-forget email notification
supabase.functions.invoke("send-timecard-notification", { body: {...} })
  .then(({ error }) => {
    if (error) console.error("Email error:", error);
  })
  .catch(err => console.error("Timecard notification failed:", err));
```

### 2. `supabase/functions/send-timecard-notification/index.ts`
Update CORS headers to include all Supabase client headers:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
```

