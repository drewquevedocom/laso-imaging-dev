

# Plan: Add Time Adjustment for Staff Entries + Testing

## Current State

Staff can only fix **missed clock-outs** (entries from previous days with no clock-out). There is **no way** to edit clock-in time, clock-out time, or break minutes on completed entries from the current week. The edge function already supports a `fix_missed` action that updates `clock_out` with an audit trail — we can extend this pattern.

## Changes

### 1. Extend the `timecard-clock` Edge Function

Add a new `edit_entry` action that allows updating both `clock_in` and `clock_out` on non-submitted entries, with a required `edit_reason` for the audit log. Guard against editing submitted/locked entries.

**File:** `supabase/functions/timecard-clock/index.ts`
- Add `case "edit_entry"` that accepts `entry_id`, `new_clock_in`, `new_clock_out`, and `edit_reason`
- Validates the entry belongs to the user, is not submitted, and not locked
- Updates both fields, logs old/new values to `timecard_audit_log`

### 2. Add Edit Entry UI to StaffTimecard

**File:** `src/pages/internal/StaffTimecard.tsx`

- Add state: `editEntry`, `editClockIn`, `editClockOut`, `editReason`, `showEditDialog`
- Add a pencil/edit icon button on each completed (non-active, non-submitted) entry row in the weekly summary table
- Add a new `Dialog` for editing an entry with fields for clock-in time, clock-out time, and reason (required)
- Add `handleEditEntry` handler that calls `invokeClockAction({ action: "edit_entry", ... })` and refreshes entries

### Summary of UI Flow

1. Staff sees a small edit icon on each row (only for completed, non-submitted entries)
2. Clicking opens a dialog pre-filled with current clock-in/out times
3. Staff adjusts times, provides a reason, and saves
4. Entry updates with full audit trail

