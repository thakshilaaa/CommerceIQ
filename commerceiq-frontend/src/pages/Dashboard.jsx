import React, { useEffect, useState } from 'react'
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import KpiCard from '../components/common/KpiCard'
import StatusBadge from '../components/common/StatusBadge'
import api from '../api/axios'
import { formatCurrency, formatDate } from '../utils/formatters'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    )
  }

  if (!data) {
    return <div className="text-center text-gray-500 py-20">Failed to load dashboard data.</div>
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Intelligence Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time overview of your business performance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          change={data.revenueGrowthPercent}
          icon={DollarSign}
          color="primary"
        />
        <KpiCard
          title="Total Orders"
          value={data.totalOrders}
          change={data.orderGrowthPercent}
          icon={ShoppingCart}
          color="blue"
        />
        <KpiCard
          title="Total Customers"
          value={data.totalCustomers}
          change={data.customerGrowthPercent}
          icon={Users}
          color="green"
        />
        <KpiCard
          title="Low Stock Alerts"
          value={data.lowStockProducts}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Monthly Revenue Trend</h3>
          {data.monthlySales && data.monthlySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => formatCurrency(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5}
                  dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              No monthly data yet — create some orders to see trends
            </div>
          )}
        </div>

        {/* Order Status */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          {data.orderStatusDistribution && data.orderStatusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.orderStatusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.orderStatusDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              No orders yet
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Top Selling Products</h3>
          {data.topProducts && data.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="productName" type="category" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="totalSold" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-60 text-gray-400 text-sm">
              No sales data yet
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Payment Methods</h3>
          {data.paymentMethodDistribution && data.paymentMethodDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.paymentMethodDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="method" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-60 text-gray-400 text-sm">
              No payment data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Order #', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.recentOrders && data.recentOrders.length > 0 ? (
                data.recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-primary-600">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-gray-700">{order.customerName}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(order.date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">No recent orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
