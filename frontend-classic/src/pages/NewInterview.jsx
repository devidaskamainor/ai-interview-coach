import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

const LEVELS = [
  { id: 'beginner', title: 'Beginner', desc: 'Fundamentals and core concepts' },
  { id: 'intermediate', title: 'Intermediate', desc: 'Trade-offs, debugging, applied design' },
  { id: 'advanced', title: 'Advanced', desc: 'Architecture, scale and edge cases' },
]

export default function NewInterview() {
  const nav = useNavigate()
  const [roles, setRoles] = useState([])
  const [rolesError, setRolesError] = useState('')
  const [role, setRole] = useState('Python Developer')
  const [custom, setCustom] = useState('')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [count, setCount] = useState(5)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.roles()
      .then((r) => setRoles(r.roles))
      .catch((e) => setRolesError(e.message || 'Could not load suggested roles. You can still enter a role below.'))
  }, [])

  async function start() {
    const finalRole = (custom.trim() || role).trim()
    if (finalRole.length < 2) {
      setError('Enter a role with at least 2 characters.')
      return
    }
    setBusy(true); setError('')
    try {
      const s = await api.createSession({ role: finalRole, difficulty, num_questions: count })
      nav(`/interview/${s.id}`)
    } catch (e) {
      setError(e.message); setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">New interview</h1>
        <p className="mt-1 text-muted">Questions are generated fresh each time for the role and level you choose.</p>
      </div>

      <fieldset>
        <legend className="mb-2 font-semibold">Role</legend>
        {rolesError && <p className="mb-2 text-sm text-bad">{rolesError}</p>}
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button key={r} type="button" onClick={() => { setRole(r); setCustom('') }}
              aria-pressed={!custom && role === r}
              className={`rounded-full border px-3 py-1.5 text-sm ${!custom && role === r ? 'border-signal bg-signal-soft text-signal-dark font-medium' : 'border-line bg-white hover:border-ink/40'}`}>
              {r}
            </button>
          ))}
        </div>
        <input className="field mt-3" placeholder="Or type another role, e.g. Android Developer"
          value={custom} onChange={(e) => setCustom(e.target.value)} maxLength={80} />
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-semibold">Difficulty</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {LEVELS.map((l) => (
            <button key={l.id} type="button" onClick={() => setDifficulty(l.id)} aria-pressed={difficulty === l.id}
              className={`panel p-4 text-left ${difficulty === l.id ? '!border-signal ring-1 ring-signal' : 'hover:border-ink/40'}`}>
              <div className="font-semibold">{l.title}</div>
              <div className="mt-1 text-sm text-muted">{l.desc}</div>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-semibold">Number of questions: {count}</legend>
        <input type="range" min={3} max={10} value={count} onChange={(e) => setCount(+e.target.value)} className="w-full accent-signal" />
      </fieldset>

      {error && <p className="text-sm text-bad">{error}</p>}
      <button className="btn-primary" onClick={start} disabled={busy}>
        {busy ? 'Generating your questions…' : 'Start interview'}
      </button>
    </div>
  )
}
