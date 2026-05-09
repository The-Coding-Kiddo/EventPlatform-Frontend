import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, Search } from 'lucide-react'
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
        (e.title || '').toLowerCase().includes(q)       ||
        (e.description || '').toLowerCase().includes(q) ||
        (e.institution || '').toLowerCase().includes(q) ||
        (e.location || '').toLowerCase().includes(q)    ||
        (e.venue || '').toLowerCase().includes(q)
      )
    }
    if (filters.category)  events = events.filter(e => e.category === filters.category)
    if (filters.city)      events = events.filter(e => (e.location || '').toLowerCase().includes(filters.city.toLowerCase()))
    if (filters.price === 'free')     events = events.filter(e => Number(e.price || 0) === 0)
    if (filters.price === 'paid')     events = events.filter(e => Number(e.price || 0) > 0)
    if (filters.price === 'under50')  events = events.filter(e => Number(e.price || 0) < 50)
    if (filters.price === 'under100') events = events.filter(e => Number(e.price || 0) < 100)

    if (filters.sort === 'date')       events = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
    if (filters.sort === 'popularity') events = [...events].sort((a, b) => Number(b.attendees || 0) - Number(a.attendees || 0))
    if (filters.sort === 'price')      events = [...events].sort((a, b) => Number(a.price || 0) - Number(b.price || 0))

    return events
  }, [filters, publicEvents])

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => k !== 'sort' && v !== '')

  return (
    <div className="min-h-screen bg-[#EDF4F9] pt-24 pb-12">
      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Filters */}
        <div className="mb-4">
          <EventFilters filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
        </div>

        {/* Results toolbar */}
        <div className="mb-4 flex items-center justify-between px-1">
          <p className="text-sm text-[#4A6070]">
            Showing <span className="font-extrabold text-[#1A2E3E]">{filtered.length}</span>{' '}
            event{filtered.length !== 1 ? 's' : ''}
            {filters.category && (
              <> in <span className="font-bold text-[#3B5F82]">{filters.category}</span></>
            )}
          </p>
          <div className="flex items-center gap-1 rounded-xl border border-[#C8D8E4] bg-white p-1 shadow-sm">
            <button
              onClick={() => setView('grid')}
              className={`rounded-lg p-1.5 transition-colors ${
                view === 'grid' ? 'bg-[#3B5F82] text-white shadow-sm' : 'text-[#4A6070] hover:text-[#1A2E3E]'
              }`}
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`rounded-lg p-1.5 transition-colors ${
                view === 'list' ? 'bg-[#3B5F82] text-white shadow-sm' : 'text-[#4A6070] hover:text-[#1A2E3E]'
              }`}
              title="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#C8D8E4] bg-white px-6 py-24 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF4F9] text-[#7AAFC7]">
              <Search size={28} />
            </div>
            <h3 className="mb-2 text-xl font-extrabold text-[#1A2E3E]">No events found</h3>
            <p className="mb-6 max-w-sm text-sm leading-6 text-[#4A6070]">
              {hasActiveFilters
                ? 'Try adjusting your filters or search terms to discover more reviewed events.'
                : 'No approved events are available right now. Check back soon for new listings.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="rounded-xl bg-[#7AAFC7] hover:bg-[#3B5F82] px-5 py-3 text-sm font-bold text-white transition"
               
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </main>
    </div>
  )
}
