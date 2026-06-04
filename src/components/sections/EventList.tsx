import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { eventService } from "@/services/eventService"
import type { Event } from "@/services/eventService"
import { Link } from "react-router-dom"

type EventListProps = {
  showPastEvents?: boolean
}

type EventsResponse =
  | Event[]
  | {
      items?: Event[]
      data?: Event[] | { items?: Event[]; data?: Event[] | { items?: Event[] } }
    }

function extractEvents(response: EventsResponse | null): Event[] {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.items)) return response.items
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.items)) return response.data.items
  if (Array.isArray(response?.data?.data)) return response.data.data
  if (Array.isArray(response?.data?.data?.items)) return response.data.data.items
  return []
}

function getEventDateTime(event: Event) {
  const datePart = event.date?.slice(0, 10)
  const timePart = event.time || "23:59"
  const eventDate = new Date(`${datePart}T${timePart}`)
  return Number.isNaN(eventDate.getTime()) ? new Date(event.date) : eventDate
}

function isPastEvent(event: Event) {
  const eventTime = getEventDateTime(event).getTime()
  return Number.isNaN(eventTime) ? false : eventTime < Date.now()
}

function EventCard({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/events/${event.id}`}>
        <Card className="glass h-full flex flex-col border-white/20 hover:shadow-2xl transition-all duration-500 group overflow-hidden cursor-pointer">
          <CardHeader className="p-0 relative h-48 overflow-hidden">
            <img
              src={event.image || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=60"}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md">
              {event.category}
            </Badge>
          </CardHeader>
          <CardContent className="p-6 flex-grow">
            <div className="flex items-center gap-2 text-xs text-primary font-medium mb-3">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <h3 className="text-xl font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {event.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {event.venue || event.location}
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex items-center justify-between">
            <div className="text-lg font-bold">
              {event.price === 0 ? "Free" : `$${event.price}`}
            </div>
            <Button size="sm" className="rounded-full px-6">
              Details
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}

export function EventList({ showPastEvents = false }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getPublicEvents()
        const allEvents = extractEvents(response)
        const upcomingEvents = allEvents.filter((event) => !isPastEvent(event))

        if (!showPastEvents && upcomingEvents.length === 0) {
          setEvents(allEvents)
          setPastEvents([])
          return
        }

        setEvents(upcomingEvents)
        setPastEvents(showPastEvents ? allEvents.filter(isPastEvent) : [])
      } catch (error) {
        console.error("Failed to fetch events:", error)
        setEvents([])
        setPastEvents([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [showPastEvents])

  return (
    <section id="events" className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Upcoming Events</h2>
            <p className="text-muted-foreground leading-relaxed">
              Discover and join the most exciting events happening near you.
            </p>
          </div>
          <Button variant="ghost" className="group">
            View all events
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[400px] rounded-3xl bg-muted animate-pulse" />
            ))
          ) : events.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No events available right now. Check back later!
            </div>
          ) : (
            events.map((event, index) => <EventCard key={event.id} event={event} index={index} />)
          )}
        </div>

        {showPastEvents && pastEvents.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Past Events</h2>
              <p className="text-muted-foreground leading-relaxed">
                Browse events that have already taken place.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80">
              {pastEvents.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
