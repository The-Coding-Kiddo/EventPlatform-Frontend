import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Github, Twitter, Linkedin, ArrowRight, CheckCircle } from 'lucide-react'

const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { label: 'Discover Events', to: '/' },
      { label: 'Browse All Events', to: '/events' },
      { label: 'Categories', to: '/events' },
      { label: 'Featured Events', to: '/events?featured=true' },
    ],
  },
  {
    title: 'For Organizers',
    links: [
      { label: 'Publish an Event', to: '/publish' },
      { label: 'Institution Admin', to: '/login' },
      { label: 'Moderation Policy', to: '#' },
      { label: 'Analytics', to: '/admin' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '#' },
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
      { label: 'Contact', to: '#' },
    ],
  },
]

const SOCIAL = [
  { Icon: Github,   href: '#', label: 'GitHub'   },
  { Icon: Twitter,  href: '#', label: 'Twitter'  },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">

      {/* ── Newsletter strip ── */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Stay in the loop</h3>
            <p className="text-sm text-gray-400">Get the best events delivered to your inbox every week.</p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle size={16} />
              You're subscribed — check your inbox!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="flex-1 sm:w-64 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shrink-0"
              >
                Subscribe <ArrowRight size={13} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Main footer columns ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Event<span className="text-blue-400">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              The moderated event platform connecting citizens, institutions, and communities worldwide. Every event reviewed before it goes live.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors text-gray-500 hover:text-white"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
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

      {/* ── Bottom bar ── */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2026 EventSphere. All rights reserved.</p>
          <p>Built with a moderation-first architecture for safer communities.</p>
        </div>
      </div>
    </footer>
  )
}
