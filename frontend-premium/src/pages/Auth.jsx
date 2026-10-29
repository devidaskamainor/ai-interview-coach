import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/theme'
import Icon, { Brand } from '../components/Icon'

export default function Auth() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const fn =
        mode === 'signin'
          ? supabase.auth.signInWithPassword
          : supabase.auth.signUp
      const { data, error } = await fn.call(supabase.auth, { email, password })
      if (error) setMsg({ type: 'error', text: error.message })
      else if (mode === 'signup' && !data.session)
        setMsg({
          type: 'info',
          text: 'Check your email to confirm your account, then sign in.',
        })
    } catch (error) {
      setMsg({
        type: 'error',
        text: error.message || 'Unable to connect. Please try again.',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-story">
        <Brand />
        <div className="auth-story-main">
          <span className="eyebrow">A LITTLE PRACTICE. A NEW POSSIBILITY.</span>
          <h1>
            Your next chapter
            <br />
            starts with <span>confidence.</span>
          </h1>
          <p>
            A thoughtful space to prepare, find your voice, and walk into your
            next interview ready.
          </p>
          <div className="auth-illustration" aria-hidden="true">
            <div className="illustration-orbit orbit-one" />
            <div className="illustration-orbit orbit-two" />
            <div className="illustration-center">
              <Icon name="practice" size={52} />
            </div>
            <span className="orbit-node node-one">
              <Icon name="code" size={24} />
            </span>
            <span className="orbit-node node-two">
              <Icon name="message" size={24} />
            </span>
            <span className="orbit-node node-three">
              <Icon name="check" size={24} />
            </span>
          </div>
          <div className="auth-benefits">
            <span>
              <Icon name="checkCircle" size={17} />
              Real interview questions
            </span>
            <span>
              <Icon name="checkCircle" size={17} />
              Personal, actionable feedback
            </span>
            <span>
              <Icon name="checkCircle" size={17} />
              Progress at your pace
            </span>
          </div>
        </div>
        <span className="auth-story-footer">
          PREPARE WITH INTENTION. SHOW UP AS YOURSELF.
        </span>
      </section>
      <section className="auth-form-side">
        <button
          className="icon-button auth-theme"
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          <Icon name={resolvedTheme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <Brand />
          </div>
          <span className="form-emblem">
            <Icon
              name={mode === 'signin' ? 'practice' : 'sparkles'}
              size={25}
            />
          </span>
          <h2>
            {mode === 'signin' ? 'Welcome back.' : 'Make your next move.'}
          </h2>
          <p className="auth-form-description">
            {mode === 'signin'
              ? 'Pick up where you left off. Your next opportunity awaits.'
              : 'Create your space to practice, learn, and grow.'}
          </p>
          <form onSubmit={submit} className="auth-form">
            <label htmlFor="email">Email address</label>
            <div className="input-with-icon">
              <Icon name="mail" size={18} />
              <input
                id="email"
                className="field"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                className="field"
                type={showPassword ? 'text' : 'password'}
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === 'signin'
                    ? 'Enter your password'
                    : 'Create a password (6+ characters)'
                }
              />
              <button
                type="button"
                className="icon-button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon name="eye" size={18} />
              </button>
            </div>
            {msg && (
              <p
                role={msg.type === 'error' ? 'alert' : 'status'}
                className={`inline-message ${msg.type === 'error' ? 'message-error' : 'message-info'}`}
              >
                <Icon name="info" size={17} />
                {msg.text}
              </p>
            )}
            <button className="btn-primary auth-submit" disabled={busy}>
              {busy
                ? 'Please wait…'
                : mode === 'signin'
                  ? 'Sign in to your workspace'
                  : 'Create your account'}
              {!busy && <Icon name="arrow" size={17} />}
            </button>
          </form>
          <p className="auth-switch">
            {mode === 'signin'
              ? 'New to Interview Coach?'
              : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setMsg(null)
              }}
            >
              {mode === 'signin' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
          <div className="auth-trust">
            <Icon name="shield" size={15} />
            <span>Your practice stays in your personal workspace.</span>
          </div>
        </div>
        <span className="auth-form-footer">
          One good conversation can change everything.
        </span>
      </section>
    </div>
  )
}
