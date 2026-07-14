import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Truck, Search } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/common/Modal'
import Table from '../components/common/Table'
import StatusBadge from '../components/common/StatusBadge'
import { useAuth } from '../contexts/AuthContext'

export default function Suppliers() {
  const { isManager } = useAuth()
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editSupplier, setEditSupplier] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', contactPerson: '', status: 'ACTIVE' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetch = async () => {
    setLoading(true)
    try { const res = await api.get('/suppliers'); setSuppliers(res.data.data || []) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const openCreate = () => {
    setEditSupplier(null)
    setForm({ name: '', email: '', phone: '', address: '', contactPerson: '', status: 'ACTIVE' })
    setModalOpen(true)
  }
  const openEdit = (s) => {
    setEditSupplier(s)
    setForm({ name: s.name, email: s.email || '', phone: s.phone || '', address: s.address || '', contactPerson: s.contactPerson || '', status: s.status })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editSupplier) await api.put(`/suppliers/${editSupplier.id}`, form)
      else await api.post('/suppliers', form)
      setModalOpen(false); fetch()
    } catch (err) { alert(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/suppliers/${deleteId}`); setDeleteId(null); fetch() }
    catch (err) { alert(err.response?.data?.message || 'Error') }
  }

  const filtered = suppliers.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { header: 'Supplier', render: s => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <Truck size={14} className="text-orange-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{s.name}</p>
          <p className="text-xs text-gray-500">{s.contactPerson || '—'}</p>
        </div>
      </div>
    )},
    { header: 'Email', key: 'email' },
    { header: 'Phone', key: 'phone' },
    { header: 'Address', render: s => <span className="text-sm text-gray-500">{s.address || '—'}</span> },
    { header: 'Status', render: s => <StatusBadge status={s.status} /> },
    { header: 'Actions', render: s => (
      <div className="flex gap-2">
        {isManager() && <button onClick={() => openEdit(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={15} /></button>}
        {isManager() && <button onClick={() => setDeleteId(s.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>}
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-sm text-gray-500 mt-1">{suppliers.length} suppliers</p>
        </div>
        {isManager() && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Supplier
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editSupplier ? 'Edit Supplier' : 'Add Supplier'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Company Name *</label>
              <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="label">Contact Person</label>
              <input className="input" value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Address</label>
              <textarea className="input" rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editSupplier ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Supplier" size="sm">
        <p className="text-gray-600 mb-4">Delete this supplier? This may affect products assigned to them.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
