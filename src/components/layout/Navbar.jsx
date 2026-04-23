import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Search, Bell, Menu, X, LogOut, Settings,
  User, Shield, Building2, Zap, Plus,
  Bookmark, Ticket, CreditCard
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import Avatar from '../ui/Avatar'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const profileRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }

      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { to: '/',       label: 'Discover' },
    { to: '/events', label: 'Events'   },
    // Dashboard: institution admin only
    ...(user?.role === 'institution_admin' ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
    // Admin only: top-level Admin link (Moderation lives inside the Admin sidebar)
    ...(user?.role === 'super_admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ]

  const roleLabel = user?.role === 'super_admin'        ? 'Super Admin'
    : user?.role === 'institution_admin' ? 'Institution Admin'
    : 'Citizen'

  const roleColor = user?.role === 'super_admin'        ? 'text-amber-700   bg-amber-50   border-amber-200'
    : user?.role === 'institution_admin' ? 'text-sky-700     bg-sky-50     border-sky-200'
    : 'text-blue-700    bg-blue-50    border-blue-200'

  const canPublish = user?.role === 'institution_admin' || user?.role === 'super_admin'

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-sm shadow-gray-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:bg-blue-700 transition-colors">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-[1.05rem] text-gray-900 tracking-tight">
              Event<span className="text-blue-600">Sphere</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-1.5">

            {/* Search shortcut */}
            <Link
              to="/events"
              className="hidden sm:flex p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Search events"
            >
              <Search size={17} />
            </Link>

            {/* Publish button */}
            {canPublish && (
              <Link
                to="/publish"
                className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm shadow-blue-600/20"
              >
                <Plus size={14} /> Publish
              </Link>
            )}

            {/* Notifications */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
                  className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-gray-900/10 overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm font-medium text-gray-900">No notifications</p>
                          <p className="text-xs text-gray-500 mt-1">You’re all caught up for now.</p>
                        </div>
                      ) : (
                        notifications.slice(0, 3).map(n => (
                          <div
                            key={n.id}
                            onClick={() => markRead(n.id)}
                            className={`px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors last:border-0 ${!n.read ? 'bg-blue-50/50' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3">
                      <button
                        onClick={markAllRead}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Mark all as read
                      </button>
                      <button
                        onClick={() => {
                          navigate('/notifications')
                          setNotifOpen(false)
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        View all notifications →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile / Sign-in */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
                  className="flex items-center px-1.5 py-1.5 rounded-full border border-transparent hover:bg-gray-50 hover:border-gray-200 transition-colors"
                >
                  <Avatar initials={user.avatar} size="sm" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-gray-200/90 rounded-3xl shadow-xl shadow-gray-900/10 overflow-hidden animate-fade-in">
                    <div className="px-5 py-5 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
                      <div className="flex items-center gap-3.5">
                        <Avatar initials={user.avatar} size="sm" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                        </div>
                      </div>
                      {user?.role !== 'citizen' && (
                        <span className={`mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleColor}`}>
                          {user?.role === 'super_admin' ? <Shield size={10} />
                            : user?.role === 'institution_admin' ? <Building2 size={10} />
                            : <User size={10} />}
                          {roleLabel}
                        </span>
                      )}
                    </div>

                    {user?.role !== 'super_admin' && user?.role !== 'institution_admin' && (
                      <>
                        <div className="px-3 pt-3 pb-1">
                          <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Your Events</p>
                        </div>
                        <div className="px-1.5 pb-2">
                          <button
                            onClick={() => { navigate('/saved-events'); setProfileOpen(false) }}
                            className="w-full text-left px-3 py-3 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                          >
                            <Bookmark size={14} /> Saved
                          </button>
                          <button
                            onClick={() => { navigate('/registered-events'); setProfileOpen(false) }}
                            className="w-full text-left px-3 py-3 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                          >
                            <Ticket size={14} /> Tickets
                          </button>
                          <button
                            onClick={() => { navigate('/subscriptions'); setProfileOpen(false) }}
                            className="w-full text-left px-3 py-3 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                          >
                            <CreditCard size={14} /> Following
                          </button>
                        </div>

                        <div className="mx-4 border-t border-gray-100" />
                      </>
                    )}

                    <div className="px-3 pt-3 pb-1">
                      <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Account</p>
                    </div>
                    <div className="px-1.5 pb-2">
                      {user?.role !== 'citizen' && (
                        <button
                          onClick={() => { navigate('/profile'); setProfileOpen(false) }}
                          className="w-full text-left px-3 py-3 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                        >
                          <User size={14} /> Profile
                        </button>
                      )}
                      <button
                        onClick={() => { navigate('/settings'); setProfileOpen(false) }}
                        className="w-full text-left px-3 py-3 rounded-xl text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                      >
                        <Settings size={14} /> Settings
                      </button>
                    </div>

                    <div className="p-1.5 border-t border-gray-100">
                      <button
                        onClick={() => {
                          logout()
                          setProfileOpen(false)
                          setNotifOpen(false)
                          navigate('/')
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-600/20"
              >
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {canPublish && (
              <Link
                to="/publish"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                + Publish Event
              </Link>
            )}
          </div>
        </div>
      )}

    </nav>
  )
}
