import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { label: 'Events', to: '/events' },
      { label: 'Publish Event', to: '/publish' },
      { label: 'Institution Admin', to: '/login' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '#' },
      { label: 'Contact', to: '#' },
      { label: 'Privacy', to: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#C8D8E4] bg-[#3B5F82] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <svg width="28" height="28" viewBox="0 0 28 28">
                <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill="#2d4760" stroke="#7AAFC7" strokeWidth="1.5"/>
                <text x="14" y="18.5" textAnchor="middle" fontFamily="Helvetica,Arial,sans-serif" fontWeight="700" fontSize="12" fill="#fff">E</text>
              </svg>
              <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '17px', fontWeight: 700, color: '#fff' }}>Eventim</span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
              A trusted event platform for discovering verified events from institutions and organizers.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#7AAFC7]/30 bg-[#7AAFC7]/10 px-3 py-1 text-xs font-semibold text-[#7AAFC7]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7AAFC7]" />
              Moderation-first event discovery
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:justify-self-end sm:gap-16">
            {FOOTER_LINKS.map(col => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map(({ label, to }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="text-sm text-white/50 transition hover:text-[#7AAFC7]"
                       
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 Eventim. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="#" className="transition hover:text-white/70">Terms</Link>
            <Link to="#" className="transition hover:text-white/70">Privacy</Link>
            <span>Built for verified events</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
