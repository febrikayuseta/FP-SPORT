import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getActivity } from '../api/activities'
import { getPaymentMethods } from '../api/payments'
import { createTransaction } from '../api/transactions'
import { useToast } from '../context/ToastContext'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { IconCalendar, IconClock, IconPin, IconWallet } from '../components/Icons'
import { formatDate, formatRupiah, formatTimeRange } from '../utils/format'

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [activity, setActivity] = useState(null)
  const [methods, setMethods] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let alive = true
    Promise.allSettled([getActivity(id), getPaymentMethods()]).then(([actRes, payRes]) => {
      if (!alive) return
      if (actRes.status === 'fulfilled') setActivity(actRes.value?.data)
      else setErrorMsg(actRes.reason?.message || 'Gagal ambil data aktivitas.')

      if (payRes.status === 'fulfilled') {
        const d = payRes.value?.data
        const list = Array.isArray(d) ? d : d?.data || []
        setMethods(list)
        if (list[0]) setSelected(list[0].id)
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [id])

  async function handleConfirm() {
    if (!selected) {
      toast.error('Pilih metode pembayaran dulu ya.')
      return
    }
    setSubmitting(true)
    try {
      const res = await createTransaction({ sport_activity_id: Number(id), payment_method_id: Number(selected) })
      toast.success('Booking dibuat! Lanjut upload bukti bayar.')
      const txId = res?.data?.id
      navigate(txId ? `/transaksi/${txId}` : '/transaksi-saya')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader label="Nyiapin checkout..." />
  if (errorMsg || !activity) {
    return (
      <div className="container section">
        <EmptyState title="Nggak bisa booking" hint={errorMsg} />
      </div>
    )
  }

  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <h2>Konfirmasi Booking</h2>
          <p>Cek detail aktivitas & pilih metode pembayaran sebelum lanjut.</p>
        </div>
      </div>

      <div className="checkout-grid">
        <div className="card-surface" style={{ padding: 26 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', textTransform: 'none', fontWeight: 700, marginBottom: 16 }}>
            <IconWallet width={18} height={18} style={{ verticalAlign: '-3px', marginRight: 6 }} /> Pilih Metode Pembayaran
          </h3>

          {methods.length === 0 ? (
            <EmptyState title="Belum ada metode pembayaran" hint="Hubungi admin buat nambahin metode bayar." />
          ) : (
            methods.map((m) => (
              <label key={m.id} className={`payment-option ${selected === m.id ? 'is-selected' : ''}`}>
                <input type="radio" name="payment" checked={selected === m.id} onChange={() => setSelected(m.id)} />
                <div>
                  <strong>{m.name}</strong>
                  {m.account_number && <small>{m.account_number}{m.account_name ? ` a.n. ${m.account_name}` : ''}</small>}
                </div>
              </label>
            ))
          )}
        </div>

        <div className="card-surface" style={{ padding: 26 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', textTransform: 'none', fontWeight: 700, marginBottom: 4 }}>{activity.title}</h3>
          <div className="stack" style={{ marginTop: 14, fontSize: '0.9rem', opacity: 0.8 }}>
            <span><IconPin width={15} height={15} /> {activity.city?.name || activity.address}</span>
            <span><IconCalendar width={15} height={15} /> {formatDate(activity.activity_date)}</span>
            <span><IconClock width={15} height={15} /> {formatTimeRange(activity.start_time, activity.end_time)}</span>
          </div>

          <div className="divider" />

          <div className="summary-row">
            <span>Harga per slot</span>
            <span>{formatRupiah(activity.price)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatRupiah(activity.price)}</span>
          </div>

          <button className="btn btn--solid btn--full" style={{ marginTop: 18 }} onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Memproses...' : 'Konfirmasi & Booking'}
          </button>
        </div>
      </div>
    </div>
  )
}
