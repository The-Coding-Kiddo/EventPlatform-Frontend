import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Bookmark, Bell, Tag, Calendar, MapPin, User, Settings,
  ChevronRight, X, LayoutDashboard, FileText, BarChart3,
  Plus, AlertTriangle, CheckCircle, Users, Building2,
  TrendingUp, Eye, Clock, PanelLeftClose, PanelLeftOpen
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { useEvents } from '../context/EventContext'
import { CATEGORIES } from '../data/constants'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import EventCard from '../components/events/EventCard'

/* ─────────────────────────────────────────────
   Citizen constants (unchanged)
───────────────────────────────────────────── */
const CATEGORY_ICONS = {
  'Technology': '💻', 'Music': '🎵', 'Arts & Culture': '🎨', 'Sports': '⚽',
  'Business': '💼', 'Food & Drink': '🍽️', 'Health & Wellness': '🧘',
  'Education': '📚', 'Community': '🤝', 'Entertainment': '🎭',
}

const CITIZEN_TABS = [
  { label: 'Saved Events',      icon: Bookmark     },
  { label: 'Registered Events', icon: CheckCircle  },
  { label: 'Subscriptions',     icon: Tag          },
  { label: 'Notifications',     icon: Bell         },
  { label: 'Profile',           icon: User         },
]

/* ─────────────────────────────────────────────
   Institution admin constants
───────────────────────────────────────────── */
// Grouped accordion nav for the institution admin sidebar.
const INSTITUTION_NAV_GROUPS = [
  { id: 'Overview',  label: 'Overview',  icon: LayoutDashboard, tab: 'Overview'  },
  {
    id: 'Events',    label: 'Events',
    children: [
      { id: 'Events List',   label: 'Events',        icon: Calendar,  tab: 'Events', countKey: 'myEvents' },
      { id: 'Publish Event', label: 'Publish Event', icon: Plus,      tab: 'Publish Event', href: '/publish' },
      { id: 'Drafts',        label: 'Drafts',        icon: FileText,  tab: 'Drafts', countKey: 'drafts' },
    ],
  },
  { id: 'Analytics', label: 'Analytics', icon: BarChart3, tab: 'Analytics' },
  {
    id: 'Account',   label: 'Account',
    children: [
      { id: 'Notifications', label: 'Notifications', icon: Bell, tab: 'Notifications' },
      { id: 'Profile',       label: 'Organization Profile', icon: User, tab: 'Profile' },
    ],
  },
]

// MOCK_DRAFTS removed — drafts come exclusively from live EventContext state.

/* ─────────────────────────────────────────────
   Institution Admin Dashboard
   (rendered when role === 'institution_admin')
───────────────────────────────────────────── */
function InstitutionAdminDashboard({ user }) {
  const [activeTab,  setActiveTab]  = useState('Overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // Groups start open so the full nav is visible; users can collapse what they don't need
  const [openGroups, setOpenGroups] = useState(() => new Set(['Events', 'Account']))
  const { getInstitutionEvents, getDrafts } = useEvents()
  const { getNotificationsForUser, markRead, markAllRead } = useNotifications()

  // Derive institution's events from live event state
  const myEvents           = getInstitutionEvents(user.institution)
  const published          = myEvents.filter(e => e.status === 'approved')
  const pending            = myEvents.filter(e => e.status === 'pending')
  const drafts             = getDrafts(user.institution)
  const totalRegistrations = myEvents.reduce((sum, e) => sum + (e.attendees || 0), 0)
  const bestEvent          = [...myEvents].sort((a, b) => (b.attendees || 0) - (a.attendees || 0))[0]
  const myNotifications    = getNotificationsForUser(user)

  const navCounts = {
    myEvents: myEvents.length,
    drafts: drafts.length,
  }

  const collapsedNavItems = [
    { id: 'Overview', label: 'Overview', icon: LayoutDashboard, tab: 'Overview' },
    { id: 'Events', label: 'Events', icon: Calendar, tab: 'Events' },
    { id: 'Publish Event', label: 'Publish Event', icon: Plus, href: '/publish' },
    { id: 'Drafts', label: 'Drafts', icon: FileText, tab: 'Drafts' },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3, tab: 'Analytics' },
    { id: 'Notifications', label: 'Notifications', icon: Bell, tab: 'Notifications' },
    { id: 'Profile', label: 'Organization Profile', icon: User, tab: 'Profile' },
  ]

  const overviewStats = [
    { label: 'Published Events', value: published.length,         icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pending Review',   value: pending.length,           icon: AlertTriangle, color: 'text-amber-600  bg-amber-50'  },
    { label: 'Drafts',           value: drafts.length,            icon: FileText,    color: 'text-blue-600   bg-blue-50'    },
    { label: 'Registrations',    value: totalRegistrations.toLocaleString(), icon: Users, color: 'text-violet-600 bg-violet-50' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className={`max-w-6xl mx-auto grid grid-cols-1 ${sidebarCollapsed ? 'lg:grid-cols-[92px,1fr]' : 'lg:grid-cols-[280px,1fr]'} gap-6`}>

        {/* ── Sidebar ── */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className={`card transition-all duration-200 ${sidebarCollapsed ? 'p-3' : 'p-5'}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center mb-2' : 'justify-between mb-4'}`}>
              {!sidebarCollapsed && (
                <div>
                  <p className="text-sm font-semibold text-gray-700">Admin Panel</p>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(prev => !prev)}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              </button>
            </div>

            {sidebarCollapsed ? (
              <div className="space-y-1">
                {collapsedNavItems.map(item => {
                  const isActive = item.tab ? activeTab === item.tab : false
                  const cls = `w-full h-11 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gray-100 text-gray-900 border border-gray-200'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`

                  return item.href ? (
                    <Link key={item.id} to={item.href} className={cls} title={item.label}>
                      <item.icon size={17} />
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.tab)}
                      className={cls}
                      title={item.label}
                    >
                      <item.icon size={17} />
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-0.5">
                {INSTITUTION_NAV_GROUPS.map(group => {
                  if (!group.children) {
                    const isActive = activeTab === group.tab
                    return (
                      <button
                        key={group.id}
                        onClick={() => setActiveTab(group.tab)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-gray-100 text-gray-900 border-l-2 border-brand-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <group.icon size={16} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                        <span>{group.label}</span>
                      </button>
                    )
                  }

                  const isOpen = openGroups.has(group.id)
                  const hasActiveChild = group.children.some(c => c.tab === activeTab)
                  const toggleGroup = () => setOpenGroups(prev => {
                    const s = new Set(prev)
                    s.has(group.id) ? s.delete(group.id) : s.add(group.id)
                    return s
                  })

                  return (
                    <div key={group.id}>
                      <button
                        onClick={toggleGroup}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors mt-1 ${
                          hasActiveChild ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">{group.label}</span>
                        <ChevronRight
                          size={13}
                          className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                        />
                      </button>

                      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                        <div className="pl-2 space-y-0.5 pt-0.5 pb-1">
                          {group.children.map(child => {
                            const isActive = activeTab === child.tab && !child.href
                            const cls = `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              isActive
                                ? 'bg-gray-100 text-gray-900 border-l-2 border-brand-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                            return child.href ? (
                              <Link key={child.id} to={child.href} className={cls}>
                                <child.icon size={15} className="text-gray-400" />
                                <span>{child.label}</span>
                                {typeof navCounts[child.countKey] === 'number' && (
                                  <span className="ml-auto text-xs font-semibold text-gray-400">{navCounts[child.countKey]}</span>
                                )}
                              </Link>
                            ) : (
                              <button key={child.id} onClick={() => setActiveTab(child.tab)} className={cls}>
                                <child.icon size={15} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                                <span>{child.label}</span>
                                {typeof navCounts[child.countKey] === 'number' && (
                                  <span className={`ml-auto text-xs font-semibold ${isActive ? 'text-gray-900/90' : 'text-gray-400'}`}>{navCounts[child.countKey]}</span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="min-w-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{activeTab}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'Overview'      && `Management workspace for ${user.institution}`}
              {activeTab === 'Events'        && 'Events published or submitted by your institution'}
              {activeTab === 'Drafts'        && 'Saved drafts waiting to be submitted'}
              {activeTab === 'Analytics'     && 'Performance summary for your institution'}
              {activeTab === 'Notifications' && 'Platform and moderation updates'}
              {activeTab === 'Profile'       && 'Your account and institution information'}
            </p>
          </div>

          {/* ── OVERVIEW ── */}
          {activeTab === 'Overview' && (
            <div className="space-y-5">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {overviewStats.map(({ label, value, icon: Icon, color }) => {
                  const handleClick = () => {
                    if (label === 'Published Events') setActiveTab('Events')
                    if (label === 'Pending Review') setActiveTab('Events')
                    if (label === 'Drafts') setActiveTab('Drafts')
                    if (label === 'Registrations') setActiveTab('Analytics')
                  }

                  return (
                    <button
                      key={label}
                      onClick={handleClick}
                      className="card p-4 text-left hover:border-blue-200 hover:shadow-sm transition-all"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                        <Icon size={16} />
                      </div>
                      <p className="text-2xl font-black text-gray-900">{value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                    </button>
                  )
                })}
              </div>

              {/* Recent events & activity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* My recent events */}
                <div className="card p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-blue-600" /> Recent Events
                  </h3>
                  {myEvents.length === 0 ? (
                    <p className="text-sm text-gray-400">No events yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {myEvents.slice(0, 3).map(e => (
                        <div key={e.id} className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{e.title}</p>
                            <p className="text-xs text-gray-400">{e.date}</p>
                          </div>
                          <Badge variant={e.status === 'approved' ? 'success' : e.status === 'pending' ? 'warning' : 'danger'} size="xs">
                            {e.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setActiveTab('Events')} className="mt-4 text-xs text-blue-600 hover:text-blue-700 font-semibold">
                    View all →
                  </button>
                </div>

                {/* Recent drafts */}
                <div className="card p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                    <FileText size={14} className="text-blue-600" /> Recent Drafts
                  </h3>
                  {drafts.length === 0 ? (
                    <div>
                      <p className="text-sm text-gray-400">No drafts yet.</p>
                      <p className="text-xs text-gray-400 mt-1">Start a new event to create your first draft.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {drafts.slice(0, 3).map(d => {
                        const label = (() => {
                          try { return new Date(d.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
                          catch { return d.updatedAt }
                        })()
                        return (
                          <div key={d.id} className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{d.title}</p>
                              <p className="text-xs text-gray-400">Updated {label}</p>
                            </div>
                            <Badge variant="default" size="xs">Draft</Badge>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <button onClick={() => setActiveTab('Drafts')} className="mt-4 text-xs text-blue-600 hover:text-blue-700 font-semibold">
                    View all →
                  </button>
                </div>
              </div>

              {/* Publish CTA */}
              <div className="card p-5 flex items-center justify-between gap-4 bg-blue-50 border-blue-100">
                <div>
                  <p className="font-semibold text-gray-900">Ready to publish a new event?</p>
                  <p className="text-sm text-gray-500 mt-0.5">Submit it for review and reach thousands of attendees.</p>
                </div>
                <Link to="/publish" className="btn-primary shrink-0">
                  <Plus size={14} /> New Event
                </Link>
              </div>
            </div>
          )}

          {/* ── EVENTS ── */}
          {activeTab === 'Events' && (
            <div className="card overflow-hidden">
              {myEvents.length === 0 ? (
                <div className="p-10 text-center">
                  <Calendar size={36} className="text-gray-300 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-1">No events yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Publish your first event to see it here</p>
                  <Link to="/publish" className="btn-primary">Publish Event</Link>
                </div>
              ) : (
                <>
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{myEvents.length} event{myEvents.length !== 1 ? 's' : ''}</span>
                    <Link to="/publish" className="btn-primary text-xs py-1.5">
                      <Plus size={13} /> New Event
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {['Event', 'Category', 'Status', 'Date', 'Attendees', ''].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {myEvents.map(e => (
                          <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3.5">
                              <p className="text-sm font-semibold text-gray-900 max-w-[220px] truncate">{e.title}</p>
                              <p className="text-xs text-gray-400">{e.venue}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <Badge variant="primary" size="xs">{e.category}</Badge>
                            </td>
                            <td className="px-4 py-3.5">
                              <Badge variant={e.status === 'approved' ? 'success' : e.status === 'pending' ? 'warning' : 'danger'} size="xs">
                                {e.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{e.date}</td>
                            <td className="px-4 py-3.5 text-sm text-gray-600">{e.attendees.toLocaleString()}</td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <Link to={`/events/${e.id}`} className="text-blue-600 hover:text-blue-700 text-xs font-semibold">
                                  View →
                                </Link>
                                {(e.status === 'draft' || e.status === 'pending') && (
                                  <Link to="/publish" className="text-gray-400 hover:text-gray-600 text-xs font-semibold">
                                    Edit
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── DRAFTS ── */}
          {activeTab === 'Drafts' && (
            <div className="space-y-3">
              {drafts.length === 0 && (
                <div className="card p-10 text-center">
                  <FileText size={36} className="text-gray-300 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-1">No drafts yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Start writing an event and save it as a draft to continue later</p>
                  <Link to="/publish" className="btn-primary">Create Event</Link>
                </div>
              )}
              {drafts.map(d => {
                const updatedLabel = (() => {
                  try { return new Date(d.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
                  catch { return d.updatedAt }
                })()
                return (
                  <div key={d.id} className="card p-4 flex items-center gap-4 hover:border-blue-200 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{d.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {d.category && <Badge variant="primary" size="xs">{d.category}</Badge>}
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> Updated {updatedLabel}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="default" size="xs">Draft</Badge>
                      <Link to="/publish" className="btn-secondary text-xs py-1.5">Edit</Link>
                    </div>
                  </div>
                )
              })}
              {drafts.length > 0 && (
                <Link to="/publish" className="card p-4 flex items-center justify-center gap-2 text-sm text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all border-dashed">
                  <Plus size={15} /> Create new event
                </Link>
              )}
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab === 'Analytics' && (() => {
            const avgFillRate = myEvents.length
              ? Math.round(
                  myEvents.reduce((sum, e) => sum + (e.attendees || 0), 0) /
                  myEvents.reduce((sum, e) => sum + (e.capacity || 1), 0) * 100
                )
              : 0

            const weakestEvent = myEvents.length
              ? [...myEvents].sort((a, b) => (a.attendees || 0) - (b.attendees || 0))[0]
              : null

            const needsAttention = pending[0] || weakestEvent

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Total Registrations',
                      value: totalRegistrations.toLocaleString(),
                      sub: totalRegistrations > 0 ? 'Audience reached across all events' : 'No registrations yet',
                      color: 'text-blue-600 bg-blue-50',
                      icon: Users,
                      onClick: () => setActiveTab('Analytics'),
                    },
                    {
                      label: 'Live Events',
                      value: published.length,
                      sub: published.length > 0 ? 'Approved and visible to attendees' : 'No live events right now',
                      color: 'text-emerald-600 bg-emerald-50',
                      icon: CheckCircle,
                      onClick: () => setActiveTab('Events'),
                    },
                    {
                      label: 'Pending Review',
                      value: pending.length,
                      sub: pending.length > 0 ? 'Needs moderation attention' : 'All submissions are clear',
                      color: 'text-amber-600 bg-amber-50',
                      icon: AlertTriangle,
                      onClick: () => setActiveTab('Events'),
                    },
                    {
                      label: 'Total Events',
                      value: myEvents.length,
                      sub: myEvents.length > 0 ? 'All created events' : 'No events yet',
                      color: 'text-gray-700 bg-gray-100',
                      icon: Calendar,
                      onClick: () => setActiveTab('Events'),
                    },
                  ].map(({ label, value, sub, color, icon: Icon, onClick }) => (
                    <button
                      key={label}
                      onClick={onClick}
                      className="card p-5 text-left hover:border-blue-200 hover:shadow-sm transition-all"
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
                        <Icon size={18} />
                      </div>
                      <p className="text-3xl font-black text-gray-900">{value}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-2">{label}</p>
                      <p className="text-xs text-gray-500 mt-1">{sub}</p>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <div className="card p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                        <TrendingUp size={14} className="text-emerald-600" /> Top Performer
                      </h3>
                      {bestEvent && (
                        <Link to={`/events/${bestEvent.id}`} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                          View Event →
                        </Link>
                      )}
                    </div>

                    {bestEvent ? (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                          <img src={bestEvent.image} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-gray-900 truncate">{bestEvent.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{bestEvent.date} · {bestEvent.venue}</p>
                          <p className="text-xs text-emerald-600 font-semibold mt-2">Highest registrations across your events</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-3xl font-black text-gray-900">{bestEvent.attendees.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">registrations</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No live performance data yet.</p>
                    )}
                  </div>

                  <div className="card p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                        <AlertTriangle size={14} className="text-amber-600" /> Needs Attention
                      </h3>
                      {needsAttention && (
                        <Link
                          to={needsAttention.status === 'pending' || needsAttention.status === 'draft' ? '/publish' : `/events/${needsAttention.id}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {needsAttention.status === 'pending' || needsAttention.status === 'draft' ? 'Edit Event →' : 'View Event →'}
                        </Link>
                      )}
                    </div>

                    {needsAttention ? (
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-lg font-bold text-gray-900 truncate">{needsAttention.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{needsAttention.date} · {needsAttention.venue}</p>
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            <Badge variant={needsAttention.status === 'approved' ? 'success' : needsAttention.status === 'pending' ? 'warning' : 'danger'} size="xs">
                              {needsAttention.status}
                            </Badge>
                            <span className="text-xs font-semibold text-amber-600">
                              {needsAttention.status === 'pending'
                                ? 'Pending approval'
                                : (needsAttention.attendees || 0) === 0
                                  ? 'No registrations'
                                  : 'Low performance'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-black text-gray-900">{(needsAttention.attendees || 0).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">registrations</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No events need attention right now.</p>
                    )}
                  </div>
                </div>

                {myEvents.length > 0 && (
                  <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Event Performance Overview</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Track registration traction and event health.</p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            {['Event', 'Status', 'Registrations', 'Capacity', 'Fill Rate', 'Performance', 'Action'].map(h => (
                              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {myEvents.map(e => {
                            const fill = Math.round((e.attendees / e.capacity) * 100)
                            const performance =
                              e.status === 'pending'
                                ? { label: 'Waiting review', tone: 'text-amber-600' }
                                : e.attendees === 0
                                  ? { label: 'No traction', tone: 'text-red-500' }
                                  : fill >= 70
                                    ? { label: 'Strong', tone: 'text-emerald-600' }
                                    : fill >= 35
                                      ? { label: 'Moderate', tone: 'text-blue-600' }
                                      : { label: 'Weak', tone: 'text-amber-600' }

                            return (
                              <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3.5">
                                  <div className="max-w-[260px]">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{e.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{e.date} · {e.venue}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <Badge variant={e.status === 'approved' ? 'success' : e.status === 'pending' ? 'warning' : 'danger'} size="xs">
                                    {e.status}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3.5 text-sm text-gray-700 font-medium">{e.attendees.toLocaleString()}</td>
                                <td className="px-4 py-3.5 text-sm text-gray-500">{e.capacity.toLocaleString()}</td>
                                <td className="px-4 py-3.5 min-w-[160px]">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full ${fill >= 70 ? 'bg-emerald-500' : fill >= 35 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(fill, 100)}%` }} />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-600 w-10 text-right">{fill}%</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <span className={`text-xs font-semibold ${performance.tone}`}>{performance.label}</span>
                                </td>
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-3 whitespace-nowrap">
                                    <Link to={`/events/${e.id}`} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                                      View
                                    </Link>
                                    {(e.status === 'draft' || e.status === 'pending') && (
                                      <Link to="/publish" className="text-xs font-semibold text-gray-500 hover:text-gray-700">
                                        Edit
                                      </Link>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === 'Notifications' && (
            <div className="card divide-y divide-gray-100 overflow-hidden">
              {myNotifications.length === 0 && (
                <div className="p-10 text-center">
                  <Bell size={36} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              )}
              {myNotifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50' : ''}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-gray-300' : 'bg-brand-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-gray-900 text-sm">{n.title}</span>
                      {!n.read && <Badge variant="primary" size="xs">New</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                  {n.eventId && (
                    <Link to={`/events/${n.eventId}`} className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-700 transition-colors">
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === 'Profile' && (
            <div className="space-y-5 max-w-4xl">
              <div className="card p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar initials={user.avatar} size="lg" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 badge bg-sky-50 text-sky-700 border border-sky-200">
                          <Building2 size={10} /> Institution Admin
                        </span>
                        <span className="inline-flex items-center gap-1 badge bg-gray-50 text-gray-700 border border-gray-200">
                          <MapPin size={10} /> {user.institution || 'Institution'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div />
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Institution Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Institution Name</label>
                    <div className="input bg-gray-50 cursor-default">{user.institution || '—'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Organization Type</label>
                    <div className="input bg-gray-50 cursor-default">Educational Institution</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Contact Email</label>
                    <div className="input bg-gray-50 cursor-default">{user.email}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Primary Role</label>
                    <div className="input bg-gray-50 cursor-default">Institution Admin</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main export — branches by role
───────────────────────────────────────────── */
export default function UserDashboard() {
  const { user, toggleSavedEvent, toggleSubscription } = useAuth()
  const { getNotificationsForUser, markRead } = useNotifications()
  const { events } = useEvents()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('Saved Events')

  // Use live events from context so newly submitted/bookmarked events appear immediately
  const savedEvents      = events.filter(e => user?.savedEvents?.includes(e.id))
  const registeredEvents = events.filter(e => user?.registeredEvents?.includes(e.id))
  const citizenNotifications = user ? getNotificationsForUser(user) : []

  useEffect(() => {
    const tab = searchParams.get('tab')

    const tabMap = {
      saved: 'Saved Events',
      registered: 'Registered Events',
      subscriptions: 'Subscriptions',
      notifications: 'Notifications',
      profile: 'Profile',
    }

    if (tabMap[tab]) {
      setActiveTab(tabMap[tab])
    }
  }, [searchParams])

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <User size={28} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in required</h2>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  // ── Institution admin gets its own dashboard ──
  if (user.role === 'institution_admin') {
    return <InstitutionAdminDashboard user={user} />
  }

  // ── Citizen dashboard (unchanged) ──
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="card p-5">
            <div className="flex items-center gap-4 mb-5">
              <Avatar initials={user.avatar} size="lg" />
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 truncate">{user.name}</h1>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <span className="mt-2 inline-flex items-center gap-1 badge bg-blue-50 text-blue-700 border border-blue-200">
                  <User size={10} /> Citizen
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {CITIZEN_TABS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === label ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-gray-200 space-y-2 text-sm text-gray-500">
              <p>{user.registeredEvents?.length || 0} registered events</p>
              <p>{user.savedEvents?.length || 0} saved events</p>
              <p>{user.subscriptions?.length || 0} subscriptions</p>
            </div>

            <button className="btn-secondary w-full mt-5 justify-center">
              <Settings size={14} /> Edit Profile
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{activeTab}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'Saved Events'      && 'Events you bookmarked to revisit later.'}
              {activeTab === 'Registered Events' && 'Events you have confirmed registration for.'}
              {activeTab === 'Subscriptions'     && 'Manage the categories you want to hear about.'}
              {activeTab === 'Notifications'     && 'Your latest platform and event updates.'}
              {activeTab === 'Profile'           && 'View and manage your account information.'}
            </p>
          </div>

          {/* Saved Events */}
          {activeTab === 'Saved Events' && (
            <div>
              {savedEvents.length === 0 ? (
                <div className="card p-10 text-center">
                  <Bookmark size={40} className="text-gray-300 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-1">No saved events yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Bookmark events to find them here later</p>
                  <Link to="/events" className="btn-primary">Discover Events</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {savedEvents.map(e => <EventCard key={e.id} event={e} />)}
                </div>
              )}
            </div>
          )}

          {/* Registered Events */}
          {activeTab === 'Registered Events' && (
            <div>
              {registeredEvents.length === 0 ? (
                <div className="card p-10 text-center">
                  <CheckCircle size={40} className="text-gray-300 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-1">No registered events yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Find an event and click "Register Now" to confirm your spot</p>
                  <Link to="/events" className="btn-primary">Discover Events</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {registeredEvents.map(e => <EventCard key={e.id} event={e} />)}
                </div>
              )}
            </div>
          )}

          {/* Subscriptions */}
          {activeTab === 'Subscriptions' && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-1">Category Subscriptions</h2>
              <p className="text-gray-500 text-sm mb-5">Get notified when new events are published in your subscribed categories</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {CATEGORIES.map(cat => {
                  const isSubscribed = user.subscriptions?.includes(cat)
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleSubscription(cat)}
                      className={`p-3 rounded-xl border transition-all text-center hover:-translate-y-0.5 ${
                        isSubscribed
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-900'
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{CATEGORY_ICONS[cat]}</div>
                      <p className="text-xs font-medium leading-tight">{cat}</p>
                      {isSubscribed && <p className="text-[10px] mt-1 text-blue-600">Subscribed</p>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'Notifications' && (
            <div className="card divide-y divide-gray-200 overflow-hidden">
              {citizenNotifications.length === 0 && (
                <div className="p-10 text-center">
                  <Bell size={36} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              )}
              {citizenNotifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50' : ''}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-gray-300' : 'bg-brand-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-gray-900 text-sm">{n.title}</span>
                      {!n.read && <Badge variant="primary" size="xs">New</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                  {n.eventId && (
                    <Link to={`/events/${n.eventId}`} className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-700 transition-colors">
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Profile */}
          {activeTab === 'Profile' && (
            <div className="card p-6 space-y-5 max-w-3xl">
              <h2 className="font-bold text-gray-900">Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name',     value: user.name        },
                  { label: 'Email Address', value: user.email       },
                  { label: 'Account Type',  value: 'Citizen'        },
                  { label: 'Member Since',  value: 'March 2025'     },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
                    <div className="input bg-gray-50 cursor-default">{value}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button className="btn-primary">Save Changes</button>
                <button className="btn-secondary">Change Password</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
