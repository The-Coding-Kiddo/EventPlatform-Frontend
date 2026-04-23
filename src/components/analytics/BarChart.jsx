export default function BarChart({ data, title, height = 200 }) {
  const max = Math.max(...data.map(d => d.count))

  return (
    <div className="card p-5">
      <h4 className="font-semibold text-gray-900 mb-5">{title}</h4>
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((item, i) => {
          const pct = (item.count / max) * 100
          const approvedPct = item.approved ? (item.approved / item.count) * pct : pct
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex flex-col justify-end" style={{ height: height - 32 }}>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                  {item.count} events
                </div>
                {/* Bar background */}
                <div className="relative w-full rounded-t-md overflow-hidden" style={{ height: `${pct}%` }}>
                  <div className="absolute inset-0 bg-brand-600/20 rounded-t-md" />
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-brand-500 rounded-t-md transition-all"
                    style={{ height: `${item.approved ? (approvedPct / pct) * 100 : 100}%` }}
                  />
                  {item.rejected && (
                    <div
                      className="absolute top-0 left-0 right-0 bg-red-500/60"
                      style={{ height: `${((item.count - item.approved) / item.count) * 100}%` }}
                    />
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">{item.month}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-brand-500" />
          <span className="text-xs text-gray-500">Approved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-500/60" />
          <span className="text-xs text-gray-500">Rejected</span>
        </div>
      </div>
    </div>
  )
}
