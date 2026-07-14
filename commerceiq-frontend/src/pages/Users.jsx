import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Shield } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/common/Modal'
import Table from '../components/common/Table'
import { formatDate } from '../utils/formatters'

const ROLES = ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '', role: 'ROLE_STAFF' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetch = async () => {
    setLoading(true)
    try { const res = await api.get('/users'); setUsers(res.data.data || []) }
    catch { setUsers([]) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const openCreate = () => {
    setEditUser(null)
    setForm({ username: '', email: '', password: '', fullName: '', role: 'ROLE_STAFF' })
    setModalOpen(true)
  }
  const openEdit = (u) => {
    setEditUser(u)
    setForm({ username: u.username, email: u.email, password: '', fullName: u.fullName || '', role: u.role })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editUser) await api.put(`/users/${editUser.id}`, form)
      else await api.post('/auth/register', form)
      setModalOpen(false); fetch()
    } catch (err) { alert(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/users/${deleteId}`); setDeleteId(null); fetch() }
    catch (err) { alert(err.response?.data?.message || 'Error') }
  }

  const roleLabel = (r) => {
    const map = { ROLE_ADMIN: { label: 'Admin', cls: 'bg-red-100 text-red-700' }, ROLE_MANAGER: { label: 'Manager', cls: 'bg-blue-100 text-blue-700' }, ROLE_STAFF: { label: 'Staff', cls: 'bg-green-100 text-green-700' } }
    const cfg = map[r] || { label: r, cls: 'bg-gray-100 text-gray-600' }
    return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
  }

  const columns = [
    { header: 'User', render: u => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">
          {(u.fullName || u.username || 'U')[0].toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900">{u.fullName || u.username}</p>
          <p className="text-xs text-gray-500">@{u.username}</p>
        </div>
      </div>
    )},
    { header: 'Email', key: 'email' },
    { header: 'Role', render: u => roleLabel(u.role) },
    { header: 'Status', render: u => <span className={`badge ${u.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{u.enabled ? 'Active' : 'Disabled'}</span> },
    { header: 'Created', render: u => formatDate(u.createdAt) },
    { header: 'Actions', render: u => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(u)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={15} /></button>
        <button onClick={() => setDeleteId(u.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} system users</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="card">
        <Table columns={columns} data={users} loading={loading} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
          </div>
          <div>
            <label className="label">Username *</label>
            <input className="input" required value={form.username} onChange={e => setForm({...form, username: e.target.value})} disabled={!!editUser} />
          </div>
          <div>
            <label className="label">Email *</label>
            <input className="input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="label">{editUser ? 'New Password (leave blank to keep)' : 'Password *'}</label>
            <input className="input" type="password" required={!editUser} value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              {ROLES.map(r => <option key={r} value={r}>{r.replace('ROLE_', '')}</option>)}
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editUser ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete User" size="sm">
        <p className="text-gray-600 mb-4">Are you sure you want to delete this user? This cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
