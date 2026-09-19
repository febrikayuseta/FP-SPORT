import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { IconArrowRight, IconBall } from '../components/Icons'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)
    try {
      await login(form.email, form.password)
      toast.success('Berhasil masuk. Gaskeun!')
      navigate(location.state?.from?.pathname || '/main', { replace: true })
    } catch (err) {
      setErrors(err.errors || {})
      toast.error(err.message || 'Email atau password salah.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-shell__art grain">
        <span className="hero__eyebrow"><IconBall width={15} height={15} /> Welcome back</span>
        <h2>Balik lagi buat mabar?</h2>
        <p>Masuk buat lanjutin booking, cek transaksi, atau kelola aktivitas yang udah kamu buka.</p>
      </div>
      <div className="auth-shell__form">
        <div className="auth-card">
          <h1>Masuk</h1>
          <p>Belum punya akun? <Link to="/daftar" style={{ fontWeight: 700, textDecoration: 'underline' }}>Daftar dulu</Link></p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="kamu@email.com"
              />
              {errors.email && <span className="field-error">{errors.email[0]}</span>}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                required
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="••••••••"
              />
              {errors.password && <span className="field-error">{errors.password[0]}</span>}
            </div>

            <button type="submit" className="btn btn--solid btn--full" disabled={submitting}>
              {submitting ? 'Lagi masuk...' : 'Masuk'} <IconArrowRight width={16} height={16} />
            </button>
          </form>

          <p className="auth-switch">
            Belum gabung MABAR? <Link to="/daftar">Buat akun baru</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
