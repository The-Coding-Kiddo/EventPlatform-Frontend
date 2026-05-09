import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import EventForm from '../components/events/EventForm'

export default function PublishEventPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user || (user.role !== 'institution_admin' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-[#EDF4F9] pt-24 flex items-center justify-center px-4">
        <div className="rounded-3xl border border-[#C8D8E4] bg-white p-8 text-center shadow-xl" style={{ boxShadow: '0 2px 8px rgba(59,95,130,0.08)' }}>
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-[#1A2E3E] mb-2">Institution Admin access required</h2>
          <p className="text-[#4A6070] mb-6">Only institution administrators can publish events.</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-[#7AAFC7] hover:bg-[#3B5F82] px-5 py-2.5 text-sm font-bold text-white transition"
           
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EDF4F9] px-4 pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#4A6070] hover:text-[#3B5F82] text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1A2E3E] mb-1">Publish New Event</h1>
              <p className="text-[#4A6070] text-sm">
                Publishing as <span className="text-[#1A2E3E] font-medium">{user.institution || user.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EDF4F9] border border-[#C8D8E4] text-[#3B5F82] text-xs font-medium">
              <Shield size={12} /> Moderation Required
            </div>
          </div>
        </div>

        {/* Pipeline steps */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { label: 'Submit',       icon: '📝', active: true  },
            { label: 'Risk Analysis',icon: '🔍', active: false },
            { label: 'Review',       icon: '🛡️', active: false },
            { label: 'Publish',      icon: '🚀', active: false },
          ].map((step, i) => (
            <div key={i} className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all shadow-sm ${step.active ? 'bg-[#EDF4F9] border-[#7AAFC7]' : 'bg-white border-[#C8D8E4]'}`}>
              <div className="text-xl mb-1">{step.icon}</div>
              <p className={`text-xs font-medium ${step.active ? 'text-[#3B5F82]' : 'text-[#8AABBD]'}`}>{step.label}</p>
            </div>
          ))}
        </div>

        <EventForm onSubmit={() => {}} />
      </div>
    </div>
  )
}
