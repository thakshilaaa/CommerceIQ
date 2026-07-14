import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/common/Modal'
import Table from '../components/common/Table'
import { formatDate } from '../utils/formatters'
import { useAuth } from '../contexts/AuthContext'

export default function Categories() {
  const { isManager } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetch = async () => {
    setLoading(true)
    try { const res = await api.get('/categories'); setCategories(res.data.data || []) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditCat(null); setForm({ name: '', description: '' }); setModalOpen(true) }
  const openEdit = (c) => { setEditCat(c); setForm({ name: c.name, description: c.description || '' }); setModalOpen(true) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editCat) await api.put(`/categories/${editCat.id}`, form)
      else await api.post('/categories', form)
      setModalOpen(false); fetch()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/categories/${deleteId}`); setDeleteId(null); fetch() }
    catch (err) { alert(err.response?.data?.message || 'Error deleting') }
  }

  const columns = [
    { header: 'Category', render: c => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <Tag size={14} className="text-purple-600" />
        </div>
        <span className="font-medium text-gray-900">{c.name}</span>
      </div>
    )},
    { header: 'Description', render: c => <span className="text-gray-500 text-sm">{c.description || '—'}</span> },
    { header: 'Created', render: c => formatDate(c.createdAt) },
    { header: 'Actions', render: c => (
      <div className="flex gap-2">
        {isManager() && (
          <button onClick={() => openEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Edit2 size={15} />
          </button>
        )}
        {isManager() && (
          <button onClick={() => setDeleteId(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 size={15} />
          </button>
        )}
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        {isManager() && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      <div className="card">
        <Table columns={columns} data={categories} loading={loading} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editCat ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description}
              onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editCat ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Category" size="sm">
        <p className="text-gray-600 mb-4">Delete this category? Products in it will lose their category.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
