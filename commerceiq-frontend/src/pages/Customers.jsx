import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Users, Search } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/common/Modal'
import Table from '../components/common/Table'
import StatusBadge from '../components/common/StatusBadge'
import { formatDate } from '../utils/formatters'
import { useAuth } from '../contexts/AuthContext'

const emptyForm = { firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: 'USA', status: 'ACTIVE' }

export default function Customers() {
  const { isManager } = useAuth()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editCustomer, setEditCustomer] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetch = async () => {
    setLoading(true)
    try { const res = await api.get('/customers'); setCustomers(res.data.data || []) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditCustomer(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (c) => {
    setEditCustomer(c)
    setForm({ firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone || '', address: c.address || '', city: c.city || '', country: c.country || 'USA', status: c.status })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editCustomer) await api.put(`/customers/${editCustomer.id}`, form)
      else await api.post('/customers', form)
      setModalOpen(false); fetch()
    } catch (err) { alert(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/customers/${deleteId}`); setDeleteId(null); fetch() }
    catch (err) { alert(err.response?.data?.message || 'Error') }
  }

  const filtered = customers.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { header: 'Customer', render: c => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold text-sm">
          {c.firstName[0]}{c.lastName[0]}
        </div>
        <div>
          <p className="font-medium text-gray-900">{c.firstName} {c.lastName}</p>
          <p className="text-xs text-gray-500">{c.email}</p>
        </div>
      </div>
    )},
    { header: 'Phone', render: c => c.phone || '—' },
    { header: 'City', render: c => c.city || '—' },
    { header: 'Country', render: c => c.country || '—' },
    { header: 'Status', render: c => <StatusBadge status={c.status} /> },
    { header: 'Joined', render: c => formatDate(c.createdAt) },
    { header: 'Actions', render: c => (
      <div className="flex gap-2">
        {isManager() && <button onClick={() => openEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={15} /></button>}
        {isManager() && <button onClick={() => setDeleteId(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>}
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">{customers.length} total customers</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editCustomer ? 'Edit Customer' : 'Add Customer'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name *</label>
              <input className="input" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input className="input" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
            </div>
            <div>
              <label className="label">Email *</label>
              <input className="input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
            </div>
            <div>
              <label className="label">Country</label>
              <input className="input" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
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
              {saving ? 'Saving...' : editCustomer ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Customer" size="sm">
        <p className="text-gray-600 mb-4">Delete this customer? Their orders will remain in the system.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
