

# Plan: Fix Timecard Email Sender Domain

## The Issue
The `send-timecard-notification` edge function is using `hello@noreply.lasoimaging.com` as the sender, but the subdomain `noreply.lasoimaging.com` is not verified in Resend. This is causing the 500 error when trying to send your timecard.

## Solution
Update the edge function to use the verified `lasoimaging.com` domain instead of the unverified `noreply.lasoimaging.com` subdomain.

---

## Technical Change

**File:** `supabase/functions/send-timecard-notification/index.ts`

**Line 207** - Change sender from:
```typescript
from: "LASO Imaging <hello@noreply.lasoimaging.com>",
```

To:
```typescript
from: "LASO Imaging <timecards@lasoimaging.com>",
```

---

## After Implementation
Once deployed, I'll immediately re-trigger the email to send your timecard (Jan 23-29, 7.5 hours, $187.50) to marketing@lasoimaging.com.

---

## Note
Several other edge functions also use the unverified `noreply.lasoimaging.com` subdomain. You may want to verify that subdomain in Resend, or update all functions to use the main `lasoimaging.com` domain in a future update.

