import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

// onClick is optional — when provided the card renders as a <button> with hover affordances.
export default function StatsCard({ label, value, sub, trend, icon: Icon, color = 'brand', onClick }) {
  const colors = {
    brand:   { bg: 'bg-blue-50',    icon: 'text-blue-600',    border: 'border-blue-200'    },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-200' },
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   border: 'border-amber-200'   },
    red:     { bg: 'bg-red-50',     icon: 'text-red-600',     border: 'border-red-200'     },
    cyan:    { bg: 'bg-cyan-50',    icon: 'text-cyan-600',    border: 'border-cyan-200'    },
    purple:  { bg: 'bg-purple-50',  icon: 'text-purple-600',  border: 'border-purple-200'  },
  }
  const c = colors[color]
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const trendColor = trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-600' : 'text-gray-400'

  const cls = [
    'card p-5 border', c.border,
    'transition-all duration-200 hover:scale-[1.02]',
    onClick ? 'cursor-pointer hover:shadow-md hover:border-opacity-60 group' : '',
  ].join(' ')

  const inner = (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center ${onClick ? 'group-hover:scale-110 transition-transform duration-200' : ''}`}>
          {Icon && <Icon size={18} className={c.icon} />}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={12} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 tabular-nums">{value}</p>
      <p className="text-sm font-medium text-gray-600 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </>
  )

  return onClick ? (
    <button onClick={onClick} className={`${cls} w-full text-left`}>{inner}</button>
  ) : (
    <div className={cls}>{inner}</div>
  )
}
