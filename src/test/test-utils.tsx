import { render } from '@testing-library/react'
import type { PropsWithChildren, ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AppProviders } from '@/app/providers/AppProviders'

interface RenderWithProvidersOptions {
  route?: string
}

function Wrapper({
  children,
  route = '/',
}: PropsWithChildren<RenderWithProvidersOptions>) {
  return (
    <MemoryRouter initialEntries={[route]}>
      <AppProviders>{children}</AppProviders>
    </MemoryRouter>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  const { route } = options

  return render(ui, {
    wrapper: ({ children }) => <Wrapper route={route}>{children}</Wrapper>,
  })
}
