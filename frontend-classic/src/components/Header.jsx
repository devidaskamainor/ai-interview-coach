import { Link, NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Header({ email }) {
  const link = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-signal-soft text-signal-dark' : 'text-muted hover:text-ink'}`
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-display text-xl font-bold">Interview Coach</Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={link}>Progress</NavLink>
          <NavLink to="/new" className={link}>New interview</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted sm:inline">{email}</span>
          <button className="btn-ghost !py-1.5" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </div>
    </header>
  )
}
