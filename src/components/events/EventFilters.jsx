import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, CITIES } from '../../data/constants'

export default function EventFilters({ filters, onChange, onReset }) {
  const handle = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <div className="card p-5 space-y-5">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search events, venues, organizers..."
          value={filters.search}
          onChange={e => handle('search', e.target.value)}
          className="input pl-10 pr-10"
        />
        {filters.search && (
          <button onClick={() => handle('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Category */}
        <select
          value={filters.category}
          onChange={e => handle('category', e.target.value)}
          className="input text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* City */}
        <select
          value={filters.city}
          onChange={e => handle('city', e.target.value)}
          className="input text-sm"
        >
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Price */}
        <select
          value={filters.price}
          onChange={e => handle('price', e.target.value)}
          className="input text-sm"
        >
          <option value="">Any Price</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
          <option value="under50">Under $50</option>
          <option value="under100">Under $100</option>
        </select>

        {/* Date */}
        <select
          value={filters.date}
          onChange={e => handle('date', e.target.value)}
          className="input text-sm"
        >
          <option value="">Any Date</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <span className="text-xs text-gray-500">Sort by:</span>
          <div className="flex items-center gap-1">
            {['relevance', 'date', 'popularity', 'price'].map(s => (
              <button
                key={s}
                onClick={() => handle('sort', s)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filters.sort === s ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onReset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2">
          Reset all
        </button>
      </div>
    </div>
  )
}
