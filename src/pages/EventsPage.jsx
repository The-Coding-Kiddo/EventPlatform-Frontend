import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, Search, SlidersHorizontal } from 'lucide-react'
import EventCard from '../components/events/EventCard'
import EventFilters from '../components/events/EventFilters'
import { useEvents } from '../context/EventContext'

const DEFAULT_FILTERS = {
  search: '', category: '', city: '', price: '', date: '', sort: 'relevance',
}

export default function EventsPage() {
  const [searchParams] = useSearchParams()
  const { publicEvents } = useEvents()
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: searchParams.get('category') || '',
    search:   searchParams.get('q')        || '',
  })
  const [view, setView] = useState('grid')

  const filtered = useMemo(() => {
    let events = publicEvents

    if (filters.search) {
      const q = filters.search.toLowerCase()
      events = events.filter(e =>
        e.title.toLowerCase().includes(q)       ||
        e.description.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q)   ||
        e.location.toLowerCase().includes(q)    ||
        e.venue.toLowerCase().includes(q)
      )
    }
    if (filters.category)  events = events.filter(e => e.category === filters.category)
    if (filters.city)      events = events.filter(e => e.location.toLowerCase().includes(filters.city.toLowerCase()))
    if (filters.price === 'free')     events = events.filter(e => e.price === 0)
    if (filters.price === 'paid')     events = events.filter(e => e.price > 0)
    if (filters.price === 'under50')  events = events.filter(e => e.price < 50)
    if (filters.price === 'under100') events = events.filter(e => e.price < 100)

    if (filters.sort === 'date')       events = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
    if (filters.sort === 'popularity') events = [...events].sort((a, b) => b.attendees - a.attendees)
    if (filters.sort === 'price')      events = [...events].sort((a, b) => a.price - b.price)

    return events
  }, [filters])

  const hasActiveFilters = Object.entries(filters).some(
    ([k, v]) => k !== 'sort' && v !== ''
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Browse Events</h1>
          <p className="text-gray-500 text-sm">
            Discover safety-reviewed events happening worldwide
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Filters ── */}
        <div className="mb-5">
          <EventFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </div>

        {/* ── Results bar ── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filtered.length}</span>{' '}
            event{filtered.length !== 1 ? 's' : ''} found
            {filters.category && (
              <>
                {' '}in{' '}
                <span className="font-semibold text-blue-600">{filters.category}</span>
              </>
            )}
          </p>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                view === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                view === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}
              title="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        {filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
              <Search size={28} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              {hasActiveFilters
                ? 'Try adjusting your filters or search terms to discover more events.'
                : 'No events are available right now. Check back soon!'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="btn-primary"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(event => (
              <div
                key={event.id}
                className="card p-4 flex items-center gap-5 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-blue-600">{event.category}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{event.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 truncate text-sm">{event.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {event.venue}, {event.location}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {event.attendees.toLocaleString()} attending
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-bold text-base ${event.price === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {event.price === 0 ? 'FREE' : `$${event.price}`}
                  </p>
                  <a
                    href={`/events/${event.id}`}
                    className="text-xs text-blue-600 hover:underline mt-1 block"
                  >
                    View →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
