import React, { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users, Package, CreditCard } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import api from '../api/axios'
import { formatCurrency } from '../utils/formatters'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Reports() {
  const [salesData, setSalesData] = useState(null)
  const [inventoryData, setInventoryData] = useState(null)
  const [customerData, setCustomerData] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [productData, setProductData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('sales')
  const [days, setDays] = useState(30)

  const fetch = async () => {
    setLoading(true)
    try {
      const [sRes, iRes, cRes, pRes, prRes] = await Promise.all([
        api.get(`/reports/sales-summary?days=${days}`),
        api.get('/reports/inventory-report'),
        api.get('/reports/customer-report'),
        api.get('/reports/payment-report'),
        api.get('/reports/product-performance'),
      ])
      setSalesData(sRes.data.data)
      setInventoryData(iRes.data.data)
      setCustomerData(cRes.data.data)
      setPaymentData(pRes.data.data)
      setProductData(prRes.data.data || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [days])

  const tabs = [
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ]

  const orderStatusData = salesData?.orderStatusBreakdown
    ? salesData.orderStatusBreakdown.map(r => ({ name: r[0]?.toString(), value: Number(r[1]) }))
    : []

  const paymentMethodData = paymentData?.methodBreakdown
    ? paymentData.methodBreakdown.map(r => ({ name: r[0]?.toString().replace('_', ' '), value: Number(r[1]) }))
    : []

  const topProductsData = productData.slice(0, 8).map(r => ({
    name: r[1]?.toString().slice(0, 20),
    sold: Number(r[2]),
    revenue: Number(r[3]),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Detailed business insights and analytics</p>
        </div>
        <select className="input max-w-[160px]" value={days} onChange={e => setDays(e.target.value)}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last 365 days</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : (
        <>
          {/* Sales Tab */}
          {activeTab === 'sales' && salesData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card text-center">
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{salesData.totalOrders ?? 0}</p>
                </div>
                <div className="card text-center">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-3xl font-bold text-primary-600 mt-1">{formatCurrency(salesData.totalRevenue ?? 0)}</p>
                </div>
                <div className="card text-center">
                  <p className="text-sm text-gray-500">Avg. Order Value</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {salesData.totalOrders > 0 ? formatCurrency(salesData.totalRevenue / salesData.totalOrders) : '$0.00'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-base font-semibold text-gray-800 mb-4">Order Status Breakdown</h3>
                  {orderStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                          label={({ name, percent }) => `${name} (${(percent*100).toFixed(0)}%)`} labelLine={false}>
                          {orderStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <div className="flex items-center justify-center h-60 text-gray-400 text-sm">No data</div>}
                </div>

                <div className="card">
                  <h3 className="text-base font-semibold text-gray-800 mb-4">Top Products by Sales</h3>
                  {topProductsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={topProductsData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="sold" fill="#6366f1" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <div className="flex items-center justify-center h-60 text-gray-400 text-sm">No sales data</div>}
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && inventoryData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card text-center"><p className="text-3xl font-bold">{inventoryData.totalProducts}</p><p className="text-sm text-gray-500 mt-1">Total Products</p></div>
                <div className="card text-center"><p className="text-3xl font-bold text-orange-600">{inventoryData.lowStockProducts?.length}</p><p className="text-sm text-gray-500 mt-1">Low Stock</p></div>
                <div className="card text-center"><p className="text-3xl font-bold text-red-600">{inventoryData.outOfStock}</p><p className="text-sm text-gray-500 mt-1">Out of Stock</p></div>
              </div>

              {inventoryData.lowStockProducts?.length > 0 && (
                <div className="card">
                  <h3 className="text-base font-semibold mb-4">Low Stock Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-gray-50 border-b">
                        {['Product','SKU','Stock','Reorder Level','Category'].map(h => <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-600">{h}</th>)}
                      </tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {inventoryData.lowStockProducts.map(p => (
                          <tr key={p.id}>
                            <td className="px-4 py-2 font-medium">{p.name}</td>
                            <td className="px-4 py-2 text-gray-500">{p.sku || '—'}</td>
                            <td className="px-4 py-2 text-red-600 font-semibold">{p.stockQuantity}</td>
                            <td className="px-4 py-2">{p.reorderLevel}</td>
                            <td className="px-4 py-2 text-gray-500">{p.category?.name || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && customerData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card text-center"><p className="text-3xl font-bold">{customerData.totalCustomers}</p><p className="text-sm text-gray-500 mt-1">Total Customers</p></div>
                <div className="card text-center"><p className="text-3xl font-bold text-green-600">{customerData.newThisMonth}</p><p className="text-sm text-gray-500 mt-1">New This Month</p></div>
              </div>
              <div className="card">
                <h3 className="text-base font-semibold mb-4">All Customers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 border-b">
                      {['Name','Email','Phone','City','Status'].map(h => <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-600">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {customerData.allCustomers?.map(c => (
                        <tr key={c.id}>
                          <td className="px-4 py-2 font-medium">{c.firstName} {c.lastName}</td>
                          <td className="px-4 py-2 text-gray-500">{c.email}</td>
                          <td className="px-4 py-2 text-gray-500">{c.phone || '—'}</td>
                          <td className="px-4 py-2 text-gray-500">{c.city || '—'}</td>
                          <td className="px-4 py-2"><span className="badge bg-green-100 text-green-700">{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && paymentData && (
            <div className="space-y-6">
              <div className="card text-center max-w-sm mx-auto">
                <p className="text-sm text-gray-500">Total Completed Payments</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{formatCurrency(paymentData.totalCompleted)}</p>
              </div>
              <div className="card">
                <h3 className="text-base font-semibold mb-4">Payment Methods Breakdown</h3>
                {paymentMethodData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={paymentMethodData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="flex items-center justify-center h-60 text-gray-400 text-sm">No payment data yet</div>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
