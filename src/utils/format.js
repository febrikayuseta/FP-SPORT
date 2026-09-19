export function formatRupiah(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return value
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

export function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(d)
  } catch {
    return dateStr
  }
}

export function formatTimeRange(start, end) {
  if (!start && !end) return '-'
  const clean = (t) => (t ? t.slice(0, 5) : '')
  return `${clean(start)} - ${clean(end)} WIB`
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}
