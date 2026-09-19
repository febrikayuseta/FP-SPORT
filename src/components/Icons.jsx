// Set ikon custom (inline SVG, stroke-based) biar tampilannya khas sendiri —
// bukan icon pack generik yang dipake semua template AI.

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconBall(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 L12 8 L16.5 11 L14.5 16 L9.5 16 L7.5 11 Z" />
      <path d="M12 8 L12 3 M16.5 11 L21 9.5 M14.5 16 L17 20.5 M9.5 16 L7 20.5 M7.5 11 L3 9.5" />
    </svg>
  )
}

export function IconPin(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  )
}

export function IconClock(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  )
}

export function IconUsers(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17.5" cy="8.5" r="2.6" />
      <path d="M15.8 14.2c2.7.5 4.7 2.6 4.7 5.8" />
    </svg>
  )
}

export function IconWallet(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 9.5h18" />
      <path d="M16.5 14h2" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12.5 9.5 18 20 6" />
    </svg>
  )
}

export function IconX(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconSearch(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  )
}

export function IconArrowRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  )
}

export function IconPlus(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconEdit(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" />
    </svg>
  )
}

export function IconTrash(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4.8c0-.4.4-.8.9-.8h4.2c.5 0 .9.4.9.8V7" />
      <path d="M6.5 7 7.3 20a1 1 0 0 0 1 1h7.4a1 1 0 0 0 1-1L17.5 7" />
    </svg>
  )
}

export function IconCalendar(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  )
}

export function IconTag(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12.5 3.5H6a2.5 2.5 0 0 0-2.5 2.5v6.5L13 22l7.5-7.5-8-11Z" />
      <circle cx="8.2" cy="8.2" r="1.4" />
    </svg>
  )
}

export function IconLogout(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}

export function IconShield(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
      <path d="M9 12l2.2 2.2L15.5 9.5" />
    </svg>
  )
}

export function IconUpload(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}
