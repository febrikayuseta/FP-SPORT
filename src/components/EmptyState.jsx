export default function EmptyState({ title = 'Belum ada apa-apa di sini', hint, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark">¯\_(ツ)_/¯</div>
      <h3>{title}</h3>
      {hint && <p>{hint}</p>}
      {action}
    </div>
  )
}
