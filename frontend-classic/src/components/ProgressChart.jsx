import { fmtDate } from '../lib/format'

export default function ProgressChart({ trend }) {
  if (!trend?.length) return null
  const W = 640, H = 200, P = { l: 32, r: 12, t: 12, b: 24 }
  const iw = W - P.l - P.r, ih = H - P.t - P.b
  const x = (i) => P.l + (trend.length === 1 ? iw / 2 : (i / (trend.length - 1)) * iw)
  const y = (s) => P.t + ih - (s / 100) * ih
  const pts = trend.map((t, i) => `${x(i)},${y(t.score)}`).join(' ')
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[480px] w-full" role="img" aria-label="Interview scores over time">
        {[0, 25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line x1={P.l} x2={W - P.r} y1={y(g)} y2={y(g)} stroke="#E4E9EE" />
            <text x={P.l - 6} y={y(g) + 4} textAnchor="end" fontSize="10" fill="#5B6B7A">{g}</text>
          </g>
        ))}
        <polyline points={pts} fill="none" stroke="#2447F5" strokeWidth="2.5" strokeLinejoin="round" />
        {trend.map((t, i) => (
          <g key={t.id}>
            <circle cx={x(i)} cy={y(t.score)} r="4.5" fill="#fff" stroke="#2447F5" strokeWidth="2.5">
              <title>{`${t.role} (${t.difficulty}) - ${t.score} on ${fmtDate(t.date)}`}</title>
            </circle>
            {(trend.length <= 8 || i % Math.ceil(trend.length / 8) === 0) && (
              <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#5B6B7A">{fmtDate(t.date).replace(/, \d{4}$/, '')}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
