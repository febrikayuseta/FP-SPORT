import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteActivity, getActivities } from '../api/activities'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'
import { IconEdit, IconPlus, IconTrash } from '../components/Icons'
import { formatDate, formatRupiah } from '../utils/format'

const PER_PAGE = 10

export default function MyActivities() {
  const { user } = useAuth()
  const toast = useToast()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [page, setPage] = useState(1)

  function load() {
    setLoading(true)
    setErrorMsg('')
    getActivities({ is_paginate: false, per_page: 200 })
      .then((res) => {
        const d = res?.data
        const all = Array.isArray(d) ? d : d?.data || []
        setActivities(all.filter((a) => a.user_id === user?.id || a.user?.id === user?.id))
        setPage(1)
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

  const totalPages = Math.ceil(activities.length / PER_PAGE)
  const paginated = activities.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const fakeMeta = activities.length > PER_PAGE
    ? { current_page: page, last_page: totalPages, total: activities.length }
    : null

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
        <>
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
                {paginated.map((a) => (
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
          <Pagination meta={fakeMeta} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
