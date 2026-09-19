import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteActivity, getActivities } from '../api/activities'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { IconEdit, IconPlus, IconTrash } from '../components/Icons'
import { formatDate, formatRupiah } from '../utils/format'

export default function MyActivities() {
  const { user } = useAuth()
  const toast = useToast()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  function load() {
    setLoading(true)
    setErrorMsg('')
    // Endpoint sport-activities belum ada filter "punya saya", jadi kita ambil
    // semua terus disaring di client berdasarkan user_id yang bikin.
    getActivities({ is_paginate: false, per_page: 200 })
      .then((res) => {
        const d = res?.data
        const all = Array.isArray(d) ? d : d?.data || []
        setActivities(all.filter((a) => a.user_id === user?.id || a.user?.id === user?.id))
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [user])

  async function handleDelete(id) {
    if (!window.confirm('Hapus aktivitas ini?')) return
    try {
      await deleteActivity(id)
      toast.success('Aktivitas dihapus.')
      setActivities((a) => a.filter((x) => x.id !== id))
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <h2>Aktivitas Saya</h2>
          <p>Jadwal mabar yang kamu buka buat komunitas.</p>
        </div>
        <Link to="/aktivitas-saya/baru" className="btn btn--solid">
          <IconPlus width={16} height={16} /> Bikin Aktivitas
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : errorMsg ? (
        <EmptyState title="Gagal ambil data" hint={errorMsg} />
      ) : activities.length === 0 ? (
        <EmptyState
          title="Kamu belum bikin aktivitas"
          hint="Buka jadwal mabar pertamamu sekarang."
          action={
            <Link to="/aktivitas-saya/baru" className="btn btn--solid">
              <IconPlus width={16} height={16} /> Bikin Aktivitas
            </Link>
          }
        />
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Tanggal</th>
                <th>Slot</th>
                <th>Harga</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link to={`/aktivitas/${a.id}`} style={{ fontWeight: 700 }}>
                      {a.title}
                    </Link>
                  </td>
                  <td>{formatDate(a.activity_date)}</td>
                  <td>{a.slot}</td>
                  <td>{formatRupiah(a.price)}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/aktivitas-saya/${a.id}/edit`} className="btn btn--sm btn--outline">
                        <IconEdit width={14} height={14} />
                      </Link>
                      <button className="btn btn--sm btn--danger" onClick={() => handleDelete(a.id)}>
                        <IconTrash width={14} height={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
