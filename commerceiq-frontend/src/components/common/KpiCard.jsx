import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function KpiCard({ title, value, change, icon: Icon, color = 'primary', prefix = '' }) {
  const colorMap = {
    primary: { bg: 'bg-primary-50', icon: 'text-primary-600', iconBg: 'bg-primary-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', iconBg: 'bg-green-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', iconBg: 'bg-blue-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', iconBg: 'bg-orange-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', iconBg: 'bg-red-100' },
  }
  const c = colorMap[color] || colorMap.primary
  const isPositive = change >= 0

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {prefix}{typeof value === 'number' && value > 1000
              ? value.toLocaleString()
              : value ?? '—'}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(change).toFixed(1)}% from last month</span>
            </div>
          )}
        </div>
        <div className={`${c.iconBg} p-3 rounded-xl`}>
          <Icon className={`${c.icon} w-6 h-6`} />
        </div>
      </div>
    </div>
  )
}
