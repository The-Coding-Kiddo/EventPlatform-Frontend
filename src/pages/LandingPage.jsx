import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, Shield, Globe, Bell,
  TrendingUp, Users, ChevronRight, Cpu, Music,
  Palette, Trophy, Briefcase, UtensilsCrossed, Heart,
  BookOpen, Handshake, Clapperboard, CheckCircle, Star,
  Zap, MapPin, Calendar
} from 'lucide-react'
import { useEvents } from '../context/EventContext'
import EventCard from '../components/events/EventCard'

const CATEGORIES = [
  { label: 'Technology',      Icon: Cpu,             color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { label: 'Music',           Icon: Music,           color: 'text-violet-600 bg-violet-50 border-violet-100' },
  { label: 'Arts & Culture',  Icon: Palette,         color: 'text-pink-600   bg-pink-50   border-pink-100'   },
  { label: 'Sports',          Icon: Trophy,          color: 'text-cyan-600   bg-cyan-50   border-cyan-100'   },
  { label: 'Business',        Icon: Briefcase,       color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { label: 'Food & Drink',    Icon: UtensilsCrossed, color: 'text-amber-600  bg-amber-50  border-amber-100'  },
  { label: 'Health & Wellness', Icon: Heart,         color: 'text-rose-600   bg-rose-50   border-rose-100'   },
  { label: 'Education',       Icon: BookOpen,        color: 'text-blue-600   bg-blue-50   border-blue-100'   },
  { label: 'Community',       Icon: Handshake,       color: 'text-teal-600   bg-teal-50   border-teal-100'   },
  { label: 'Entertainment',   Icon: Clapperboard,    color: 'text-orange-600 bg-orange-50 border-orange-100' },
]

const STATS = [
  { value: '1,284+', label: 'Active Events',       icon: Calendar },
  { value: '48K+',   label: 'Registered Attendees', icon: Users   },
  { value: '187',    label: 'Partner Institutions', icon: Globe   },
  { value: '10',     label: 'Global Cities',        icon: MapPin  },
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Moderation-First Safety',
    desc: 'Every event passes automated risk scoring and human review before going live — keeping the community safe.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    desc: 'Connect with events across 10 major cities worldwide. From tech conferences to cultural festivals.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    desc: 'Subscribe to categories you love and get notified the moment a matching event is published.',
    color: 'text-violet-600 bg-violet-50',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { publicEvents } = useEvents()
  const featured = publicEvents.filter(e => e.featured).slice(0, 3)
  const upcoming = publicEvents.slice(0, 6)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/events?q=${encodeURIComponent(search)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-10 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, venues, cities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-36 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 transition-colors"
              >
                Search <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── Featured Events ─────────────────────────────────────────── */}
      <section className="pt-16 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={15} className="text-amber-500" fill="currentColor" />
                <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Featured</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Handpicked Events</h2>
            </div>
            <Link
              to="/events?featured=true"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      </section>

      {/* ── Browse by Category ──────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">Categories</p>
            <h2 className="text-3xl font-bold text-gray-900">Browse by Interest</h2>
            <p className="text-gray-500 mt-2">Find events that match your passions</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.map(({ label, Icon, color }) => (
              <Link
                key={label}
                to={`/events?category=${label}`}
                className={`group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${color}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={22} />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 text-center leading-snug">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ─────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={15} className="text-blue-500" />
                <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Upcoming</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Don't Miss Out</h2>
            </div>
            <Link
              to="/events"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
            >
              See all events <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Ready to publish your event?
          </h2>

          <p className="mt-3 text-gray-500 text-sm sm:text-base">
            Reach thousands of users by sharing your event on EventSphere.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              Get Started <ArrowRight size={14} />
            </Link>

            <Link
              to="/events"
              className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Browse Events
            </Link>

          </div>

        </div>
      </section>
    </div>
  )
}
