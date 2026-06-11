import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, ArrowRight, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
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
  
  // Try to find items in nested structure
  const data = (response as any).data || response
  if (Array.isArray(data)) return data
  if (Array.isArray(data.items)) return data.items
  if (Array.isArray(data.data)) return data.data
  if (data.data && Array.isArray(data.data.items)) return data.data.items
  
  // Fallback for some common backend wrappers
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/events/${event.id}`}>
        <Card className="glass h-full flex flex-col border-white/10 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 group overflow-hidden cursor-pointer">
          <CardHeader className="p-0 relative h-52 overflow-hidden">
            <img
              src={event.image || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=60"}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md shadow-lg border-0">
              {event.category}
            </Badge>
            {isPastEvent(event) && (
              <Badge variant="secondary" className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white border-0">
                Past Event
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-6 flex-grow">
            <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed opacity-80">
              {event.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="truncate">{event.venue || event.location}</span>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Entry</span>
              <div className="text-lg font-bold text-foreground">
                {event.price === 0 ? "Free" : `$${event.price}`}
              </div>
            </div>
            <Button size="sm" className="rounded-full px-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white transition-all duration-300">
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
    <section id="events" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 border-primary/20 text-primary inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Events
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Discover What's Coming Next
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explore workshops, conferences, and festivals curated just for you.
            </p>
          </div>
          <Link to="/events">
            <Button variant="ghost" className="group text-primary hover:bg-primary/5">
              Browse all events
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="mb-12 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-5 transition-all ${
                    activeCategory === cat 
                      ? "shadow-lg shadow-primary/20 scale-105" 
                      : "border-white/10 hover:border-primary/50"
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
                className="pl-10 h-11 bg-white/5 border-white/10 focus-visible:ring-primary rounded-xl"
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

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[450px] rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            ))
          ) : displayedEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center glass rounded-3xl border border-dashed border-white/10"
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-primary opacity-40" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-8">
                  We couldn't find any events matching your current filters. Try broadening your search.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActiveCategory("All")
                    setSearchQuery("")
                  }}
                  className="rounded-full border-white/10"
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
          <div className="mt-16 text-center">
            <Button 
              size="lg" 
              onClick={() => setLimit(prev => prev + 6)}
              className="rounded-full px-10 h-12 shadow-xl shadow-primary/20"
            >
              Load More Events
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

