import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const fn = mode === 'signin' ? supabase.auth.signInWithPassword : supabase.auth.signUp
      const { data, error } = await fn.call(supabase.auth, { email, password })
      if (error) setMsg({ type: 'error', text: error.message })
      else if (mode === 'signup' && !data.session)
        setMsg({ type: 'info', text: 'Check your email to confirm your account, then sign in.' })
    } catch (error) {
      setMsg({ type: 'error', text: error.message || 'Unable to connect. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <section className="flex flex-col justify-center bg-ink px-8 py-12 text-white md:px-16">
        <h1 className="max-w-md text-4xl font-bold leading-tight md:text-5xl">
          Practice the interview before it counts.
        </h1>
        <p className="mt-5 max-w-md text-white/75">
          Pick a role, answer real questions, and get scored on technical accuracy and how clearly you communicate.
        </p>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-bold">{mode === 'signin' ? 'Sign in' : 'Create your account'}</h2>
          <label className="block text-sm font-medium">
            Email
            <input className="field mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input className="field mt-1" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {msg && <p className={`text-sm ${msg.type === 'error' ? 'text-bad' : 'text-good'}`}>{msg.text}</p>}
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
          <button type="button" className="w-full text-sm text-muted hover:text-ink"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMsg(null) }}>
            {mode === 'signin' ? 'New here? Create an account' : 'Have an account? Sign in'}
          </button>
        </form>
      </section>
    </div>
  )
}
