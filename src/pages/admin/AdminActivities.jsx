import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminShell from '../../components/AdminShell'
import { deleteActivity, getActivities } from '../../api/activities'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import { IconEdit, IconPlus, IconTrash } from '../../components/Icons'
import { formatDate, formatRupiah } from '../../utils/format'

const PER_PAGE = 10

export default function AdminActivities() {
  const toast = useToast()
  const [activities, setActivities] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  function load() {
    setLoading(true)
    getActivities({ is_paginate: true, per_page: PER_PAGE, page })
      .then((res) => {
        const d = res?.data
        setActivities(d?.data || [])
        setMeta(d || null)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [page])

  async function handleDelete(id) {
    if (!window.confirm('Hapus aktivitas ini?')) return
    setBusyId(id)
    try {
      await deleteActivity(id)
      toast.success('Aktivitas dihapus.')
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AdminShell title="Semua Aktivitas" subtitle="Moderasi semua jadwal mabar yang dibuat komunitas.">
      <div className="row row--between" style={{ marginBottom: 16 }}>
        <span style={{ opacity: 0.65 }}>{meta?.total ?? activities.length} aktivitas terdaftar</span>
        <Link to="/aktivitas-saya/baru" className="btn btn--sm btn--solid">
          <IconPlus width={14} height={14} /> Tambah
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : activities.length === 0 ? (
        <EmptyState title="Belum ada aktivitas" />
      ) : (
        <>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Host</th>
                  <th>Tanggal</th>
                  <th>Harga</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link to={`/aktivitas/${a.id}`} style={{ fontWeight: 700 }}>{a.title}</Link>
                    </td>
                    <td>{a.user?.name || '-'}</td>
                    <td>{formatDate(a.activity_date)}</td>
                    <td>{formatRupiah(a.price)}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/aktivitas-saya/${a.id}/edit`} className="btn btn--sm btn--outline">
                          <IconEdit width={14} height={14} />
                        </Link>
                        <button className="btn btn--sm btn--danger" onClick={() => handleDelete(a.id)} disabled={busyId === a.id}>
                          <IconTrash width={14} height={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}
    </AdminShell>
  )
}
