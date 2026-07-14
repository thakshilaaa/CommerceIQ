import React, { useEffect, useState } from 'react'
import { CreditCard } from 'lucide-react'
import api from '../api/axios'
import Table from '../components/common/Table'
import StatusBadge from '../components/common/StatusBadge'
import { formatCurrency, formatDateTime } from '../utils/formatters'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  const fetch = async () => {
    setLoading(true)
    try { const res = await api.get('/payments'); setPayments(res.data.data || []) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetch() }, [])

  const handleStatusChange = async (id, status) => {
    try { await api.patch(`/payments/${id}/status`, { status }); fetch() }
    catch (err) { alert(err.response?.data?.message || 'Error') }
  }

  const filtered = filterStatus ? payments.filter(p => p.status === filterStatus) : payments
  const totalCompleted = payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + (p.amount || 0), 0)

  const columns = [
    { header: 'Transaction ID', render: p => <span className="font-mono text-sm text-gray-600">{p.transactionId || '—'}</span> },
    { header: 'Order #', render: p => <span className="text-primary-600 font-medium">{p.order?.orderNumber || '—'}</span> },
    { header: 'Amount', render: p => <span className="font-semibold">{formatCurrency(p.amount)}</span> },
    { header: 'Method', render: p => (
      <span className="badge bg-blue-100 text-blue-700">{p.paymentMethod?.replace('_', ' ') || '—'}</span>
    )},
    { header: 'Status', render: p => <StatusBadge status={p.status} /> },
    { header: 'Date', render: p => formatDateTime(p.createdAt) },
    { header: 'Update', render: p => (
      <select value={p.status} onChange={e => handleStatusChange(p.id, e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none">
        {['PENDING','COMPLETED','FAILED','REFUNDED'].map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500 mt-1">{payments.length} total transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <CreditCard className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{payments.length}</p>
          <p className="text-sm text-gray-500">Total Payments</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCompleted)}</p>
          <p className="text-sm text-gray-500">Total Completed</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === 'PENDING').length}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <select className="input max-w-xs" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {['PENDING','COMPLETED','FAILED','REFUNDED'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Table columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  )
}
