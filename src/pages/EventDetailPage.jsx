import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar, MapPin, Clock, Users, Tag, Building2, Globe,
  Bookmark, BookmarkCheck, Share2, ArrowLeft, AlertTriangle,
  CheckCircle, Star, ArrowRight, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import Badge from '../components/ui/Badge'
import EventCard from '../components/events/EventCard'

export default function EventDetailPage() {
  const { id } = useParams()
  const { user, toggleSavedEvent, toggleSubscription, registerEvent, unregisterEvent } = useAuth()
  const { events } = useEvents()
  const navigate = useNavigate()
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [copied, setCopied] = useState(false)

  // All events (all statuses) come from EventContext — populated from service layer on mount.
  const event = events.find(e => e.id === Number(id))
  // Derived from persistent user state — survives page refresh
  const isRegistered = user?.registeredEvents?.includes(event?.id)
  const related = events
    .filter(e => e.category === event?.category && e.id !== event?.id && e.status === 'approved')
    .slice(0, 3)
  const isSaved = user?.savedEvents?.includes(event?.id)
  const fillPct = event ? Math.round((event.attendees / event.capacity) * 100) : 0


  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ── Not found ── */
  if (!event) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Calendar size={36} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-500 mb-6">
            This event may have been removed or the link is incorrect.
          </p>
          <Link to="/events" className="btn-primary">
            Browse All Events
          </Link>
        </div>
      </div>
    )
  }

  const statusConfig = {
    approved: { variant: 'success', icon: CheckCircle, label: 'Approved & Live'      },
    pending:  { variant: 'warning', icon: AlertTriangle, label: 'Pending Review'     },
    flagged:  { variant: 'danger',  icon: AlertTriangle, label: 'Flagged for Review' },
    rejected: { variant: 'danger',  icon: AlertTriangle, label: 'Rejected'           },
  }[event.status] || {}

  const StatusIcon = statusConfig.icon
  // Role helpers — single source of truth for all role-based rendering below.
  const isCitizen = !user || user.role === 'citizen'
  const isAdmin   = user?.role === 'super_admin' || user?.role === 'institution_admin'

  const formattedDate = (() => {
    try {
      return new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      })
    } catch { return event.date }
  })()

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">

      {/* ── Hero image ── */}
      <div className="relative h-72 sm:h-[400px] overflow-hidden bg-gray-200">
        {!imgError ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
            <Calendar size={80} className="text-blue-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute top-5 left-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/40 backdrop-blur-sm text-white text-sm font-medium hover:bg-black/60 transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main ── */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6 sm:p-8">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {event.status !== 'approved' && (
                  <Badge variant={statusConfig.variant}>
                    {StatusIcon && <StatusIcon size={11} />} {statusConfig.label}
                  </Badge>
                )}
                {event.featured && (
                  <Badge variant="warning">
                    <Star size={10} fill="currentColor" /> Featured
                  </Badge>
                )}
                <Badge variant="primary">{event.category}</Badge>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  event.price === 0
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {event.price === 0 ? 'Free Entry' : `$${event.price} / ticket`}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-5 leading-tight">
                {event.title}
              </h1>

              {/* Meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                {[
                  { Icon: Calendar,  label: 'Date',      value: formattedDate  },
                  { Icon: Clock,     label: 'Time',      value: event.time     },
                  { Icon: MapPin,    label: 'Location',  value: `${event.venue}, ${event.location}` },
                  { Icon: Building2, label: 'Institution', value: event.institution },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-7">
                <h3 className="font-bold text-gray-900 mb-3 text-base">About This Event</h3>
                <p className="text-gray-600 leading-relaxed text-[0.95rem]">{event.description}</p>
              </div>

              {/* Tags */}
              {event.tags?.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
                    <Tag size={14} className="text-blue-600" /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-sm hover:bg-gray-100 hover:border-blue-200 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Flag notice */}
              {event.status === 'flagged' && event.flagReason && (
                <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                  <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-700 mb-0.5">Content Under Review</p>
                    <p className="text-sm text-red-600/80">{event.flagReason}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Related events */}
            {related.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Similar Events</h2>
                  <Link
                    to={`/events?category=${event.category}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    See all <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map(e => <EventCard key={e.id} event={e} compact />)}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Registration */}
            <div className="card p-5 sm:p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Price</p>
                  <span className={`text-3xl font-black ${event.price === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </span>
                  {event.price > 0 && <span className="text-gray-400 text-sm ml-1">/ ticket</span>}
                </div>
                <div className="flex items-center gap-2">
                  {/* Save is citizen-only — admins preview events, not attend them */}
                  {isCitizen && (
                    <button
                      onClick={() => user && toggleSavedEvent(event.id)}
                      title={isSaved ? 'Remove from saved' : 'Save event'}
                      className={`p-2 rounded-xl border transition-all ${
                        isSaved
                          ? 'bg-blue-50 border-blue-200 text-blue-600'
                          : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  )}
                  <button
                    onClick={handleShare}
                    title="Copy link"
                    className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-700 transition-all"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              {copied && (
                <p className="text-xs text-emerald-600 font-medium mb-3 flex items-center gap-1">
                  <CheckCircle size={12} /> Link copied to clipboard
                </p>
              )}

              {/* Capacity */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <Users size={13} /> Availability
                  </span>
                  <span className="text-gray-900 font-semibold text-xs">
                    {event.attendees.toLocaleString()} / {event.capacity.toLocaleString()} registered
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      fillPct >= 100 ? 'bg-red-500' : fillPct > 80 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(fillPct, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {fillPct >= 100 ? 'Fully booked' : `${100 - fillPct}% spots remaining`}
                </p>
              </div>

              {/* CTA — citizen only */}
              {isCitizen ? (
                <>
                  {event.status === 'approved' ? (
                    isRegistered ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm">
                          <CheckCircle size={15} /> You're Registered!
                        </div>

                        {typeof unregisterEvent === 'function' ? (
                          <button
                            onClick={() => {
                              const confirmCancel = window.confirm('Are you sure you want to cancel your registration?')
                              if (confirmCancel) {
                                unregisterEvent(event.id)
                              }
                            }}
                            className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-all"
                          >
                            Cancel Registration
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      <button
                        onClick={() => { if (!user) navigate('/login'); else setShowRegisterModal(true) }}
                        disabled={fillPct >= 100}
                        className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {fillPct >= 100
                          ? 'Sold Out'
                          : user
                            ? 'Register Now'
                            : 'Sign In to Register'}
                      </button>
                    )
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
                      <AlertTriangle size={13} /> Registration opens after approval
                    </div>
                  )}

                  {user && (
                    <button
                      onClick={() => toggleSubscription(event.category)}
                      className={`w-full mt-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        user.subscriptions?.includes(event.category)
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {user.subscriptions?.includes(event.category)
                        ? `✓ Subscribed to ${event.category}`
                        : `Subscribe to ${event.category} events`}
                    </button>
                  )}
                </>
              ) : (
                /* Admin / institution admin — preview only, no attendee actions */
                <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 text-xs">
                  <Users size={13} className="shrink-0" />
                  Attendee actions are available for citizen accounts only.
                </div>
              )}
            </div>

            {/* Admin: Risk score */}
            {isAdmin && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Moderation Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Risk Score</span>
                    <span className={`text-sm font-bold ${
                      event.riskScore > 70 ? 'text-red-500' :
                      event.riskScore > 40 ? 'text-amber-500' :
                      'text-emerald-500'
                    }`}>
                      {event.riskScore} / 100
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        event.riskScore > 70 ? 'bg-red-500' :
                        event.riskScore > 40 ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${event.riskScore}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status</span>
                    <Badge
                      variant={event.status === 'approved' ? 'success' : event.status === 'pending' ? 'warning' : 'danger'}
                      size="xs"
                    >
                      {event.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Map placeholder */}
            <div className="card overflow-hidden">
              <div className="h-44 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative">
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="relative text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-600/20">
                    <MapPin size={22} className="text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{event.venue}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{event.location}</p>
                </div>
              </div>
              <div className="p-3 border-t border-gray-100">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${event.venue} ${event.location}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <Globe size={13} /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Registration confirmation modal ── */}
      {showRegisterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowRegisterModal(false) }}
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Confirm Registration</h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">Review the details and confirm your spot.</p>

            {/* Event summary */}
            <div className="space-y-2 mb-6">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-0.5">Event</p>
                <p className="font-semibold text-gray-900 text-sm leading-snug">{event.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-0.5">Date</p>
                  <p className="font-medium text-gray-900 text-sm">{formattedDate}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-0.5">Price</p>
                  <p className={`font-bold text-sm ${event.price === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-2">
                <MapPin size={13} className="text-blue-600 shrink-0" />
                <p className="font-medium text-gray-900 text-sm truncate">{event.venue}, {event.location}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRegisterModal(false)}
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={() => { registerEvent(event.id); setShowRegisterModal(false) }}
                className="btn-primary flex-1 justify-center"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
