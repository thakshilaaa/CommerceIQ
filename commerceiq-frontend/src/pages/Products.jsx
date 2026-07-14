import React, { useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/common/Modal'
import Table from '../components/common/Table'
import StatusBadge from '../components/common/StatusBadge'
import { formatCurrency } from '../utils/formatters'
import { useAuth } from '../contexts/AuthContext'

const emptyForm = {
  name: '', description: '', sku: '', price: '', costPrice: '',
  stockQuantity: '', reorderLevel: 10, imageUrl: '', status: 'ACTIVE',
  categoryId: '', supplierId: ''
}

export default function Products() {
  const { isManager } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [pRes, cRes, sRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/suppliers'),
      ])
      setProducts(pRes.data.data || [])
      setCategories(cRes.data.data || [])
      setSuppliers(sRes.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const openCreate = () => { setEditProduct(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (p) => {
    setEditProduct(p)
    setForm({
      name: p.name, description: p.description || '', sku: p.sku || '',
      price: p.price, costPrice: p.costPrice || '', stockQuantity: p.stockQuantity,
      reorderLevel: p.reorderLevel || 10, imageUrl: p.imageUrl || '', status: p.status,
      categoryId: p.category?.id || '', supplierId: p.supplier?.id || '',
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const { categoryId, supplierId, ...body } = form
      const params = {}
      if (categoryId) params.categoryId = categoryId
      if (supplierId) params.supplierId = supplierId
      const qs = new URLSearchParams(params).toString()
      if (editProduct) {
        await api.put(`/products/${editProduct.id}?${qs}`, body)
      } else {
        await api.post(`/products?${qs}`, body)
      }
      setModalOpen(false); fetchAll()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/products/${deleteId}`); setDeleteId(null); fetchAll() }
    catch (err) { alert(err.response?.data?.message || 'Error deleting') }
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  const columns = [
    { header: 'Product', render: p => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
          <Package size={14} className="text-primary-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{p.name}</p>
          <p className="text-xs text-gray-500">{p.sku || 'No SKU'}</p>
        </div>
      </div>
    )},
    { header: 'Category', render: p => p.category?.name || '—' },
    { header: 'Price', render: p => <span className="font-semibold">{formatCurrency(p.price)}</span> },
    { header: 'Stock', render: p => (
      <span className={`font-medium ${p.stockQuantity <= p.reorderLevel ? 'text-red-600' : 'text-gray-700'}`}>
        {p.stockQuantity}
        {p.stockQuantity <= p.reorderLevel && <span className="ml-1 text-xs">(Low)</span>}
      </span>
    )},
    { header: 'Supplier', render: p => p.supplier?.name || '—' },
    { header: 'Status', render: p => <StatusBadge status={p.status} /> },
    { header: 'Actions', render: p => (
      <div className="flex gap-2">
        {isManager() && (
          <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
            <Edit2 size={15} />
          </button>
        )}
        {isManager() && (
          <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} total products</p>
        </div>
        {isManager() && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9" placeholder="Search products..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editProduct ? 'Edit Product' : 'Add Product'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Product Name *</label>
              <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className="label">SKU</label>
              <input className="input" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div>
              <label className="label">Price *</label>
              <input className="input" type="number" step="0.01" min="0" required value={form.price}
                onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            <div>
              <label className="label">Cost Price</label>
              <input className="input" type="number" step="0.01" min="0" value={form.costPrice}
                onChange={e => setForm({...form, costPrice: e.target.value})} />
            </div>
            <div>
              <label className="label">Stock Quantity</label>
              <input className="input" type="number" min="0" value={form.stockQuantity}
                onChange={e => setForm({...form, stockQuantity: e.target.value})} />
            </div>
            <div>
              <label className="label">Reorder Level</label>
              <input className="input" type="number" min="0" value={form.reorderLevel}
                onChange={e => setForm({...form, reorderLevel: e.target.value})} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                <option value="">— Select Category —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Supplier</label>
              <select className="input" value={form.supplierId} onChange={e => setForm({...form, supplierId: e.target.value})}>
                <option value="">— Select Supplier —</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea className="input" rows={3} value={form.description}
                onChange={e => setForm({...form, description: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
        <p className="text-gray-600 mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
