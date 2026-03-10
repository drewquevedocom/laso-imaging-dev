

# Fix Email from Lead Detail Sidebar + Build Error

## Problem
1. **Email in Comms tab works but is bare-bones** — just a plain text box. The EmailTemplateSelector exists but isn't wired into the CommunicationHub, so there's no way to pick a professional template when emailing a lead from the sidebar.
2. **Build error** in `ErrorBoundary.tsx` — `process.env.NODE_ENV` not available in Vite (needs `import.meta.env.DEV`).

## Solution

### 1. Add Email Template Button to CommunicationHub
- Import `EmailTemplateSelector` into `CommunicationHub.tsx`
- Add a "Use Template" button next to the email compose area that opens the template selector dialog
- Pass `leadEmail`, `leadId`, and lead name as props
- This gives staff the ability to send professional templated emails directly from the lead sidebar

### 2. Fix Build Error
- In `ErrorBoundary.tsx` line 65, replace `process.env.NODE_ENV === 'development'` with `import.meta.env.DEV`

## Files to Edit

| File | Change |
|------|--------|
| `src/components/admin/CommunicationHub.tsx` | Add EmailTemplateSelector integration with "Use Template" button in email compose mode |
| `src/components/ErrorBoundary.tsx` | Fix `process.env.NODE_ENV` → `import.meta.env.DEV` |

