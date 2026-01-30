

# Plan: Fix Timecard Email - Match Working Sender Format

## The Issue
The `send-timecard-notification` edge function is failing despite the domain being verified. However, the `enroll-customer-drip` function successfully sent an email using the same domain.

### Key Difference Found:
- **Working (enroll-customer-drip)**: `updates@updates.lasoimaging.com`
- **Failing (send-timecard-notification)**: `timecards@updates.lasoimaging.com`

While Resend should accept any prefix on a verified domain, there may be a configuration issue or the function may be using a cached version.

---

## Solution

Update the timecard function to use the exact same sender email format that works in the drip campaign function.

---

## Technical Change

**File:** `supabase/functions/send-timecard-notification/index.ts`

**Line 207** - Change sender from:
```typescript
from: "LASO Imaging <timecards@updates.lasoimaging.com>",
```

To:
```typescript
from: "LASO Imaging <updates@updates.lasoimaging.com>",
```

---

## After Implementation
1. Deploy the updated function
2. Re-trigger the timecard email for Andrew Quevedo (Jan 23-29, 7.5 hours, $187.50) to marketing@lasoimaging.com

---

## Alternative Investigation
If this still fails, there may be an issue with the RESEND_API_KEY secret not being properly accessible to this specific edge function. In that case, we would need to:
1. Re-save the RESEND_API_KEY secret
2. Verify the secret is properly propagated to all edge functions

