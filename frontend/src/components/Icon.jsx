const paths = {
  sparkles: (
    <>
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />
      <path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5Z" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="6" height="6" rx="1.5" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1.5" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1.5" />
      <rect x="14.5" y="14.5" width="6" height="6" rx="1.5" />
    </>
  ),
  practice: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="3" />
      <path d="m8 21 4-3h5M9 9l-2 2 2 2m6-4 2 2-2 2m-3-5-1 6" />
    </>
  ),
  history: (
    <>
      <path d="M3 11a9 9 0 1 1 2.4 7M3 4v7h7m2-4v5l3 2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h16M8 14l4-5 4 3 5-7" />
    </>
  ),
  settings: (
    <>
      <path d="m10 3-.6 2.1-2 .9-2-.6L3.6 8.5 5 10v2l-1.4 1.5L5.4 17l2-.5 2 .9L10 20h4l.6-2.6 2-.9 2 .5 1.8-3.5L19 12v-2l1.4-1.5-1.8-3.1-2 .6-2-.9L14 3Z" />
      <circle cx="12" cy="11.5" r="3" />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowLeft: <path d="M19 12H5m5-5-5 5 5 5" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  collapse: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M9 4v16m7-11-3 3 3 3" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  code: (
    <>
      <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20" />
    </>
  ),
  message: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.2-4.2A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8 9h8m-8 4h5" />
    </>
  ),
  book: (
    <>
      <path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M7 3v4m10-4v4M3 11h18" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" />
    </>
  ),
  logout: (
    <>
      <path d="M9 3H4v18h5m5-14 5 5-5 5M8 12h13" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  moon: <path d="M20.5 14.5A9 9 0 0 1 9.5 3.5a9 9 0 1 0 11 11Z" />,
  monitor: (
    <>
      <rect x="3" y="3" width="18" height="13" rx="2" />
      <path d="M8 21h8m-4-5v5" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10v.2" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  bars: (
    <>
      <path d="M5 20v-5m7 5V9m7 11V4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
}

export default function Icon({
  name = 'sparkles',
  size = 20,
  className = '',
  ...props
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {paths[name] || paths.sparkles}
    </svg>
  )
}

export function Brand({ compact = false }) {
  return (
    <span className="brand">
      <span className="brand-mark">
        <Icon name="sparkles" size={22} />
      </span>
      {!compact && (
        <span className="brand-wordmark">
          AI Interview Coach<span>YOUR NEXT CHAPTER</span>
        </span>
      )}
    </span>
  )
}
