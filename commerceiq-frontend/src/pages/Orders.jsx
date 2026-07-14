import React, { useEffect, useState } from 'react'
import { Plus, Eye, ChevronDown } from 'lucide-react'
import api from '../api/axios'
import Modal from '../components/common/Modal'
import Table from '../components/common/Table'
import StatusBadge from '../components/common/StatusBadge'
import { formatCurrency, formatDateTime } from '../utils/formatters'

const ORDER_STATUSES = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','RETURNED']
const PAYMENT_METHODS = ['CASH','CREDIT_CARD','DEBIT_CARD','BANK_TRANSFER','ONLINE_PAYMENT']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewOrder, setViewOrder] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [form, setForm] = useState({ customerId: '', notes: '', discount: 0, taxRate: 0.1, paymentMethod: 'CASH', items: [{ productId: '', quantity: 1 }] })
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const [oRes, cRes, pRes] = await Promise.all([api.get('/orders'), api.get('/customers'), api.get('/products')])
      setOrders(oRes.data.data || [])
      setCustomers(cRes.data.data || [])
      setProducts(pRes.data.data || [])
    } finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const handleStatusChange = async (id, status) => {
    try { await api.patch(`/orders/${id}/status`, { status }); fetch() }
    catch (err) { alert(err.response?.data?.message || 'Error') }
  }

  const addItem = () => setForm({ ...form, items: [...form.items, { productId: '', quantity: 1 }] })
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })
  const updateItem = (i, field, val) => {
    const items = [...form.items]
    items[i] = { ...items[i], [field]: val }
    setForm({ ...form, items })
  }

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await api.post('/orders', { ...form, customerId: parseInt(form.customerId), items: form.items.map(i => ({ productId: parseInt(i.productId), quantity: parseInt(i.quantity) })) })
      setCreateOpen(false)
      setForm({ customerId: '', notes: '', discount: 0, taxRate: 0.1, paymentMethod: 'CASH', items: [{ productId: '', quantity: 1 }] })
      fetch()
    } catch (err) { alert(err.response?.data?.message || 'Error creating order') }
    finally { setSaving(false) }
  }

  const filtered = filterStatus ? orders.filter(o => o.status === filterStatus) : orders

  const columns = [
    { header: 'Order #', render: o => <span className="font-mono text-primary-600 font-medium">{o.orderNumber}</span> },
    { header: 'Customer', render: o => o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : '—' },
    { header: 'Items', render: o => o.orderItems?.length || 0 },
    { header: 'Total', render: o => <span className="font-semibold">{formatCurrency(o.totalAmount)}</span> },
    { header: 'Status', render: o => (
      <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500">
        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
    { header: 'Date', render: o => formatDateTime(o.createdAt) },
    { header: 'View', render: o => (
      <button onClick={() => setViewOrder(o)} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg">
        <Eye size={15} />
      </button>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Order
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <select className="input max-w-xs" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>

      {/* View Order Modal */}
      <Modal open={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order ${viewOrder?.orderNumber}`} size="lg">
        {viewOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{viewOrder.customer?.firstName} {viewOrder.customer?.lastName}</span></div>
              <div><span className="text-gray-500">Status:</span> <StatusBadge status={viewOrder.status} /></div>
              <div><span className="text-gray-500">Date:</span> <span>{formatDateTime(viewOrder.createdAt)}</span></div>
              <div><span className="text-gray-500">Shipping:</span> <span>{viewOrder.shippingAddress || '—'}</span></div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  {['Product','Qty','Unit Price','Total'].map(h => <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-600">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {(viewOrder.orderItems || []).map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2">{item.product?.name}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-2 font-medium">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span>{formatCurrency(viewOrder.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Discount:</span><span>- {formatCurrency(viewOrder.discount)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax:</span><span>{formatCurrency(viewOrder.taxAmount)}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total:</span><span>{formatCurrency(viewOrder.totalAmount)}</span></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Order Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Order" size="xl">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Customer *</label>
              <select className="input" required value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})}>
                <option value="">— Select Customer —</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Payment Method</label>
              <select className="input" value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Discount ($)</label>
              <input className="input" type="number" min="0" step="0.01" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} />
            </div>
            <div>
              <label className="label">Tax Rate (e.g. 0.1 = 10%)</label>
              <input className="input" type="number" min="0" step="0.01" max="1" value={form.taxRate} onChange={e => setForm({...form, taxRate: e.target.value})} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Order Items *</label>
              <button type="button" onClick={addItem} className="text-xs text-primary-600 hover:text-primary-700 font-medium">+ Add Item</button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <select className="input flex-1" required value={item.productId} onChange={e => updateItem(i, 'productId', e.target.value)}>
                    <option value="">— Select Product —</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stockQuantity})</option>)}
                  </select>
                  <input className="input w-24" type="number" min="1" required value={item.quantity}
                    onChange={e => updateItem(i, 'quantity', e.target.value)} placeholder="Qty" />
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 px-2">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setCreateOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
