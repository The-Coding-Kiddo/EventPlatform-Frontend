import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, CITIES } from '../../data/constants'

export default function EventFilters({ filters, onChange, onReset }) {
  const handle = (key, value) => onChange({ ...filters, [key]: value })

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'sort' && value !== ''
  )

  return (
    <div className="rounded-2xl border border-[#C8D8E4] bg-white px-4 py-3 shadow-sm" style={{ boxShadow: '0 2px 8px rgba(59,95,130,0.08)' }}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AABBD]" />
          <input
            type="text"
            placeholder="Search events, venues, organizers..."
            value={filters.search}
            onChange={e => handle('search', e.target.value)}
            className="h-11 w-full rounded-xl border border-[#C8D8E4] bg-[#EDF4F9] pl-10 pr-10 text-sm text-[#1A2E3E] outline-none transition focus:border-[#7AAFC7] focus:bg-white focus:ring-2 focus:ring-[#7AAFC7]/10 placeholder-[#8AABBD]"
           
          />
          {filters.search && (
            <button
              onClick={() => handle('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#8AABBD] transition hover:bg-[#EDF4F9] hover:text-[#4A6070]"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:items-center">
          {[
            { key: 'category', label: 'All categories', options: CATEGORIES.map(c => ({ value: c, label: c })) },
            { key: 'city',     label: 'All cities',     options: CITIES.map(c => ({ value: c, label: c })) },
            { key: 'price',    label: 'Any price',      options: [{ value: 'free', label: 'Free' }, { value: 'paid', label: 'Paid' }, { value: 'under50', label: 'Under $50' }, { value: 'under100', label: 'Under $100' }] },
            { key: 'date',     label: 'Any date',       options: [{ value: 'today', label: 'Today' }, { value: 'week', label: 'This week' }, { value: 'month', label: 'This month' }] },
          ].map(({ key, label, options }) => (
            <select
              key={key}
              value={filters[key]}
              onChange={e => handle(key, e.target.value)}
              className="h-11 rounded-xl border border-[#C8D8E4] bg-white px-3 text-sm text-[#1A2E3E] outline-none transition focus:border-[#7AAFC7] focus:ring-2 focus:ring-[#7AAFC7]/10"
             
            >
              <option value="">{label}</option>
              {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 border-t border-[#C8D8E4] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#4A6070]">
          <SlidersHorizontal size={15} className="text-[#7AAFC7]" />
          <span className="text-xs font-semibold uppercase tracking-wide text-[#8AABBD]">Sort</span>
          {['relevance', 'date', 'popularity', 'price'].map(s => (
            <button
              key={s}
              onClick={() => handle('sort', s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                filters.sort === s
                  ? 'bg-[#3B5F82] text-white shadow-sm'
                  : 'bg-transparent text-[#4A6070] border border-[#C8D8E4] hover:bg-[#EDF4F9]'
              }`}
             
            >
              {s}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#4A6070] transition hover:bg-[#EDF4F9] hover:text-[#1A2E3E]"
          >
            <X size={14} /> Reset
          </button>
        )}
      </div>
    </div>
  )
}
