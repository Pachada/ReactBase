import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { AppProviders } from '@/app/providers/AppProviders'
import { router } from '@/app/router'
import { ErrorPage } from '@/pages/ErrorPage'

function App() {
  return (
    <AppProviders>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </AppProviders>
  )
}

export default App
