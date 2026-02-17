# ReactBase Project Guide (AI-Friendly)

This file describes how the project is currently set up and exactly where to configure each behavior.

## 1) Stack and runtime

- **Framework**: React 19 + TypeScript + Vite
- **UI**: Mantine Core + Mantine Charts + Mantine Notifications
- **Routing**: React Router
- **Forms**: react-hook-form
- **Icons**: lucide-react
- **Animations**: framer-motion (page transitions)
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

- `reactbase.navbar.group-open`

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
- `src/core/ui/FontPicker.tsx`
- `src/app/providers/AppProviders.tsx`
- `src/app/AppShellLayout.tsx` (Drawer UI)

Editable tokens today:

- `brandName`
- `radius` (`sm | md | lg | xl`)
- `fontFamily` (default: `Outfit, system-ui, sans-serif`) — Interactive picker with 13 curated Google Fonts and live preview
- `notificationPosition` (`top-right | bottom-right | bottom-center`)

Effects:

- Header app name uses `brandName`
- Mantine theme uses tokenized `defaultRadius` and `fontFamily`
- Document title uses `brandName`
- Font picker dynamically loads Google Fonts and shows live preview of selected font

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

### 6.8 Mobile navigation (bottom tab bar)

Implemented in:

- `src/app/AppShellLayout.tsx` (mobile-bottom-nav component)
- `src/index.css` (mobile-bottom-nav styles)

Features:

- Thumb-zone optimized bottom navigation bar (< 768px)
- Active state highlighting with primary color
- Role-based visibility (admin tab for admins only)
- Safe area inset support for notched devices
- Replaces hamburger menu on mobile for faster access

Navigation items:

- Dashboard, Components, Admin (role-gated), Settings

### 6.9 Page transitions

Component:

- `src/core/ui/PageTransition.tsx`

Behavior:

- Wraps page content with framer-motion animations
- Entry: 380ms fade + slide-up with custom easing
- Exit: 220ms fade + slide-down
- Smooth, production-grade transitions

Usage:

```tsx
import { PageTransition } from '@/core/ui/PageTransition'

export function MyPage() {
  return (
    <PageTransition>
      <Stack>{/* content */}</Stack>
    </PageTransition>
  )
}
```

### 6.10 Skeleton loading states

Components:

- `src/core/ui/SkeletonLoaders.tsx`

Available loaders:

- `DashboardStatCardSkeleton` — Stat cards with icon + text
- `DashboardCardSkeleton` — General cards
- `TableSkeleton` — Data tables with filters
- `ChartSkeleton` — Charts with controls

Features:

- Shimmer animation (1.5s ease-in-out infinite)
- Matches actual component dimensions
- CSS-based animation for performance

### 6.11 Empty states with illustrations

Component:

- `src/core/ui/EmptyState.tsx`

Illustrations:

- `no-data` — Dashed chart with dots (missing datasets)
- `no-results` — Magnifying glass with X (search/filter)
- `no-notifications` — Bell with slash (notification center)

Usage:

```tsx
<EmptyState
  illustration="no-results"
  title="No matches found"
  description="Try adjusting your filters"
  action={<Button>Clear filters</Button>}
/>
```

### 6.12 Scroll to top button

Component:

- `src/core/ui/ScrollToTop.tsx`

Behavior:

- Appears after scrolling 400px
- Slide-up transition (300ms)
- Fixed position (bottom-right)
- Auto-adjusts position for mobile bottom nav
- Smooth scroll to top on click

Integrated in:

- `src/app/AppShellLayout.tsx`

### 6.13 Micro-interactions

Implemented in:

- `src/index.css`

Effects:

- Button/icon hover: `translateY(-1px)` lift
- Button/icon active: `scale(0.96)` press feedback
- Ripple effect: Radial gradient animation (600ms)
- Card hover: lift + shadow enhancement

CSS classes:

- `.btn-ripple` — For ripple effect on click
- All Mantine buttons/icons have micro-interactions by default

### 6.14 Accessibility baseline

Implemented in:

- `src/app/AppShellLayout.tsx`
- `src/index.css`
- `src/core/ui/ErrorStateAlert.tsx`

Patterns:

- Skip link (`Skip to main content`)
- Semantic landmarks (`header`, `nav`, `main`)
- Global `:focus-visible` outline rule (2px primary color)
- Alert components with ARIA-friendly semantics
- 44px minimum touch targets on mobile
- Keyboard navigation support

## 7) Design system and UI patterns

### Typography

- Primary font: **Outfit** (via Google Fonts)
- Font weights: 300, 400, 500, 600, 700, 800
- Distinctive geometric sans-serif with character
- Replaces generic Inter for memorable brand identity

### Animations and motion

Global animations in `src/index.css`:

- `fadeSlideUp` — Entry animation (0.38s)
- `scaleIn` — Scale entrance (0.5s)
- `float` — Floating effect for decorative elements
- `shimmer-slide` — Loading skeleton animation (1.8s)
- `ripple` — Click feedback (0.6s)

Usage:

- `.page-enter` — Page entrance animation
- `.shimmer-loading` — Shimmer effect on elements
- `.btn-ripple` — Button ripple on click

### Color strategy

- Cohesive aesthetic with dominant primary color
- 6 color presets (Indigo, Blue, Teal, Grape, Brand, Client Forest)
- Custom 10-shade color scales
- User-selectable via palette picker in header

### Visual effects

- **Backdrop blur header**: `blur(12px)` + semi-transparent background
- **Card hover lift**: `translateY(-2px)` + enhanced shadow
- **Custom scrollbar**: Thin (6px), subtle, theme-aware
- **Glassmorphism**: Header and mobile bottom nav

### Login page design

File: `src/features/auth/LoginPage.tsx`

Features:

- Split-screen editorial layout
- Adaptive hero panel with theme-aware gradients:
  - **Dark mode**: Deep blue gradient (`#0c1222` → `#162032` → `#0f172a`)
  - **Light mode**: Soft slate gradient (`#f8fafc` → `#e2e8f0` → `#cbd5e1`)
  - Smooth transitions (0.3s) when switching color schemes
- Floating decorative accents with primary color tint
- Clean form panel (right) with staggered entrance animations
- Responsive: hides hero on mobile
- Distinctive visual identity that adapts to user preference

### Dashboard design

File: `src/features/dashboard/DashboardPage.tsx`

Features:

- Time-of-day personalized greeting
- 4 stat cards with themed icons (RBAC, Typed API, Color presets, Components)
- Page entrance animation
- Layout preset toggle (compact vs detailed)

## 8) Dashboard and components showcase configuration

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

## 9) Error and empty state patterns

### Error-state component

Reusable component:

- `src/core/ui/ErrorStateAlert.tsx`

Used by:

- `src/features/auth/LoginPage.tsx`
- `src/features/dashboard/ComponentsPage.tsx`

Pattern:

- Clear title with AlertTriangle icon
- Actionable message
- Optional contextual button (`actionLabel` + `onAction`)
- Red color variant for errors

### Empty-state component

Reusable component:

- `src/core/ui/EmptyState.tsx`

Illustrations:

- `no-data`, `no-results`, `no-notifications`
- Custom inline SVG illustrations
- Icon fallback option

Pattern:

- Centered layout with illustration/icon
- Title + description
- Optional action button
- Used for: empty tables, no search results, no notifications

## 10) GitHub Copilot Skills

Location: `.github/skills/`

### frontend-design skill

File: `.github/skills/frontend-design/SKILL.md`

Purpose:

- Guides creation of distinctive, production-grade frontend interfaces
- Avoids generic AI aesthetics
- Provides design thinking framework

Usage:

```bash
/frontend-design create a pricing page
```

Content:

- Design thinking framework (purpose, tone, constraints, differentiation)
- 10 aesthetic direction options
- Typography, color, motion, layout guidelines
- Anti-pattern checklist
- Real examples from this project

## 11) How to add a new route correctly

1. Add route in `src/app/router.tsx`.
2. Add `handle` metadata (`title`, `breadcrumb`, optional command area data).
3. Wrap page component with `PageTransition` for smooth animations.
4. Add navigation entry in `navGroups` inside `src/app/AppShellLayout.tsx`.
5. If role-restricted, add `roles` on nav item and/or wrap route with `ProtectedRoute`.
6. Add to mobile bottom nav if it's a primary route.

## 12) LocalStorage key index (quick reference)

- `reactbase.auth`
- `reactbase.theme.<user>`
- `reactbase.primary-color.<user>`
- `reactbase.theme-tokens.<user>` (includes `notificationPosition`)
- `reactbase.navbar.desktop-collapsed`
- `reactbase.navbar.group-collapsed`
- `reactbase.dashboard.layout-preset`
- `reactbase.onboarding.completed`

## 13) Reusable UI components

Core UI library in `src/core/ui/`:

- `ErrorStateAlert.tsx` — Error states with icon + action
- `EmptyState.tsx` — Empty states with SVG illustrations
- `PageTransition.tsx` — Framer Motion page wrapper
- `SkeletonLoaders.tsx` — Loading state skeletons (stat cards, tables, charts)
- `ScrollToTop.tsx` — Floating scroll-to-top button

Usage pattern:

```tsx
import { EmptyState } from '@/core/ui/EmptyState'
import { PageTransition } from '@/core/ui/PageTransition'
import { DashboardStatCardSkeleton } from '@/core/ui/SkeletonLoaders'

// In your page component
export function MyPage() {
  return (
    <PageTransition>
      <Stack>
        {loading && <DashboardStatCardSkeleton />}
        {!loading && data.length === 0 && (
          <EmptyState
            illustration="no-data"
            title="No data yet"
            description="Get started by adding your first item"
          />
        )}
      </Stack>
    </PageTransition>
  )
}
```

## 14) Testing and tooling notes

- Vitest config is in `vite.config.ts` (`jsdom`, globals, setup file).
- Test setup file: `src/test/setup.ts`.
- Lint + format hooks run through Husky/lint-staged from `package.json`.

## 15) Current implementation boundaries

- Global command search input is currently placeholder-only UI (no backend query wiring yet).
- Command area actions currently show placeholder notifications.
- Notification feed is in-memory per session (not persisted to localStorage/backend).
- Auth is demo-mode and must be replaced for production.
- Page transitions use framer-motion (adds ~120KB to bundle).
- Skeleton loaders are presentational (wire to actual data fetching hooks).
- Mobile bottom nav is CSS-hidden on desktop (not code-split).

## 16) Design principles applied

This skeleton follows industrial/utilitarian aesthetic with modern refinements:

**Typography**: Outfit font family (distinctive, geometric, characterful)

**Color**: Dominant primary color + sharp accents (not evenly distributed)

**Motion**: Purposeful animations that enhance usability

- Page transitions for spatial continuity
- Micro-interactions for tactile feedback
- Loading skeletons for perceived performance

**Layout**: Thumb-zone optimization on mobile, generous whitespace on desktop

**Visual details**:

- Backdrop blur effects (glassmorphism)
- Custom SVG illustrations (not stock icons)
- Shimmer loading animations
- Subtle card hover effects

**Accessibility**:

- 44px minimum touch targets on mobile
- Semantic HTML with ARIA labels
- Keyboard navigation support
- Focus-visible outlines (2px primary color)

See `.github/skills/frontend-design/SKILL.md` for complete design guidelines.
