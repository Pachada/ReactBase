import { LayoutDashboard, Library, Settings2, ShieldCheck } from 'lucide-react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/core/auth/AuthContext'
import { env } from '@/core/config/env'

interface MobileBottomNavProps {
  onOpenThemeDrawer: () => void
}

export function MobileBottomNav({ onOpenThemeDrawer }: MobileBottomNavProps) {
  const auth = useAuth()
  const location = useLocation()
  const themeTokenEditorEnabled = env.themeTokenEditorEnabled

  const isActiveLink = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <div className="mobile-bottom-nav-inner">
        <RouterLink
          to="/"
          className={`mobile-nav-item ${isActiveLink('/') ? 'active' : ''}`}
        >
          <LayoutDashboard />
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink
          to="/components"
          className={`mobile-nav-item ${isActiveLink('/components') ? 'active' : ''}`}
        >
          <Library />
          <span>Components</span>
        </RouterLink>
        {auth.hasRole(['admin']) && (
          <RouterLink
            to="/admin"
            className={`mobile-nav-item ${isActiveLink('/admin') ? 'active' : ''}`}
          >
            <ShieldCheck />
            <span>Admin</span>
          </RouterLink>
        )}
        {themeTokenEditorEnabled && (
          <button
            type="button"
            className="mobile-nav-item"
            onClick={onOpenThemeDrawer}
            aria-label="Settings"
          >
            <Settings2 />
            <span>Settings</span>
          </button>
        )}
      </div>
    </nav>
  )
}
