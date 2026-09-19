import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getActivities } from '../api/activities'
import { getCategories } from '../api/categories'
import ActivityCard from '../components/ActivityCard'
import CityPicker from '../components/CityPicker'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { IconSearch } from '../components/Icons'

const PER_PAGE = 9

export default function Browse() {
  const [params, setParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [activities, setActivities] = useState([])
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const search = params.get('q') || ''
  const categoryId = params.get('kategori') || ''
  const cityId = params.get('kota') || ''
  const page = Number(params.get('page') || 1)

  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    getCategories({ is_paginate: false, per_page: 50 })
      .then((res) => {
        const d = res?.data
        setCategories(Array.isArray(d) ? d : d?.data || [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setErrorMsg('')
    getActivities({
      is_paginate: true,
      per_page: PER_PAGE,
      page,
      search,
      sport_category_id: categoryId,
      city_id: cityId,
    })
      .then((res) => {
        if (!alive) return
        const d = res?.data
        if (Array.isArray(d)) {
          setActivities(d)
          setMeta(null)
        } else {
          setActivities(d?.data || [])
          setMeta(d || null)
        }
      })
      .catch((err) => alive && setErrorMsg(err.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [search, categoryId, cityId, page])

  function updateParam(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next)
  }

  function submitSearch(e) {
    e.preventDefault()
    updateParam('q', searchInput)
  }

  return (
    <>
      <div className="browse-head">
        <div className="container">
          <h1>Cari Mabar Sekarang</h1>
          <p>Filter sesuai cabang olahraga, kota, atau nama aktivitasnya.</p>
        </div>
      </div>

      <div className="container">
        <form className="filters" onSubmit={submitSearch}>
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="row" style={{ position: 'relative' }}>
              <input
                className="input"
                placeholder="Cari judul aktivitas..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          <select className="input" value={categoryId} onChange={(e) => updateParam('kategori', e.target.value)}>
            <option value="">Semua Cabang Olahraga</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.length > 24 ? c.name.slice(0, 24) + '…' : c.name}
              </option>
            ))}
          </select>

          <button type="submit" className="btn btn--solid">
            <IconSearch width={16} height={16} /> Cari
          </button>
        </form>

        <div style={{ marginTop: 14 }}>
          <CityFilter cityId={cityId} onChange={(id) => updateParam('kota', id)} />
        </div>

        <div className="results-bar">
          <span>
            Nemu <strong>{meta?.total ?? activities.length}</strong> aktivitas
          </span>
          {(categoryId || cityId || search) && (
            <button className="btn btn--ghost" onClick={() => setParams({})}>
              Reset filter
            </button>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : errorMsg ? (
          <EmptyState title="Gagal ambil data" hint={errorMsg} />
        ) : activities.length === 0 ? (
          <EmptyState title="Aktivitas nggak ketemu" hint="Coba ganti kata kunci atau filter lainnya." />
        ) : (
          <div className="activity-grid">
            {activities.map((a, i) => (
              <ActivityCard key={a.id} activity={a} index={i} />
            ))}
          </div>
        )}

        <Pagination meta={meta} onPageChange={(p) => updateParam('page', p)} />
      </div>
    </>
  )
}

// Filter kota simpel: provinsi -> kota, taruh terpisah biar Browse nggak makin gemuk.
function CityFilter({ cityId, onChange }) {
  return (
    <div style={{ maxWidth: 480 }}>
      <CityPicker value={cityId} onChange={onChange} />
    </div>
  )
}
