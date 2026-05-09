import { Bell, Check, CheckCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'

const TYPE_STYLES = {
  event_approved: { dot: 'bg-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  event_rejected: { dot: 'bg-red-400',     bg: 'bg-red-50',     text: 'text-red-700'     },
  new_event:      { dot: 'bg-[#7AAFC7]',   bg: 'bg-[#EDF4F9]',  text: 'text-[#3B5F82]'  },
}

function typeStyle(type) {
  return TYPE_STYLES[type] ?? { dot: 'bg-[#C8D8E4]', bg: 'bg-[#EDF4F9]', text: 'text-[#4A6070]' }
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const { markRead, markAllRead, getNotificationsForUser } = useNotifications()

  const notifs = getNotificationsForUser(user)
  const unread = notifs.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-[#EDF4F9] px-4 pt-28 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1A2E3E]">Notifications</h1>
            {unread > 0 && (
              <p className="mt-1 text-sm text-[#4A6070]">{unread} unread</p>
            )}
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 rounded-xl border border-[#C8D8E4] bg-white px-4 py-2 text-sm font-medium text-[#4A6070] transition hover:border-[#7AAFC7] hover:text-[#3B5F82]"
            >
              <CheckCheck size={15} /> Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        {notifs.length === 0 ? (
          <div className="rounded-2xl border border-[#C8D8E4] bg-white p-12 text-center" style={{ boxShadow: '0 2px 8px rgba(59,95,130,0.08)' }}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF4F9] text-[#7AAFC7]">
              <Bell size={26} />
            </div>
            <p className="font-semibold text-[#1A2E3E]">You're all caught up</p>
            <p className="mt-1 text-sm text-[#8AABBD]">New notifications will appear here.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#C8D8E4] bg-white" style={{ boxShadow: '0 2px 8px rgba(59,95,130,0.08)' }}>
            {notifs.map((n, i) => {
              const s = typeStyle(n.type)
              return (
                <div
                  key={n.id}
                  onClick={() => !n.read && markRead(n.id)}
                  className={`flex cursor-pointer items-start gap-4 px-5 py-4 transition-colors hover:bg-[#EDF4F9] ${
                    !n.read ? 'bg-[#EDF4F9]/60' : 'bg-white'
                  } ${i < notifs.length - 1 ? 'border-b border-[#C8D8E4]/60' : ''}`}
                >
                  {/* Type dot */}
                  <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? 'bg-[#C8D8E4]' : s.dot}`} />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className={`text-sm font-semibold ${n.read ? 'text-[#4A6070]' : 'text-[#1A2E3E]'}`}>
                        {n.title}
                      </p>
                      <span className="shrink-0 text-xs text-[#8AABBD]">{n.time}</span>
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-[#4A6070]">{n.message}</p>
                  </div>

                  {/* Mark read button */}
                  {!n.read && (
                    <button
                      onClick={e => { e.stopPropagation(); markRead(n.id) }}
                      title="Mark as read"
                      className="mt-0.5 shrink-0 rounded-lg p-1.5 text-[#8AABBD] transition hover:bg-[#C8D8E4] hover:text-[#3B5F82]"
                    >
                      <Check size={13} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
