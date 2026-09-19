const MAP = {
  pending: { label: 'Menunggu Bayar', cls: 'pending' },
  waiting: { label: 'Menunggu Konfirmasi', cls: 'pending' },
  success: { label: 'Berhasil', cls: 'success' },
  paid: { label: 'Berhasil', cls: 'success' },
  failed: { label: 'Gagal', cls: 'failed' },
  cancel: { label: 'Dibatalkan', cls: 'cancelled' },
  cancelled: { label: 'Dibatalkan', cls: 'cancelled' },
  canceled: { label: 'Dibatalkan', cls: 'cancelled' },
}

export default function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase()
  const info = MAP[key] || { label: status || 'Tidak diketahui', cls: 'default' }
  return <span className={`status-badge status-badge--${info.cls}`}>{info.label}</span>
}
