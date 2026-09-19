import { useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../api/categories'
import { useToast } from '../../context/ToastContext'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import { IconCheck, IconEdit, IconPlus, IconTrash, IconX } from '../../components/Icons'

const PER_PAGE = 10

export default function AdminCategories() {
  const toast = useToast()
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [busyId, setBusyId] = useState(null)

  function load() {
    setLoading(true)
    getCategories({ is_paginate: true, per_page: PER_PAGE, page })
      .then((res) => {
        const d = res?.data
        setCategories(d?.data || [])
        setMeta(d || null)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [page])

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      await createCategory({ name: newName.trim() })
      toast.success('Kategori ditambahkan.')
      setNewName('')
      setPage(1)
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCreating(false)
    }
  }

  function startEdit(c) {
    setEditingId(c.id)
    setEditingName(c.name)
  }

  async function saveEdit(id) {
    if (!editingName.trim()) return
    setBusyId(id)
    try {
      await updateCategory(id, { name: editingName.trim() })
      toast.success('Kategori diupdate.')
      setEditingId(null)
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus kategori ini? Aktivitas yang pakai kategori ini bisa kena imbas.')) return
    setBusyId(id)
    try {
      await deleteCategory(id)
      toast.success('Kategori dihapus.')
      load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AdminShell title="Kategori Olahraga" subtitle="Kelola master data cabang olahraga di platform.">
      <form className="card-surface row" style={{ padding: 18, marginBottom: 20, gap: 10 }} onSubmit={handleCreate}>
        <input
          className="input"
          placeholder="Nama kategori baru, cth: Panjat Tebing"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="btn btn--solid" disabled={creating} style={{ flexShrink: 0 }}>
          <IconPlus width={16} height={16} /> Tambah
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : categories.length === 0 ? (
        <EmptyState title="Belum ada kategori" hint="Tambahin kategori pertama di form atas." />
      ) : (
        <>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>
                      {editingId === c.id ? (
                        <input className="input" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        {editingId === c.id ? (
                          <>
                            <button className="btn btn--sm btn--lime" onClick={() => saveEdit(c.id)} disabled={busyId === c.id}>
                              <IconCheck width={14} height={14} />
                            </button>
                            <button className="btn btn--sm btn--outline" onClick={() => setEditingId(null)}>
                              <IconX width={14} height={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn--sm btn--outline" onClick={() => startEdit(c)}>
                              <IconEdit width={14} height={14} />
                            </button>
                            <button className="btn btn--sm btn--danger" onClick={() => handleDelete(c.id)} disabled={busyId === c.id}>
                              <IconTrash width={14} height={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}
    </AdminShell>
  )
}
