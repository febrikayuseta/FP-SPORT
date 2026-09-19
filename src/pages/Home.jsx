import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../api/categories'
import { getActivities } from '../api/activities'
import ActivityCard from '../components/ActivityCard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { IconArrowRight, IconBall, IconCalendar, IconUsers, IconWallet } from '../components/Icons'

const HOW_IT_WORKS = [
  {
    n: '01',
    title: 'Cari / Bikin Aktivitas',
    desc: 'Scroll aktivitas olahraga di kotamu, atau bikin sendiri jadwal mabar dan ajak orang lain gabung.',
    icon: IconBall,
  },
  {
    n: '02',
    title: 'Booking Slot',
    desc: 'Pilih metode pembayaran, transfer, upload bukti bayar. Slot langsung ke-lock buat kamu.',
    icon: IconWallet,
  },
  {
    n: '03',
    title: 'Dateng & Main',
    desc: 'Sampai lokasi sesuai jadwal, ketemu temen baru, main bareng. Gampang kan?',
    icon: IconUsers,
  },
]

export default function Home() {
  const [categories, setCategories] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let alive = true
    Promise.allSettled([
      getCategories({ is_paginate: false, per_page: 8 }),
      getActivities({ is_paginate: false, per_page: 6 }),
    ]).then(([catRes, actRes]) => {
      if (!alive) return
      if (catRes.status === 'fulfilled') {
        const d = catRes.value?.data
        setCategories(Array.isArray(d) ? d : d?.data || [])
      } else {
        setErr('Nggak bisa ambil data dari backend.')
      }
      if (actRes.status === 'fulfilled') {
        const d = actRes.value?.data
        setActivities(Array.isArray(d) ? d : d?.data || [])
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <>
      <section className="hero grain">
        <div className="container hero__inner">
          <div>
            <span className="hero__eyebrow">
              <IconBall width={15} height={15} /> Komunitas olahraga se-Indonesia
            </span>
            <h1>
              MAIN BARENG,
              <br />
              <span>JANGAN SOLO.</span>
            </h1>
            <p className="lede">
              Cari temen tanding, booking lapangan, dan gabung mabar bareng komunitas olahraga di kotamu —
              tanpa ribet nyari grup WA sana-sini.
            </p>
            <div className="hero__actions">
              <Link to="/main" className="btn btn--solid">
                Cari Mabar <IconArrowRight width={16} height={16} />
              </Link>
              <Link to="/daftar" className="btn btn--outline" style={{ background: 'var(--white)' }}>
                Gabung Gratis
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <b>{categories.length || '10+'}</b>
                <span>Cabang Olahraga</span>
              </div>
              <div className="hero__stat">
                <b>{activities.length ? `${activities.length}+` : '—'}</b>
                <span>Aktivitas Aktif</span>
              </div>
              <div className="hero__stat">
                <b>34</b>
                <span>Provinsi Kejangkau</span>
              </div>
            </div>
          </div>

          <div className="hero__art">
            <div className="blob" />
            <div className="badge-card badge-card--1">⚽ Futsal Jumat</div>
            <div className="badge-card badge-card--2">🏸 2 Slot Sisa</div>
            <div className="badge-card badge-card--3">Rp 70K/orang</div>
          </div>
        </div>
      </section>

      <div className="ticker">
        <div className="ticker__track">
          {[...categories, ...categories, ...categories].map((c, i) => (
            <span key={i}>{c.name} ★</span>
          ))}
          {categories.length === 0 &&
            ['SEPAK BOLA', 'BADMINTON', 'BASKET', 'FUTSAL', 'VOLI', 'LARI'].concat(['SEPAK BOLA', 'BADMINTON', 'BASKET', 'FUTSAL', 'VOLI', 'LARI']).map((c, i) => (
              <span key={i}>{c} ★</span>
            ))}
        </div>
      </div>

      <section className="section container">
        <div className="section-head">
          <div>
            <h2>Pilih Cabang Olahraganya</h2>
            <p>Dari yang santai sampai yang niat banget, semua ada komunitasnya.</p>
          </div>
          <Link to="/main" className="btn btn--ghost">
            Lihat semua <IconArrowRight width={15} height={15} />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : categories.length === 0 ? (
          <EmptyState title="Kategori belum ke-load" hint={err || 'Coba cek koneksi ke backend-nya.'} />
        ) : (
          <div className="category-grid">
            {categories.map((c) => (
              <Link key={c.id} to={`/main?kategori=${c.id}`} className="category-chip">
                <IconBall width={22} height={22} />
                <strong>{c.name}</strong>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section section--tight" style={{ background: 'var(--paper-2)', borderTop: '3px solid var(--ink)', borderBottom: '3px solid var(--ink)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Gampang Kok, 3 Langkah</h2>
            </div>
          </div>
          <div className="activity-grid">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.n} className="card-surface" style={{ padding: 24 }}>
                  <div className="row row--between">
                    <Icon width={26} height={26} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', opacity: 0.3 }}>{step.n}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-body)', textTransform: 'none', fontSize: '1.1rem', margin: '14px 0 8px' }}>
                    {step.title}
                  </h3>
                  <p style={{ opacity: 0.75, fontSize: '0.92rem' }}>{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <h2>Lagi Rame Nih</h2>
            <p>Aktivitas yang baru dibuka komunitas, buruan gabung sebelum slot penuh.</p>
          </div>
          <Link to="/main" className="btn btn--ghost">
            Semua aktivitas <IconArrowRight width={15} height={15} />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : activities.length === 0 ? (
          <EmptyState
            title="Belum ada aktivitas"
            hint="Jadilah yang pertama bikin jadwal mabar!"
            action={
              <Link to="/aktivitas-saya/baru" className="btn btn--solid">
                Bikin Aktivitas
              </Link>
            }
          />
        ) : (
          <div className="activity-grid">
            {activities.map((a, i) => (
              <ActivityCard key={a.id} activity={a} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="section container">
        <div className="card-surface grain" style={{ padding: '50px 40px', background: 'var(--orange)', color: 'var(--white)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ color: 'var(--white)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>Punya Jadwal Main? Buka Slotnya!</h2>
            <p style={{ marginTop: 10, opacity: 0.9 }}>Bikin aktivitas dalam 2 menit, biar orang lain bisa ikutan patungan lapangan.</p>
          </div>
          <Link to="/aktivitas-saya/baru" className="btn btn--danger">
            Bikin Aktivitas <IconArrowRight width={16} height={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
