export default function Avatar({ initials, size = 'md', color = 'brand' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' }
  const colors = {
    brand: 'bg-brand-600',
    purple: 'bg-purple-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    red: 'bg-red-600',
    cyan: 'bg-cyan-600',
  }
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full flex items-center justify-center font-bold text-white shrink-0`}>
      {initials}
    </div>
  )
}
