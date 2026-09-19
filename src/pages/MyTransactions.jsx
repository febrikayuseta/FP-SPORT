import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyTransactions } from '../api/transactions'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import { formatDate, formatRupiah } from '../utils/format'

export default function MyTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let alive = true
    getMyTransactions({ is_paginate: true, per_page: 100 })
      .then((res) => {
        if (!alive) return
        const d = res?.data
        setTransactions(Array.isArray(d) ? d : d?.data || [])
      })
      .catch((err) => alive && setErrorMsg(err.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <h2>Transaksi Saya</h2>
          <p>Riwayat booking aktivitas yang pernah kamu lakukan.</p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : errorMsg ? (
        <EmptyState title="Gagal ambil data" hint={errorMsg} />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="Belum ada transaksi"
          hint="Yuk booking aktivitas pertamamu."
          action={
            <Link to="/main" className="btn btn--solid">
              Cari Mabar
            </Link>
          }
        />
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Aktivitas</th>
                <th>Tanggal Booking</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 700 }}>{t.sport_activity?.title || `Transaksi #${t.id}`}</td>
                  <td>{formatDate(t.created_at)}</td>
                  <td>{formatRupiah(t.sport_activity?.price ?? t.total ?? 0)}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>
                    <Link to={`/transaksi/${t.id}`} className="btn btn--sm btn--outline">
                      Detail
                    </Link>
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
