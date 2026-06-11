import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Users, Calendar, MapPin, UserPlus, UserMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { eventService } from "@/services/eventService"
import type { Event } from "@/services/eventService"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

type InstitutionProfile = {
  id: string
  name: string
  institution: string
  bio: string | null
  profilePicture: string | null
  followerCount: number
}

export default function InstitutionProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<InstitutionProfile | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isTogglingFollow, setIsTogglingFollow] = useState(false)

  const isOwnProfile = user?.id === id

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return
      try {
        const profileData = await eventService.getInstitutionProfile(id)
        setProfile(profileData)
        if (profileData.institution) {
          const eventsData = await eventService.getPublicEvents({ institution: profileData.institution, take: 50 })
          setEvents(eventsData?.items || [])
        }
      } catch (error) {
        toast.error("Failed to load institution profile")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to follow institutions")
      return
    }
    if (!id) return
    setIsTogglingFollow(true)
    try {
      if (isFollowing) {
        await eventService.unfollowInstitution(id)
        setIsFollowing(false)
        setProfile(prev => prev ? { ...prev, followerCount: Math.max(0, prev.followerCount - 1) } : prev)
        toast.success("Unfollowed institution")
      } else {
        await eventService.followInstitution(id)
        setIsFollowing(true)
        setProfile(prev => prev ? { ...prev, followerCount: prev.followerCount + 1 } : prev)
        toast.success("Now following this institution")
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update follow status")
    } finally {
      setIsTogglingFollow(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Institution not found</p>
          <Button variant="link" asChild className="mt-2">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border border-border shrink-0">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground/40">
                {profile.name?.[0]?.toUpperCase() || "I"}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
            <p className="text-muted-foreground mb-3">{profile.institution}</p>
            {profile.bio && (
              <p className="text-sm text-muted-foreground/80 max-w-prose mb-4">{profile.bio}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {profile.followerCount} follower{profile.followerCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {events.length} event{events.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          {!isOwnProfile && (
            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={handleToggleFollow}
              disabled={isTogglingFollow}
            >
              {isTogglingFollow ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : isFollowing ? (
                <UserMinus className="w-4 h-4 mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-6">Events</h2>
          {events.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No events yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(event => (
                <Link key={event.id} to={`/events/${event.id}`}>
                  <Card className="border-border/40 hover:border-foreground/30 transition-colors p-4">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-3 text-[10px]"
                    >
                      {event.status}
                    </Badge>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
