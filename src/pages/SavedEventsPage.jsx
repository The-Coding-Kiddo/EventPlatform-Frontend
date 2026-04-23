import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import EventCard from '../components/events/EventCard'

export default function SavedEventsPage() {
  const { user, toggleSavedEvent } = useAuth()
  const { events } = useEvents()

  const savedEvents = events.filter(event => user?.savedEvents?.includes(event.id))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Events</h1>
        <p className="mt-2 text-gray-600">
          View all the events you bookmarked in one place.
        </p>
      </div>

      {savedEvents.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">No saved events yet</h2>
          <p className="mt-2 text-gray-600">
            Start exploring events and save the ones you want to come back to later.
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
          {savedEvents.map(event => (
            <div key={event.id} className="space-y-3">
              <EventCard event={event} />
              <button
                onClick={() => toggleSavedEvent(event.id)}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Remove from Saved
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}