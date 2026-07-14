import React from 'react'

const statusConfig = {
  // Orders
  PENDING:    { label: 'Pending',    cls: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED:  { label: 'Confirmed',  cls: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Processing', cls: 'bg-indigo-100 text-indigo-700' },
  SHIPPED:    { label: 'Shipped',    cls: 'bg-purple-100 text-purple-700' },
  DELIVERED:  { label: 'Delivered',  cls: 'bg-green-100 text-green-700' },
  CANCELLED:  { label: 'Cancelled',  cls: 'bg-red-100 text-red-700' },
  RETURNED:   { label: 'Returned',   cls: 'bg-gray-100 text-gray-600' },
  // Payments
  COMPLETED:  { label: 'Completed',  cls: 'bg-green-100 text-green-700' },
  FAILED:     { label: 'Failed',     cls: 'bg-red-100 text-red-700' },
  REFUNDED:   { label: 'Refunded',   cls: 'bg-orange-100 text-orange-700' },
  // Customers / Products / Suppliers
  ACTIVE:     { label: 'Active',     cls: 'bg-green-100 text-green-700' },
  INACTIVE:   { label: 'Inactive',   cls: 'bg-gray-100 text-gray-600' },
}

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status?.toUpperCase()] || { label: status, cls: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
  )
}
