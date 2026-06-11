import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Tag, User, Bookmark, Settings, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import { eventService } from "@/services/eventService"
import type { Event } from "@/services/eventService"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user } = useAuth()
  const [savedEvents, setSavedEvents] = useState<Event[]>([])
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([])
  const [waitlistedEvents, setWaitlistedEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }
      try {
        // Fetch only the specific events the user has saved / registered / waitlisted for
        const savedIds = user.savedEvents || []
        const registeredIds = user.registeredEvents || []
        const waitlistedIds = user.waitlistedEvents || []

        const [savedResults, registeredResults, waitlistedResults] = await Promise.all([
          Promise.all(savedIds.map((id) => eventService.getEventById(id).catch(() => null))),
          Promise.all(registeredIds.map((id) => eventService.getEventById(id).catch(() => null))),
          Promise.all(waitlistedIds.map((id) => eventService.getEventById(id).catch(() => null))),
        ])

        setSavedEvents(savedResults.filter(Boolean) as Event[])
        setRegisteredEvents(registeredResults.filter(Boolean) as Event[])
        setWaitlistedEvents(waitlistedResults.filter(Boolean) as Event[])
      } catch (error) {
        toast.error("Failed to load your events")
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserEvents()
  }, [user])

  const EventCardList = ({ events }: { events: Event[] }) => {
    if (events.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground glass rounded-2xl">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No events found.</p>
          <Button variant="link" asChild className="mt-2">
            <Link to="/">Discover Events</Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/events/${event.id}`}>
              <Card className="glass hover:bg-white/5 transition-colors border-white/10 overflow-hidden group">
                <div className="flex h-32">
                  <div className="w-32 shrink-0 relative">
                    <img 
                      src={event.image || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&q=80"} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-center flex-grow">
                    <h4 className="font-bold line-clamp-1 mb-1 group-hover:text-primary transition-colors">{event.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {event.venue}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
              <span className="text-3xl font-bold text-primary">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/20">
                  {user?.role?.replace('_', ' ').toUpperCase()}
                </Badge>
                {user?.institution && (
                  <Badge variant="outline" className="bg-secondary/10 border-secondary/20">
                    {user.institution}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" className="glass border-white/20">
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <Tabs defaultValue="registered" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-[500px] mb-8 glass">
            <TabsTrigger value="registered">Registered</TabsTrigger>
            <TabsTrigger value="waitlisted">Waitlisted</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registered" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Confirmed Tickets
              </h3>
            </div>
            {isLoading ? (
              <div className="h-32 glass rounded-2xl animate-pulse"></div>
            ) : (
              <EventCardList events={registeredEvents} />
            )}
          </TabsContent>

          <TabsContent value="waitlisted" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                Waitlist Queue
              </h3>
            </div>
            {isLoading ? (
              <div className="h-32 glass rounded-2xl animate-pulse"></div>
            ) : (
              <EventCardList events={waitlistedEvents} />
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-primary" />
                Saved for Later
              </h3>
            </div>
            {isLoading ? (
              <div className="h-32 glass rounded-2xl animate-pulse"></div>
            ) : (
              <EventCardList events={savedEvents} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
