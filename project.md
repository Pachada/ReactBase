# ReactBase — Project Overview

Concise reference for how the project is organized and where to configure core behavior.

## 1) What this project is

ReactBase is a frontend skeleton app built for fast product starts.  
It includes:

- Authentication flow (login, signup, forgot password)
- Role-based route protection (viewer/editor/admin)
- App shell with responsive navigation
- Theme customization (brand tokens, color presets, font picker)
- Notification center + toasts
- Demo dashboard and component showcase
- React Query example with optimistic updates

## 2) Tech stack

- React 19 + TypeScript + Vite
- Mantine (core, charts, notifications)
- React Router
- React Hook Form
- TanStack React Query
- Framer Motion
- Vitest + Testing Library
- ESLint + Prettier + Husky + lint-staged

## 3) Key folders

- `src/app/` — routing, shell layout, global providers
- `src/core/` — auth, config, theme, notifications, shared UI, API client
- `src/features/` — feature pages/components (auth, dashboard)
- `src/pages/` — static pages like 404
- `src/test/` — shared test setup/utilities

## 4) App architecture (high-level)

- Entry: `src/main.tsx`
- Root app: `src/App.tsx`
- Providers: `src/app/providers/AppProviders.tsx`
- Router: `src/app/router.tsx`
- Layout shell: `src/app/AppShellLayout.tsx`

Providers currently include:

- Auth context
- Theme tokens context
- Primary color context
- Mantine provider
- React Query `QueryClientProvider`
- Notification center provider

## 5) Routes

- `/login` — sign in
- `/signup` — sign up
- `/forgot-password` — reset flow (demo UI)
- `/` — protected dashboard shell
- `/components` — protected component showcase
- `/admin` — protected admin page (admin role only)

## 6) Auth model (demo)

Files:

- `src/core/auth/AuthContext.tsx`
- `src/core/auth/auth-storage.ts`
- `src/core/auth/SessionTimeoutWarning.tsx`

Behavior:

- Demo password: `changeme`
- Remember me supported:
  - `true` -> localStorage persistence
  - `false` -> sessionStorage persistence
- Session timeout warning modal for non-remembered sessions
- Logout clears auth state

## 7) Theming and branding

Files:

- `src/core/theme/ThemeTokensContext.tsx`
- `src/core/theme/color-presets.ts`
- `src/core/ui/FontPicker.tsx`
- `src/app/AppShellLayout.tsx`

Customizable tokens:

- `brandName`
- `radius`
- `fontFamily`
- `notificationPosition`

Primary color presets are centralized in `color-presets.ts`.

## 8) Environment variables

See `.env.example`.

- `VITE_API_BASE_URL`
- `VITE_ENABLE_THEME_TOKEN_EDITOR` (default `true`)

Runtime parsing/guards live in `src/core/config/env.ts`:

- Boolean parsing for feature flags
- Production HTTPS guard for API base URL

## 9) Data layer

- Shared HTTP client: `src/core/api/http-client.ts`
- React Query wired in providers
- Example optimistic mutation + rollback:
  - `src/features/dashboard/ProfileFormCard.tsx`
  - `src/features/dashboard/profile-api.ts`

## 10) UX systems included

- Route-aware breadcrumbs/title/command slot
- Desktop sidebar + mobile bottom nav
- Onboarding coachmarks
- Page transitions
- Skeleton loading states
- Empty state illustrations
- Scroll-to-top button
- Micro-interaction feedback

## 11) Developer commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## 12) Important notes

- This is a skeleton: some flows are intentionally demo/mock.
- Prefer extending `src/features/*` and shared primitives in `src/core/*`.
- Keep UI changes aligned with existing design direction (distinctive, production-ready, responsive).
