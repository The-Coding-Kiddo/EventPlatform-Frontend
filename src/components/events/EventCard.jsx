import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Users, Bookmark, BookmarkCheck, Star, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Badge from '../ui/Badge'

export default function EventCard({ event, compact = false }) {
  const { user, toggleSavedEvent } = useAuth()
  const [imgError, setImgError] = useState(false)

  const isSaved  = user?.savedEvents?.includes(event.id)
  const fillPct  = Math.round((event.attendees / event.capacity) * 100)
  const isFull   = fillPct >= 100
  const isAdmin  = user?.role === 'super_admin' || user?.role === 'institution_admin'

  const GRADIENT_FALLBACKS = [
    'from-blue-100   to-indigo-200',
    'from-violet-100 to-purple-200',
    'from-cyan-100   to-sky-200',
    'from-emerald-100 to-teal-200',
    'from-amber-100  to-orange-200',
  ]
  const fallbackBg = GRADIENT_FALLBACKS[event.id % 5]

  // Format date nicely
  const formattedDate = (() => {
    try {
      return new Date(event.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    } catch { return event.date }
  })()

  return (
    <div className="card overflow-hidden group hover:shadow-xl hover:shadow-gray-200/80 hover:-translate-y-1 transition-all duration-300 flex flex-col">

      {/* ── Image ── */}
      <div className="relative overflow-hidden h-48 shrink-0">
        {!imgError ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${fallbackBg} flex items-center justify-center`}>
            <Calendar size={40} className="text-white/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Featured badge */}
        {event.featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wide shadow">
              <Star size={9} fill="currentColor" /> Featured
            </span>
          </div>
        )}

        {/* Admin-only status badge */}
        {isAdmin && (
          <div className="absolute top-3 left-3 mt-6">
            <Badge
              variant={{ approved: 'success', pending: 'warning', flagged: 'danger', rejected: 'danger' }[event.status] || 'default'}
              size="xs"
            >
              {event.status}
            </Badge>
          </div>
        )}

        {/* Bookmark */}
        {user && (
          <button
            onClick={e => { e.preventDefault(); toggleSavedEvent(event.id) }}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all"
          >
            {isSaved
              ? <BookmarkCheck size={15} className="text-blue-300" />
              : <Bookmark size={15} />
            }
          </button>
        )}

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow ${
            event.price === 0
              ? 'bg-emerald-500 text-white'
              : 'bg-black/70 backdrop-blur-sm text-white'
          }`}>
            {event.price === 0 ? 'FREE' : `$${event.price}`}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <Badge variant="primary" size="xs">{event.category}</Badge>
        </div>

        <h3 className="font-bold text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors text-[0.95rem]">
          {event.title}
        </h3>

        <div className="space-y-1.5 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={11} className="text-blue-400 shrink-0" />
            <span>{formattedDate} · {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={11} className="text-blue-400 shrink-0" />
            <span className="truncate">{event.venue}, {event.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={11} className="text-blue-400 shrink-0" />
            <span>{event.attendees.toLocaleString()} attending</span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isFull ? 'bg-red-500' : fillPct > 80 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(fillPct, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            {isFull ? 'Sold out' : `${100 - fillPct}% spots left`}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link
            to={`/events/${event.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            View Details <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
