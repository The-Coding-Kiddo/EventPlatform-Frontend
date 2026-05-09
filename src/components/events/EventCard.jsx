import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Building2,
  CalendarDays,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function EventCard({ event }) {
  const { user, toggleSavedEvent } = useAuth()

  const isSaved = user?.savedEvents?.includes(event.id)
  const title = event.title || 'Untitled event'
  const category = event.category || 'Event'
  const institution = event.institution || 'Verified institution'
  const location = [event.venue, event.location].filter(Boolean).join(', ') || 'Location TBA'
  const priceLabel = Number(event.price || 0) === 0 ? 'Free' : `$${event.price}`

  const formattedDate = (() => {
    try {
      return new Date(event.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    } catch {
      return event.date || 'Date TBA'
    }
  })()

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#C8D8E4] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl" style={{ boxShadow: '0 2px 8px rgba(59,95,130,0.08)' }}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {/* Category badge */}
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold border border-[#7AAFC7] text-[#3B5F82]" style={{ background: 'rgba(122,175,199,0.15)' }}>
              {category}
            </span>
            {/* Approved badge */}
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-[#3B5F82]" style={{ background: 'rgba(122,175,199,0.15)' }}>
              <ShieldCheck size={12} /> Approved
            </span>
          </div>

          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#1A2E3E]">
            {title}
          </h3>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {/* Price tag */}
          <span className="rounded-full bg-[#EDF4F9] px-3 py-1 text-xs font-bold text-[#3B5F82] ring-1 ring-[#C8D8E4]">
            {priceLabel}
          </span>

          {user && (
            <button
              onClick={e => { e.preventDefault(); toggleSavedEvent(event.id) }}
              className={`rounded-xl border p-2 transition hover:scale-95 active:scale-95 ${
                isSaved
                  ? 'border-[#7AAFC7] bg-[#EDF4F9] text-[#3B5F82]'
                  : 'border-[#C8D8E4] text-[#8AABBD] hover:border-[#7AAFC7] hover:bg-[#EDF4F9] hover:text-[#3B5F82]'
              }`}
              aria-label={isSaved ? 'Remove saved event' : 'Save event'}
            >
              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          )}
        </div>
      </div>

      <p className="mb-5 line-clamp-2 min-h-[40px] text-sm leading-6 text-[#4A6070]">
        {event.description || 'No description has been provided for this event yet.'}
      </p>

      <div className="mb-5 space-y-2.5 text-sm text-[#4A6070]">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="shrink-0 text-[#7AAFC7]" />
          <span>{formattedDate} · {event.time || 'Time TBA'}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="shrink-0 text-[#7AAFC7]" />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={16} className="shrink-0 text-[#7AAFC7]" />
          <span className="truncate">{institution}</span>
        </div>
      </div>

      <Link
        to={`/events/${event.id}`}
        className="mt-auto inline-flex items-center justify-between rounded-xl bg-[#7AAFC7] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#3B5F82]"
       
      >
        View details
        <ArrowRight size={16} />
      </Link>
    </article>
  )
}
