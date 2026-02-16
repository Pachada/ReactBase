# ReactBase

Modern React application skeleton using Vite, TypeScript, Mantine, and enterprise-ready
foundations.

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
