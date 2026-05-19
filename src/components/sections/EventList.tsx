import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { eventService } from "@/services/eventService"
import type { Event } from "@/services/eventService"
import { Link } from "react-router-dom"

export function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getPublicEvents()
        setEvents(response?.data?.items || response?.items || [])
      } catch (error) {
        console.error("Failed to fetch events:", error)
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvents()
  }, [])

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
            events.map((event, index) => (
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
            ))
          )}
        </div>
      </div>
    </section>
  )
}
