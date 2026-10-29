import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import QuestionFeedback from '../components/QuestionFeedback'
import ScoreRing from '../components/ScoreRing'
import { cap } from '../lib/format'

function Results({ session }) {
  const sm = session.summary || {}
  const Block = ({ title, items }) =>
    items?.length ? (
      <div>
        <h3 className="mb-1.5 font-semibold">{title}</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </div>
    ) : null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{session.role}: results</h1>
        <p className="text-muted">{cap(session.difficulty)} · {session.num_questions} questions</p>
      </div>

      <section className="panel flex flex-wrap items-start gap-8 p-6">
        <ScoreRing score={session.overall_score ?? 0} size={150} />
        <div className="min-w-[240px] flex-1 space-y-4">
          <p className="leading-relaxed">{sm.summary || 'Your interview results are ready. The overall summary is unavailable.'}</p>
          <div className="flex gap-8 text-sm">
            <div><span className="text-muted">Technical </span><b>{session.technical_avg}/10</b></div>
            <div><span className="text-muted">Communication </span><b>{session.communication_avg}/10</b></div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <Block title="Strengths" items={sm.strengths} />
        <Block title="Work on" items={sm.improvements} />
        <Block title="Next steps" items={sm.next_steps} />
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Question by question</h2>
        {session.questions.map((q) => (
          <details key={q.id} className="panel group">
            <summary className="flex cursor-pointer items-center justify-between gap-4 p-4">
              <span className="font-medium">{q.position}. {q.question}</span>
              <span className="font-display text-lg font-bold">{q.score}</span>
            </summary>
            <div className="space-y-5 border-t border-line p-4">
              <div>
                <h4 className="mb-1 text-sm font-semibold text-muted">Your answer</h4>
                <p className="whitespace-pre-line text-sm leading-relaxed">{q.answer}</p>
              </div>
              <QuestionFeedback q={q} />
            </div>
          </details>
        ))}
      </section>

      <div className="flex gap-3">
        <Link to="/new" className="btn-primary">Practice again</Link>
        <Link to="/" className="btn-ghost">Back to progress</Link>
      </div>
    </div>
  )
}

export default function Interview() {
  const { id } = useParams()
  const [session, setSession] = useState(null)
  const [idx, setIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setSession(null)
    setError('')
    api.getSession(id).then((s) => {
      setSession(s)
      const first = s.questions.findIndex((q) => !q.evaluated_at)
      setIdx(first === -1 ? s.questions.length - 1 : first)
    }).catch((e) => setError(e.message))
  }, [id])

  if (error && !session) return (
    <div role="alert" className="space-y-3">
      <p className="text-bad">{error}</p>
      <Link to="/" className="btn-ghost inline-block">Back to progress</Link>
    </div>
  )
  if (!session) return <p className="text-muted">Loading interview…</p>
  if (session.status === 'completed') return <Results session={session} />
  if (!session.questions.length) return (
    <div role="alert" className="space-y-3">
      <p className="text-bad">This interview has no questions. Start another interview from your progress page.</p>
      <Link to="/" className="btn-ghost inline-block">Back to progress</Link>
    </div>
  )

  const q = session.questions[idx]
  const isLast = idx === session.questions.length - 1

  async function submit() {
    setBusy(true); setError('')
    try {
      const updated = await api.submitAnswer(id, q.id, answer)
      setSession((s) => ({ ...s, questions: s.questions.map((x) => (x.id === q.id ? updated : x)) }))
    } catch (e) {
      setError(e.message || 'Unable to submit your answer. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function next() {
    setAnswer(''); setError('')
    if (!isLast) return setIdx(idx + 1)
    setBusy(true)
    try {
      setSession(await api.complete(id))
    } catch (e) {
      setError(e.message || 'Unable to finish this interview. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="mb-2 flex justify-between text-sm text-muted">
          <span>{session.role} · {cap(session.difficulty)}</span>
          <span>Question {idx + 1} of {session.questions.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-line">
          <div className="h-1.5 rounded-full bg-signal transition-all"
            style={{ width: `${(session.questions.filter((x) => x.evaluated_at).length / session.questions.length) * 100}%` }} />
        </div>
      </div>

      <section className="panel p-6">
        {q.topic && <div className="mb-2 text-sm font-medium text-signal-dark">{q.topic}</div>}
        <h1 className="text-2xl font-bold leading-snug">{q.question}</h1>
      </section>

      {!q.evaluated_at ? (
        <section className="space-y-3">
          <label htmlFor="answer" className="font-semibold">Your answer</label>
          <textarea id="answer" className="field min-h-[200px] leading-relaxed" value={answer}
            onChange={(e) => setAnswer(e.target.value)} maxLength={6000}
            placeholder="Answer as you would in the interview. Explain your reasoning and give an example where it helps." />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">{answer.length}/6000</span>
            <button className="btn-primary" onClick={submit} disabled={busy || answer.trim().length < 3}>
              {busy ? 'Evaluating…' : 'Submit answer'}
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="panel p-6 space-y-6">
            <div>
              <h2 className="mb-1 text-sm font-semibold text-muted">Your answer</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed">{q.answer}</p>
            </div>
            <QuestionFeedback q={q} />
          </section>
          <div className="flex justify-end">
            <button className="btn-primary" onClick={next} disabled={busy}>
              {busy ? 'Building your report…' : isLast ? 'Finish and see results' : 'Next question'}
            </button>
          </div>
        </>
      )}
      {error && <p className="text-sm text-bad">{error}</p>}
    </div>
  )
}
