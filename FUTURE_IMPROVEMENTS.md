# Future Improvements & Feature Ideas

This document tracks potential enhancements for the ReactBase skeleton app, organized by category.

---

## ✅ Recently Completed

### UI/UX Enhancements

- [x] **Animated page transitions** — Route-level transition animations using `framer-motion` for smooth page-to-page navigation
- [x] **Skeleton loading states** — Shimmer skeleton placeholders for dashboard cards, tables, and charts
- [x] **Toast positioning preference** — User-selectable notification toast position (top-right, bottom-right, bottom-center)
- [x] **Mobile bottom navigation** — Bottom tab bar for thumb-zone optimized mobile access
- [x] **Empty state illustrations** — Custom SVG illustrations for no-data, no-results, and no-notifications states
- [x] **Micro-interaction feedback** — Haptic-style visual feedback (ripple, hover lift, press scale)
- [x] **Scroll-to-top button** — Floating scroll button that appears after scrolling threshold

### Theme & Branding

- [x] **Dark mode login hero** — Login hero panel dynamically adjusts colors based on light/dark theme
- [x] **Font picker with preview** — Interactive dropdown with 13 curated Google Fonts and live preview panel

---

## UI/UX Enhancements

- [ ] **Breadcrumb dropdown navigation** — Make breadcrumb segments interactive with dropdown menus to jump between sibling routes

## Theme & Branding

- [ ] **Custom color scale generator** — Add a UI in the theme editor to generate a full 10-shade color scale from any single hex color input
- [ ] **Logo upload slot** — Add a brand logo upload/URL field in the theme token editor that replaces the text-only brand name in the header
- [ ] **CSS variable export** — Add a "Copy theme as CSS variables" button in the theme editor for easy integration into external systems
- [ ] **Compact mode toggle** — Add a global density toggle (comfortable/compact) that adjusts padding, font sizes, and spacing app-wide

## Authentication & Authorization

- [ ] **OAuth/OIDC integration scaffold** — Add a pluggable auth adapter pattern with examples for Auth0, Clerk, and Supabase Auth.
- [ ] **Session timeout warning** — Show a countdown modal before auto-logout when the auth token is about to expire.
- [ ] **Remember me** — Add a "Remember me" checkbox on login that controls token persistence strategy (session vs. localStorage).
- [ ] **Multi-factor auth UI** — Add a TOTP/OTP input step after password verification for MFA-ready flows.
- [ ] **Permission-based UI** — Extend RBAC from role-level to granular permission-level visibility (e.g., `canEditUsers`, `canViewAuditLog`).

## Data & API

- [ ] **React Query integration** — Replace manual `useState` + `useEffect` data fetching with `@tanstack/react-query` for caching, retry, and background refetch.
- [ ] **Optimistic updates** — Add optimistic update patterns for form submissions (ProfileFormCard) with rollback on failure.
- [ ] **Pagination with URL sync** — Sync table pagination, sorting, and filters to URL search params for shareable/bookmarkable table states.
- [ ] **WebSocket notification channel** — Replace in-memory notification feed with a WebSocket or SSE connection for real-time server push.
- [ ] **API request/response interceptors** — Add global interceptors for auth token refresh, request deduplication, and error normalization.

## Developer Experience

- [ ] **Storybook integration** — Add Storybook for isolated component development and visual regression testing of all UI patterns.
- [ ] **Code splitting by route** — Lazy-load route components with `React.lazy()` + `Suspense` to reduce initial bundle size below the 500KB warning.
- [ ] **E2E testing with Playwright** — Add end-to-end tests for critical flows (login, navigation, theme switching, role-based access).
- [ ] **Feature flag system** — Add a lightweight feature flag context for toggling features without redeployment.
- [ ] **Error boundary with recovery** — Add a global `ErrorBoundary` component with a friendly error UI and "Try again" recovery action.
- [ ] **PWA support** — Add a service worker, web manifest, and offline fallback page for progressive web app capabilities.
- [ ] **i18n scaffold** — Add internationalization support with `react-intl` or `i18next` and a language switcher in the header.

## Accessibility

- [ ] **ARIA live region for route changes** — Announce route transitions to screen readers using an `aria-live` region.
- [ ] **Keyboard shortcut overlay** — Add a `?` keyboard shortcut that shows all available keyboard shortcuts in a modal.
- [ ] **Reduced motion support** — Respect `prefers-reduced-motion` media query by disabling all animations and transitions.
- [ ] **High contrast mode** — Add a high-contrast color scheme option in the theme editor for WCAG AAA compliance.
- [ ] **Focus management on navigation** — Auto-focus the main content heading after route changes for keyboard/screen reader users.

## Performance

- [ ] **Virtual scrolling for tables** — Use `@tanstack/react-virtual` for tables with large datasets instead of paginated slicing.
- [ ] **Image optimization pipeline** — Add automatic WebP/AVIF conversion and responsive `srcset` generation for any uploaded images.
- [ ] **Bundle analysis script** — Add `rollup-plugin-visualizer` to `vite.config.ts` for on-demand bundle size analysis.
- [ ] **Prefetch on hover** — Prefetch route data when the user hovers over nav links for instant page transitions.
