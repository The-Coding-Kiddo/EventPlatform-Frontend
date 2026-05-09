export default function Avatar({ initials, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' }
  return (
    <div className={`${sizes[size]} bg-[#3B5F82] rounded-full flex items-center justify-center font-bold text-white shadow-sm shrink-0`}
     >
      {initials}
    </div>
  )
}
