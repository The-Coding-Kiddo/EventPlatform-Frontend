import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Calendar, Users, Activity, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { eventService } from "@/services/eventService"
import type { Event } from "@/services/eventService"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (user?.role === "super_admin") {
      setActiveTab("moderation")
    } else {
      setActiveTab("all")
    }
  }, [user])

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const data = await eventService.getAllEvents()
        setEvents(data?.data?.items || data?.items || [])
      } catch (error) {
        toast.error("Failed to fetch admin events")
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllEvents()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await eventService.updateEvent(id, { status })
      setEvents(events.map(e => e.id === id ? { ...e, status: status as Event['status'] } : e))
      toast.success(`Event marked as ${status}`)
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const pendingEvents = events.filter(e => e.status === "pending")
  const approvedEvents = events.filter(e => e.status === "approved")
  const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0)

  const isSuperAdmin = user?.role === "super_admin"

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            {isSuperAdmin ? "Super Admin Dashboard" : "Institution Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSuperAdmin 
              ? "Manage platform-wide events, moderation, and users." 
              : `Manage events for ${user?.institution || "your institution"}.`} 
            {" "}Role: {user?.role?.toUpperCase()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isSuperAdmin ? "Total Platform Events" : "Our Events"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card className="glass border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">{pendingEvents.length}</div>
            </CardContent>
          </Card>
          <Card className="glass border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isSuperAdmin ? "Approved Events" : "Total Attendees"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {isSuperAdmin ? approvedEvents.length : totalAttendees}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass mb-6">
            {isSuperAdmin && (
              <TabsTrigger value="moderation">Event Moderation</TabsTrigger>
            )}
            <TabsTrigger value="all">
              {isSuperAdmin ? "All Events" : "My Events"}
            </TabsTrigger>
            {isSuperAdmin && (
              <TabsTrigger value="users">Users</TabsTrigger>
            )}
          </TabsList>

          {isSuperAdmin && (
            <TabsContent value="moderation" className="space-y-4">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle>Pending Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-32 animate-pulse bg-white/5 rounded-lg"></div>
                  ) : pendingEvents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50 text-green-500" />
                      All caught up! No pending events to moderate.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingEvents.map(event => (
                        <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 gap-4">
                          <div>
                            <h4 className="font-bold">{event.title}</h4>
                            <div className="text-sm text-muted-foreground flex gap-4 mt-1">
                              <span>{event.institution}</span>
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-green-500/50 hover:bg-green-500/10 text-green-500" onClick={() => handleUpdateStatus(event.id, "approved")}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/50 hover:bg-red-500/10 text-red-500" onClick={() => handleUpdateStatus(event.id, "rejected")}>
                              <XCircle className="w-4 h-4 mr-2" /> Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="all">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle>
                  {isSuperAdmin ? "All Platform Events" : "My Institution Events"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No events found.
                    </div>
                  ) : (
                    events.map(event => (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">{event.institution}</p>
                        </div>
                        <Badge variant={
                          event.status === "approved" ? "default" :
                          event.status === "pending" ? "outline" :
                          event.status === "rejected" ? "destructive" : "secondary"
                        }>
                          {event.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {isSuperAdmin && (
            <TabsContent value="users">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">User management endpoints would be connected here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
