import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { IconArrowRight, IconUsers } from '../components/Icons'

export default function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    c_password: '',
    phone_number: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})

    if (form.password !== form.c_password) {
      setErrors({ c_password: ['Konfirmasi password nggak sama.'] })
      return
    }

    setSubmitting(true)
    try {
      const res = await register({ ...form, role: 'user' })
      if (res?.data?.token) {
        toast.success('Akun berhasil dibuat. Selamat gabung di MABAR!')
        navigate('/main', { replace: true })
      } else {
        toast.success('Akun berhasil dibuat. Silakan masuk.')
        navigate('/masuk', { replace: true })
      }
    } catch (err) {
      setErrors(err.errors || {})
      toast.error(err.message || 'Pendaftaran gagal, cek lagi form-nya.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-shell__art grain" style={{ background: 'var(--orange)' }}>
        <span className="hero__eyebrow" style={{ background: 'var(--ink)', color: 'var(--white)' }}>
          <IconUsers width={15} height={15} /> Gabung sekarang
        </span>
        <h2>Satu akun buat semua mabar.</h2>
        <p>Bikin akun sekali, langsung bisa booking aktivitas atau buka jadwal mabar sendiri kapan aja.</p>
      </div>
      <div className="auth-shell__form">
        <div className="auth-card">
          <h1>Daftar</h1>
          <p>Udah punya akun? <Link to="/masuk" style={{ fontWeight: 700, textDecoration: 'underline' }}>Masuk aja</Link></p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Nama Lengkap</label>
              <input id="name" className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Nama kamu" />
              {errors.name && <span className="field-error">{errors.name[0]}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" className="input" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="kamu@email.com" />
              {errors.email && <span className="field-error">{errors.email[0]}</span>}
            </div>

            <div className="field">
              <label htmlFor="phone">No. HP (opsional)</label>
              <input id="phone" className="input" value={form.phone_number} onChange={(e) => set('phone_number', e.target.value)} placeholder="08xxxxxxxxxx" />
              {errors.phone_number && <span className="field-error">{errors.phone_number[0]}</span>}
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" className="input" type="password" required value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="min. 8 karakter" />
                {errors.password && <span className="field-error">{errors.password[0]}</span>}
              </div>
              <div className="field">
                <label htmlFor="c_password">Ulangi Password</label>
                <input id="c_password" className="input" type="password" required value={form.c_password} onChange={(e) => set('c_password', e.target.value)} placeholder="ulangi password" />
                {errors.c_password && <span className="field-error">{errors.c_password[0]}</span>}
              </div>
            </div>

            <button type="submit" className="btn btn--solid btn--full" disabled={submitting}>
              {submitting ? 'Lagi daftar...' : 'Buat Akun'} <IconArrowRight width={16} height={16} />
            </button>
          </form>

          <p className="auth-switch">
            Dengan daftar, kamu setuju main sportif dan nggak php-in slot orang lain 😄
          </p>
        </div>
      </div>
    </div>
  )
}
