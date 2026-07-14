import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, Truck, Warehouse,
  Users, ShoppingCart, CreditCard, BarChart3, Settings,
  TrendingUp, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  { path: '/',         label: 'Dashboard',    icon: LayoutDashboard, exact: true },
  { path: '/products', label: 'Products',     icon: Package },
  { path: '/categories', label: 'Categories', icon: Tag },
  { path: '/suppliers', label: 'Suppliers',   icon: Truck },
  { path: '/inventory', label: 'Inventory',   icon: Warehouse },
  { path: '/customers', label: 'Customers',   icon: Users },
  { path: '/orders',   label: 'Orders',       icon: ShoppingCart },
  { path: '/payments', label: 'Payments',     icon: CreditCard },
  { path: '/reports',  label: 'Reports',      icon: BarChart3 },
]

const adminItems = [
  { path: '/users', label: 'User Management', icon: Settings },
]

export default function Sidebar({ open, setOpen }) {
  const { isAdmin } = useAuth()

  return (
    <div className={`${open ? 'w-64' : 'w-16'} transition-all duration-300 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {open && (
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary-400 w-6 h-6" />
            <span className="font-bold text-lg tracking-tight">CommerceIQ</span>
          </div>
        )}
        {!open && <TrendingUp className="text-primary-400 w-6 h-6 mx-auto" />}
        <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-white ml-auto">
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-2">
          {navItems.map(({ path, label, icon: Icon, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {open && <span className="text-sm font-medium truncate">{label}</span>}
            </NavLink>
          ))}

          {isAdmin() && (
            <>
              {open && <div className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</div>}
              {adminItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {open && <span className="text-sm font-medium">{label}</span>}
                </NavLink>
              ))}
            </>
          )}
        </div>
      </nav>

      {/* Footer */}
      {open && (
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center">
          CommerceIQ v1.0.0
        </div>
      )}
    </div>
  )
}
