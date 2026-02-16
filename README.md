# ReactBase

Production-ready React application skeleton for building future apps quickly and consistently.

## Tech Stack

- React + TypeScript (strict)
- Vite + React Router
- Tailwind CSS v4 + shadcn/ui primitives
- Jest + Testing Library
- ESLint + Prettier + pre-commit hooks

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Type-check and create production build
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run formatting and lint checks
- `npm run lint:fix` - Auto-fix formatting and lint issues
- `npm run type-check` - Run TypeScript checks

## Project Structure

```text
public/
src/
  Main.tsx
  app/
    api.ts
    types.ts
    test-utils.tsx
    components/
      layout/
      ui/
    contexts/
    hooks/
    pages/home/
    utils/
  styles/
```

## Environment Variables

Copy `.env.example` to `.env` and update values:

- `VITE_API_BASE_URL` - Backend API base URL

## Testing Guidelines

- Import render utilities from `@/app/test-utils`
- Mock API calls through `@/app/api` to keep tests deterministic
- Favor user-oriented assertions via Testing Library
