import { fmtDate } from '../lib/format'
export default function ProgressChart({ trend }) {
  if (!trend?.length) return null
  const width = 680,
    height = 230,
    padding = { left: 35, right: 24, top: 15, bottom: 33 }
  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom
  const x = (index) =>
    padding.left +
    (trend.length === 1
      ? innerWidth / 2
      : (index / (trend.length - 1)) * innerWidth)
  const y = (score) =>
    padding.top +
    innerHeight -
    (Math.max(0, Math.min(100, score)) / 100) * innerHeight
  const points = trend
    .map((item, index) => `${x(index)},${y(item.score)}`)
    .join(' ')
  const labelStep = Math.max(1, Math.ceil((trend.length - 1) / 4))
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="performance-chart"
      role="img"
      aria-label={`Overall scores across ${trend.length} completed ${trend.length === 1 ? 'interview' : 'interviews'}`}
    >
      {[0, 25, 50, 75, 100].map((value) => (
        <g key={value}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={y(value)}
            y2={y(value)}
            stroke="rgb(var(--line))"
            strokeDasharray="3 5"
          />
          <text
            x={padding.left - 12}
            y={y(value) + 4}
            textAnchor="end"
            fontSize="10"
            fill="rgb(var(--muted))"
          >
            {value}
          </text>
        </g>
      ))}
      <polyline
        points={points}
        fill="none"
        stroke="rgb(var(--signal))"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {trend.map((item, index) => (
        <g key={item.id}>
          <circle
            cx={x(index)}
            cy={y(item.score)}
            r="4"
            fill="rgb(var(--surface))"
            stroke="rgb(var(--signal))"
            strokeWidth="2"
            tabIndex={0}
            aria-label={`${item.role}, ${item.score} out of 100, ${fmtDate(item.date)}`}
          >
            <title>{`${item.role} · ${item.score}/100 · ${fmtDate(item.date)}`}</title>
          </circle>
          {(index % labelStep === 0 || index === trend.length - 1) && (
            <text
              x={x(index)}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="rgb(var(--muted))"
            >
              {new Date(item.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
