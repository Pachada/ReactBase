# ReactBase Skeleton Generator Prompt

> Use this prompt to generate a production-ready React application skeleton aligned with this repository's current stack and configuration patterns.

---

## 🎯 Objective

Generate a complete React skeleton that can be reused as a secure, maintainable enterprise baseline. The scaffold should include:

- Modern React + TypeScript architecture
- Mantine-first UI foundation
- Route protection and RBAC-ready auth pattern
- Typed API client structure
- Testing, linting, and formatting setup
- One component showcase page including table and chart examples

---

## 📦 Required Stack and Versions

### Core

- **React 19**
- **TypeScript (strict)**
- **Vite 7**
- **React Router 7**

### UI and UX

- **@mantine/core**
- **@mantine/hooks**
- **@mantine/notifications**
- **@mantine/charts** + **recharts**
- **Lucide React**

### Forms

- **react-hook-form**

### Testing

- **Vitest** with **jsdom**
- **@testing-library/react**
- **@testing-library/user-event**
- **@testing-library/jest-dom** (Vitest matcher integration)

### Code Quality and Git Hooks

- **ESLint (flat config)** with:
  - TypeScript
  - React
  - React Hooks
  - React Refresh
  - JSX A11y
  - Prettier compatibility
- **Prettier**
- **Husky** + **lint-staged** pre-commit checks

---

## 🧱 Required Architecture

Use this project structure:

```text
src/
  app/          # providers, app shell layout, router, route guards
  core/         # auth, api, config
  features/     # domain features (auth, dashboard, components)
  pages/        # shared route-level pages
  test/         # setup and test utilities
```

Implement these foundations:

- `AppProviders` wrapping Mantine provider, notifications, and auth provider
- Protected routes with optional role checks (`admin`, `editor`, `viewer`)
- Auth context with typed state and login/logout contract
- Typed `HttpClient` and centralized API error model
- Environment config via `VITE_API_BASE_URL`

---

## 🧩 Components Showcase Requirements

Create a showcase page demonstrating:

- Buttons, badges, inputs, switches, tabs, progress
- **Data table** example
- **Charts** with multiple presentations:
  - Line chart
  - Bar chart

---

## ⚙️ Required Configuration

Ensure generated project includes and wires:

- TypeScript strict mode
- Vite alias `@ -> src`
- Vitest config in `vite.config.ts` with setup file
- Test setup polyfills needed by Mantine in jsdom (for example `matchMedia`, `ResizeObserver`)
- ESLint flat config
- Prettier config and ignore file
- `.env.example`
- npm scripts:
  - `dev`
  - `build`
  - `lint`
  - `lint:fix`
  - `typecheck`
  - `test`
  - `test:watch`
  - `format`
  - `format:check`

---

## 📚 Documentation to Include

### README.md

Include sections for:

- Project overview
- Tech stack
- Development commands
- Project structure
- Environment variables
- Testing guidelines
- Code patterns

### Additional Files

- `.gitignore`
- `LICENSE` (MIT)
- `CONTRIBUTING.md` (optional but recommended)

---

## 🎓 Key Principles

1. **Security First**: never expose secrets; use environment variables
2. **Type Safety**: strict TypeScript, explicit interfaces, avoid `any`
3. **Testability**: reusable test wrappers and mockable boundaries
4. **Maintainability**: clear feature boundaries and shared core layer
5. **Accessibility**: semantic structure and accessible component usage
6. **Performance**: support code splitting and optimized bundles
7. **Developer Experience**: fast feedback loop with lint/test/build checks

---

## 🚀 Usage

When using this prompt with an AI:

1. Copy this full prompt into your assistant
2. Specify app name and any custom features
3. Request full scaffold generation
4. Validate generated files against this checklist

Example request:

> "Using this ReactBase Skeleton Generator Prompt, scaffold a new app called `ProjectX` with the same stack and structure. Include protected routing, auth/RBAC foundation, Mantine components page with table + line/bar charts, and full tooling configuration."

---

**Version:** 2.0  
**Last updated:** 2026-02-16
