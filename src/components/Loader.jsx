export default function Loader({ label = 'Lagi ambil data...' }) {
  return (
    <div className="loader">
      <div className="loader__ball" />
      <span>{label}</span>
    </div>
  )
}
