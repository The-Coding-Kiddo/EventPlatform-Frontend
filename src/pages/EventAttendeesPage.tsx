import { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Users, 
  Search, 
  ArrowLeft, 
  QrCode, 
  CheckCircle, 
  UserPlus, 
  Loader2, 
  ShieldCheck, 
  Activity,
  Plus,
  Mail,
  Calendar,
  MapPin,
  Clock,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { eventService } from "@/services/eventService"
import type { Event } from "@/services/eventService"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

export default function EventAttendeesPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [event, setEvent] = useState<Event | null>(null)
  const [attendees, setAttendees] = useState<any[]>([])
  const [waitlist, setWaitlist] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [attendeeSearch, setAttendeeSearch] = useState("")
  const [activeTab, setActiveTab] = useState("registered")

  // Invite states
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteName, setInviteName] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  // Check-in states
  const [showCheckInScanner, setShowCheckInScanner] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [manualQrData, setManualQrData] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        const [eventData, allParticipants] = await Promise.all([
          eventService.getEventById(id),
          eventService.getAttendees(id)
        ])

        // PRIVILEGE CHECK: Ensure the admin has rights to this specific event
        if (user?.role !== 'super_admin') {
          if (eventData.institution !== user?.institution) {
            toast.error("Security Alert: You do not have permission to access this institution's data.")
            navigate("/institution/dashboard")
            return
          }
        }

        setEvent(eventData)
        
        // Filter participants into Registered and Waitlisted based on status
        // Default to 'registered' if no status is provided (legacy or simple implementation)
        const participants = Array.isArray(allParticipants) ? allParticipants : []
        const registered = participants.filter(p => !p.status || p.status === 'confirmed' || p.status === 'registered' || p.status === 'attended')
        const queued = participants.filter(p => p.status === 'waitlisted')
        
        setAttendees(registered)
        setWaitlist(queued)
      } catch (error) {
        toast.error("Failed to load event data or unauthorized access")
        navigate("/institution/dashboard")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, navigate, user])

  const filteredAttendees = useMemo(() => {
    return attendees.filter(a => 
      a.name?.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      a.email?.toLowerCase().includes(attendeeSearch.toLowerCase())
    )
  }, [attendees, attendeeSearch])

  const filteredWaitlist = useMemo(() => {
    return waitlist.filter(w => 
      w.name?.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      w.email?.toLowerCase().includes(attendeeSearch.toLowerCase())
    )
  }, [waitlist, attendeeSearch])

  const refreshRoster = async () => {
    if (!id) return
    try {
      const allParticipants = await eventService.getAttendees(id)
      const participants = Array.isArray(allParticipants) ? allParticipants : []
      
      const registered = participants.filter(p => !p.status || p.status === 'confirmed' || p.status === 'registered' || p.status === 'attended')
      const queued = participants.filter(p => p.status === 'waitlisted')
      
      setAttendees(registered)
      setWaitlist(queued)
      
      // Also refresh event to update total attendee count
      const eventData = await eventService.getEventById(id)
      setEvent(eventData)
    } catch (error) {
      console.error("Failed to refresh roster:", error)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !inviteEmail.trim()) return

    setIsInviting(true)
    try {
      await eventService.inviteAttendee(id, {
        email: inviteEmail.trim(),
        name: inviteName.trim() || undefined,
      })
      toast.success("Attendee successfully invited!")
      setInviteEmail("")
      setInviteName("")
      
      await refreshRoster()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to invite attendee")
    } finally {
      setIsInviting(false)
    }
  }

  const handleCheckIn = async (qrData?: string) => {
    if (!id) return
    setIsCheckingIn(true)
    try {
      await eventService.checkIn(id, qrData)
      toast.success("Check-in successful!")
      setShowCheckInScanner(false)
      setManualQrData("")
      
      await refreshRoster()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Check-in failed")
    } finally {
      setIsCheckingIn(false)
    }
  }

  const handleManualRosterCheckIn = async (attendeeId: string) => {
    if (!id) return
    setIsCheckingIn(true)
    try {
      const payload = btoa(JSON.stringify({ eventId: id, userId: attendeeId }))
      await eventService.checkIn(id, payload)
      toast.success("Check-in successful!")
      
      await refreshRoster()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Manual check-in failed")
    } finally {
      setIsCheckingIn(false)
    }
  }

  const handleRemoveParticipant = async (userId: string) => {
    if (!id) return
    
    const confirmRemoval = window.confirm("Are you sure you want to remove this participant? This will cancel their registration/waitlist spot.")
    if (!confirmRemoval) return

    try {
      await eventService.cancelRegistration(id, userId)
      toast.success("Participant successfully removed")
      await refreshRoster()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove participant")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!event) return null

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumbs / Back */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/institution/dashboard")} 
          className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {event.category}
              </Badge>
              <Badge variant="outline">
                {event.status}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString()} at {event.time}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {event.venue}, {event.location}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
              onClick={() => setShowCheckInScanner(true)}
            >
              <QrCode className="w-5 h-5 mr-2" />
              Scanner Console
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Attendee List with Tabs */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass border-white/10 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <CardHeader className="border-b border-white/5 bg-white/5 p-0">
                  <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">Event Roster</CardTitle>
                    </div>
                  </div>
                  <TabsList className="bg-transparent border-none px-6 h-12">
                    <TabsTrigger 
                      value="registered" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-12"
                    >
                      Registered ({attendees.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="waitlist" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-12"
                    >
                      Waitlist ({waitlist.length})
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="p-4 border-b border-white/5 bg-white/5 flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder={activeTab === 'registered' ? "Search registered citizens..." : "Search waitlist queue..."}
                        value={attendeeSearch}
                        onChange={(e) => setAttendeeSearch(e.target.value)}
                        className="pl-9 bg-background/50 border-white/10"
                      />
                    </div>
                  </div>

                  <TabsContent value="registered" className="m-0">
                    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                      {filteredAttendees.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                          <Users className="w-12 h-12 mx-auto mb-4 opacity-10" />
                          <p>No registered attendees found.</p>
                        </div>
                      ) : (
                        filteredAttendees.map((attendee) => (
                          <div key={attendee.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center border border-white/10 relative">
                                <span className="text-sm font-bold text-primary">
                                  {attendee.name?.substring(0, 1).toUpperCase() || "?"}
                                </span>
                                {attendee.checkedIn && (
                                  <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-white/10">
                                    <CheckCircle className="w-3 h-3 text-green-500 fill-green-500/20" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold text-sm">{attendee.name}</div>
                                  {attendee.checkedIn && (
                                    <Badge className="h-4 text-[9px] bg-green-500/10 text-green-500 border-green-500/20 px-1.5 uppercase font-bold">In</Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {attendee.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-[10px] text-muted-foreground hidden sm:block font-mono">
                                {new Date(attendee.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className={`h-8 rounded-full border-white/10 transition-all ${
                                    attendee.checkedIn 
                                      ? "bg-green-500/10 text-green-500 border-green-500/20 cursor-default" 
                                      : "hover:bg-primary/20 hover:text-primary"
                                  }`}
                                  onClick={() => !attendee.checkedIn && handleManualRosterCheckIn(attendee.id)}
                                  disabled={isCheckingIn || attendee.checkedIn}
                                >
                                  {attendee.checkedIn ? (
                                    <><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Checked In</>
                                  ) : isCheckingIn ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                      Check In
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-0"
                                  onClick={() => handleRemoveParticipant(attendee.id)}
                                  title="Remove Registration"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="waitlist" className="m-0">
                    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                      {filteredWaitlist.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                          <Clock className="w-12 h-12 mx-auto mb-4 opacity-10" />
                          <p>The waitlist queue is currently empty.</p>
                        </div>
                      ) : (
                        filteredWaitlist.map((citizen) => (
                          <div key={citizen.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-white/10">
                                <span className="text-sm font-bold text-amber-500">
                                  {citizen.name?.substring(0, 1).toUpperCase() || "?"}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-sm">{citizen.name}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {citizen.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5">
                                Waitlisted
                              </Badge>
                              <div className="text-[10px] text-muted-foreground hidden sm:block font-mono">
                                Joined: {new Date(citizen.createdAt).toLocaleDateString()}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveParticipant(citizen.id)}
                                title="Remove from Waitlist"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar: Stats & Invitation */}
          <div className="space-y-6">
            <Card className="glass border-white/10 overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-primary" />
                  Invite Citizen
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest pl-1">Full Name</label>
                    <Input 
                      placeholder="John Doe"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      className="bg-white/5 border-white/10 text-sm h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest pl-1 text-primary">Email Address</label>
                    <Input 
                      type="email"
                      placeholder="john@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="bg-white/5 border-white/10 text-sm h-11"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isInviting} className="w-full h-11 font-bold">
                    {isInviting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Send Invitation
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-1">
                    {Math.round((event.attendees / event.capacity) * 100)}%
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Occupancy Rate</div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                    className="h-full bg-gradient-to-r from-primary to-blue-500 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{event.attendees} Registered</span>
                  <span>{event.capacity} Capacity</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Check-In / Scanner Console Dialog (Simplified & Professional) */}
      <Dialog open={showCheckInScanner} onOpenChange={setShowCheckInScanner}>
          <DialogContent className="bg-background border-border text-foreground max-w-md p-0 overflow-hidden shadow-2xl">
            <div className="bg-muted p-6 border-b border-border">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Scanner Console
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mt-1">
                  Verifying for: {event.title}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-6 space-y-6">
              <div className="relative aspect-square bg-muted/50 rounded-2xl overflow-hidden border border-border flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Waiting for input...</p>
                  <p className="text-xs text-muted-foreground">Position ticket QR within the frame</p>
                </div>
                
                {/* Minimalist Scanning Frame */}
                <div className="absolute inset-16 border border-primary/30 rounded-xl">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary -translate-x-[1px] -translate-y-[1px]" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary translate-x-[1px] -translate-y-[1px]" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary -translate-x-[1px] translate-y-[1px]" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary translate-x-[1px] translate-y-[1px]" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Manual Entry</label>
                  <Input 
                    placeholder="Enter Ticket Code or Paste Payload..."
                    value={manualQrData}
                    onChange={(e) => setManualQrData(e.target.value)}
                    className="bg-background border-border font-mono text-xs h-11 focus-visible:ring-primary"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 font-semibold text-xs uppercase tracking-wider"
                    onClick={() => handleCheckIn()}
                    disabled={isCheckingIn}
                  >
                    Staff Override
                  </Button>
                  <Button 
                    className="flex-1 h-11 font-semibold text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    onClick={() => handleCheckIn(manualQrData)}
                    disabled={isCheckingIn || !manualQrData}
                  >
                    {isCheckingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Verify Ticket"
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-muted/30 p-4 border-t border-border flex justify-center">
              <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3 h-3" />
                SECURE AUTHENTICATION ACTIVE
              </p>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  )
}
