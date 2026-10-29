import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import NewInterview from './pages/NewInterview'
import Interview from './pages/Interview'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (session === undefined) return <p className="p-8 text-muted">Loading…</p>
  if (!session) return <Auth />

  return (
    <>
      <Header email={session.user.email} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewInterview />} />
          <Route path="/interview/:id" element={<Interview />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
