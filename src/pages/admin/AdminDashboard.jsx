import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminShell from '../../components/AdminShell'
import { getCategories } from '../../api/categories'
import { getActivities } from '../../api/activities'
import { getAllTransactions } from '../../api/transactions'
import Loader from '../../components/Loader'
import StatusBadge from '../../components/StatusBadge'
import { formatDate, formatRupiah } from '../../utils/format'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.allSettled([
      getCategories({ is_paginate: true, per_page: 1 }),
      getActivities({ is_paginate: true, per_page: 1 }),
      getAllTransactions({ is_paginate: true, per_page: 5 }),
    ]).then(([catRes, actRes, txRes]) => {
      if (!alive) return
      const catTotal = catRes.status === 'fulfilled' ? catRes.value?.data?.total ?? 0 : 0
      const actTotal = actRes.status === 'fulfilled' ? actRes.value?.data?.total ?? 0 : 0
      const txData = txRes.status === 'fulfilled' ? txRes.value?.data : null
      const txTotal = txData?.total ?? 0
      const txList = txData?.data || []
      const pending = txList.filter((t) => String(t.status).toLowerCase() === 'pending').length

      setStats({ catTotal, actTotal, txTotal, pending })
      setRecent(txList)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <AdminShell title="Dashboard Admin" subtitle="Ringkasan aktivitas platform MABAR.">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="stat-grid">
            <div className="card-surface stat-card">
              <b>{stats.catTotal}</b>
              <span>Kategori Olahraga</span>
            </div>
            <div className="card-surface stat-card">
              <b>{stats.actTotal}</b>
              <span>Total Aktivitas</span>
            </div>
            <div className="card-surface stat-card">
              <b>{stats.txTotal}</b>
              <span>Total Transaksi</span>
            </div>
            <div className="card-surface stat-card" style={{ background: 'var(--lime)' }}>
              <b>{stats.pending}</b>
              <span>Perlu Dicek (halaman ini)</span>
            </div>
          </div>

          <div className="card-surface" style={{ padding: 22 }}>
            <div className="row row--between" style={{ marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'var(--font-body)', textTransform: 'none' }}>Transaksi Terbaru</h3>
              <Link to="/admin/transaksi" className="btn btn--sm btn--ghost">Lihat semua</Link>
            </div>
            {recent.length === 0 ? (
              <p style={{ opacity: 0.6 }}>Belum ada transaksi.</p>
            ) : (
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Aktivitas</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <Link to={`/transaksi/${t.id}`} style={{ fontWeight: 700 }}>
                            {t.sport_activity?.title || `Transaksi #${t.id}`}
                          </Link>
                        </td>
                        <td>{formatDate(t.created_at)}</td>
                        <td><StatusBadge status={t.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminShell>
  )
}
