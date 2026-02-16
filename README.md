# ReactBase

Modern React application skeleton using Vite, TypeScript, Mantine, and enterprise-ready
foundations.

## ✨ What's New

**Production-grade UI/UX**: This skeleton now features:

- **Distinctive design system** with Outfit typography and backdrop-blur effects
- **Split-screen login** with animated hero panel and staggered form entrance
- **Polished dashboard** with stat cards, personalized greeting, and page transitions
- **Custom animations** (fade-slide entrance, card hover lift, floating accents)
- **GitHub Copilot skill** for frontend design guidance (`.github/skills/frontend-design/`)

See **[FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md)** for 40+ enhancement ideas.

## Tech stack

- React 19 + TypeScript (strict)
- Vite
- React Router
- Mantine + Lucide React
- react-hook-form
- Vitest + Testing Library
- ESLint + Prettier + Husky + lint-staged

## Development commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Project structure

```text
src/
  app/          # app shell, providers, routing
  core/         # auth, api client, env config
  features/     # feature modules (auth, dashboard, components)
  pages/        # shared route pages
  test/         # test setup and utilities
```

## Environment variables

Copy `.env.example` to `.env` and set:

- `VITE_API_BASE_URL`: backend API base URL

## Testing guidelines

- Write UI tests with Testing Library.
- Use `renderWithProviders` from `src/test/test-utils.tsx`.
- Keep tests focused on user behavior and accessibility.

## Code patterns

- Route protection is centralized in `ProtectedRoute`.
- Authentication state lives in `AuthContext`.
- API calls should use `HttpClient` and typed response contracts.
- Forms should use `react-hook-form` with explicit validation rules.

## GitHub Copilot Skills

This project includes a specialized **frontend-design** skill for Copilot CLI to guide creation of distinctive, production-grade UI components. To use:

```bash
/frontend-design
```

See [.github/skills/README.md](./.github/skills/README.md) for details.
