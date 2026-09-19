export default function Pagination({ meta, onPageChange }) {
  if (!meta || !meta.last_page || meta.last_page <= 1) return null
  const current = meta.current_page || 1
  const last = meta.last_page

  const pages = []
  const start = Math.max(1, current - 1)
  const end = Math.min(last, current + 1)
  for (let p = start; p <= end; p++) pages.push(p)

  return (
    <div className="pagination">
      <button className="pagination__btn" disabled={current <= 1} onClick={() => onPageChange(current - 1)}>
        ← Prev
      </button>

      {start > 1 && (
        <>
          <button className="pagination__num" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span className="pagination__dots">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          className={`pagination__num ${p === current ? 'is-active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {end < last && (
        <>
          {end < last - 1 && <span className="pagination__dots">…</span>}
          <button className="pagination__num" onClick={() => onPageChange(last)}>{last}</button>
        </>
      )}

      <button className="pagination__btn" disabled={current >= last} onClick={() => onPageChange(current + 1)}>
        Next →
      </button>
    </div>
  )
}
