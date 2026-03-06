

# Staff Timecard System — Full Enhancement Plan

This is a large multi-part implementation covering database schema changes, new Edge Functions, a new admin page, and significant UI upgrades to the existing StaffTimecard page.

## Database Changes (Single Migration)

### Alter `timecard_entries`:
- Add `break_minutes` (integer, default 0)
- Add `entry_type` (text, default 'clock' — values: clock, pto, sick, holiday)
- Add `locked_by_admin` (boolean, default false)
- Add `unlocked_at` (timestamptz, nullable)

### Create `timecard_weeks` table:
- `id` (uuid PK), `user_id` (uuid, not null), `week_start` (date), `week_end` (date), `total_hours` (numeric), `submitted` (boolean, default false), `submitted_at` (timestamptz), `locked` (boolean, default false)
- RLS: users can manage own rows, admins can manage all

### Create `timecard_audit_log` table:
- `id` (uuid PK), `timecard_entry_id` (uuid), `user_id` (uuid), `action` (text — clock_in/clock_out/edit/break_start/break_end/submitted/unlocked), `old_value` (text), `new_value` (text), `edit_reason` (text), `performed_at` (timestamptz, default now())
- RLS: users can view own logs, admins can manage all

### Create `timecard_breaks` table:
- `id` (uuid PK), `entry_id` (uuid, references timecard_entries), `user_id` (uuid), `break_start` (timestamptz), `break_end` (timestamptz, nullable), `created_at` (timestamptz)
- RLS: users manage own, admins manage all

## Edge Functions

### 1. `timecard-clock` (new)
Server-side tamper-proof clock in/out/break operations. Accepts `action` (clock_in, clock_out, break_start, break_end), `entry_id` (for clock_out/breaks), `notes` (optional). Sets timestamps via `now()` server-side. Writes to `timecard_audit_log`.

### 2. `generate-timecard-pdf` (new)
Accepts week data, generates a PDF (using jsPDF pattern from existing `generate-quote-pdf`). Returns PDF as base64. Called on submission.

### 3. Update `send-staff-timecard` 
Accept optional PDF attachment (base64) and include break/tag columns in the HTML email.

## Frontend Changes

### `src/pages/internal/StaffTimecard.tsx` — Major Rewrite
1. **Overtime Detection**: Amber row highlight for days >8h, red weekly total for >40h, warning icon badges
2. **Break Tracking**: "Start Break"/"End Break" buttons visible while clocked in; live break timer; break column in weekly table; breaks fetched from `timecard_breaks`
3. **PTO/Sick/Holiday Tags**: Button row when not clocked in — creates 8h entry with `entry_type` tag; shown as label in table instead of clock times
4. **Progress Bar**: Below header — green fill to 40h, amber/orange beyond 40h, updates with live timer
5. **Browser Notification**: Request permission on mount; at 6PM local, fire notification if clocked in; localStorage guard for once-per-day
6. **Locking**: When `weekSubmitted`, all buttons disabled, green badge shown. Clock in/out calls go through `timecard-clock` Edge Function (tamper-proof)
7. **Historical Archive**: Collapsible "Past Timecards" section below weekly summary; queries last 12 submitted weeks from `timecard_weeks`; expandable read-only breakdown; "Download PDF" per week
8. **PDF on Submit**: Call `generate-timecard-pdf`, pass result to `send-staff-timecard` with attachment

### `src/pages/admin/AdminTimecards.tsx` — New Page
- Week selector (defaults to current week)
- Table: Staff Name | Total Hours | Status (Submitted/In Progress) | View Details | Unlock
- "View Details" opens modal with full daily breakdown + audit trail (collapsible)
- "Unlock Timecard" sets `locked_by_admin=false`, `unlocked_at=now()`, logs to audit
- CSV export button for all timecards in selected week
- Queries `timecard_weeks` joined with entries

### Routing & Navigation
- Add route `/admin/timecards` → `AdminTimecards` inside admin layout
- Add "Timecards" with Clock icon to AdminSidebar under Configuration group

## Implementation Order
1. Database migration (all tables + columns)
2. `timecard-clock` Edge Function (server-side timestamps + audit logging)
3. `generate-timecard-pdf` Edge Function
4. Update `send-staff-timecard` for PDF attachment
5. Rewrite `StaffTimecard.tsx` with all UI enhancements
6. Create `AdminTimecards.tsx` page
7. Update `App.tsx` routes and `AdminSidebar.tsx` navigation

