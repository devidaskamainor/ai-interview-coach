import RubricBars from './RubricBars'
import ScoreRing from './ScoreRing'

function List({ title, items, tone }) {
  if (!items?.length) return null
  return (
    <div>
      <h4 className={`mb-1.5 text-sm font-semibold ${tone}`}>{title}</h4>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
        {items.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  )
}

export default function QuestionFeedback({ q }) {
  const fb = q.feedback || {}
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-6">
        <ScoreRing score={q.score ?? 0} size={104} />
        <div className="flex gap-8 text-sm">
          <div>
            <div className="text-muted">Technical</div>
            <div className="font-display text-2xl font-bold">{Number(q.technical_score).toFixed(1)}<span className="text-sm font-normal text-muted">/10</span></div>
          </div>
          <div>
            <div className="text-muted">Communication</div>
            <div className="font-display text-2xl font-bold">{Number(q.communication_score).toFixed(1)}<span className="text-sm font-normal text-muted">/10</span></div>
          </div>
        </div>
      </div>

      <RubricBars rubric={q.rubric} />

      <div className="grid gap-5 md:grid-cols-3">
        <List title="What worked" items={fb.strengths} tone="text-good" />
        <List title="Improve next time" items={fb.improvements} tone="text-warn" />
        <List title="Points you missed" items={fb.missing_points} tone="text-bad" />
      </div>

      {q.suggested_answer && (
        <div className="rounded-md border border-signal/20 bg-signal-soft p-4">
          <h4 className="mb-1.5 text-sm font-semibold text-signal-dark">Suggested answer</h4>
          <p className="whitespace-pre-line text-sm leading-relaxed">{q.suggested_answer}</p>
        </div>
      )}
    </div>
  )
}
