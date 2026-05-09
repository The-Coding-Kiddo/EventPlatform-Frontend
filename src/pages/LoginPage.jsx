import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, LogIn, CheckCircle } from 'lucide-react'
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
    <div className="min-h-screen flex items-center justify-center bg-[#EDF4F9] px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#C8D8E4] bg-white shadow-xl" style={{ boxShadow: '0 2px 8px rgba(59,95,130,0.08)' }}>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#1A2E3E] mb-2">Welcome back</h1>
            <p className="text-[#4A6070]">Sign in to your Eventim account.</p>
          </div>

          {justRegistered && (
            <div className="flex items-center gap-2.5 px-4 py-3 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
              <CheckCircle size={16} className="shrink-0" />
              Account created! Sign in below to get started.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#1A2E3E] mb-1.5">
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
                <label className="text-sm font-semibold text-[#1A2E3E]">Password</label>
                <a href="#" className="text-xs text-[#7AAFC7] hover:text-[#3B5F82] font-medium transition-colors">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AABBD] hover:text-[#7AAFC7] transition-colors"
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
              <input type="checkbox" id="remember" className="rounded border-[#C8D8E4] text-[#7AAFC7] focus:ring-[#7AAFC7]" />
              <label htmlFor="remember" className="text-sm text-[#4A6070] cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7AAFC7] hover:bg-[#3B5F82] py-3 text-base font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70 mt-2"
             
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#4A6070] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#7AAFC7] hover:text-[#3B5F82] font-semibold transition-colors">
              Sign up
            </Link>
          </p>

          <p className="text-center text-xs text-[#8AABBD] mt-2">
            Need an institution account?{' '}
            <span className="text-[#4A6070]">Contact the platform admin.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
