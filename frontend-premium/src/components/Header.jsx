import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/theme'
import Icon, { Brand } from './Icon'

const navigation = [
  { to: '/', label: 'Dashboard', icon: 'grid' },
  { to: '/new', label: 'Practice interview', icon: 'practice' },
  { to: '/history', label: 'Interview history', icon: 'history' },
  { to: '/analytics', label: 'Performance', icon: 'chart' },
]

export default function Header({ email, children }) {
  const { pathname } = useLocation()
  const { resolvedTheme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dialog = useRef(null)
  const userName =
    email?.split('@')[0]?.replace(/[._-]/g, ' ') || 'Your account'
  const current =
    navigation.find((item) => item.to === pathname)?.label ||
    (pathname === '/settings' ? 'Settings' : 'Interview room')
  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])
  useEffect(() => {
    if (mobileOpen && !dialog.current.open) dialog.current.showModal()
    if (!mobileOpen && dialog.current.open) dialog.current.close()
  }, [mobileOpen])

  const sidebar = (mobile = false) => (
    <>
      <div className="sidebar-brand">
        <Link to="/" aria-label="AI Interview Coach dashboard">
          <Brand compact={collapsed && !mobile} />
        </Link>
        {mobile && (
          <button
            className="icon-button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="close" />
          </button>
        )}
      </div>
      <div className="sidebar-section-label">WORKSPACE</div>
      <nav aria-label="Main navigation" className="sidebar-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            aria-label={item.label}
            title={collapsed && !mobile ? item.label : undefined}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'is-active' : ''}`
            }
          >
            <Icon name={item.icon} size={19} />
            <span className="nav-label">{item.label}</span>
            {item.to === '/new' && (
              <span className="nav-plus">
                <Icon name="plus" size={13} />
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="note-icon">
            <Icon name="sparkles" size={18} />
          </span>
          <p>
            A little practice.
            <br />
            <strong>A lot more confidence.</strong>
          </p>
          <Link to="/new">
            Make time for your next step
            <Icon name="arrow" size={14} />
          </Link>
        </div>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'is-active' : ''}`
          }
          aria-label="Settings"
        >
          <Icon name="settings" size={19} />
          <span className="nav-label">Settings</span>
        </NavLink>
        <div className="sidebar-profile">
          <span className="avatar">{userName.slice(0, 2).toUpperCase()}</span>
          <span className="profile-copy">
            <strong>{userName}</strong>
            <span title={email}>{email}</span>
          </span>
          <button
            className="icon-button signout-button"
            aria-label="Sign out"
            title="Sign out"
            onClick={() => supabase.auth.signOut()}
          >
            <Icon name="logout" size={17} />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-is-collapsed' : ''}`}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <aside className="sidebar">{sidebar()}</aside>
      <dialog
        ref={dialog}
        className="mobile-nav-dialog"
        aria-label="Navigation"
        onCancel={() => setMobileOpen(false)}
      >
        {sidebar(true)}
      </dialog>
      <div className="app-body">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Icon name="menu" />
            </button>
            <button
              className="icon-button desktop-collapse"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setCollapsed(!collapsed)}
            >
              <Icon name="collapse" size={19} />
            </button>
            <span className="breadcrumb-root">Workspace</span>
            <Icon name="chevron" size={12} />
            <span className="breadcrumb-current">{current}</span>
          </div>
          <div className="topbar-actions">
            <span className="personal-workspace">Personal workspace</span>
            <button
              className="icon-button"
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
              }
            >
              <Icon
                name={resolvedTheme === 'dark' ? 'sun' : 'moon'}
                size={19}
              />
            </button>
            <Link
              to="/settings"
              className="avatar avatar-small"
              aria-label="Account settings"
            >
              {userName.slice(0, 2).toUpperCase()}
            </Link>
          </div>
        </header>
        <main id="main-content" className="main-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="app-footer">
          <span>AI Interview Coach</span>
          <span>Progress, one conversation at a time.</span>
        </footer>
      </div>
    </div>
  )
}
