export default function DonutChart({ data, title }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  let cumulative = 0
  const size = 160
  const radius = 60
  const cx = size / 2
  const cy = size / 2
  const strokeWidth = 22

  const slices = data.map((item) => {
    const pct = item.count / total
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2
    const endAngle = startAngle + pct * 2 * Math.PI
    cumulative += pct

    const x1 = cx + radius * Math.cos(startAngle)
    const y1 = cy + radius * Math.sin(startAngle)
    const x2 = cx + radius * Math.cos(endAngle)
    const y2 = cy + radius * Math.sin(endAngle)
    const largeArc = pct > 0.5 ? 1 : 0

    return {
      ...item,
      path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
    }
  })

  return (
    <div className="card p-5">
      <h4 className="font-semibold text-gray-900 mb-5">{title}</h4>
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {slices.map((s, i) => (
              <path
                key={i}
                d={s.path}
                fill="none"
                stroke={s.color}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" className="fill-gray-900 font-bold" fontSize="20">{total.toLocaleString()}</text>
            <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-500" fontSize="10">events</text>
          </svg>
        </div>
        <div className="flex-1 space-y-2.5 min-w-0">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-xs text-gray-600 truncate">{item.category}</span>
              </div>
              <span className="text-xs font-semibold text-gray-900 shrink-0">{Math.round((item.count / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
