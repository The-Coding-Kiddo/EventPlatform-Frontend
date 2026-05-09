import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import EventCard from '../components/events/EventCard'

export default function SubscriptionsPage() {
  const { user, toggleSubscription } = useAuth()
  const { events } = useEvents()

  const subscribedEvents = events.filter(event => user?.subscriptions?.includes(event.category))
  const subscribedCategories = user?.subscriptions || []
  const groupedSubscriptions = subscribedCategories.map(category => ({
    category,
    events: subscribedEvents.filter(event => event.category === category),
  }))

  return (
    <div className="min-h-screen bg-[#EDF4F9] px-4 pt-28 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A2E3E]">Subscribed Categories</h1>
          <p className="mt-2 text-[#4A6070]">
            Follow categories you care about and browse the latest events in each one.
          </p>
        </div>

        {subscribedEvents.length === 0 ? (
          <div className="rounded-2xl border border-[#C8D8E4] bg-white p-8 text-center shadow-sm" style={{ boxShadow: '0 2px 8px rgba(59,95,130,0.08)' }}>
            <h2 className="text-xl font-semibold text-[#1A2E3E]">No subscriptions yet</h2>
            <p className="mt-2 text-[#4A6070]">
              Subscribe to categories to receive updates and discover matching events here.
            </p>
            <Link
              to="/events"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#7AAFC7] hover:bg-[#3B5F82] px-5 py-2.5 font-semibold text-white transition"
             
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedSubscriptions.map(({ category, events }) => (
              <section key={category} className="rounded-3xl border border-[#C8D8E4] bg-white p-5 shadow-sm sm:p-6" style={{ boxShadow: '0 2px 8px rgba(59,95,130,0.08)' }}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="inline-flex items-center rounded-full border border-[#7AAFC7] px-3 py-1 text-xs font-semibold text-[#3B5F82]" style={{ background: 'rgba(122,175,199,0.15)' }}>
                      {category}
                    </span>
                    <h2 className="mt-3 text-xl font-bold text-[#1A2E3E]">
                      {category} events
                    </h2>
                    <p className="mt-1 text-sm text-[#4A6070]">
                      {events.length} event{events.length === 1 ? '' : 's'} currently available in this category.
                    </p>
                  </div>

                  <button
                    onClick={() => toggleSubscription(category)}
                    className="inline-flex items-center justify-center rounded-xl border border-[#C8D8E4] px-4 py-2 text-sm font-medium text-[#4A6070] transition-colors hover:border-[#7AAFC7] hover:bg-[#EDF4F9] hover:text-[#3B5F82]"
                   
                  >
                    Unfollow category
                  </button>
                </div>

                {events.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-dashed border-[#C8D8E4] bg-[#EDF4F9]/40 p-6 text-sm text-[#4A6070]">
                    No events are available in this category right now.
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {events.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
