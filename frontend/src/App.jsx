import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import NewInterview from './pages/NewInterview'
import Interview from './pages/Interview'
import Auth from './pages/Auth'
import History from './pages/History'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import { LoadingState } from './components/UI'

export default function App() {
  const [session, setSession] = useState(undefined)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])
  if (session === undefined)
    return (
      <div className="initial-loading">
        <LoadingState />
      </div>
    )
  if (!session) return <Auth />
  return (
    <Header email={session.user.email}>
      <Routes>
        <Route path="/" element={<Dashboard email={session.user.email} />} />
        <Route path="/new" element={<NewInterview />} />
        <Route path="/interview/:id" element={<Interview />} />
        <Route path="/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route
          path="/settings"
          element={<Settings email={session.user.email} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Header>
  )
}
