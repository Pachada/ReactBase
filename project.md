# ReactBase Project Guide (AI-Friendly)

This file describes how the project is currently set up and exactly where to configure each behavior.

## 1) Stack and runtime

- **Framework**: React 19 + TypeScript + Vite
- **UI**: Mantine Core + Mantine Charts + Mantine Notifications
- **Routing**: React Router
- **Forms**: react-hook-form
- **Icons**: lucide-react
- **Testing**: Vitest + Testing Library + jsdom
- **Quality**: ESLint (flat config), Prettier, Husky, lint-staged

Key files:

- `package.json` (scripts, deps)
- `vite.config.ts` (Vite + `@` alias + Vitest setup)
- `src/main.tsx` (global style imports, app mount)
- `src/App.tsx` (provider + router wiring)

## 2) Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## 3) Environment configuration

File:

- `.env.example`

Variable:

- `VITE_API_BASE_URL=`

Runtime reader:

- `src/core/config/env.ts` (`env.apiBaseUrl`)

## 4) App composition and architecture

- `src/App.tsx` wraps app with `AppProviders` and renders `RouterProvider`.
- `src/app/providers/AppProviders.tsx` composes:
  - `AuthProvider`
  - `ThemeTokensContext`
  - `PrimaryColorContext`
  - `MantineProvider`
  - `NotificationCenterProvider`
  - `Notifications`

Routing:

- `src/app/router.tsx`
  - `/login` public
  - `/` protected shell
  - child routes: index dashboard, `/components`, `/admin` (admin only)
  - per-route `handle` metadata powers breadcrumbs/title/command area

Access control:

- `src/app/routes/ProtectedRoute.tsx`
- roles in `src/core/auth/types.ts` and labels/options in `src/core/auth/roles.ts`

## 5) Authentication model (demo)

Files:

- `src/core/auth/AuthContext.tsx`
- `src/core/auth/auth-storage.ts`

Current behavior:

- Demo password is **`changeme`**
- Login generates mock user/token and persists to localStorage
- Logout clears stored auth

Auth localStorage key:

- `reactbase.auth`

## 6) Main UX systems and how to configure them

### 6.1 Route context (breadcrumbs, page title, command area)

Configure in:

- `src/app/router.tsx` route `handle` object

Supported fields currently used:

- `title`: page title shown in header and document title
- `breadcrumb`: breadcrumb label
- `quickSearchPlaceholder`: placeholder text for global search input
- `actions`: array of command button slots

Example:

```ts
handle: {
  breadcrumb: 'Components',
  title: 'Components',
  quickSearchPlaceholder: 'Search components',
  actions: [
    { label: 'Add component', variant: 'light' },
    { label: 'Open docs', variant: 'default' },
  ],
}
```

### 6.2 Multi-level navigation groups + role visibility

Configure in:

- `src/app/AppShellLayout.tsx`
- `navGroups` constant

Model:

- Nav is grouped (e.g., `workspace`, `administration`)
- Each item can include `roles?: Role[]`
- Visibility uses `auth.hasRole(...)`

Persistence key for collapsed group state:

- `reactbase.navbar.group-collapsed`

Persistence key for desktop compact nav:

- `reactbase.navbar.desktop-collapsed`

### 6.3 Theme mode (light/dark)

Configure in:

- `src/app/AppShellLayout.tsx` (toggle UI)
- `src/app/providers/AppProviders.tsx` (`localStorageColorSchemeManager`)

Persistence key (user-scoped):

- `reactbase.theme.<user-email-or-anonymous>`

### 6.4 Primary color presets

Configure in:

- `src/core/theme/color-presets.ts`

What to edit:

- `PRIMARY_COLOR_PRESETS` (what appears in picker)
- `CUSTOM_THEME_COLORS` (custom scales map)
- Add 10-shade scales as `readonly` arrays when needed

Persistence key (user-scoped):

- `reactbase.primary-color.<user-email-or-anonymous>`

### 6.5 Theme token editor (white-label controls)

Files:

- `src/core/theme/ThemeTokensContext.tsx`
- `src/app/providers/AppProviders.tsx`
- `src/app/AppShellLayout.tsx` (Drawer UI)

Editable tokens today:

- `brandName`
- `radius` (`sm | md | lg | xl`)
- `fontFamily`

Effects:

- Header app name uses `brandName`
- Mantine theme uses tokenized `defaultRadius` and `fontFamily`
- Document title uses `brandName`

Persistence key (user-scoped):

- `reactbase.theme-tokens.<user-email-or-anonymous>`

### 6.6 Notification center pattern

Files:

- `src/core/notifications/NotificationCenterContext.tsx`
- `src/app/AppShellLayout.tsx` (feed menu UI)

Behavior:

- `addNotification` pushes to in-memory feed (max 30) and also shows Mantine toast
- Header bell opens latest feed entries

API:

```ts
const { items, addNotification, clearNotifications } = useNotificationCenter()
```

### 6.7 Onboarding coachmarks (first-run discoverability)

Configure in:

- `src/app/AppShellLayout.tsx`
  - `coachmarkSteps` array (title/description/target)

Styling in:

- `src/index.css`
  - `.coachmark-target`
  - `.coachmark-panel`

Persistence key:

- `reactbase.onboarding.completed`

Behavior:

- If not completed, panel shows step-by-step coachmarks
- Help icon restarts tour

### 6.8 Accessibility baseline

Implemented in:

- `src/app/AppShellLayout.tsx`
- `src/index.css`
- `src/core/ui/ErrorStateAlert.tsx`

Patterns:

- Skip link (`Skip to main content`)
- Semantic landmarks (`header`, `nav`, `main`)
- Global `:focus-visible` outline rule
- Alert components with ARIA-friendly semantics

## 7) Dashboard and components showcase configuration

### Dashboard page

File:

- `src/features/dashboard/DashboardPage.tsx`

Configurable layout preset:

- `compact` vs `detailed`

Persistence key:

- `reactbase.dashboard.layout-preset`

### Components page

File:

- `src/features/dashboard/ComponentsPage.tsx`

Table features:

- filtering, sorting, pagination, sticky header, row selection

Chart features:

- line/bar/area switch, legend toggle, loading/empty/error states, refresh action

Note:

- Current refresh behavior is mock/simulated (randomized error for demo)

## 8) Error-state standard

Reusable component:

- `src/core/ui/ErrorStateAlert.tsx`

Used by:

- `src/features/auth/LoginPage.tsx`
- `src/features/dashboard/ComponentsPage.tsx`

Pattern:

- clear title
- actionable message
- optional contextual button (`actionLabel` + `onAction`)

## 9) How to add a new route correctly

1. Add route in `src/app/router.tsx`.
2. Add `handle` metadata (`title`, `breadcrumb`, optional command area data).
3. Add navigation entry in `navGroups` inside `src/app/AppShellLayout.tsx`.
4. If role-restricted, add `roles` on nav item and/or wrap route with `ProtectedRoute`.

## 10) LocalStorage key index (quick reference)

- `reactbase.auth`
- `reactbase.theme.<user>`
- `reactbase.primary-color.<user>`
- `reactbase.theme-tokens.<user>`
- `reactbase.navbar.desktop-collapsed`
- `reactbase.navbar.group-collapsed`
- `reactbase.dashboard.layout-preset`
- `reactbase.onboarding.completed`

## 11) Testing and tooling notes

- Vitest config is in `vite.config.ts` (`jsdom`, globals, setup file).
- Test setup file: `src/test/setup.ts`.
- Lint + format hooks run through Husky/lint-staged from `package.json`.

## 12) Current implementation boundaries

- Global command search input is currently placeholder-only UI (no backend query wiring yet).
- Command area actions currently show placeholder notifications.
- Notification feed is in-memory per session (not persisted to localStorage/backend).
- Auth is demo-mode and must be replaced for production.
