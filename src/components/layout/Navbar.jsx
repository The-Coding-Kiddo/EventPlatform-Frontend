import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Search, Bell, Menu, X, LogOut, Settings,
  User, Shield, Building2, Plus,
  Bookmark, Ticket, CreditCard
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import Avatar from '../ui/Avatar'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { markRead, markAllRead, getNotificationsForUser } = useNotifications()
  const userNotifs = getNotificationsForUser(user)
  const unreadCount = userNotifs.filter(n => !n.read).length
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const profileRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { to: '/',       label: 'Home'   },
    { to: '/events', label: 'Events' },
    ...(user?.role === 'institution_admin' ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
    ...(user?.role === 'super_admin'       ? [{ to: '/admin',     label: 'Admin'     }] : []),
  ]

  const roleLabel = user?.role === 'super_admin'        ? 'Super Admin'
    : user?.role === 'institution_admin' ? 'Institution Admin'
    : 'Citizen'

  const roleColor = user?.role === 'super_admin'
    ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-[#3B5F82] bg-[#EDF4F9] border-[#C8D8E4]'

  const canPublish = user?.role === 'institution_admin' || user?.role === 'super_admin'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-sm" style={{ background: 'rgba(44,74,102,0.97)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(122,175,199,0.15)' }}>
      <div className="max-w-7xl px-4 sm:px-6 mx-auto">
        <div className="h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link to="/" className="shrink-0 group flex items-center gap-2.5">
            <svg width="30" height="30" viewBox="0 0 28 28" className="transition-transform duration-300 group-hover:scale-105">
              <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill="#2d4760" stroke="#7AAFC7" strokeWidth="1.5"/>
              <text x="14" y="18.5" textAnchor="middle" fontFamily="Helvetica,Arial,sans-serif" fontWeight="700" fontSize="12" fill="#fff">E</text>
            </svg>
            <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
              Eventim
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-5 text-sm font-semibold transition-colors ${
                  location.pathname === link.to
                    ? 'text-white after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-[#7AAFC7]'
                    : 'text-white/70 hover:text-white'
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
              className="hidden sm:flex rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              title="Search events"
            >
              <Search size={17} />
            </Link>

            {/* Publish button */}
            {canPublish && (
              <Link
                to="/publish"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#7AAFC7] hover:bg-white/20 px-4 py-2 text-sm font-bold text-white transition-all"
               
              >
                <Plus size={14} /> Publish
              </Link>
            )}

            {/* Notifications */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
                  className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7AAFC7] rounded-full ring-2 ring-[#3B5F82]" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#C8D8E4] rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-[#C8D8E4] flex items-center justify-between">
                      <span className="font-semibold text-[#1A2E3E] text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs font-semibold text-[#3B5F82] bg-[#EDF4F9] px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {userNotifs.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm font-medium text-[#1A2E3E]">No notifications</p>
                          <p className="text-xs text-[#8AABBD] mt-1">You're all caught up for now.</p>
                        </div>
                      ) : (
                        userNotifs.slice(0, 3).map(n => (
                          <div
                            key={n.id}
                            onClick={() => markRead(n.id)}
                            className={`px-4 py-3.5 border-b border-[#C8D8E4]/50 hover:bg-[#EDF4F9] cursor-pointer transition-colors last:border-0 ${!n.read ? 'bg-[#EDF4F9]/60' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-[#C8D8E4]' : 'bg-[#7AAFC7]'}`} />
                              <div>
                                <p className="text-sm font-semibold text-[#1A2E3E]">{n.title}</p>
                                <p className="text-xs text-[#4A6070] mt-0.5 leading-relaxed">{n.message}</p>
                                <p className="text-xs text-[#8AABBD] mt-1">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-3 border-t border-[#C8D8E4] flex items-center justify-between gap-3">
                      <button
                        onClick={markAllRead}
                        className="text-xs text-[#4A6070] hover:text-[#1A2E3E] font-medium"
                      >
                        Mark all as read
                      </button>
                      <button
                        onClick={() => { navigate('/notifications'); setNotifOpen(false) }}
                        className="text-xs text-[#7AAFC7] hover:text-[#3B5F82] font-semibold"
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
                  className="flex items-center px-1.5 py-1.5 rounded-full border border-transparent hover:bg-white/10 transition-colors"
                >
                  <Avatar initials={user.avatar} size="sm" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-[#C8D8E4] rounded-3xl shadow-xl overflow-hidden animate-fade-in">
                    <div className="px-5 py-5 border-b border-[#C8D8E4] bg-[#EDF4F9]">
                      <div className="flex items-center gap-3.5">
                        <Avatar initials={user.avatar} size="sm" />
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1A2E3E] text-sm truncate">{user.name}</p>
                          <p className="text-xs text-[#8AABBD] mt-0.5 truncate">{user.email}</p>
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
                          <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-[#8AABBD]">Your Events</p>
                        </div>
                        <div className="px-1.5 pb-2">
                          <button
                            onClick={() => { navigate('/saved-events'); setProfileOpen(false) }}
                            className="w-full text-left px-3 py-3 rounded-xl text-sm text-[#1A2E3E] hover:text-[#1A2E3E] hover:bg-[#EDF4F9] flex items-center gap-2.5 transition-colors"
                          >
                            <Bookmark size={14} className="text-[#7AAFC7]" /> Saved
                          </button>
                          <button
                            onClick={() => { navigate('/registered-events'); setProfileOpen(false) }}
                            className="w-full text-left px-3 py-3 rounded-xl text-sm text-[#1A2E3E] hover:bg-[#EDF4F9] flex items-center gap-2.5 transition-colors"
                          >
                            <Ticket size={14} className="text-[#7AAFC7]" /> Tickets
                          </button>
                          <button
                            onClick={() => { navigate('/subscriptions'); setProfileOpen(false) }}
                            className="w-full text-left px-3 py-3 rounded-xl text-sm text-[#1A2E3E] hover:bg-[#EDF4F9] flex items-center gap-2.5 transition-colors"
                          >
                            <CreditCard size={14} className="text-[#7AAFC7]" /> Following
                          </button>
                        </div>
                        <div className="mx-4 border-t border-[#C8D8E4]" />
                      </>
                    )}

                    <div className="px-3 pt-3 pb-1">
                      <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-[#8AABBD]">Account</p>
                    </div>
                    <div className="px-1.5 pb-2">
                      {user?.role !== 'citizen' && (
                        <button
                          onClick={() => { navigate('/profile'); setProfileOpen(false) }}
                          className="w-full text-left px-3 py-3 rounded-xl text-sm text-[#1A2E3E] hover:bg-[#EDF4F9] flex items-center gap-2.5 transition-colors"
                        >
                          <User size={14} className="text-[#7AAFC7]" /> Profile
                        </button>
                      )}
                      <button
                        onClick={() => { navigate('/settings'); setProfileOpen(false) }}
                        className="w-full text-left px-3 py-3 rounded-xl text-sm text-[#1A2E3E] hover:bg-[#EDF4F9] flex items-center gap-2.5 transition-colors"
                      >
                        <Settings size={14} className="text-[#7AAFC7]" /> Settings
                      </button>
                    </div>

                    <div className="p-1.5 border-t border-[#C8D8E4]">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); setNotifOpen(false); navigate('/') }}
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
                className="rounded-xl bg-[#7AAFC7] hover:bg-[#5C9AB5] px-5 py-2.5 text-sm font-bold text-white transition-all"
               
              >
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#3B5F82]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-white/15 text-white'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
               
              >
                {link.label}
              </Link>
            ))}
            {canPublish && (
              <Link
                to="/publish"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl bg-[#7AAFC7] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#5C9AB5]"
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
