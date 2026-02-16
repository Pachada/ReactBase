import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'
import type { Role } from '@/core/auth/types'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: Role[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const auth = useAuth()
  const location = useLocation()

  if (auth.status === 'anonymous') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !auth.hasRole(roles)) {
    return <Navigate to="/" replace />
  }

  return children
}
