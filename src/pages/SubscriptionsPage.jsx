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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscribed Categories</h1>
        <p className="mt-2 text-gray-600">
          Follow categories you care about and browse the latest events in each one.
        </p>
      </div>

      {subscribedEvents.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">No subscriptions yet</h2>
          <p className="mt-2 text-gray-600">
            Subscribe to categories to receive updates and discover matching events here.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center justify-center mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedSubscriptions.map(({ category, events }) => (
            <section key={category} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                    {category}
                  </span>
                  <h2 className="mt-3 text-xl font-bold text-gray-900">
                    {category} events
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {events.length} event{events.length === 1 ? '' : 's'} currently available in this category.
                  </p>
                </div>

                <button
                  onClick={() => toggleSubscription(category)}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Unfollow category
                </button>
              </div>

              {events.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
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
  )
}