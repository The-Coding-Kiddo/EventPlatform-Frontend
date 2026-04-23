import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, CheckCircle, XCircle, Clock, Shield,
  ChevronDown, ChevronUp, Eye, Flag, Search, Filter
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import Badge from '../components/ui/Badge'

export default function ModerationPage() {
  const { user } = useAuth()
  const { moderationQueue, resolveModeration, events } = useEvents()
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [actionModal, setActionModal] = useState(null)
  const [actionNote, setActionNote] = useState('')

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <Shield size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Super Admin access required</h2>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  const handleAction = (id, action) => {
    resolveModeration(id, action, actionNote)
    setActionModal(null)
    setActionNote('')
  }

  const filtered = moderationQueue.filter(item => {
    if (filter !== 'all' && item.status !== filter && !(filter === 'pending' && item.status === 'pending_review')) return false
    if (search && !item.eventTitle.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const riskColor = (score) =>
    score >= 70 ? 'text-red-400' : score >= 40 ? 'text-amber-400' : 'text-emerald-400'

  const riskBg = (score) =>
    score >= 70 ? 'bg-red-500' : score >= 40 ? 'bg-amber-500' : 'bg-emerald-500'

  const statusCounts = {
    all: moderationQueue.length,
    pending: moderationQueue.filter(i => i.status === 'pending_review').length,
    approved: moderationQueue.filter(i => i.status === 'approved').length,
    rejected: moderationQueue.filter(i => i.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Moderation Queue</h1>
            <p className="text-gray-500 text-sm">Review and moderate flagged event submissions</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
            <AlertTriangle size={14} />
            {statusCounts.pending} pending review
          </div>
        </div>

        {/* Filter bar */}
        <div className="card p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9 text-sm" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {Object.entries(statusCounts).map(([key, count]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === key ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {key} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Queue items */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="card p-12 text-center">
              <CheckCircle size={40} className="text-emerald-400/40 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Queue is clear</h3>
              <p className="text-gray-500 text-sm">No items match the current filter</p>
            </div>
          )}

          {filtered.map(item => {
            const isExpanded = expanded === item.id
            const isPending = item.status === 'pending_review'

            return (
              <div key={item.id} className={`card border-l-4 transition-all ${
                item.riskLevel === 'high' ? 'border-l-red-500' : item.riskLevel === 'medium' ? 'border-l-amber-500' : 'border-l-emerald-500'
              } ${isPending ? '' : 'opacity-60'}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant={isPending ? 'warning' : item.status === 'approved' ? 'success' : 'danger'} size="xs">
                          {isPending ? 'Pending' : item.status}
                        </Badge>
                        <Badge variant={item.riskLevel === 'high' ? 'danger' : item.riskLevel === 'medium' ? 'warning' : 'success'} size="xs">
                          {item.riskLevel} risk
                        </Badge>
                        <span className="text-xs text-gray-500">{item.category} · {item.location}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{item.eventTitle}</h3>
                      <p className="text-sm text-gray-500 mb-0.5">
                        Submitted by <span className="text-gray-700">{item.submittedBy}</span>
                        {item.date && (
                          <> · Event date: <span className="text-gray-700 font-medium">{item.date}</span></>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        Submitted {new Date(item.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>

                      {/* Risk score bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-48">
                          <div className={`h-full rounded-full ${riskBg(item.riskScore)}`} style={{ width: `${item.riskScore}%` }} />
                        </div>
                        <span className={`text-sm font-bold ${riskColor(item.riskScore)}`}>
                          Risk: {item.riskScore}/100
                        </span>
                      </div>

                      {/* Flag reason */}
                      <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-gray-50">
                        <Flag size={12} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600">{item.flagReason}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isPending && (
                        <>
                          <button
                            onClick={() => setActionModal({ id: item.id, action: 'approve', title: item.eventTitle })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all"
                          >
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button
                            onClick={() => setActionModal({ id: item.id, action: 'reject', title: item.eventTitle })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-xs font-semibold transition-all"
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : item.id)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (() => {
                    const src = events.find(e =>
                      (item.eventId && e.id === item.eventId) ||
                      e.title === item.eventTitle
                    ) || {}
                    const d = { ...src, ...item }
                    const eventPageId = item.eventId ?? src.id ?? ''
                    return (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                        {/* ── Full event detail ── */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Full Event Details</h4>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                            {d.description && (
                              <div className="col-span-2">
                                <p className="text-xs text-gray-400 mb-0.5">Description</p>
                                <p className="text-gray-700 leading-relaxed">{d.description}</p>
                              </div>
                            )}
                            {d.venue && (
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Venue</p>
                                <p className="text-gray-700">{d.venue}</p>
                              </div>
                            )}
                            {d.time && (
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Time</p>
                                <p className="text-gray-700">{d.time}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Price</p>
                              <p className="text-gray-700">{d.price === 0 ? 'Free' : `$${d.price}`}</p>
                            </div>
                            {d.capacity > 0 && (
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Capacity</p>
                                <p className="text-gray-700">{d.capacity.toLocaleString()}</p>
                              </div>
                            )}
                            {d.institution && (
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Institution</p>
                                <p className="text-gray-700">{d.institution}</p>
                              </div>
                            )}
                          </div>
                          {d.tags?.length > 0 && (
                            <div className="mt-2.5">
                              <p className="text-xs text-gray-400 mb-1.5">Tags</p>
                              <div className="flex flex-wrap gap-1.5">
                                {d.tags.map(tag => (
                                  <span key={tag} className="badge bg-blue-50 text-blue-600 border border-blue-200 text-xs">{tag}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ── Auto-detected flags ── */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Auto-detected Flags</h4>
                          <div className="flex flex-wrap gap-2">
                            {item.autoFlags.map(flag => (
                              <span key={flag} className="badge bg-red-50 text-red-600 border border-red-200 text-xs">
                                ⚠ {flag.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>

                        {eventPageId && (
                          <Link to={`/events/${eventPageId}`} className="btn-secondary text-xs py-1.5 inline-flex">
                            <Eye size={12} /> View Full Event Page
                          </Link>
                        )}

                        {item.note && (
                          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <p className="text-xs text-gray-600"><span className="text-blue-600 font-semibold">Reviewer note:</span> {item.note}</p>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
            )
          })}
        </div>

        {/* Action modal */}
        {actionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setActionModal(null)} />
            <div className="relative w-full max-w-md card p-6 animate-slide-up">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${actionModal.action === 'approve' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                {actionModal.action === 'approve' ? <CheckCircle size={22} className="text-emerald-400" /> : <XCircle size={22} className="text-red-400" />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                {actionModal.action === 'approve' ? 'Approve Event' : 'Reject Event'}
              </h3>
              <p className="text-gray-500 text-sm text-center mb-5">
                "{actionModal.title}"
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reviewer Note (optional)</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Add a note for the record..."
                  value={actionNote}
                  onChange={e => setActionNote(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setActionModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button
                  onClick={() => handleAction(actionModal.id, actionModal.action)}
                  className={`flex-1 justify-center font-semibold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 ${
                    actionModal.action === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  {actionModal.action === 'approve' ? <><CheckCircle size={14} /> Approve</> : <><XCircle size={14} /> Reject</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
