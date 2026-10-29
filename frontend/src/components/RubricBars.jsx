import { scoreBg } from '../lib/format'

const LABELS = {
  technical_accuracy: 'Technical accuracy',
  completeness: 'Completeness',
  clarity: 'Clarity',
  structure: 'Structure',
}

export default function RubricBars({ rubric }) {
  if (!rubric) return null
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {Object.entries(LABELS).map(([key, label]) => {
        const v = Number(rubric[key] ?? 0)
        return (
          <div key={key}>
            <div className="mb-1 flex justify-between text-sm">
              <dt>{label}</dt>
              <dd className="font-semibold">{v.toFixed(1)}/10</dd>
            </div>
            <div className="h-2 rounded-full bg-line/70">
              <div className={`h-2 rounded-full ${scoreBg(v * 10)}`} style={{ width: `${v * 10}%` }} />
            </div>
          </div>
        )
      })}
    </dl>
  )
}
