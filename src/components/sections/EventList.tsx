import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, ArrowRight, Search, X, ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { eventService } from "@/services/eventService"
import type { Event } from "@/services/eventService"
import { Link } from "react-router-dom"

type EventListProps = {
  showPastEvents?: boolean
  initialLimit?: number
}

type EventsResponse =
  | Event[]
  | {
      items?: Event[]
      data?: Event[] | { items?: Event[]; data?: Event[] | { items?: Event[] } }
    }

function extractEvents(response: EventsResponse | null): Event[] {
  if (!response) return []
  if (Array.isArray(response)) return response

  const data = (response as any).data || response
  if (Array.isArray(data)) return data
  if (Array.isArray(data.items)) return data.items
  if (Array.isArray(data.data)) return data.data
  if (data.data && Array.isArray(data.data.items)) return data.data.items
  if (Array.isArray((response as any).items)) return (response as any).items

  return []
}

function getEventDateTime(event: Event) {
  if (!event.date) return new Date()
  const datePart = typeof event.date === 'string' ? event.date.slice(0, 10) : ""
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
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/events/${event.id}`}>
        <Card className="h-full flex flex-col border-border hover:border-foreground/30 transition-colors overflow-hidden cursor-pointer bg-transparent">
          <div className="relative h-48 overflow-hidden border-b border-border">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <div className="text-center">
                  <ImageOff className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-[10px] text-muted-foreground/30 uppercase tracking-wider font-medium">No image</p>
                </div>
              </div>
            )}
            <Badge className="absolute top-3 right-3 bg-background text-foreground border-border rounded-md">
              {event.category}
            </Badge>
            {isPastEvent(event) && (
              <Badge variant="secondary" className="absolute top-3 left-3 bg-muted text-muted-foreground border-border rounded-md">
                Past Event
              </Badge>
            )}
          </div>
          <CardContent className="p-5 flex-grow">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-snug">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {event.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{event.venue || event.location}</span>
            </div>
          </CardContent>
          <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Entry</span>
              <div className="text-base font-bold">
                {event.price === 0 ? "Free" : `$${event.price}`}
              </div>
            </div>
            <Button size="sm" variant="outline" className="rounded-md border-border text-xs">
              Details
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}

const CATEGORIES = ["All", "Technology", "Education", "Art", "Music", "Food", "Sports", "Other"]

export function EventList({ showPastEvents = false, initialLimit }: EventListProps) {
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [limit, setLimit] = useState(initialLimit || 9)

  const fetchEvents = async () => {
    try {
      const response = await eventService.getPublicEvents()
      const extracted = extractEvents(response)
      setAllEvents(extracted)
    } catch (error) {
      console.error("Failed to fetch events:", error)
      setAllEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesCategory = activeCategory === "All" || event.category === activeCategory
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())

      const isPast = isPastEvent(event)
      const matchesPastFilter = showPastEvents ? true : !isPast

      return matchesCategory && matchesSearch && matchesPastFilter
    })
  }, [allEvents, activeCategory, searchQuery, showPastEvents])

  const displayedEvents = filteredEvents.slice(0, limit)

  return (
    <section id="events" className="py-20 lg:py-28 bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-border rounded text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              <span className="w-1 h-1 rounded-full bg-primary" />
              Live Events
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
              Discover What's Coming Next
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Explore workshops, conferences, and festivals curated just for you.
            </p>
          </div>
          <Link to="/events">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">
              Browse all events
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="mb-10 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-md px-4 text-xs ${
                    activeCategory === cat
                      ? ""
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events, topics, locations..."
                className="pl-10 h-10 bg-transparent border-border rounded-md text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[420px] rounded-lg bg-muted animate-pulse border border-border" />
            ))
          ) : displayedEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center border border-dashed border-border rounded-lg"
            >
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-5">
                  <Search className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-bold mb-2">No events found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We couldn't find any events matching your current filters. Try broadening your search.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveCategory("All")
                    setSearchQuery("")
                  }}
                  className="border-border text-sm"
                >
                  Reset all filters
                </Button>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {displayedEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {!isLoading && filteredEvents.length > displayedEvents.length && (
          <div className="mt-12 text-center">
            <Button
              onClick={() => setLimit(prev => prev + 6)}
              variant="outline"
              className="border-border text-sm"
            >
              Load More Events
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
