export default function Badge({ children, variant = 'default', size = 'sm' }) {
  const variants = {
    default:    'bg-gray-100 text-gray-600',
    primary:    'bg-blue-50 text-blue-700 border border-blue-200',
    success:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning:    'bg-amber-50 text-amber-700 border border-amber-200',
    danger:     'bg-red-50 text-red-700 border border-red-200',
    info:       'bg-cyan-50 text-cyan-700 border border-cyan-200',
    purple:     'bg-purple-50 text-purple-700 border border-purple-200',
    free:       'bg-emerald-50 text-emerald-700 border border-emerald-200',
  }
  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }
  return (
    <span className={`badge ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}
