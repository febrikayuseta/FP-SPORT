import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteActivity, getActivity } from '../api/activities'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { IconBall, IconCalendar, IconClock, IconEdit, IconPin, IconTrash, IconUsers } from '../components/Icons'
import { formatDate, formatRupiah, formatTimeRange } from '../utils/format'

export default function ActivityDetail() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    getActivity(id)
      .then((res) => alive && setActivity(res?.data))
      .catch((err) => alive && setErrorMsg(err.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [id])

  if (loading) return <Loader label="Nyiapin detail aktivitas..." />
  if (errorMsg || !activity) {
    return (
      <div className="container section">
        <EmptyState title="Aktivitas nggak ketemu" hint={errorMsg || 'Mungkin udah dihapus sama host-nya.'} />
      </div>
    )
  }

  const isOwner = isAuthenticated && (activity.user_id === user?.id || activity.user?.id === user?.id)

  async function handleDelete() {
    if (!window.confirm('Yakin mau hapus aktivitas ini? Aksi ini nggak bisa dibatalin.')) return
    setDeleting(true)
    try {
      await deleteActivity(activity.id)
      toast.success('Aktivitas berhasil dihapus.')
      navigate('/aktivitas-saya')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="detail-hero">
        <div className="container">
          <span className="tag">
            <IconBall width={14} height={14} /> {activity.sport_category?.name || 'Olahraga'}
          </span>
          <h1>{activity.title}</h1>
          <div className="row">
            <span><IconPin width={16} height={16} /> {activity.city?.name || activity.address}</span>
            <span><IconCalendar width={16} height={16} /> {formatDate(activity.activity_date)}</span>
            <span><IconClock width={16} height={16} /> {formatTimeRange(activity.start_time, activity.end_time)}</span>
            <span><IconUsers width={16} height={16} /> {activity.slot} slot tersedia</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="detail-layout">
          <div className="stack">
            <div className="card-surface detail-card">
              <h3>Tentang Aktivitas Ini</h3>
              <p className="desc">{activity.description || 'Host belum nambahin deskripsi.'}</p>
            </div>

            <div className="card-surface detail-card">
              <h3>Lokasi</h3>
              <p className="desc">{activity.address}</p>
              {activity.map_url && (
                <a href={activity.map_url} target="_blank" rel="noreferrer" className="btn btn--outline" style={{ marginTop: 14 }}>
                  <IconPin width={16} height={16} /> Buka di Google Maps
                </a>
              )}
            </div>

            {activity.user?.name && (
              <div className="card-surface detail-card row" style={{ gap: 14 }}>
                <div className="profile-avatar" style={{ width: 52, height: 52, fontSize: '1.1rem', margin: 0 }}>
                  {activity.user.name.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <strong>{activity.user.name}</strong>
                  <p style={{ opacity: 0.65, fontSize: '0.85rem' }}>Host aktivitas ini</p>
                </div>
              </div>
            )}
          </div>

          <div className="card-surface booking-box">
            <div className="booking-box__price">
              {formatRupiah(activity.price)}
              <span>per orang / slot</span>
            </div>
            <div className="divider" />

            {isOwner ? (
              <div className="stack">
                <p style={{ fontWeight: 700, opacity: 0.75, fontSize: '0.88rem' }}>
                  Ini aktivitas kamu sendiri. Kamu bisa edit atau hapus dari sini.
                </p>
                <Link to={`/aktivitas-saya/${activity.id}/edit`} className="btn btn--outline btn--full">
                  <IconEdit width={16} height={16} /> Edit Aktivitas
                </Link>
                <button className="btn btn--danger btn--full" onClick={handleDelete} disabled={deleting}>
                  <IconTrash width={16} height={16} /> {deleting ? 'Menghapus...' : 'Hapus Aktivitas'}
                </button>
              </div>
            ) : (
              <div className="stack">
                <Link to={isAuthenticated ? `/booking/${activity.id}` : '/masuk'} className="btn btn--solid btn--full">
                  Gas, Join Sekarang
                </Link>
                {!isAuthenticated && (
                  <p style={{ fontSize: '0.82rem', opacity: 0.6, textAlign: 'center' }}>
                    Kamu perlu masuk dulu buat booking slot.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
