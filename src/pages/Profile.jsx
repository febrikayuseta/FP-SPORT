import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { initials } from '../utils/format'
import { IconCheck, IconShield } from '../components/Icons'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const toast = useToast()

  const [form, setForm] = useState({ name: '', email: '', phone_number: '', password: '', c_password: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, name: user.name || '', email: user.email || '', phone_number: user.phone_number || '' }))
    }
  }, [user])

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

    setSaving(true)
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        phone_number: form.phone_number,
        password: form.password,
        c_password: form.c_password,
      })
      toast.success('Profil berhasil diupdate.')
      setForm((f) => ({ ...f, password: '', c_password: '' }))
    } catch (err) {
      setErrors(err.errors || {})
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <h2>Profil Saya</h2>
          <p>Data akun kamu di MABAR.</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="card-surface profile-side">
          <div className="profile-avatar" style={{ margin: '0 auto 14px' }}>{initials(user.name)}</div>
          <strong style={{ fontSize: '1.1rem' }}>{user.name}</strong>
          <p style={{ opacity: 0.65, fontSize: '0.88rem', marginTop: 4 }}>{user.email}</p>
          <div className="role-tag">
            <span className="tag">
              <IconShield width={14} height={14} /> {user.role === 'admin' ? 'Admin' : 'Anggota'}
            </span>
          </div>
        </div>

        <div className="card-surface" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Nama Lengkap</label>
                <input id="name" className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} />
                {errors.name && <span className="field-error">{errors.name[0]}</span>}
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" className="input" required value={form.email} onChange={(e) => set('email', e.target.value)} />
                {errors.email && <span className="field-error">{errors.email[0]}</span>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="phone">No. HP</label>
              <input id="phone" className="input" value={form.phone_number} onChange={(e) => set('phone_number', e.target.value)} />
              {errors.phone_number && <span className="field-error">{errors.phone_number[0]}</span>}
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="password">Password Baru</label>
                <input id="password" type="password" className="input" required value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="isi buat simpan perubahan" />
                <small className="hint">API ini butuh password dikirim ulang tiap update profil.</small>
                {errors.password && <span className="field-error">{errors.password[0]}</span>}
              </div>
              <div className="field">
                <label htmlFor="c_password">Ulangi Password</label>
                <input id="c_password" type="password" className="input" required value={form.c_password} onChange={(e) => set('c_password', e.target.value)} />
                {errors.c_password && <span className="field-error">{errors.c_password[0]}</span>}
              </div>
            </div>

            <button type="submit" className="btn btn--solid" disabled={saving}>
              <IconCheck width={16} height={16} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
