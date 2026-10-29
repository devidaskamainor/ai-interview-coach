export const scoreColor = (s) => (s >= 75 ? 'text-good' : s >= 50 ? 'text-warn' : 'text-bad')
export const scoreBg = (s) => (s >= 75 ? 'bg-good' : s >= 50 ? 'bg-warn' : 'bg-bad')
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ''
export const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '')
