import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  cancelTransaction,
  getTransaction,
  updateProofPayment,
  updateStatus,
} from '../api/transactions'
import { extractUploadedUrl, uploadImage } from '../api/uploads'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import { IconCheck, IconUpload, IconX } from '../components/Icons'
import { formatDate, formatRupiah } from '../utils/format'

export default function TransactionDetail() {
  const { id } = useParams()
  const { isAdmin } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [tx, setTx] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState(false)

  function load() {
    setLoading(true)
    getTransaction(id)
      .then((res) => setTx(res?.data))
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const uploadRes = await uploadImage(file)
      const url = extractUploadedUrl(uploadRes)
      if (!url) throw new Error('Server nggak balikin URL file yang diupload.')
      await updateProofPayment(id, { proof_payment_url: url })
      toast.success('Bukti pembayaran berhasil diupload.')
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleCancel() {
    if (!window.confirm('Batalkan transaksi ini?')) return
    setBusy(true)
    try {
      await cancelTransaction(id)
      toast.success('Transaksi dibatalkan.')
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleStatus(status) {
    setBusy(true)
    try {
      await updateStatus(id, { status })
      toast.success(`Status transaksi diubah jadi "${status}".`)
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Loader label="Nyiapin detail transaksi..." />
  if (errorMsg || !tx) {
    return (
      <div className="container section">
        <EmptyState title="Transaksi nggak ketemu" hint={errorMsg} action={
          <button className="btn btn--outline" onClick={() => navigate(-1)}>Kembali</button>
        } />
      </div>
    )
  }

  const status = String(tx.status || '').toLowerCase()
  const isPending = status === 'pending' || status === 'waiting' || !status
  const activity = tx.sport_activity

  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <div className="section-head">
        <div>
          <h2>Transaksi #{tx.id}</h2>
          <p>Dibuat {formatDate(tx.created_at)}</p>
        </div>
        <StatusBadge status={tx.status} />
      </div>

      <div className="stack">
        {activity && (
          <div className="card-surface detail-card">
            <h3>Aktivitas</h3>
            <p style={{ fontWeight: 700 }}>{activity.title}</p>
            <p className="desc" style={{ marginTop: 4 }}>{activity.address}</p>
            <div className="divider" />
            <div className="summary-row total">
              <span>Total Bayar</span>
              <span>{formatRupiah(activity.price)}</span>
            </div>
          </div>
        )}

        {tx.payment_method && (
          <div className="card-surface detail-card">
            <h3>Metode Pembayaran</h3>
            <p style={{ fontWeight: 700 }}>{tx.payment_method.name}</p>
            {tx.payment_method.account_number && (
              <p className="desc">{tx.payment_method.account_number}{tx.payment_method.account_name ? ` a.n. ${tx.payment_method.account_name}` : ''}</p>
            )}
          </div>
        )}

        <div className="card-surface detail-card">
          <h3>Bukti Pembayaran</h3>
          {tx.proof_payment_url ? (
            <a href={tx.proof_payment_url} target="_blank" rel="noreferrer" className="btn btn--outline">
              Lihat Bukti Bayar
            </a>
          ) : (
            <p className="desc" style={{ marginBottom: 14 }}>Belum ada bukti pembayaran diupload.</p>
          )}

          {isPending && !isAdmin && (
            <div className="proof-upload" style={{ marginTop: 14 }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} id="proof-input" />
              <label htmlFor="proof-input" className="btn btn--solid" style={{ cursor: 'pointer' }}>
                <IconUpload width={16} height={16} /> {uploading ? 'Mengupload...' : 'Upload Bukti Bayar'}
              </label>
            </div>
          )}
        </div>

        {isPending && !isAdmin && (
          <button className="btn btn--danger" onClick={handleCancel} disabled={busy}>
            <IconX width={16} height={16} /> Batalkan Transaksi
          </button>
        )}

        {isAdmin && (
          <div className="card-surface detail-card">
            <h3>Aksi Admin</h3>
            <div className="row row--wrap">
              <button className="btn btn--lime" onClick={() => handleStatus('success')} disabled={busy}>
                <IconCheck width={16} height={16} /> Tandai Berhasil
              </button>
              <button className="btn btn--outline" onClick={() => handleStatus('failed')} disabled={busy}>
                <IconX width={16} height={16} /> Tandai Gagal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
