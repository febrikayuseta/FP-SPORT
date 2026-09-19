import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__brand-mark">MABAR</span>
          <p>Cari temen, booking lapangan, mabar bareng. Satu platform buat komunitas olahraga di kotamu.</p>
        </div>

        <div className="footer__cols">
          <div>
            <h4>Jelajah</h4>
            <Link to="/main">Cari Mabar</Link>
            <Link to="/aktivitas-saya">Aktivitas Saya</Link>
            <Link to="/transaksi-saya">Transaksi Saya</Link>
          </div>
          <div>
            <h4>Akun</h4>
            <Link to="/masuk">Masuk</Link>
            <Link to="/daftar">Daftar</Link>
            <Link to="/profil">Profil</Link>
          </div>
        </div>
      </div>
      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} MABAR. Main bareng, seru bareng.</span>
      </div>
    </footer>
  )
}
