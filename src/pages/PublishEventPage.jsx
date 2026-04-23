import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import EventForm from '../components/events/EventForm'

export default function PublishEventPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user || (user.role !== 'institution_admin' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Institution Admin access required</h2>
          <p className="text-gray-500 mb-6">Only institution administrators can publish events.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Publish New Event</h1>
              <p className="text-gray-500 text-sm">
                Publishing as <span className="text-gray-700 font-medium">{user.institution || user.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              <Shield size={12} /> Moderation Required
            </div>
          </div>
        </div>

        {/* Pipeline info */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { label: 'Submit', icon: '📝', active: true },
            { label: 'Risk Analysis', icon: '🔍', active: false },
            { label: 'Review', icon: '🛡️', active: false },
            { label: 'Publish', icon: '🚀', active: false },
          ].map((step, i) => (
            <div key={i} className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${step.active ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-xl mb-1">{step.icon}</div>
              <p className={`text-xs font-medium ${step.active ? 'text-blue-600' : 'text-gray-400'}`}>{step.label}</p>
              {i < 3 && <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white/10 text-xs">→</div>}
            </div>
          ))}
        </div>

        {/* onSubmit is called after EventForm shows its own success screen.
            The success screen has its own "Go to Dashboard" link so no forced
            navigation here — just a no-op to satisfy the prop contract. */}
        <EventForm onSubmit={() => {}} />
      </div>
    </div>
  )
}
