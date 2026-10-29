import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import ProgressChart from '../components/ProgressChart'
import { cap, fmtDate, scoreColor } from '../lib/format'

function Stat({ label, value, suffix }) {
  return (
    <div className="panel p-4">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold">
        {value ?? '–'}{value != null && suffix && <span className="text-base font-normal text-muted">{suffix}</span>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [sessions, setSessions] = useState(null)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const load = async () => {
    setError('')
    try {
      const [s, l] = await Promise.all([api.stats(), api.listSessions()])
      setStats(s)
      setSessions(l.sessions)
    } catch (e) {
      setError(e.message || 'Unable to load your progress. Please try again.')
    }
  }
  useEffect(() => { load() }, [])

  async function remove(id) {
    if (!confirm('Delete this interview? This cannot be undone.')) return
    setDeletingId(id)
    setError('')
    try {
      await api.remove(id)
      await load()
    } catch (e) {
      setError(e.message || 'Unable to delete this interview. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (error) return (
    <div role="alert" className="space-y-3">
      <p className="text-bad">{error}</p>
      <button className="btn-ghost" onClick={load}>Try again</button>
    </div>
  )
  if (!stats || !sessions) return <p className="text-muted">Loading your progress…</p>

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Your progress</h1>
          <p className="text-muted">Scores from every completed interview.</p>
        </div>
        <Link to="/new" className="btn-primary">New interview</Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Interviews completed" value={stats.completed} />
        <Stat label="Average score" value={stats.avg_score} suffix="/100" />
        <Stat label="Technical average" value={stats.avg_technical} suffix="/10" />
        <Stat label="Communication average" value={stats.avg_communication} suffix="/10" />
      </div>

      {stats.trend.length > 0 ? (
        <section className="panel p-5">
          <h2 className="mb-3 text-lg font-semibold">Score over time</h2>
          <ProgressChart trend={stats.trend} />
        </section>
      ) : (
        <section className="panel p-8 text-center">
          <h2 className="text-lg font-semibold">No completed interviews yet</h2>
          <p className="mt-1 text-muted">Finish your first interview to start tracking progress.</p>
          <Link to="/new" className="btn-primary mt-4">Start your first interview</Link>
        </section>
      )}

      {(stats.by_role.length > 0 || stats.weak_topics.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          <section className="panel p-5">
            <h2 className="mb-3 text-lg font-semibold">By role</h2>
            <ul className="space-y-2 text-sm">
              {stats.by_role.map((r) => (
                <li key={r.role} className="flex justify-between">
                  <span>{r.role} <span className="text-muted">({r.count})</span></span>
                  <span className={`font-semibold ${scoreColor(r.avg)}`}>{r.avg}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel p-5">
            <h2 className="mb-3 text-lg font-semibold">Topics to revisit</h2>
            {stats.weak_topics.length ? (
              <ul className="space-y-2 text-sm">
                {stats.weak_topics.map((t) => (
                  <li key={t.topic} className="flex justify-between">
                    <span>{t.topic}</span><span className="text-muted">scored under 60 × {t.count}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">No weak spots yet. Nice work.</p>}
          </section>
        </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">History</h2>
        {sessions.length === 0 ? <p className="text-muted">Nothing here yet.</p> : (
          <ul className="panel divide-y divide-line">
            {sessions.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <div className="font-medium">{s.role}</div>
                  <div className="text-sm text-muted">
                    {cap(s.difficulty)} · {s.num_questions} questions · {fmtDate(s.created_at)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {s.status === 'completed'
                    ? <span className={`font-display text-xl font-bold ${scoreColor(s.overall_score)}`}>{Math.round(s.overall_score)}</span>
                    : <span className="rounded-full bg-signal-soft px-2.5 py-0.5 text-xs font-medium text-signal-dark">In progress</span>}
                  <Link className="btn-ghost !py-1.5" to={`/interview/${s.id}`}>
                    {s.status === 'completed' ? 'Review' : 'Resume'}
                  </Link>
                  <button className="text-sm text-muted hover:text-bad" onClick={() => remove(s.id)} disabled={deletingId === s.id}>
                    {deletingId === s.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
