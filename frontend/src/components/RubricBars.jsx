const LABELS = {
  technical_accuracy: 'Technical accuracy',
  completeness: 'Completeness',
  clarity: 'Clarity',
  structure: 'Structure',
}
export default function RubricBars({ rubric }) {
  if (!rubric) return null
  return (
    <dl className="rubric-bars">
      {Object.entries(LABELS).map(([key, label]) => {
        const value = Number(rubric[key] ?? 0)
        return (
          <div key={key}>
            <div className="rubric-label">
              <dt>{label}</dt>
              <dd>
                {value.toFixed(1)}
                <span>/10</span>
              </dd>
            </div>
            <div className="track">
              <span
                style={{ width: `${Math.max(0, Math.min(100, value * 10))}%` }}
              />
            </div>
          </div>
        )
      })}
    </dl>
  )
}
