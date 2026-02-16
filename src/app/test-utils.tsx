import type { ReactElement, ReactNode } from 'react';
import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppStateProvider } from '@/app/contexts/AppStateContext';
import { AuthProvider } from '@/app/contexts/AuthContext';

interface ExtendedRenderOptions extends RenderOptions {
  skipAppState?: boolean;
}

function Wrapper({ children, skipAppState }: { children: ReactNode; skipAppState?: boolean }) {
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

export function render(ui: ReactElement, options?: ExtendedRenderOptions) {
  const { skipAppState, ...renderOptions } = options ?? {};
  return rtlRender(ui, {
    wrapper: ({ children }) => <Wrapper skipAppState={skipAppState}>{children}</Wrapper>,
    ...renderOptions,
  });
}

export * from '@testing-library/react';
