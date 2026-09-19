import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminShell from '../../components/AdminShell'
import { getAllTransactions, updateStatus } from '../../api/transactions'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import StatusBadge from '../../components/StatusBadge'
import { IconCheck, IconSearch, IconX } from '../../components/Icons'
import { formatDate, formatRupiah } from '../../utils/format'

const PER_PAGE = 10

export default function AdminTransactions() {
  const toast = useToast()
  const [transactions, setTransactions] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  function load() {
    setLoading(true)
    getAllTransactions({ is_paginate: true, per_page: PER_PAGE, page, search })
      .then((res) => {
        const d = res?.data
        setTransactions(d?.data || [])
        setMeta(d || null)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [page, search])

  function submitSearch(e) {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  async function handleStatus(id, status) {
    setBusyId(id)
    try {
      await updateStatus(id, { status })
      toast.success(`Status diubah jadi "${status}".`)
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AdminShell title="Semua Transaksi" subtitle="Verifikasi pembayaran dan pantau semua booking masuk.">
      <form className="row" style={{ marginBottom: 16 }} onSubmit={submitSearch}>
        <input
          className="input"
          placeholder="Cari transaksi..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="btn btn--outline" style={{ flexShrink: 0 }}>
          <IconSearch width={16} height={16} />
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : transactions.length === 0 ? (
        <EmptyState title="Belum ada transaksi" />
      ) : (
        <>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Aktivitas</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const isPending = String(t.status).toLowerCase() === 'pending'
                  return (
                    <tr key={t.id}>
                      <td>
                        <Link to={`/transaksi/${t.id}`} style={{ fontWeight: 700 }}>
                          {t.sport_activity?.title || `Transaksi #${t.id}`}
                        </Link>
                      </td>
                      <td>{formatDate(t.created_at)}</td>
                      <td>{formatRupiah(t.sport_activity?.price ?? t.total ?? 0)}</td>
                      <td><StatusBadge status={t.status} /></td>
                      <td>
                        {isPending ? (
                          <div className="table-actions">
                            <button className="btn btn--sm btn--lime" onClick={() => handleStatus(t.id, 'success')} disabled={busyId === t.id}>
                              <IconCheck width={14} height={14} />
                            </button>
                            <button className="btn btn--sm btn--outline" onClick={() => handleStatus(t.id, 'failed')} disabled={busyId === t.id}>
                              <IconX width={14} height={14} />
                            </button>
                          </div>
                        ) : (
                          <Link to={`/transaksi/${t.id}`} className="btn btn--sm btn--outline">Detail</Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}
    </AdminShell>
  )
}
