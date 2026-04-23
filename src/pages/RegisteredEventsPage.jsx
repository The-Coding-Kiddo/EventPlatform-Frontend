import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import EventCard from '../components/events/EventCard'

export default function RegisteredEventsPage() {
  const { user } = useAuth()
  const { events } = useEvents()

  const registeredEvents = events.filter(event => user?.registeredEvents?.includes(event.id))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Registered Events</h1>
        <p className="mt-2 text-gray-600">
          Here are the events you have registered for.
        </p>
      </div>

      {registeredEvents.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">No registered events</h2>
          <p className="mt-2 text-gray-600">
            You haven’t registered for any events yet.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center justify-center mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {registeredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}