import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, MapPin, Crown, Building2, CalendarPlus, BarChart2, BadgeCheck, BellRing, Check } from 'lucide-react'
import { useEvents } from '../context/EventContext'
const LANDMARK_CARDS = [
  { emoji: '🖥️', bg: '#1a2535', tag: 'Technology', name: 'Global AI & Machine Learning Conference', location: 'San Francisco', meta: '11,400 attended · Oct 2025' },
  { emoji: '🎶', bg: '#1f2e1f', tag: 'Music & Culture', name: 'Mediterranean Music & Arts Festival', location: 'Barcelona', meta: '18,200 attended · Aug 2025' },
  { emoji: '🎓', bg: '#1f1a35', tag: 'Education', name: 'Oxford Future Leaders Forum', location: 'Oxford', meta: '4,600 attended · Sep 2025' },
]

const HERO_IMAGE = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&q=70'

const TESTIMONIALS = [
  { quote: '"Found and booked my last three conferences through Eventim. Everything is verified — I never have to second-guess if an event is legitimate."', initials: 'JM', name: 'James Moreau', role: 'Product Designer, Berlin', avatarBg: '#7AAFC7' },
  { quote: '"The organizer dashboard gives us everything we need. Registration tracking, event management, and the verification badge made our events feel truly credible."', initials: 'SK', name: 'Sara Khalid', role: 'Events Director, TED MENA', avatarBg: '#3B5F82' },
  { quote: '"As an admin, the review tools are clean and efficient. We can approve, flag, or request changes in seconds — the quality of published events speaks for itself."', initials: 'RL', name: 'Rafael Lima', role: 'Platform Admin, Eventim', avatarBg: '#4A6070' },
]

const EVENT_IMAGES = {
  Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=90',
  Music: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=90',
  Business: 'https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=1200&q=90',
  'Food & Drink': 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=90',
}

function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return date || 'Date TBA'
  }
}

function HomeEventCard({ event }) {
  const title = event.title || 'Untitled Event'
  const category = event.category || 'Event'
  const image = event.image || EVENT_IMAGES[category] || EVENT_IMAGES.Technology
  const price = Number(event.price || 0) === 0 ? 'Free' : `$${event.price}`
  const location = [event.venue, event.location].filter(Boolean).join(', ') || 'Location TBA'

  return (
    <article className="overflow-hidden rounded-2xl border border-[#C8D8E4] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ boxShadow: '0 2px 8px rgba(59,95,130,0.08)' }}>
      <div className="relative h-40 overflow-hidden bg-[#3B5F82]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E3E]/55 via-[#1A2E3E]/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-lg bg-[#7AAFC7] px-3 py-1.5 text-xs font-bold text-white">
          {category}
        </span>
        <span className="absolute right-4 top-4 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#3B5F82]">
          {price}
        </span>
      </div>

      <div className="p-5 pb-6">
        <h3 className="line-clamp-1 text-lg font-bold text-[#1A2E3E]">
          {title}
        </h3>

        <div className="mt-4 space-y-2.5 text-sm text-[#4A6070]">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#7AAFC7]" />
            <span>{formatDate(event.date)} · {event.time || 'Time TBA'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#7AAFC7]" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <Link
          to={`/events/${event.id}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#7AAFC7] transition hover:text-[#3B5F82]"
         
        >
          View Details <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  )
}

export default function LandingPage() {
  const { publicEvents } = useEvents()
  const upcoming = publicEvents.slice(0, 4)

  return (
    <div className="min-h-screen bg-[#EDF4F9]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#3B5F82]" style={{ minHeight: '580px' }}>
        <img
          src={HERO_IMAGE}
          alt="Crowd at a live event"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ filter: 'brightness(0.85) contrast(1.15) saturate(1.1)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(30,52,72,0.95) 0%, rgba(59,95,130,0.80) 40%, rgba(59,95,130,0.15) 75%, rgba(0,0,0,0.05) 100%), linear-gradient(to bottom, transparent 60%, rgba(237,244,249,0.4) 100%)' }} />

        <div className="relative mx-auto flex max-w-none items-center px-12 pt-16 sm:px-12 lg:px-12" style={{ minHeight: '580px' }}>
          <div className="max-w-[600px]">
            <h1 className="max-w-[600px] text-4xl font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-xl sm:text-5xl lg:text-[52px]">
              Discover events that actually matter
            </h1>
            <p className="mt-4 max-w-[460px] text-[17px] leading-7" style={{ color: '#BDD6E6' }}>
              Find, book, and experience the best happening around you.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-xl bg-[#7AAFC7] px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#3B5F82]"
               
              >
                Browse Events <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-[#EDF4F9] px-9 py-10 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-none">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-[#1A2E3E] sm:text-[28px]">
              Upcoming Events
            </h2>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#7AAFC7] transition hover:text-[#3B5F82]"
             
            >
              View all events <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map(event => (
              <HomeEventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-[#C8D8E4]" />

      {/* Landmark Events */}
      <section className="bg-white px-9 py-12 sm:px-10 lg:px-12">
        <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-widest text-[#7AAFC7]">Platform Highlights</p>
        <h2 className="mb-7 text-[22px] font-extrabold tracking-tight text-[#3B5F82]">Landmark Events</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
          {/* Main featured card */}
          <div className="relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-2xl bg-[#1a2535]">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=60"
              alt="World Innovation Summit"
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,37,53,0.98) 40%, rgba(26,37,53,0.2) 100%)' }} />
            <div className="relative z-10 p-6">
              <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#7AAFC7] px-3 py-1 text-[10px] font-bold text-white">
                <Crown size={11} /> Most Attended · 2025
              </span>
              <h3 className="mb-2.5 text-xl font-extrabold leading-snug tracking-tight text-white">
                World Innovation Summit 2025
              </h3>
              <div className="mb-4 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[11.5px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <MapPin size={13} className="text-[#7AAFC7]" /> Dubai World Trade Centre
                </div>
                <div className="flex items-center gap-1.5 text-[11.5px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <Building2 size={13} className="text-[#7AAFC7]" /> World Economic Forum
                </div>
              </div>
            </div>
          </div>

          {/* Stack of 3 smaller cards */}
          <div className="flex flex-col gap-3">
            {LANDMARK_CARDS.map((card) => (
              <div key={card.name} className="flex overflow-hidden rounded-xl border border-[#C8D8E4] bg-[#EDF4F9]">
                <div className="flex w-20 flex-shrink-0 items-center justify-center text-3xl" style={{ background: card.bg }}>
                  {card.emoji}
                </div>
                <div className="flex-1 px-3.5 py-3">
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-[#7AAFC7]">{card.tag}</p>
                  <p className="mb-1.5 text-[13px] font-bold leading-snug text-[#3B5F82]">{card.name}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8AABBD]">
                    <MapPin size={12} className="text-[#7AAFC7]" /> {card.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-[#C8D8E4]" />

      {/* Testimonials */}
      <section className="bg-[#EDF4F9] px-9 py-12 sm:px-10 lg:px-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[22px] font-extrabold tracking-tight text-[#3B5F82]">What people are saying</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex flex-col gap-3.5 rounded-xl border border-[#C8D8E4] bg-white p-5">
              <div className="text-[13px] tracking-wide text-[#7AAFC7]">★★★★★</div>
              <p className="flex-1 text-[13px] italic leading-relaxed text-[#1A2E3E]">{t.quote}</p>
              <div className="flex items-center gap-2.5 border-t border-[#EDF4F9] pt-3.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: t.avatarBg }}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-[12.5px] font-bold text-[#3B5F82]">{t.name}</p>
                  <p className="mt-0.5 text-[11px] text-[#8AABBD]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* For Organizers */}
      <section className="bg-[#3B5F82] px-9 py-14 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: copy */}
          <div>
            <p className="mb-2 text-[10.5px] font-bold uppercase tracking-widest text-[#7AAFC7]">For Organizations</p>
            <h2 className="mb-2.5 text-[22px] font-extrabold leading-snug tracking-tight text-white">
              The platform built for serious event organizers
            </h2>
            <p className="mb-7 text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>
              Everything you need to publish, manage, and grow your events — in one place.
            </p>
            <div className="mb-7 flex flex-col gap-3.5">
              {[
                { icon: <CalendarPlus size={17} />, title: 'Full event publishing control', desc: 'Create events with complete details, media, ticketing, and capacity settings.' },
                { icon: <BarChart2 size={17} />, title: 'Real-time analytics dashboard', desc: 'Track registrations and attendance across all your events as they happen.' },
                { icon: <BadgeCheck size={17} />, title: 'Verified institution badge', desc: 'Stand out with a platform-issued verification badge on every event you publish.' },
                { icon: <BellRing size={17} />, title: 'Instant approval notifications', desc: 'Get notified the moment your event is reviewed — approved or flagged for changes.' },
              ].map((feat) => (
                <div key={feat.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[#7AAFC7]" style={{ background: 'rgba(122,175,199,0.12)', border: '1px solid rgba(122,175,199,0.22)' }}>
                    {feat.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-white">{feat.title}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-[#7AAFC7] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white hover:text-[#3B5F82]"
            >
              Get Started <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right: mock dashboard */}
          <div className="overflow-hidden rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(122,175,199,0.18)' }}>
            <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ background: 'rgba(0,0,0,0.15)', borderColor: 'rgba(122,175,199,0.12)' }}>
              <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>Organizer Dashboard</span>
              <span className="rounded-full bg-[#7AAFC7]/20 px-2 py-0.5 text-[10px] font-semibold text-[#7AAFC7]">Live</span>
            </div>
            <div className="flex flex-col gap-3 p-4">
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { n: '12', label: 'Active Events', delta: '↑ 4 this month' },
                  { n: '3,840', label: 'Registrations', delta: '↑ 22% vs last' },
                  { n: '94%', label: 'Attendance rate', delta: '↑ 6pts' },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <p className="text-lg font-extrabold text-white">{kpi.n}</p>
                    <p className="mt-0.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{kpi.label}</p>
                    <p className="mt-0.5 text-[10px] text-[#7AAFC7]">{kpi.delta}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Global Tech Summit 2026', count: '3,200 reg.', status: 'Live', statusStyle: { background: 'rgba(94,207,138,0.15)', color: '#5ecf8a' } },
                  { name: 'AI Enterprise Workshop', count: '420 reg.', status: 'Live', statusStyle: { background: 'rgba(94,207,138,0.15)', color: '#5ecf8a' } },
                  { name: 'Design Leadership Forum', count: '—', status: 'In Review', statusStyle: { background: 'rgba(240,192,64,0.15)', color: '#f0c040' } },
                  { name: 'Startup Pitch Night', count: '—', status: 'Draft', statusStyle: { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' } },
                ].map((ev) => (
                  <div key={ev.name} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(122,175,199,0.1)' }}>
                    <span className="text-[11.5px] font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{ev.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{ev.count}</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={ev.statusStyle}>{ev.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Split */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* Attendees */}
        <div className="flex flex-col gap-5 bg-[#7AAFC7] px-8 py-11">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>For Attendees</p>
          <h2 className="text-[19px] font-extrabold leading-snug tracking-tight text-white">
            Your next great experience is already on the platform
          </h2>
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>
            Browse verified events across every category — curated by institutions and approved by our team.
          </p>
          <div className="flex flex-col gap-1.5">
            {['Every event admin-verified', 'Instant booking confirmation', 'All events in one dashboard'].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-[12px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                <Check size={14} /> {item}
              </div>
            ))}
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 self-start rounded-full bg-white px-6 py-2.5 text-[13px] font-bold text-[#3B5F82] transition hover:bg-[#EDF4F9]"
          >
            Explore Events <ArrowRight size={15} />
          </Link>
        </div>

        {/* Organizations */}
        <div className="flex flex-col gap-5 px-8 py-11" style={{ background: '#2d4d6b' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>For Organizations</p>
          <h2 className="text-[19px] font-extrabold leading-snug tracking-tight text-white">
            Put your events in front of the right audience
          </h2>
          <p className="text-[12.5px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>
            Join verified institutions already publishing on EventSphere — with the tools and visibility to make every event count.
          </p>
          <div className="flex flex-col gap-1.5">
            {['Full publishing & management tools', 'Real-time registration analytics', 'Verified institution badge'].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-[12px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                <Check size={14} /> {item}
              </div>
            ))}
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 self-start rounded-full px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/10"
            style={{ border: '1.5px solid rgba(255,255,255,0.35)' }}
          >
            Start Publishing <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
