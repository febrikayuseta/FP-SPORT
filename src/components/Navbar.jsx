import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { IconLogout, IconShield, IconUsers, IconX } from './Icons'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    setOpen(false)
    navigate('/')
  }

  const links = [
    { to: '/main', label: 'Cari Mabar' },
    { to: '/aktivitas-saya', label: 'Aktivitas Saya', auth: true },
    { to: '/transaksi-saya', label: 'Transaksi Saya', auth: true },
  ]

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__brand-mark">MABAR</span>
          <span className="navbar__brand-dot" />
        </Link>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`}>
          {links
            .filter((l) => !l.auth || isAuthenticated)
            .map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `navbar__link navbar__link--admin ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <IconShield width={16} height={16} /> Admin
            </NavLink>
          )}

          <div className="navbar__mobile-actions">
            {isAuthenticated ? (
              <>
                <Link to="/profil" className="btn btn--ghost" onClick={() => setOpen(false)}>
                  <IconUsers width={16} height={16} /> {user?.name?.split(' ')[0] || 'Profil'}
                </Link>
                <button className="btn btn--outline" onClick={handleLogout}>
                  <IconLogout width={16} height={16} /> Keluar
                </button>
              </>
            ) : (
              <>
                <Link to="/masuk" className="btn btn--ghost" onClick={() => setOpen(false)}>
                  Masuk
                </Link>
                <Link to="/daftar" className="btn btn--solid" onClick={() => setOpen(false)}>
                  Gabung
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <Link to="/profil" className="btn btn--ghost">
                <IconUsers width={16} height={16} /> {user?.name?.split(' ')[0] || 'Profil'}
              </Link>
              <button className="btn btn--outline" onClick={handleLogout}>
                <IconLogout width={16} height={16} /> Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/masuk" className="btn btn--ghost">
                Masuk
              </Link>
              <Link to="/daftar" className="btn btn--solid">
                Gabung Yuk
              </Link>
            </>
          )}
        </div>

        <button className="navbar__burger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <IconX /> : (
            <span className="navbar__burger-lines">
              <span />
              <span />
              <span />
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
