

# Fix: Staff Timecard Timer Not Counting

## Root Cause

`weekStart` and `weekEnd` (lines 89-90) are computed as **new Date objects on every render**. They're listed as dependencies of the `fetchEntries` `useCallback` (line 140), which means `fetchEntries` gets a new identity every render. Since `fetchEntries` is a dependency of the `useEffect` on line 164, this triggers an **infinite re-render/re-fetch loop**, preventing the timer from updating smoothly and causing the "Failed to fetch" errors seen in console.

## Fix

1. **Memoize `weekStart` and `weekEnd`** using `useMemo` so they only recalculate when the date actually changes (i.e., once per day):

```typescript
const weekStart = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);
const weekEnd = useMemo(() => endOfWeek(new Date(), { weekStartsOn: 1 }), []);
```

2. **Remove `weekStart`/`weekEnd` from `fetchEntries` dependency array** — use the memoized values via closure, with only stable references in deps.

This single change stops the infinite loop, allows entries to load properly, sets `activeEntry`, and lets the `setInterval` timer tick normally.

### File changed
- `src/pages/internal/StaffTimecard.tsx` — lines 89-90 and 140

