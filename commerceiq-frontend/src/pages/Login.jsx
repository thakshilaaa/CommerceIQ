import React, { useState } from 'react'
import { TrendingUp, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(form.username, form.password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <TrendingUp className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white">CommerceIQ</h1>
          <p className="text-gray-400 mt-2">E-Commerce Business Intelligence Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign in to your account</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                className="input"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
            <p className="font-medium text-gray-700 mb-2">Demo credentials:</p>
            <p><span className="font-mono bg-gray-200 px-1 rounded">admin</span> / <span className="font-mono bg-gray-200 px-1 rounded">admin123</span> — Admin</p>
            <p><span className="font-mono bg-gray-200 px-1 rounded">manager</span> / <span className="font-mono bg-gray-200 px-1 rounded">manager123</span> — Manager</p>
            <p><span className="font-mono bg-gray-200 px-1 rounded">staff</span> / <span className="font-mono bg-gray-200 px-1 rounded">staff123</span> — Staff</p>
            <p><span className="font-mono bg-gray-200 px-1 rounded">customer</span> / <span className="font-mono bg-gray-200 px-1 rounded">customer123</span> — Customer</p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          &copy; {new Date().getFullYear()} CommerceIQ. All rights reserved.
        </p>
      </div>
    </div>
  )
}
