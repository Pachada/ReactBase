# ⚛️ React Code Review — ReactBase

**Stack:** React 19, TypeScript (strict), Vite, React Query v5, React Router v7, Mantine v8, react-hook-form, Vitest  
**Reviewed:** 2026-02-19

---

## ✅ What's Working Well

Before findings, worth calling out: the codebase is genuinely strong as a skeleton app — strict TypeScript throughout, no `any` types, no `dangerouslySetInnerHTML`, proper HTTPS enforcement, RBAC-aware routing, React Query for server state, lazy-loaded routes with Suspense, and a well-structured feature-based folder layout.

---

## 🔴 Medium Severity

### 1. Email Enumeration via 404 in `ForgotPasswordPage.tsx` (line 56–57)

**File:** `src/features/auth/ForgotPasswordPage.tsx`

```tsx
// ❌ Leaks whether an email is registered
if (error instanceof ApiError && error.status === 404) {
  message = 'No account found with that email address.'
}
```

**Why:** Attackers can probe which emails are registered. `SignUpPage` correctly avoids this on 409, but this endpoint undoes that protection.

**Fix:**

```tsx
// ✅ Always show a generic message regardless of whether the email exists
message = "If an account with that email exists, you'll receive a code shortly."
// Don't branch on 404 — proceed to OTP step either way
setStep(1)
```

---

### 2. `NotificationCenterContext.tsx` — Stale Closure in `useMemo` (line 58–65)

**File:** `src/core/notifications/NotificationCenterContext.tsx`

```tsx
// ❌ addNotification and clearNotifications are missing from deps
const value = useMemo(
  () => ({
    items,
    addNotification, // recreated every render, not listed in deps
    clearNotifications: () => setItems([]), // inline, not in deps
  }),
  [items], // only items listed
)
```

**Why:** `addNotification` is a new function reference every render. The `useMemo` will serve a stale `addNotification` between renders where `items` hasn't changed. ESLint's `react-hooks/exhaustive-deps` would flag this.

**Fix:** Wrap `addNotification` in `useCallback` and include it in the `useMemo` deps:

```tsx
const addNotification = useCallback(({ title, message, color }: AddNotificationInput) => {
  const notificationItem: NotificationFeedItem = { ... }
  setItems((prev) => [notificationItem, ...prev].slice(0, 30))
  notifications.show({ title, message, color })
}, []) // setItems is stable

const clearNotifications = useCallback(() => setItems([]), [])

const value = useMemo(
  () => ({ items, addNotification, clearNotifications }),
  [items, addNotification, clearNotifications],
)
```

---

### 3. `SessionTimeoutWarning.tsx` — Redundant and Overly Broad Effect Deps (line 49)

**File:** `src/core/auth/SessionTimeoutWarning.tsx`

```tsx
// ❌ `auth` (full object) AND `auth.sessionExpiresAt` in deps — redundant
// ❌ `auth` being a memoized object re-triggers the effect on ANY auth state change
}, [auth, auth.sessionExpiresAt, auth.status])
```

**Why:** `auth` is the entire memoized context value. Including it means the interval is torn down and recreated whenever any auth field changes (e.g., token refresh). Listing both `auth` and `auth.sessionExpiresAt` is redundant — the latter is already covered by the former.

**Fix:** Destructure and reference only the specific values used inside the effect:

```tsx
const { sessionExpiresAt, status, logout, resetSessionTimer } = useAuth()

useEffect(() => {
  // ... use sessionExpiresAt, status, logout directly
}, [sessionExpiresAt, status, logout, resetSessionTimer])
```

---

### 4. `AppShellLayout.tsx` — SRP Violation (~697 lines)

**File:** `src/app/AppShellLayout.tsx`

This single component manages: header, sidebar brand/nav, user menu, notification menu, coachmark onboarding, theme token drawer, breadcrumbs, mobile bottom nav, and scroll-to-top. It significantly exceeds a manageable component size.

**Suggested extraction:**

```
AppShellLayout.tsx      (orchestrator, ~80 lines)
├── AppHeader.tsx           (search, actions, user menu, notifications)
├── AppSidebar.tsx          (nav groups, brand logo, collapse logic)
├── CoachmarkPanel.tsx      (onboarding coachmark overlay)
├── MobileBottomNav.tsx     (mobile tab bar)
└── ThemeTokenDrawer.tsx    (theme settings drawer)
```

---

### 5. `SettingsPage.tsx` — SRP Violation (~907 lines)

**File:** `src/features/settings/SettingsPage.tsx`

While sub-components (`ProfileSection`, `AppearanceSection`) are defined inline, `ProfileSection` alone is ~360 lines handling profile viewing, editing, and password changing.

**Suggested extraction:**

```
settings/
├── SettingsPage.tsx             (~60 lines — layout + nav only)
├── ProfileSection.tsx           (~200 lines)
│   └── ChangePasswordModal.tsx  (extracted modal)
└── AppearanceSection.tsx        (~180 lines)
```

---

## 🟡 Low Severity

### 6. Missing React Error Boundaries

**Files:** `src/app/router.tsx`, `src/app/AppShellLayout.tsx`

There are no Error Boundaries anywhere. An uncaught render error in any component will crash the entire app tree.

**Fix:** Add a route-level error boundary using `react-error-boundary` (no class components needed):

```tsx
import { ErrorBoundary } from 'react-error-boundary'

// In App.tsx or router.tsx
;<ErrorBoundary fallback={<ErrorPage />}>
  <RouterProvider router={router} />
</ErrorBoundary>
```

---

### 7. `Suspense fallback={null}` → Blank Screen on Route Load

**File:** `src/app/router.tsx` (line 41–43)

```tsx
const withSuspense = (element: ReactElement) => (
  <Suspense fallback={null}>{element}</Suspense> // ❌ blank screen during load
)
```

**Fix:** Use a minimal skeleton or spinner:

```tsx
const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<PageSkeleton />}>{element}</Suspense>
)
```

---

### 8. Unsafe Double-Cast `as unknown as string` in Two Places

**Files:** `src/features/admin/UsersTab.tsx` (line 146), `src/features/settings/SettingsPage.tsx` (line 250)

```tsx
// ❌ Bypasses type system — `values.birthday` is already typed as `Date | null`
parseBirthday(values.birthday as unknown as string)
```

**Why this appears:** The `parseBirthday` function accepts `string | null | undefined`, but the form field is `Date | null`. The `instanceof Date` guard handles the Date case already, so this branch only ever runs when the value is `null` — in which case `parseBirthday(null)` returns `null` without the cast.

**Fix:**

```tsx
// ✅ The null path is safe without casting
const newBirthday = values.birthday instanceof Date ? values.birthday : null
```

---

### 9. Missing `aria-label` on Admin Table Action Icons

**Files:** `src/features/admin/UsersTab.tsx`, `RolesTab.tsx`, `StatusesTab.tsx`

```tsx
// ❌ Screen readers get no label for these icon-only buttons
<ActionIcon variant="subtle" onClick={() => handleEdit(u)}>
  <Pencil size={14} />
</ActionIcon>
```

**Fix:**

```tsx
<ActionIcon aria-label={`Edit ${u.username}`} variant="subtle" onClick={() => handleEdit(u)}>
<ActionIcon aria-label={`Delete ${u.username}`} variant="subtle" color="red" ...>
```

---

### 10. `FontPicker.tsx` — Constant Value Stored as `useState`

**File:** `src/core/ui/FontPicker.tsx` (line 98)

```tsx
// ❌ Never changes, never needs to trigger a re-render
const [previewText] = useState('The quick brown fox jumps over the lazy dog')
```

**Fix:**

```tsx
// ✅ Plain module-level constant
const PREVIEW_TEXT = 'The quick brown fox jumps over the lazy dog'
```

---

### 11. `auth-storage.ts` — No Runtime Validation of Parsed JSON (line 33)

**File:** `src/core/auth/auth-storage.ts`

```tsx
parsed = JSON.parse(rawState) as PersistedAuthState // TypeScript cast, not runtime validation
```

The partial guard on line 39 (`!parsed.user || !parsed.token`) provides some safety, but malformed or tampered localStorage values could pass through. Consider a Zod schema or explicit field checks for the token format.

---

## 📋 Summary Table

| Severity  | Issue                                                         | File                                              |
| --------- | ------------------------------------------------------------- | ------------------------------------------------- |
| 🔴 Medium | Email enumeration on forgot password 404                      | `ForgotPasswordPage.tsx:56`                       |
| 🔴 Medium | Stale closure — `addNotification` missing from `useMemo` deps | `NotificationCenterContext.tsx:58`                |
| 🔴 Medium | Overly broad `useEffect` deps (`auth` object vs primitives)   | `SessionTimeoutWarning.tsx:49`                    |
| 🔴 Medium | SRP violation — 697 lines in layout component                 | `AppShellLayout.tsx`                              |
| 🔴 Medium | SRP violation — 907 lines in settings page                    | `SettingsPage.tsx`                                |
| 🟡 Low    | No React Error Boundaries                                     | `router.tsx` / `App.tsx`                          |
| 🟡 Low    | `Suspense fallback={null}` → blank screen on load             | `router.tsx:42`                                   |
| 🟡 Low    | `as unknown as string` double-cast for birthday field         | `UsersTab.tsx:146`, `SettingsPage.tsx:250`        |
| 🟡 Low    | Missing `aria-label` on edit/delete `ActionIcon` components   | `UsersTab.tsx`, `RolesTab.tsx`, `StatusesTab.tsx` |
| 🟡 Low    | Preview text constant stored as `useState`                    | `FontPicker.tsx:98`                               |
| 🟡 Low    | No runtime validation for localStorage JSON parse             | `auth-storage.ts:33`                              |

**No critical findings** — no `dangerouslySetInnerHTML`, no untyped `any`, no unhandled async errors, no exposed secrets, proper RBAC enforcement throughout.
