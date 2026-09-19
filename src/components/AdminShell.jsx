import { NavLink } from 'react-router-dom'
import { IconBall, IconShield, IconTag, IconWallet } from './Icons'

const LINKS = [
  { to: '/admin', label: 'Ringkasan', icon: IconShield, end: true },
  { to: '/admin/kategori', label: 'Kategori Olahraga', icon: IconTag },
  { to: '/admin/aktivitas', label: 'Aktivitas', icon: IconBall },
  { to: '/admin/transaksi', label: 'Transaksi', icon: IconWallet },
]

export default function AdminShell({ children, title, subtitle }) {
  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className="admin-shell">
        <nav className="admin-nav">
          {LINKS.map((l) => {
            const Icon = l.icon
            return (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                <span className="row" style={{ gap: 8 }}>
                  <Icon width={16} height={16} /> {l.label}
                </span>
              </NavLink>
            )
          })}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  )
}
