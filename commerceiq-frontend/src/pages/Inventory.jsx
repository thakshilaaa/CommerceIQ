import React, { useEffect, useState } from 'react'
import { AlertTriangle, Warehouse, Plus, Minus, TrendingDown } from 'lucide-react'
import api from '../api/axios'
import Table from '../components/common/Table'
import Modal from '../components/common/Modal'
import { formatCurrency } from '../utils/formatters'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [adjustModal, setAdjustModal] = useState(null)
  const [adjustQty, setAdjustQty] = useState('')
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const [pRes, lRes] = await Promise.all([api.get('/products'), api.get('/products/low-stock')])
      setProducts(pRes.data.data || [])
      setLowStock(lRes.data.data || [])
    } finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const handleAdjust = async (delta) => {
    if (!adjustQty || isNaN(adjustQty)) return
    setSaving(true)
    try {
      await api.patch(`/products/${adjustModal.id}/stock`, { quantity: delta * parseInt(adjustQty) })
      setAdjustModal(null); setAdjustQty(''); fetch()
    } catch (err) { alert(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const stockLevel = (p) => {
    const pct = p.reorderLevel > 0 ? (p.stockQuantity / (p.reorderLevel * 5)) * 100 : 100
    if (p.stockQuantity === 0) return { label: 'Out of Stock', cls: 'bg-red-500', color: 'text-red-600', pct: 0 }
    if (p.stockQuantity <= p.reorderLevel) return { label: 'Low Stock', cls: 'bg-orange-400', color: 'text-orange-600', pct: Math.min(pct, 25) }
    return { label: 'In Stock', cls: 'bg-green-500', color: 'text-green-600', pct: Math.min(pct, 100) }
  }

  const columns = [
    { header: 'Product', render: p => (
      <div>
        <p className="font-medium text-gray-900">{p.name}</p>
        <p className="text-xs text-gray-500">{p.sku || '—'}</p>
      </div>
    )},
    { header: 'Category', render: p => p.category?.name || '—' },
    { header: 'Stock', render: p => {
      const sl = stockLevel(p)
      return (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-semibold ${sl.color}`}>{p.stockQuantity}</span>
            <span className={`text-xs badge ${sl.color === 'text-green-600' ? 'bg-green-100 text-green-700' : sl.color === 'text-orange-600' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{sl.label}</span>
          </div>
          <div className="w-32 h-1.5 bg-gray-200 rounded-full">
            <div className={`h-1.5 rounded-full ${sl.cls}`} style={{ width: `${sl.pct}%` }} />
          </div>
        </div>
      )
    }},
    { header: 'Reorder Level', key: 'reorderLevel' },
    { header: 'Unit Price', render: p => formatCurrency(p.price) },
    { header: 'Stock Value', render: p => formatCurrency(p.price * p.stockQuantity) },
    { header: 'Adjust', render: p => (
      <button onClick={() => setAdjustModal(p)} className="px-3 py-1.5 text-xs bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-medium">
        Adjust
      </button>
    )},
  ]

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor stock levels and adjust inventory</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <Warehouse className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          <p className="text-sm text-gray-500">Total Products</p>
        </div>
        <div className="card text-center">
          <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-orange-600">{lowStock.length}</p>
          <p className="text-sm text-gray-500">Low / Out of Stock</p>
        </div>
        <div className="card text-center">
          <TrendingDown className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
          <p className="text-sm text-gray-500">Total Inventory Value</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-orange-600" />
            <span className="font-semibold text-orange-800">{lowStock.length} items need restocking</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(p => (
              <span key={p.id} className="badge bg-orange-100 text-orange-700">{p.name} ({p.stockQuantity} left)</span>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <Table columns={columns} data={products} loading={loading} />
      </div>

      {/* Adjust Modal */}
      <Modal open={!!adjustModal} onClose={() => setAdjustModal(null)} title={`Adjust Stock — ${adjustModal?.name}`} size="sm">
        <div className="space-y-4">
          <div className="text-center py-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Current Stock</p>
            <p className="text-3xl font-bold text-gray-900">{adjustModal?.stockQuantity}</p>
          </div>
          <div>
            <label className="label">Quantity to Add / Remove</label>
            <input className="input text-center text-lg" type="number" min="0" placeholder="0"
              value={adjustQty} onChange={e => setAdjustQty(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button disabled={saving || !adjustQty} onClick={() => handleAdjust(1)}
              className="btn-primary flex items-center justify-center gap-2">
              <Plus size={16} /> Add Stock
            </button>
            <button disabled={saving || !adjustQty} onClick={() => handleAdjust(-1)}
              className="btn-danger flex items-center justify-center gap-2">
              <Minus size={16} /> Remove Stock
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
