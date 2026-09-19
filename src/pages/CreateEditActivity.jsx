import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createActivity, getActivity, updateActivity } from '../api/activities'
import { getCategories } from '../api/categories'
import { useToast } from '../context/ToastContext'
import CityPicker from '../components/CityPicker'
import Loader from '../components/Loader'
import { IconCheck } from '../components/Icons'

const EMPTY = {
  sport_category_id: '',
  city_id: '',
  title: '',
  description: '',
  slot: 4,
  price: 0,
  address: '',
  activity_date: '',
  start_time: '',
  end_time: '',
  map_url: '',
}

export default function CreateEditActivity() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [initialProvinceId, setInitialProvinceId] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    getCategories({ is_paginate: false, per_page: 50 })
      .then((res) => {
        const d = res?.data
        setCategories(Array.isArray(d) ? d : d?.data || [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    let alive = true
    getActivity(id)
      .then((res) => {
        if (!alive) return
        const a = res?.data
        setForm({
          sport_category_id: a.sport_category_id ?? a.sport_category?.id ?? '',
          city_id: a.city_id ?? a.city?.id ?? '',
          title: a.title || '',
          description: a.description || '',
          slot: a.slot ?? 1,
          price: a.price ?? 0,
          address: a.address || '',
          activity_date: a.activity_date ? a.activity_date.slice(0, 10) : '',
          start_time: a.start_time ? a.start_time.slice(0, 5) : '',
          end_time: a.end_time ? a.end_time.slice(0, 5) : '',
          map_url: a.map_url || '',
        })
        setInitialProvinceId(a.city?.province_id || '')
      })
      .catch((err) => toast.error(err.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit])

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setSaving(true)

    const payload = {
      ...form,
      sport_category_id: Number(form.sport_category_id),
      city_id: Number(form.city_id),
      slot: Number(form.slot),
      price: Number(form.price),
    }

    try {
      if (isEdit) {
        await updateActivity(id, payload)
        toast.success('Aktivitas berhasil diupdate.')
        navigate(`/aktivitas/${id}`)
      } else {
        const res = await createActivity(payload)
        toast.success('Aktivitas berhasil dibuat. Ajak orang gabung yuk!')
        const newId = res?.data?.id
        navigate(newId ? `/aktivitas/${newId}` : '/aktivitas-saya')
      }
    } catch (err) {
      setErrors(err.errors || {})
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Nyiapin form..." />

  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <div className="section-head">
        <div>
          <h2>{isEdit ? 'Edit Aktivitas' : 'Bikin Aktivitas Baru'}</h2>
          <p>Isi detail jadwal mabar biar orang lain gampang nemuin & join.</p>
        </div>
      </div>

      <form className="card-surface" style={{ padding: 28 }} onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="title">Judul Aktivitas</label>
          <input
            id="title"
            className="input"
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Cth: Futsal Santai Jumat Malam"
          />
          {errors.title && <span className="field-error">{errors.title[0]}</span>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="category">Cabang Olahraga</label>
            <select id="category" className="input" required value={form.sport_category_id} onChange={(e) => set('sport_category_id', e.target.value)}>
              <option value="">Pilih Cabang Olahraga</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.length > 24 ? c.name.slice(0, 24) + '…' : c.name}
                </option>
              ))}
            </select>
            {errors.sport_category_id && <span className="field-error">{errors.sport_category_id[0]}</span>}
          </div>
          <div className="field">
            <label htmlFor="slot">Jumlah Slot</label>
            <input id="slot" type="number" min="1" className="input" required value={form.slot} onChange={(e) => set('slot', e.target.value)} />
            {errors.slot && <span className="field-error">{errors.slot[0]}</span>}
          </div>
        </div>

        <div className="field">
          <label>Kota</label>
          <CityPicker
            value={form.city_id}
            onChange={(v) => set('city_id', v)}
            initialProvinceId={initialProvinceId}
            required
          />
          {errors.city_id && <span className="field-error">{errors.city_id[0]}</span>}
        </div>

        <div className="field">
          <label htmlFor="address">Alamat Lokasi</label>
          <input id="address" className="input" required value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Nama lapangan / venue + alamat" />
          {errors.address && <span className="field-error">{errors.address[0]}</span>}
        </div>

        <div className="field">
          <label htmlFor="map_url">Link Google Maps (opsional)</label>
          <input id="map_url" className="input" value={form.map_url} onChange={(e) => set('map_url', e.target.value)} placeholder="https://maps.app.goo.gl/..." />
          {errors.map_url && <span className="field-error">{errors.map_url[0]}</span>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="date">Tanggal</label>
            <input id="date" type="date" className="input" required value={form.activity_date} onChange={(e) => set('activity_date', e.target.value)} />
            {errors.activity_date && <span className="field-error">{errors.activity_date[0]}</span>}
          </div>
          <div className="field">
            <label htmlFor="price">Harga per Slot (Rp)</label>
            <input id="price" type="number" min="0" className="input" required value={form.price} onChange={(e) => set('price', e.target.value)} />
            {errors.price && <span className="field-error">{errors.price[0]}</span>}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="start">Jam Mulai</label>
            <input id="start" type="time" className="input" required value={form.start_time} onChange={(e) => set('start_time', e.target.value)} />
            {errors.start_time && <span className="field-error">{errors.start_time[0]}</span>}
          </div>
          <div className="field">
            <label htmlFor="end">Jam Selesai</label>
            <input id="end" type="time" className="input" required value={form.end_time} onChange={(e) => set('end_time', e.target.value)} />
            {errors.end_time && <span className="field-error">{errors.end_time[0]}</span>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            className="input"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Ceritain vibe mabar-nya, level skill yang dicari, atau aturan main."
          />
          {errors.description && <span className="field-error">{errors.description[0]}</span>}
        </div>

        <button type="submit" className="btn btn--solid" disabled={saving}>
          <IconCheck width={16} height={16} /> {saving ? 'Menyimpan...' : isEdit ? 'Update Aktivitas' : 'Publikasikan'}
        </button>
      </form>
    </div>
  )
}
