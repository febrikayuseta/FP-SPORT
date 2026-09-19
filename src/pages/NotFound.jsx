import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <p style={{ fontWeight: 700, fontSize: '1.2rem', marginTop: -10 }}>Wah, lapangannya nggak ketemu.</p>
      <p style={{ opacity: 0.65, marginTop: 8 }}>Halaman yang kamu cari nggak ada atau udah dipindah.</p>
      <Link to="/" className="btn btn--solid" style={{ marginTop: 24 }}>
        Balik ke Beranda
      </Link>
    </div>
  )
}
