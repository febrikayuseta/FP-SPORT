import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getActivities } from '../api/activities'
import { getCategories } from '../api/categories'
import { normalizeList } from '../api/client'
import ActivityCard from '../components/ActivityCard'
import CityPicker from '../components/CityPicker'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { IconSearch } from '../components/Icons'

const PER_PAGE_OPTIONS = [9, 18, 27]

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
  const perPage = Number(params.get('per_page') || 9)

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
      per_page: perPage,
      page,
      search,
      sport_category_id: categoryId,
      city_id: cityId,
    })
      .then((res) => {
        if (!alive) return
        const { items, meta } = normalizeList(res)
        setActivities(items)
        setMeta(meta)
      })
      .catch((err) => alive && setErrorMsg(err.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [search, categoryId, cityId, page, perPage])

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {(categoryId || cityId || search) && (
              <button className="btn btn--ghost" onClick={() => setParams({})}>
                Reset filter
              </button>
            )}
            <span style={{ opacity: 0.5, fontSize: '0.82rem' }}>Tampil:</span>
            {PER_PAGE_OPTIONS.map((n) => (
              <button
                key={n}
                className={`btn btn--sm${perPage === n ? ' btn--danger' : ' btn--outline'}`}
                onClick={() => updateParam('per_page', n)}
              >
                {n}
              </button>
            ))}
          </div>
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

function CityFilter({ cityId, onChange }) {
  return (
    <div style={{ maxWidth: 480 }}>
      <CityPicker value={cityId} onChange={onChange} />
    </div>
  )
}
