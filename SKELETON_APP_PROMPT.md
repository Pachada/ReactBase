# React App Skeleton Generator Prompt

> **Use this prompt to generate a production-ready React application skeleton with modern best practices, proper architecture, and enterprise-grade patterns.**

---

## 🎯 Objective

Create a complete React application skeleton that serves as a reusable foundation for any React project. The skeleton should include:

- Modern tech stack with best-in-class tooling
- Well-organized project structure
- Security-first patterns (especially for sensitive data)
- Comprehensive testing setup
- Role-based authentication pattern
- Backend API integration structure
- Production-ready configurations
- One page showing all the available components

---

## 📦 Tech Stack Requirements

### Core Framework & Build Tools

- **React LTS+** with TypeScript (strict mode)
- **Vite LTS** for build tooling
- **React Router LTS** for routing
- **TypeScript LTS** with strict configuration

### Styling & UI Components

- **Tailwind CSS LTS** via `@tailwindcss/vite` plugin
- **shadcn/ui** components (Radix UI primitives + Tailwind)
- **Lucide React** for icons
- **class-variance-authority** for component variants
- **clsx** + **tailwind-merge** for conditional class handling

### Forms & Data

- **react-hook-form** for form management

### Testing

- **Jest** with **jsdom** environment
- **@testing-library/react** + **@testing-library/user-event**
- **@testing-library/jest-dom** for custom matchers

### Code Quality

- **ESLint** with TypeScript, React, React Hooks, Prettier plugins
- **Prettier** for code formatting
- **pre-commit** hooks for automated linting

---

## 📁 Project Structure

Create the following directory structure:

```
project-root/
├── public/
│   └── logo.svg                    # Application logo
├── src/
│   ├── Main.tsx                    # Application entry point with routing
│   ├── app/
│   │   ├── api.ts                  # Centralized API client
│   │   ├── types.ts                # TypeScript type definitions
│   │   ├── test-utils.tsx          # Custom test renderer with providers
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui base components
│   │   │   │   ├── utils.ts        # cn() utility for class merging
│   │   │   │   ├── button.tsx      # Example: Button component
│   │   │   │   ├── card.tsx        # Example: Card component
│   │   │   │   ├── select.tsx      # Example: Select component
│   │   │   │   ├── badge.tsx       # Example: Badge component
│   │   │   │   └── sonner.tsx      # Example: Toast notifications
│   │   │   └── layout/
│   │   │       └── AppLayout.tsx   # Persistent shell layout
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx     # Authentication & role management
│   │   │   └── AppStateContext.tsx # Global application state
│   │   ├── hooks/
│   │   │   └── index.ts            # Custom hooks barrel export
│   │   ├── pages/
│   │   │   └── home/
│   │   │       └── HomePage.tsx    # Example page component
│   │   └── utils/
│   │       ├── utils.ts            # Shared utility functions
│   │       └── validation.ts       # Input validation utilities
│   └── styles/
│       ├── index.css               # Entry point (imports others)
│       ├── tailwind.css            # Tailwind imports
│       └── theme.css               # CSS custom properties / design tokens
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── jest.config.ts                  # Jest configuration
├── jest-setup.ts                   # Jest setup file
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.node.json              # TypeScript config for Node scripts
├── vite.config.ts                  # Vite configuration
├── package.json                    # Dependencies and scripts
├── .env.example                    # Example environment variables
├── .gitignore                      # Git ignore patterns
└── README.md                       # Project documentation
```

---

## 🔧 Configuration Files

### 1. `package.json`

```json
{
  "name": "react-app-skeleton",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "lint": "yarn lint:format && yarn lint:fix",
    "lint:format": "prettier --loglevel warn --write \"./**/*.{js,jsx,ts,tsx,css,md,json}\"",
    "lint:fix": "eslint ./src --ext .jsx,.js,.ts,.tsx --quiet --fix --ignore-path ./.gitignore",
    "type-check": "tsc"
  },
  "dependencies": {
    "@radix-ui/react-select": "2.1.6",
    "@radix-ui/react-dialog": "1.1.6",
    "@radix-ui/react-label": "2.1.2",
    "@radix-ui/react-slot": "1.1.2",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "lucide-react": "0.487.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "7.55.0",
    "react-router": "^7.13.0",
    "sonner": "2.0.3",
    "tailwind-merge": "3.2.0"
  },
  "devDependencies": {
    "@babel/preset-env": "^7.18.9",
    "@babel/preset-react": "^7.18.6",
    "@babel/preset-typescript": "^7.18.6",
    "@tailwindcss/vite": "4.1.12",
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^14.3.0",
    "@types/node": "^18.7.6",
    "@types/react": "^18.0.15",
    "@types/react-dom": "^18.0.6",
    "@typescript-eslint/eslint-plugin": "^5.30.7",
    "@typescript-eslint/parser": "^5.30.7",
    "@vitejs/plugin-react": "4.7.0",
    "eslint": "^8.20.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-jest": "^26.6.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-react": "^7.30.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "jest": "^28.1.3",
    "jest-environment-jsdom": "^28.1.3",
    "jsdom": "^20.0.0",
    "pre-commit": "^1.2.2",
    "prettier": "^2.7.1",
    "tailwindcss": "4.1.12",
    "typescript": "^4.7.4",
    "vite": "6.3.5"
  },
  "pre-commit": "lint"
}
```

### 2. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 3. `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 4. `jest.config.ts`

```typescript
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
```

### 5. `jest-setup.ts`

```typescript
import '@testing-library/jest-dom';
```

### 6. `.eslintrc.json`

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "jest", "react", "prettier"],
  "env": {
    "browser": true,
    "node": true,
    "jest/globals": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "ignorePatterns": ["*.d.ts", "dist", "node_modules"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-undef": "off"
  }
}
```

### 7. `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2
}
```

### 8. `.env.example`

```bash
# Backend API base URL
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🎨 Core Files to Generate

### 1. `src/Main.tsx` - Application Entry

```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { HomePage } from './app/pages/home';
import { AppLayout } from './app/components/layout';
import { AuthProvider } from './app/contexts/AuthContext';
import { AppStateProvider } from './app/contexts/AppStateContext';
import { Toaster } from './app/components/ui/sonner';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppStateProvider>
          <Toaster />
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Routes>
        </AppStateProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
```

### 2. `src/app/types.ts` - Type Definitions

```typescript
/**
 * Core application types
 *
 * @security Mark sensitive fields with @phi or @sensitive comments
 * for documentation and security review purposes
 */

export type UserRole = 'admin' | 'user' | 'viewer';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

// Add your application-specific types here
```

### 3. `src/app/api.ts` - Centralized API Client

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Base API fetch wrapper for all API calls
 *
 * @security Never log request bodies or sensitive response data
 * @security All errors should be sanitized before displaying to users
 * @security Ensure HTTPS is used in production
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // TODO: Add authentication headers when implementing auth
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // Create sanitized error (do NOT expose backend error details)
    const safeError = new Error(`API Error: ${response.status} ${response.statusText}`);
    throw safeError;
  }

  return response.json();
}

/**
 * API client - centralized API methods
 *
 * Pattern: Export a single `api` object with all backend methods
 * Benefits: Easy to mock in tests, clear interface, type-safe
 */
export const api = {
  // Example: User endpoints
  getCurrentUser: () => fetchAPI<User>('/v1/users/me'),

  // Add your application-specific API methods here
};
```

### 4. `src/app/test-utils.tsx` - Custom Test Renderer

```typescript
import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { AppStateProvider } from './contexts/AppStateContext';

interface ExtendedRenderOptions extends RenderOptions {
  /** Skip wrapping with AppStateProvider (useful for testing contexts themselves) */
  skipAppState?: boolean;
}

/**
 * Custom render function that wraps components with required providers.
 *
 * Provides: BrowserRouter > AuthProvider > AppStateProvider
 *
 * @example
 * import { render, screen } from '@/app/test-utils';
 *
 * test('renders component', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 */
function render(ui: ReactElement, options?: ExtendedRenderOptions) {
  const { skipAppState, ...rtlOptions } = options || {};

  function Wrapper({ children }: { children: React.ReactNode }) {
    if (skipAppState) {
      return (
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      );
    }
    return (
      <BrowserRouter>
        <AuthProvider>
          <AppStateProvider>{children}</AppStateProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...rtlOptions });
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override the render function with our custom implementation
export { render };
```

### 5. `src/app/contexts/AuthContext.tsx` - Authentication Context

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../types';

interface AuthContextValue {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('user');

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isAuthenticated: true, // TODO: Implement real authentication
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 6. `src/app/contexts/AppStateContext.tsx` - Global State

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppStateContextValue {
  // Add your global state here
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppStateContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
```

### 7. `src/app/components/layout/AppLayout.tsx` - Persistent Shell

```typescript
import React from 'react';
import { Outlet, NavLink } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Home } from 'lucide-react';

/**
 * AppLayout — persistent shell rendered around all route content.
 *
 * Provides:
 * - Header with logo and navigation
 * - <Outlet /> for route children
 */
export function AppLayout() {
  const { currentRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="" className="h-8" />
              <span className="text-xl font-semibold text-gray-900">App Name</span>
            </div>

            <div className="text-sm text-gray-600">
              Role: <span className="font-medium">{currentRole}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b shrink-0" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 -mb-px">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                [
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ].join(' ')
              }
            >
              <Home className="h-4 w-4" />
              Home
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Route Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
```

### 8. `src/app/components/ui/utils.ts` - Class Utility

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for conditionally merging Tailwind classes
 * Combines clsx for conditional classes with tailwind-merge to handle conflicts
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500', 'px-4')
 * // Returns: 'py-1 bg-blue-500 px-4' (px-4 overrides px-2)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 9. `src/app/utils/validation.ts` - Input Validation

```typescript
/**
 * Sanitizes user input by trimming whitespace and limiting length
 *
 * @security Always sanitize user input before logging or displaying
 */
export function sanitizeInput(input: string, maxLength: number = 200): string {
  return input.trim().slice(0, maxLength);
}

/**
 * Validates email format (basic check)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### 10. `src/app/pages/home/HomePage.tsx` - Example Page

```typescript
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your App</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            This is a skeleton React application with best practices built in.
          </p>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 11. `src/styles/index.css` - Entry Point

```css
/* Import Tailwind and theme */
@import './tailwind.css';
@import './theme.css';

/* Global styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
}
```

### 12. `src/styles/tailwind.css` - Tailwind Imports

```css
@import 'tailwindcss';
```

### 13. `src/styles/theme.css` - CSS Variables

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}
```

---

## 🧩 shadcn/ui Components to Include

Generate at minimum these essential shadcn/ui components in `src/app/components/ui/`:

1. **button.tsx** - Button component with variants
2. **card.tsx** - Card, CardHeader, CardTitle, CardContent
3. **select.tsx** - Select, SelectTrigger, SelectValue, SelectContent, SelectItem
4. **badge.tsx** - Badge component for labels/counts
5. **sonner.tsx** - Toast notification wrapper

**Reference:** https://ui.shadcn.com/ for component implementation

---

## 📝 Code Patterns & Best Practices

### Component Pattern

```typescript
// Use function declarations (not arrow functions) with explicit interface props
interface MyComponentProps {
  title: string;
  onAction: () => void;
  variant?: 'primary' | 'secondary';
}

export function MyComponent({ title, onAction, variant = 'primary' }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

### Custom Hook Pattern

```typescript
// Custom hooks should handle loading, error, and data states
export function useData() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await api.getData();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
```

### API Call Pattern

```typescript
// Always use the centralized api object from src/app/api.ts
import { api } from '@/app/api';

async function handleSubmit() {
  try {
    const result = await api.createItem(data);
    // Handle success
  } catch (error) {
    // Handle error (already sanitized by fetchAPI)
    console.error('Operation failed:', error.message);
  }
}
```

### Testing Pattern

```typescript
// Always import from test-utils, not @testing-library/react directly
import { render, screen, waitFor } from '@/app/test-utils';
import userEvent from '@testing-library/user-event';
import { api } from '@/app/api';

// Mock the API client
jest.mock('@/app/api');
const mockApi = api as jest.Mocked<typeof api>;

beforeEach(() => {
  jest.clearAllMocks();
});

test('loads and displays data', async () => {
  const user = userEvent.setup();

  mockApi.getData.mockResolvedValueOnce([{ id: '1', name: 'Test' }]);

  render(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  const button = screen.getByRole('button', { name: /action/i });
  await user.click(button);

  expect(mockApi.performAction).toHaveBeenCalledWith('1');
});
```

---

## 🔒 Security Best Practices

### 1. **Never Log Sensitive Data**

```typescript
// ❌ BAD - Logs may contain sensitive information
console.log('API response:', response);

// ✅ GOOD - Log only safe metadata
console.log('API call succeeded:', { status: response.status });
```

### 2. **Sanitize Errors Before Display**

```typescript
// Already handled in fetchAPI wrapper in src/app/api.ts
// Do NOT expose backend error details to users or logs
```

### 3. **Enforce HTTPS in Production**

```typescript
// Already handled in src/app/api.ts
if (import.meta.env.PROD && API_BASE_URL.startsWith('http://')) {
  throw new Error('HTTPS required in production');
}
```

### 4. **Mark Sensitive Types**

```typescript
// Use @phi or @sensitive comments for documentation
export interface User {
  id: string;
  email: string; // @sensitive - do not log
  ssn?: string; // @phi - handle according to compliance requirements
}
```

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

- `.gitignore` - Standard React/Node patterns
- `LICENSE` - MIT or appropriate license
- `CONTRIBUTING.md` - Contribution guidelines (optional)

---

## ✅ Validation Checklist

Before considering the skeleton complete, verify:

- [ ] All dependencies install without errors (`yarn install`)
- [ ] Dev server starts successfully (`yarn dev`)
- [ ] TypeScript compiles without errors (`yarn type-check`)
- [ ] Linting passes (`yarn lint`)
- [ ] Tests run (even if none exist yet) (`yarn test`)
- [ ] Production build succeeds (`yarn build`)
- [ ] Import aliases work (`@/` resolves to `src/`)
- [ ] Router navigation works
- [ ] AuthContext provides role management
- [ ] AppLayout renders correctly with navigation
- [ ] Toast notifications appear (test with sonner)
- [ ] shadcn/ui components render properly
- [ ] Custom test-utils render function works
- [ ] API client structure is clear and mockable

---

## 🎓 Key Principles

1. **Security First** - Never expose sensitive data in logs, errors, or client-side code
2. **Type Safety** - Use TypeScript strict mode, explicit types, no `any`
3. **Testability** - Design for testing (mockable API, custom render wrapper)
4. **Maintainability** - Clear structure, consistent patterns, good naming
5. **Accessibility** - Use semantic HTML, ARIA labels, Radix UI primitives
6. **Performance** - Lazy load heavy dependencies, optimize bundle size
7. **Developer Experience** - Fast feedback (HMR, linting, pre-commit hooks)

---

## 📖 Additional Resources

- **shadcn/ui docs**: https://ui.shadcn.com/
- **Radix UI docs**: https://www.radix-ui.com/
- **Tailwind CSS docs**: https://tailwindcss.com/
- **React Router docs**: https://reactrouter.com/
- **Testing Library docs**: https://testing-library.com/

---

## 🚀 Usage

When using this prompt with an AI:

1. **Copy the entire prompt** to your AI assistant
2. **Specify any customizations** (app name, additional features, etc.)
3. **Request file-by-file generation** or full project scaffolding
4. **Validate** each section against the checklist above

**Example request:**

> "Using the React App Skeleton Generator Prompt above, create a complete project scaffold for a new application called 'ProjectX'. Include all configuration files, core files, and at least 5 shadcn/ui components (button, card, select, badge, sonner). Ensure all files are complete and production-ready."

---

**Generated by:** distribution-ui project analysis
**Version:** 1.0
**Last updated:** 2026-02-15
