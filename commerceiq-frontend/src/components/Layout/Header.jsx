import React, { useState, useEffect } from 'react'
import { Menu, Bell, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get('/notifications/unread-count')
        setUnreadCount(res.data.data?.count || 0)
      } catch {}
    }
    fetchCount()
  }, [])

  const roleBadge = (role) => {
    const map = {
      ROLE_ADMIN: { label: 'Admin', cls: 'bg-red-100 text-red-700' },
      ROLE_MANAGER: { label: 'Manager', cls: 'bg-blue-100 text-blue-700' },
      ROLE_STAFF: { label: 'Staff', cls: 'bg-green-100 text-green-700' },
    }
    return map[role] || { label: role, cls: 'bg-gray-100 text-gray-700' }
  }

  const rb = roleBadge(user?.role)

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-gray-500 hover:text-gray-700">
          <Menu size={22} />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Welcome back, {user?.fullName || user?.username}</h2>
          <p className="text-xs text-gray-500">Manage your e-commerce operations</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user?.fullName || user?.username}</p>
              <span className={`text-xs px-1.5 py-0.5 rounded ${rb.cls}`}>{rb.label}</span>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { logout(); setDropdownOpen(false) }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
