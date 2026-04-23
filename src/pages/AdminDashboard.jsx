import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, Users, Building2, Shield, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, Activity, Globe, BarChart3,
  Search, MoreVertical, Ban, RefreshCw, LayoutDashboard,
  ChevronRight, UserPlus, X, Eye, EyeOff
} from 'lucide-react'
import { createInstitutionAdmin } from '../services/authService'
import { fetchUsers, fetchAnalytics } from '../services/adminService'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import StatsCard from '../components/analytics/StatsCard'
import BarChart from '../components/analytics/BarChart'
import DonutChart from '../components/analytics/DonutChart'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'

// Grouped accordion nav for the super admin sidebar.
// Items with `children` render as collapsible groups; others are direct nav buttons.
// Children inside Moderation carry a `filter` that pre-filters the queue view.
const NAV_GROUPS = [
  { id: 'Overview',   label: 'Overview',   icon: LayoutDashboard, tab: 'Overview' },
  {
    id: 'Management', label: 'Management',
    children: [
      { id: 'Events',       label: 'Events',       icon: Calendar,  tab: 'Events'       },
      { id: 'Users',        label: 'Users',        icon: Users,     tab: 'Users'        },
      { id: 'Institutions', label: 'Institutions', icon: Building2, tab: 'Institutions' },
    ],
  },
  {
    id: 'Moderation', label: 'Moderation',
    children: [
      { id: 'mod-pending',  label: 'Pending Review', icon: AlertTriangle, tab: 'Moderation', filter: 'pending_review' },
      { id: 'mod-approved', label: 'Approved',        icon: CheckCircle,   tab: 'Moderation', filter: 'approved'       },
      { id: 'mod-rejected', label: 'Rejected',        icon: XCircle,       tab: 'Moderation', filter: 'rejected'       },
    ],
  },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const { events, moderationQueue, resolveModeration } = useEvents()
  const [activeTab,       setActiveTab]       = useState('Overview')
  // Sidebar accordion: which groups are expanded
  const [openGroups,      setOpenGroups]      = useState(() => new Set(['Management', 'Moderation']))
  // Moderation sub-filter: '' = all, or 'pending_review' / 'approved' / 'rejected'
  const [modStatusFilter, setModStatusFilter] = useState('')
  const [userSearch, setUserSearch]       = useState('')
  const [userFilter, setUserFilter]       = useState('all')
  const [modExpanded, setModExpanded]     = useState(null)
  const [modModal, setModModal]           = useState(null)
  const [modNote, setModNote]             = useState('')
  const [eventsInstFilter, setEventsInstFilter] = useState('')   // institution name filter
  const [eventsMonthOnly,  setEventsMonthOnly]  = useState(false) // only current-month events
  const [suspendedInsts,   setSuspendedInsts]   = useState(new Set())
  const [suspendModal,     setSuspendModal]      = useState(null)  // { name, email } | null
  // ── Create Institution Admin modal ──────────────────────────────
  const [createAdminOpen,    setCreateAdminOpen]    = useState(false)
  const [createAdminForm,    setCreateAdminForm]    = useState({ name: '', email: '', password: '', institution: '' })
  const [createAdminError,   setCreateAdminError]   = useState('')
  const [createAdminLoading, setCreateAdminLoading] = useState(false)
  const [createAdminShowPw,  setCreateAdminShowPw]  = useState(false)
  // Users and analytics fetched via the service layer (works in both mock + real mode)
  const [allUsers,   setAllUsers]   = useState([])
  const [analytics,  setAnalytics]  = useState(null)

  // Auto-open the group that contains the newly active tab (e.g. from stat-card clicks)
  useEffect(() => {
    NAV_GROUPS.forEach(g => {
      if (g.children?.some(c => c.tab === activeTab)) {
        setOpenGroups(prev => new Set([...prev, g.id]))
      }
    })
  }, [activeTab])

  // Load users + analytics through the service layer on mount.
  // In mock mode the service reads in-memory data; in real mode it calls the API.
  useEffect(() => {
    fetchUsers().then(setAllUsers).catch(err => console.error('[AdminDashboard] fetchUsers', err))
    fetchAnalytics().then(setAnalytics).catch(err => console.error('[AdminDashboard] fetchAnalytics', err))
  }, [])

  /* ── Access guard ── */
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Super Admin access required</h2>
          <p className="text-gray-500 mb-5">You need super admin privileges to view this page.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  // Derived live metrics
  const livePending    = moderationQueue.filter(q => q.status === 'pending_review').length
  const liveApproved   = events.filter(e => e.status === 'approved').length
  const liveRejected   = events.filter(e => e.status === 'rejected').length
  const liveTotal      = events.length
  const liveApprovalRate = liveTotal > 0 ? Math.round((liveApproved / liveTotal) * 1000) / 10 : 0
  const liveAvgRisk    = events.length > 0
    ? Math.round(events.reduce((s, e) => s + (e.riskScore || 0), 0) / events.length * 10) / 10
    : 0

  // Merge service-fetched analytics with live counts derived from EventContext.
  // analytics is null until the first fetch resolves; safe defaults prevent crashes.
  const a = {
    totalEvents:          analytics?.totalEvents          ?? 0,
    totalUsers:           analytics?.totalUsers           ?? 0,
    totalInstitutions:    analytics?.totalInstitutions    ?? 0,
    activeInstitutions:   analytics?.activeInstitutions   ?? 0,
    eventsThisMonth:      analytics?.eventsThisMonth      ?? 0,
    approvedEvents:       analytics?.approvedEvents       ?? 0,
    rejectedEvents:       analytics?.rejectedEvents       ?? 0,
    monthlyEvents:        analytics?.monthlyEvents        ?? [],
    categoryDistribution: analytics?.categoryDistribution ?? [],
    topCities:            analytics?.topCities            ?? [],
    recentActivity:       analytics?.recentActivity       ?? [],
    // Live overrides — always up to date from EventContext, never stale
    pendingModeration: livePending,
    approvalRate:      liveApprovalRate || analytics?.approvalRate  || 0,
    avgRiskScore:      liveAvgRisk      || analytics?.avgRiskScore  || 0,
  }

  const handleModAction = (id, action) => {
    resolveModeration(id, action, modNote)
    setModModal(null)
    setModNote('')
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setCreateAdminError('')
    const { name, email, password, institution } = createAdminForm
    if (!name.trim())        return setCreateAdminError('Full name is required.')
    if (!email.trim())       return setCreateAdminError('Email address is required.')
    if (password.length < 6) return setCreateAdminError('Password must be at least 6 characters.')
    if (!institution.trim()) return setCreateAdminError('Institution name is required.')
    setCreateAdminLoading(true)
    try {
      const { user } = await createInstitutionAdmin(name, email, password, institution)
      setAllUsers(prev => [...prev, user])
      setCreateAdminOpen(false)
      setCreateAdminForm({ name: '', email: '', password: '', institution: '' })
      setCreateAdminShowPw(false)
    } catch (err) {
      setCreateAdminError(err.message || 'Failed to create account.')
    } finally {
      setCreateAdminLoading(false)
    }
  }

  const handleSuspend = (name) => {
    setSuspendedInsts(prev => { const s = new Set(prev); s.add(name); return s })
    setSuspendModal(null)
  }

  const handleUnsuspend = (name) => {
    setSuspendedInsts(prev => { const s = new Set(prev); s.delete(name); return s })
  }

  const navigateToEvents = (instFilter = '', monthOnly = false) => {
    setEventsInstFilter(instFilter)
    setEventsMonthOnly(monthOnly)
    setActiveTab('Events')
  }

  const currentMonth = new Date().toISOString().slice(0, 7) // "YYYY-MM"
  const displayedEvents = events
    .filter(e => !eventsInstFilter || e.institution === eventsInstFilter || e.organizer === eventsInstFilter)
    .filter(e => !eventsMonthOnly  || (e.date || '').startsWith(currentMonth))

  const filteredUsers = allUsers.filter(u => {
    if (userFilter !== 'all' && u.role !== userFilter && u.status !== userFilter) return false
    if (userSearch && !u.name.toLowerCase().includes(userSearch.toLowerCase()) &&
        !u.email.toLowerCase().includes(userSearch.toLowerCase())) return false
    return true
  })

  const roleColor   = { citizen: 'primary', institution_admin: 'cyan', super_admin: 'amber' }
  const statusColor = { active: 'success', suspended: 'danger' }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex h-[calc(100vh-4rem)]">

        {/* ════════════════════════════════════════
            SIDEBAR
        ════════════════════════════════════════ */}
        <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Sidebar header */}
          <div className="px-5 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/30">
                <Shield size={15} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Admin Panel</p>
                <p className="text-xs text-gray-400">Super Administrator</p>
              </div>
            </div>
          </div>

          {/* Nav — accordion groups */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {NAV_GROUPS.map(group => {
              // ── Standalone item (no children) ──────────────────
              if (!group.children) {
                const isActive = activeTab === group.tab
                return (
                  <button
                    key={group.id}
                    onClick={() => setActiveTab(group.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <group.icon size={16} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                    <span className="flex-1 text-left">{group.label}</span>
                    {isActive && <ChevronRight size={13} className="text-blue-200" />}
                  </button>
                )
              }

              // ── Collapsible group ───────────────────────────────
              const isOpen         = openGroups.has(group.id)
              const hasActiveChild = group.children.some(c => c.tab === activeTab)
              const toggleGroup    = () => setOpenGroups(prev => {
                const s = new Set(prev)
                s.has(group.id) ? s.delete(group.id) : s.add(group.id)
                return s
              })

              return (
                <div key={group.id}>
                  {/* Group header — toggle only, not a navigation target */}
                  <button
                    onClick={toggleGroup}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors mt-1 ${
                      hasActiveChild ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">{group.label}</span>
                    <ChevronRight
                      size={13}
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {/* Children — slide open/closed */}
                  <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                    <div className="pl-2 space-y-0.5 pt-0.5 pb-1">
                      {group.children.map(child => {
                        const isActive = child.tab === activeTab &&
                          (!child.filter || modStatusFilter === child.filter)
                        const handleClick = () => {
                          setActiveTab(child.tab)
                          if (child.filter !== undefined) setModStatusFilter(child.filter)
                        }
                        return (
                          <button
                            key={child.id}
                            onClick={handleClick}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            <child.icon size={15} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                            <span className="flex-1 text-left">{child.label}</span>
                            {isActive && <ChevronRight size={13} className="text-blue-200" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>
        </aside>

        {/* ════════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════════ */}
        <main className="flex-1 overflow-y-auto">
          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{activeTab}</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {activeTab === 'Overview'     && 'Platform health and key metrics'}
                {activeTab === 'Events'       && `${events.length} total events on the platform`}
                {activeTab === 'Users'        && `${allUsers.length} registered users`}
                {activeTab === 'Moderation'   && (modStatusFilter
                  ? `Showing ${modStatusFilter.replace('_', ' ')} items`
                  : `${livePending} item${livePending !== 1 ? 's' : ''} pending review`)}
                {activeTab === 'Institutions' && 'Verified partner institutions'}
              </p>
            </div>
            <button className="btn-secondary text-sm py-2">
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* ── Content ── */}
          <div className="px-6 py-6">

            {/* ── OVERVIEW ─────────────────────────────── */}
            {activeTab === 'Overview' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                  <StatsCard label="Total Events"   value={a.totalEvents.toLocaleString()} trend={8.3}   icon={Calendar}      color="brand"   sub="All time"          onClick={() => navigateToEvents()} />
                  <StatsCard label="Total Users"    value={`${(a.totalUsers / 1000).toFixed(1)}K`} trend={12.1} icon={Users} color="cyan" sub="Registered"         onClick={() => setActiveTab('Users')} />
                  <StatsCard label="Institutions"   value={a.totalInstitutions} trend={5.4}            icon={Building2}     color="purple"  sub="Active"             onClick={() => setActiveTab('Institutions')} />
                  <StatsCard label="This Month"     value={a.eventsThisMonth}   trend={-3.2}           icon={TrendingUp}    color="emerald" sub="Events published"   onClick={() => navigateToEvents('', true)} />
                  <StatsCard label="Pending Review" value={a.pendingModeration}                        icon={AlertTriangle} color="amber"   sub="Moderation queue"   onClick={() => setActiveTab('Moderation')} />
                  <StatsCard label="Approval Rate"  value={`${a.approvalRate}%`} trend={1.2}           icon={CheckCircle}   color="emerald" sub="Last 30 days" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <BarChart  data={a.monthlyEvents}        title="Monthly Event Activity" height={220} />
                  <DonutChart data={a.categoryDistribution} title="Events by Category" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Top cities */}
                  <div className="card p-5">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                      <Globe size={14} className="text-blue-600" /> Top Cities
                    </h4>
                    <div className="space-y-3">
                      {a.topCities.map((city, i) => {
                        const max = a.topCities[0].events
                        return (
                          <div key={city.city} className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 w-4 text-right font-medium">{i + 1}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">{city.city}</span>
                                <span className="text-xs font-semibold text-gray-500">{city.events}</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(city.events / max) * 100}%` }} />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="card p-5">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                      <Activity size={14} className="text-blue-600" /> Recent Activity
                    </h4>
                    <div className="space-y-2">
                      {a.recentActivity.map((activity, i) => {
                        const iconMap = {
                          check: <CheckCircle size={14} className="text-emerald-500" />,
                          alert: <AlertTriangle size={14} className="text-amber-500" />,
                          user:  <Users size={14} className="text-blue-500" />,
                          x:     <XCircle size={14} className="text-red-500" />,
                        }
                        return (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="mt-0.5 shrink-0">{iconMap[activity.icon]}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-700">{activity.message}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Platform health */}
                <div className="card p-5 flex items-center gap-6">
                  <div className="w-20 h-20 relative shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                      <circle
                        cx="50" cy="50" r="40" fill="none"
                        stroke={a.avgRiskScore > 70 ? '#ef4444' : a.avgRiskScore > 40 ? '#f59e0b' : '#10b981'}
                        strokeWidth="12" strokeLinecap="round"
                        strokeDasharray={`${(a.avgRiskScore / 100) * 251} 251`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">{a.avgRiskScore}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Avg. Risk Score</p>
                    <p className="text-3xl font-black text-gray-900">{a.avgRiskScore} <span className="text-lg text-gray-400 font-normal">/ 100</span></p>
                    <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <CheckCircle size={11} /> Low risk — platform is healthy
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── EVENTS ───────────────────────────────── */}
            {activeTab === 'Events' && (
              <div className="space-y-3 animate-fade-in">
                {/* Active-filter banner */}
                {(eventsInstFilter || eventsMonthOnly) && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-700 font-medium">
                    <span className="flex-1">
                      {eventsInstFilter && <>Showing events from <span className="font-bold">{eventsInstFilter}</span></>}
                      {eventsInstFilter && eventsMonthOnly && ' · '}
                      {eventsMonthOnly && <>This month only</>}
                    </span>
                    <button
                      onClick={() => { setEventsInstFilter(''); setEventsMonthOnly(false) }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      Clear filter
                    </button>
                  </div>
                )}

                <div className="card overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {eventsInstFilter ? `Events · ${eventsInstFilter}` : eventsMonthOnly ? 'Events this month' : 'All Events'}
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">{displayedEvents.length} total</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {['Event', 'Category', 'Status', 'Risk', 'Attendees', 'Date', ''].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {displayedEvents.map(event => (
                          <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                                  <img
                                    src={event.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={e => { e.target.parentElement.className = 'w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0'; e.target.outerHTML = event.id }}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{event.title}</p>
                                  <p className="text-xs text-gray-400 truncate">{event.organizer}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5"><Badge variant="primary" size="xs">{event.category}</Badge></td>
                            <td className="px-4 py-3.5">
                              <Badge
                                variant={event.status === 'approved' ? 'success' : event.status === 'flagged' ? 'danger' : 'warning'}
                                size="xs"
                              >
                                {event.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`text-sm font-bold ${event.riskScore >= 70 ? 'text-red-500' : event.riskScore >= 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {event.riskScore}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-600">{event.attendees?.toLocaleString() ?? '—'}</td>
                            <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{event.date}</td>
                            <td className="px-4 py-3.5">
                              <Link to={`/events/${event.id}`} className="text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors">
                                View →
                              </Link>
                            </td>
                          </tr>
                        ))}
                        {displayedEvents.length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                              No events match the current filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── USERS ────────────────────────────────── */}
            {activeTab === 'Users' && (
              <div className="space-y-4 animate-fade-in">
                {/* Search & filter bar */}
                <div className="card p-4 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className="input pl-9 text-sm"
                      placeholder="Search by name or email..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {[['all', 'All'], ['citizen', 'Citizens'], ['institution_admin', 'Institutions']].map(([val, lbl]) => (
                      <button
                        key={val}
                        onClick={() => setUserFilter(val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          userFilter === val ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                    <button
                      onClick={() => { setCreateAdminOpen(true); setCreateAdminError('') }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors ml-auto"
                    >
                      <UserPlus size={13} /> Create Institution Admin
                    </button>
                  </div>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {['User', 'Role', 'Institution', 'Status', 'Events', 'Joined', ''].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <Avatar
                                  initials={u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  size="sm"
                                  color={u.role === 'institution_admin' ? 'cyan' : 'brand'}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                                  <p className="text-xs text-gray-400">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <Badge variant={roleColor[u.role] || 'default'} size="xs">
                                {u.role.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-500">{u.institution || '—'}</td>
                            <td className="px-4 py-3.5">
                              <Badge variant={statusColor[u.status] || 'default'} size="xs">{u.status}</Badge>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-600">{u.eventsPublished}</td>
                            <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                              {new Date(u.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-4 py-3.5">
                              <button className="text-gray-300 hover:text-gray-500 transition-colors">
                                <MoreVertical size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm">
                      No users match your search.
                    </div>
                  )}
                </div>

                {/* ── Create Institution Admin modal ── */}
                {createAdminOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCreateAdminOpen(false)} />
                    <div className="relative w-full max-w-md card p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Create Institution Admin</h3>
                          <p className="text-xs text-gray-400 mt-0.5">The new account will be available on the login page immediately.</p>
                        </div>
                        <button
                          onClick={() => setCreateAdminOpen(false)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <form onSubmit={handleCreateAdmin} className="space-y-4">
                        {/* Full name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
                          <input
                            type="text"
                            className="input text-sm"
                            placeholder="Jane Smith"
                            value={createAdminForm.name}
                            onChange={e => setCreateAdminForm(p => ({ ...p, name: e.target.value }))}
                            required
                            autoFocus
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                          <input
                            type="email"
                            className="input text-sm"
                            placeholder="jane@institution.org"
                            value={createAdminForm.email}
                            onChange={e => setCreateAdminForm(p => ({ ...p, email: e.target.value }))}
                            required
                          />
                        </div>

                        {/* Password */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                          <div className="relative">
                            <input
                              type={createAdminShowPw ? 'text' : 'password'}
                              className="input text-sm pr-10"
                              placeholder="Min. 6 characters"
                              value={createAdminForm.password}
                              onChange={e => setCreateAdminForm(p => ({ ...p, password: e.target.value }))}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setCreateAdminShowPw(v => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {createAdminShowPw ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          </div>
                        </div>

                        {/* Institution */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Institution name</label>
                          <input
                            type="text"
                            className="input text-sm"
                            placeholder="e.g. City Arts Foundation"
                            value={createAdminForm.institution}
                            onChange={e => setCreateAdminForm(p => ({ ...p, institution: e.target.value }))}
                            required
                          />
                        </div>

                        {/* Role — fixed, shown as read-only context */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-700 font-medium">
                          <Building2 size={13} />
                          Role will be set to <span className="font-bold">Institution Admin</span>
                        </div>

                        {/* Error */}
                        {createAdminError && (
                          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                            {createAdminError}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                          <button type="button" onClick={() => setCreateAdminOpen(false)} className="btn-secondary flex-1 justify-center">
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={createAdminLoading}
                            className="btn-primary flex-1 justify-center"
                          >
                            {createAdminLoading
                              ? <div className="w-4 h-4 border-2 border-blue-300 border-t-white rounded-full animate-spin" />
                              : <><UserPlus size={14} /> Create Account</>
                            }
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── INSTITUTIONS ─────────────────────────── */}
            {activeTab === 'Institutions' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {allUsers.filter(u => u.role === 'institution_admin').map(inst => {
                    const isSuspended = suspendedInsts.has(inst.institution)
                    return (
                      <div key={inst.id} className={`card p-5 hover:shadow-md transition-all duration-200 ${isSuspended ? 'border-red-200 bg-red-50/30' : 'hover:border-blue-200'}`}>
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar
                            initials={inst.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            size="md"
                            color={isSuspended ? 'red' : 'cyan'}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate">{inst.institution}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{inst.email}</p>
                            <div className="mt-1.5">
                              <Badge variant={isSuspended ? 'danger' : 'success'} size="xs">
                                {isSuspended ? 'Suspended' : 'Active'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-gray-50 mb-4">
                          <div className="text-center">
                            <p className="text-xl font-black text-gray-900">{inst.eventsPublished}</p>
                            <p className="text-xs text-gray-500">Events Published</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-900">
                              {new Date(inst.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-gray-500">Member Since</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => navigateToEvents(inst.institution)}
                            className="btn-secondary flex-1 justify-center text-xs py-2"
                          >
                            View Events
                          </button>
                          {isSuspended ? (
                            <button
                              onClick={() => handleUnsuspend(inst.institution)}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 text-xs font-semibold transition-all"
                            >
                              <RefreshCw size={11} /> Unsuspend
                            </button>
                          ) : (
                            <button
                              onClick={() => setSuspendModal({ name: inst.institution, email: inst.email })}
                              className="btn-danger flex-1 justify-center text-xs py-2"
                            >
                              <Ban size={11} /> Suspend
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Suspend confirmation modal */}
                {suspendModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSuspendModal(null)} />
                    <div className="relative w-full max-w-md card p-6">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <Ban size={22} className="text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 text-center mb-1">Suspend Institution</h3>
                      <p className="text-gray-500 text-sm text-center mb-1">
                        You are about to suspend <span className="font-semibold text-gray-700">{suspendModal.name}</span>.
                      </p>
                      <p className="text-xs text-gray-400 text-center mb-5">
                        Their events will remain visible but they won't be able to submit new events until unsuspended.
                      </p>
                      <div className="flex gap-3">
                        <button onClick={() => setSuspendModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        <button
                          onClick={() => handleSuspend(suspendModal.name)}
                          className="flex-1 flex items-center justify-center gap-2 font-semibold py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all text-sm"
                        >
                          <Ban size={14} /> Confirm Suspend
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── MODERATION ───────────────────────────── */}
            {activeTab === 'Moderation' && (() => {
              // Apply the sidebar sub-filter (set when a Moderation child nav item is clicked)
              const filteredQueue = modStatusFilter
                ? moderationQueue.filter(q => q.status === modStatusFilter)
                : moderationQueue
              return (
              <div className="space-y-3 animate-fade-in">
                {/* Summary row — always shows totals regardless of active filter */}
                <div className="grid grid-cols-3 gap-4 mb-2">
                  {[
                    { label: 'Pending Review', value: livePending, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                    { label: 'Approved',        value: moderationQueue.filter(q => q.status === 'approved').length,  color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                    { label: 'Rejected',        value: moderationQueue.filter(q => q.status === 'rejected').length,  color: 'text-red-600 bg-red-50 border-red-200' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`card p-4 border ${color}`}>
                      <p className="text-2xl font-black">{value}</p>
                      <p className="text-xs font-medium mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Active filter banner */}
                {modStatusFilter && (
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-700 font-medium">
                    <span className="flex-1">
                      Showing: <span className="font-bold capitalize">{modStatusFilter.replace('_', ' ')}</span>
                    </span>
                    <button
                      onClick={() => setModStatusFilter('')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      Show all
                    </button>
                  </div>
                )}

                {filteredQueue.length === 0 && (
                  <div className="card p-12 text-center">
                    <CheckCircle size={40} className="text-emerald-400/40 mx-auto mb-3" />
                    <p className="font-bold text-gray-900">
                      {modStatusFilter ? `No ${modStatusFilter.replace('_', ' ')} items` : 'Queue is clear'}
                    </p>
                  </div>
                )}

                {filteredQueue.map(item => {
                  const isPending  = item.status === 'pending_review'
                  const riskColor  = item.riskScore >= 70 ? 'text-red-500' : item.riskScore >= 40 ? 'text-amber-500' : 'text-emerald-500'
                  const riskBg     = item.riskScore >= 70 ? 'bg-red-500'  : item.riskScore >= 40 ? 'bg-amber-500'  : 'bg-emerald-500'
                  const borderColor = item.riskLevel === 'high' ? 'border-l-red-500' : item.riskLevel === 'medium' ? 'border-l-amber-500' : 'border-l-emerald-500'
                  return (
                    <div key={item.id} className={`card border-l-4 ${borderColor} ${isPending ? '' : 'opacity-60'}`}>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <Badge variant={isPending ? 'warning' : item.status === 'approved' ? 'success' : 'danger'} size="xs">
                                {isPending ? 'Pending' : item.status}
                              </Badge>
                              <Badge variant={item.riskLevel === 'high' ? 'danger' : item.riskLevel === 'medium' ? 'warning' : 'success'} size="xs">
                                {item.riskLevel} risk
                              </Badge>
                              <span className="text-xs text-gray-500">{item.category} · {item.location}</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{item.eventTitle}</h3>
                            <p className="text-sm text-gray-500 mb-0.5">
                              By <span className="text-gray-700">{item.submittedBy}</span>
                              {item.date && (
                                <> · Event date: <span className="text-gray-700 font-medium">{item.date}</span></>
                              )}
                            </p>
                            <p className="text-xs text-gray-400 mb-2">
                              Submitted {new Date(item.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-48">
                                <div className={`h-full rounded-full ${riskBg}`} style={{ width: `${item.riskScore}%` }} />
                              </div>
                              <span className={`text-sm font-bold ${riskColor}`}>Risk: {item.riskScore}/100</span>
                            </div>
                            <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-gray-50">
                              <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                              <p className="text-xs text-gray-600">{item.flagReason}</p>
                            </div>
                            {modExpanded === item.id && (() => {
                              // Merge queue-item fields with source event fields for full detail.
                              // Queue item is the authority; source event fills any gaps.
                              const src = events.find(e =>
                                (item.eventId && e.id === item.eventId) ||
                                e.title === item.eventTitle
                              ) || {}
                              const d = { ...src, ...item }
                              return (
                                <div className="mt-3 pt-3 border-t border-gray-100 space-y-4">
                                  {/* ── Full event detail ── */}
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Event Details</p>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                                      {d.description && (
                                        <div className="col-span-2">
                                          <p className="text-xs text-gray-400 mb-0.5">Description</p>
                                          <p className="text-gray-700 leading-relaxed">{d.description}</p>
                                        </div>
                                      )}
                                      {d.venue && (
                                        <div>
                                          <p className="text-xs text-gray-400 mb-0.5">Venue</p>
                                          <p className="text-gray-700">{d.venue}</p>
                                        </div>
                                      )}
                                      {d.time && (
                                        <div>
                                          <p className="text-xs text-gray-400 mb-0.5">Time</p>
                                          <p className="text-gray-700">{d.time}</p>
                                        </div>
                                      )}
                                      <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Price</p>
                                        <p className="text-gray-700">{d.price === 0 ? 'Free' : `$${d.price}`}</p>
                                      </div>
                                      {d.capacity > 0 && (
                                        <div>
                                          <p className="text-xs text-gray-400 mb-0.5">Capacity</p>
                                          <p className="text-gray-700">{d.capacity.toLocaleString()}</p>
                                        </div>
                                      )}
                                      {d.institution && (
                                        <div>
                                          <p className="text-xs text-gray-400 mb-0.5">Institution</p>
                                          <p className="text-gray-700">{d.institution}</p>
                                        </div>
                                      )}
                                    </div>
                                    {d.tags?.length > 0 && (
                                      <div className="mt-2.5">
                                        <p className="text-xs text-gray-400 mb-1.5">Tags</p>
                                        <div className="flex flex-wrap gap-1.5">
                                          {d.tags.map(tag => (
                                            <span key={tag} className="badge bg-blue-50 text-blue-600 border border-blue-200 text-xs">{tag}</span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* ── Auto-detected flags ── */}
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Auto-detected Flags</p>
                                    <div className="flex flex-wrap gap-2">
                                      {item.autoFlags.map(f => (
                                        <span key={f} className="badge bg-red-50 text-red-600 border border-red-200 text-xs">⚠ {f.replace(/_/g, ' ')}</span>
                                      ))}
                                    </div>
                                  </div>

                                  {item.note && (
                                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                      <p className="text-xs text-gray-600"><span className="text-blue-600 font-semibold">Reviewer note:</span> {item.note}</p>
                                    </div>
                                  )}
                                </div>
                              )
                            })()}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => setModModal({ id: item.id, action: 'approve', title: item.eventTitle })}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-600 text-xs font-semibold transition-all"
                                >
                                  <CheckCircle size={13} /> Approve
                                </button>
                                <button
                                  onClick={() => setModModal({ id: item.id, action: 'reject', title: item.eventTitle })}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-500 text-xs font-semibold transition-all"
                                >
                                  <XCircle size={13} /> Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setModExpanded(modExpanded === item.id ? null : item.id)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-400 transition-colors"
                            >
                              {modExpanded === item.id ? <ChevronRight size={14} className="rotate-90" /> : <ChevronRight size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Action modal */}
                {modModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModModal(null)} />
                    <div className="relative w-full max-w-md card p-6">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${modModal.action === 'approve' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        {modModal.action === 'approve' ? <CheckCircle size={22} className="text-emerald-500" /> : <XCircle size={22} className="text-red-500" />}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                        {modModal.action === 'approve' ? 'Approve Event' : 'Reject Event'}
                      </h3>
                      <p className="text-gray-500 text-sm text-center mb-5">"{modModal.title}"</p>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Reviewer Note (optional)</label>
                        <textarea className="input resize-none" rows={3} placeholder="Add a note for the record..." value={modNote} onChange={e => setModNote(e.target.value)} />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setModModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                        <button
                          onClick={() => handleModAction(modModal.id, modModal.action)}
                          className={`flex-1 justify-center font-semibold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 text-white ${modModal.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}
                        >
                          {modModal.action === 'approve' ? <><CheckCircle size={14} /> Approve</> : <><XCircle size={14} /> Reject</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              )
            })()}

          </div>
        </main>
      </div>
    </div>
  )
}
