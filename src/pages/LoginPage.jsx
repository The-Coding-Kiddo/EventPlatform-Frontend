import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import {
  Eye, EyeOff, LogIn, CheckCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const justRegistered = searchParams.get('registered') === '1'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Incorrect email or password.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your account to continue.</p>
          </div>

          {/* Success banner shown after registration */}
          {justRegistered && (
            <div className="flex items-center gap-2.5 px-4 py-3 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
              <CheckCircle size={16} className="shrink-0" />
              Account created! Sign in below to get started.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); if (error) setError('') }}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (error) setError('') }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                {error}
              </p>
            )}

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-gray-300" />
              <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-blue-300 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign up
            </Link>
          </p>

          {/* Institution note */}
          <p className="text-center text-xs text-gray-400 mt-2">
            Need an institution account?{' '}
            <span className="text-gray-500">Contact the platform admin.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
