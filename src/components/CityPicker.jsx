import { useEffect, useState } from 'react'
import { getProvinces, getCitiesByProvince } from '../api/locations'

// Dropdown provinsi -> kota berjenjang. Dipakai di form bikin aktivitas
// dan di filter Browse. `value` = city_id (atau '' kalau belum milih).
export default function CityPicker({ value, onChange, required = false, disabled = false, initialProvinceId = '' }) {
  const [provinces, setProvinces] = useState([])
  const [cities, setCities] = useState([])
  const [provinceId, setProvinceId] = useState(initialProvinceId ? String(initialProvinceId) : '')
  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)

  useEffect(() => {
    if (initialProvinceId) setProvinceId(String(initialProvinceId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProvinceId])

  useEffect(() => {
    let alive = true
    setLoadingProvinces(true)
    getProvinces({ is_paginate: false, per_page: 100 })
      .then((res) => {
        if (!alive) return
        const data = res?.data
        setProvinces(Array.isArray(data) ? data : data?.data || [])
      })
      .catch(() => setProvinces([]))
      .finally(() => alive && setLoadingProvinces(false))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!provinceId) {
      setCities([])
      return
    }
    let alive = true
    setLoadingCities(true)
    getCitiesByProvince(provinceId, { is_paginate: false, per_page: 200 })
      .then((res) => {
        if (!alive) return
        const data = res?.data
        setCities(Array.isArray(data) ? data : data?.data || [])
      })
      .catch(() => setCities([]))
      .finally(() => alive && setLoadingCities(false))
    return () => {
      alive = false
    }
  }, [provinceId])

  return (
    <div className="city-picker">
      <select
        className="input"
        disabled={disabled || loadingProvinces}
        value={provinceId}
        onChange={(e) => {
          setProvinceId(e.target.value)
          onChange('')
        }}
      >
        <option value="">{loadingProvinces ? 'Memuat provinsi...' : 'Pilih Provinsi'}</option>
        {provinces.map((p) => (
          <option key={p.province_id ?? p.id} value={p.province_id ?? p.id}>
            {p.province_name ?? p.name}
          </option>
        ))}
      </select>

      <select
        className="input"
        disabled={disabled || !provinceId || loadingCities}
        value={value || ''}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">
          {!provinceId ? 'Pilih provinsi dulu' : loadingCities ? 'Memuat kota...' : 'Pilih Kota'}
        </option>
        {cities.map((c) => (
          <option key={c.city_id ?? c.id} value={c.city_id ?? c.id}>
            {c.city_name ?? c.name}
          </option>
        ))}
      </select>
    </div>
  )
}
