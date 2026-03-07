

# Diagnosis: Quote Notification Email Failing

## Root Cause

The edge function logs confirm the error:

> "The noreply.lasoimaging.com domain is not verified. Please, add and verify your domain on https://resend.com/domains"

The `send-quote-notification` function sends from `hello@noreply.lasoimaging.com`, but only `updates.lasoimaging.com` is verified in Resend. This is a one-line fix.

## Fix

**File:** `supabase/functions/send-quote-notification/index.ts` (line 128)

Change the `from` address from:
```
"LASO Medical <hello@noreply.lasoimaging.com>"
```
to:
```
"LASO Medical <updates@updates.lasoimaging.com>"
```

This matches the verified Resend domain used by all other working edge functions.

## Additional Check

The function also sends a customer confirmation email further down. That `from` address should also be updated if it uses the same unverified domain.

No database or schema changes needed. After deploying, the quote form will send notifications successfully.

