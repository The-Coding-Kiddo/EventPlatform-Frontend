import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import EventCard from '../components/events/EventCard'

export default function RegisteredEventsPage() {
  const { user } = useAuth()
  const { events } = useEvents()

  const registeredEvents = events.filter(event => user?.registeredEvents?.includes(event.id))

  return (
    <div className="min-h-screen bg-[#EDF4F9] px-4 pt-28 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A2E3E]">Registered Events</h1>
          <p className="mt-2 text-[#4A6070]">
            Here are the events you have registered for.
          </p>
        </div>

        {registeredEvents.length === 0 ? (
          <div className="bg-white border border-[#C8D8E4] rounded-2xl p-8 text-center shadow-sm" style={{ boxShadow: '0 2px 8px rgba(59,95,130,0.08)' }}>
            <h2 className="text-xl font-semibold text-[#1A2E3E]">No registered events</h2>
            <p className="mt-2 text-[#4A6070]">
              You haven't registered for any events yet.
            </p>
            <Link
              to="/events"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#7AAFC7] hover:bg-[#3B5F82] px-5 py-2.5 font-semibold text-white transition"
             
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
    </div>
  )
}
