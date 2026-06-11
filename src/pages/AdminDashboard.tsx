import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  UserPlus,
  Search,
  Ban,
  UserCheck,
  ExternalLink,
  Calendar,
  Building2,
  Hourglass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { eventService } from "@/services/eventService"
import type { Event } from "@/services/eventService"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

type PlatformUser = {
  id: string
  name: string
  email: string
  role: string
  institution?: string
  suspended: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<"events" | "people">("events")

  const [analytics, setAnalytics] = useState<any>(null)

  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null)

  const [showProvisionDialog, setShowProvisionDialog] = useState(false)
  const [provisionForm, setProvisionForm] = useState({ name: '', email: '', password: '', institution: '' })
  const [isProvisioning, setIsProvisioning] = useState(false)

  const isSuperAdmin = user?.role === "super_admin"

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

  useEffect(() => {
    if (isSuperAdmin) {
      eventService.getAnalytics().then(setAnalytics).catch(() => {})
    }
  }, [isSuperAdmin])

  useEffect(() => {
    if (isSuperAdmin && view === "people" && platformUsers.length === 0) {
      const fetchUsers = async () => {
        setIsUsersLoading(true)
        try {
          const data = await eventService.getUsers({ take: 100 })
          setPlatformUsers(data?.items || data || [])
        } catch (error) {
          toast.error("Failed to load users")
        } finally {
          setIsUsersLoading(false)
        }
      }
      fetchUsers()
    }
  }, [isSuperAdmin, view])

  const handleToggleSuspend = async (u: PlatformUser) => {
    setTogglingUserId(u.id)
    const newStatus = u.suspended ? 'active' : 'suspended'
    try {
      await eventService.updateUserStatus(u.id, newStatus)
      setPlatformUsers(prev =>
        prev.map(p => p.id === u.id ? { ...p, suspended: !p.suspended } : p)
      )
      toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'reactivated'} successfully`)
    } catch (error) {
      toast.error("Failed to update user status")
    } finally {
      setTogglingUserId(null)
    }
  }

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = provisionForm.name.trim()
    const email = provisionForm.email.trim().toLowerCase()
    const password = provisionForm.password
    const institution = provisionForm.institution.trim()
    if (!name || !email || !password || !institution) {
      toast.error("All fields are required")
      return
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    setIsProvisioning(true)
    try {
      const result = await eventService.provisionAdmin({ name, email, password, institution })
      toast.success(`Institution Admin created for ${institution}!`)
      setShowProvisionDialog(false)
      setProvisionForm({ name: '', email: '', password: '', institution: '' })
      if (result?.user) {
        setPlatformUsers(prev => [{
          suspended: false,
          createdAt: new Date().toISOString(),
          ...result.user,
        }, ...prev])
        setRoleFilter('institution_admin')
      } else {
        setPlatformUsers([])
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create institution admin")
    } finally {
      setIsProvisioning(false)
    }
  }

  const filteredUsers = useMemo(() => {
    return platformUsers.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.institution || '').toLowerCase().includes(userSearch.toLowerCase())
      const matchesRole = roleFilter === 'all' || u.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [platformUsers, userSearch, roleFilter])

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

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {isSuperAdmin
                  ? "Platform-wide overview"
                  : user?.institution || "Your institution"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border/40">
            <CardHeader className="pb-1.5">
              <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide">
                {isSuperAdmin ? "Events" : "My events"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/40">
            <CardHeader className="pb-1.5">
              <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{pendingEvents.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/40">
            <CardHeader className="pb-1.5">
              <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                {isSuperAdmin ? approvedEvents.length : approvedEvents.length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/40">
            <CardHeader className="pb-1.5">
              <CardTitle className="text-xs font-medium text-muted-foreground tracking-wide">
                {isSuperAdmin ? "Users" : "Attendees"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isSuperAdmin ? ((analytics?.totalUsers ?? platformUsers.length) || "—") : totalAttendees}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending moderation alert — super admin only */}
        {isSuperAdmin && pendingEvents.length > 0 && (
          <Card className="mb-8 border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Hourglass className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-1">
                  {pendingEvents.length} event{pendingEvents.length > 1 ? "s" : ""} pending review
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {pendingEvents.slice(0, 3).map(e => (
                    <span key={e.id} className="truncate max-w-[200px]">{e.title}</span>
                  ))}
                  {pendingEvents.length > 3 && (
                    <span className="text-muted-foreground/60">+{pendingEvents.length - 3} more</span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                onClick={() => setView("events")}
              >
                Review
              </Button>
            </CardContent>
          </Card>
        )}

        {/* View toggle */}
        <div className="flex items-center gap-1 mb-6 p-0.5 bg-muted/50 rounded-lg w-fit">
          <button
            onClick={() => setView("events")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              view === "events" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Events
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setView("people")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                view === "people" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              People
            </button>
          )}
        </div>

        {/* ── Events view ── */}
        {view === "events" && (
          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
              ))
            ) : events.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium mb-1">No events yet</p>
                <p className="text-xs text-muted-foreground/60">
                  {isSuperAdmin ? "Events will appear here once institutions create them." : "Create your first event to get started."}
                </p>
              </div>
            ) : (
              events.map(event => {
                const isPending = event.status === "pending"
                return (
                  <div
                    key={event.id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3 transition-colors",
                      isPending
                        ? "bg-amber-500/[0.02] border-amber-500/10"
                        : "bg-card border-border/40 hover:border-border/80"
                    )}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                        <Calendar className="w-4 h-4 text-primary/60" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold">{event.title}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] px-1.5 py-0 h-4",
                              event.status === "approved" && "border-emerald-500/30 text-emerald-500",
                              event.status === "pending" && "border-amber-500/30 text-amber-500",
                              event.status === "rejected" && "border-red-500/30 text-red-500",
                            )}
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                          {event.institution && <span>{event.institution}</span>}
                          {event.date && <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                          <span>{event.attendees || 0} attendee{(event.attendees || 0) !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isSuperAdmin && isPending && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                            onClick={() => handleUpdateStatus(event.id, "approved")}
                          >
                            <CheckCircle className="w-3 h-3 mr-1.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleUpdateStatus(event.id, "rejected")}
                          >
                            <XCircle className="w-3 h-3 mr-1.5" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs"
                        onClick={() => navigate(`/admin/events/${event.id}/attendees`)}
                      >
                        <Users className="w-3 h-3 mr-1.5" />
                        Attendees
                      </Button>
                      {(isSuperAdmin || event.status === "approved") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs text-muted-foreground"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ── People view (super admin only) ── */}
        {isSuperAdmin && view === "people" && (
          <div className="space-y-4">
            {/* Search + filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or institution..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="pl-9 bg-card border-border/40"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'citizen', 'institution_admin'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                      roleFilter === r
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border/40 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {r === 'all' ? 'All' : r === 'institution_admin' ? 'Institution Admins' : 'Users'}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProvisionDialog(true)}
                className="shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                Add admin
              </Button>
            </div>

            {/* Users table */}
            {isUsersLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-muted/30 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium mb-1">No people found</p>
                <p className="text-xs text-muted-foreground/60">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="border border-border/40 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/20">
                      <th className="p-3 text-left text-xs font-medium text-muted-foreground tracking-wide">Name</th>
                      <th className="p-3 text-left text-xs font-medium text-muted-foreground tracking-wide hidden sm:table-cell">Email</th>
                      <th className="p-3 text-left text-xs font-medium text-muted-foreground tracking-wide">Role</th>
                      <th className="p-3 text-left text-xs font-medium text-muted-foreground tracking-wide hidden md:table-cell">Institution</th>
                      <th className="p-3 text-left text-xs font-medium text-muted-foreground tracking-wide">Status</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors last:border-0">
                        <td className="p-3 font-medium text-sm">{u.name}</td>
                        <td className="p-3 text-xs text-muted-foreground hidden sm:table-cell">{u.email}</td>
                        <td className="p-3">
                          <span className={cn(
                            "text-xs font-medium",
                            u.role === 'super_admin' && 'text-amber-500',
                            u.role === 'institution_admin' && 'text-primary',
                            u.role === 'citizen' && 'text-muted-foreground',
                          )}>
                            {u.role === 'super_admin' ? 'Super Admin' : u.role === 'institution_admin' ? 'Inst. Admin' : 'User'}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{u.institution || '—'}</td>
                        <td className="p-3">
                          <span className={cn(
                            "text-xs font-medium",
                            u.suspended ? 'text-red-500' : 'text-emerald-500'
                          )}>
                            {u.suspended ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="p-3">
                          {u.role !== 'super_admin' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={togglingUserId === u.id}
                              onClick={() => handleToggleSuspend(u)}
                              className={cn(
                                "h-7 px-2 text-xs",
                                u.suspended
                                  ? "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                                  : "text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              )}
                            >
                              {togglingUserId === u.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : u.suspended ? (
                                <><UserCheck className="w-3 h-3 mr-1" />Activate</>
                              ) : (
                                <><Ban className="w-3 h-3 mr-1" />Suspend</>
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Provision dialog ── */}
        <Dialog
          open={showProvisionDialog}
          onOpenChange={(open) => {
            setShowProvisionDialog(open)
            if (!open) {
              setProvisionForm({ name: '', email: '', password: '', institution: '' })
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Add institution admin
              </DialogTitle>
              <DialogDescription>
                Create an account for someone who manages events at their institution.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleProvision} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="provision-name" className="text-xs font-medium text-muted-foreground">
                  Full name
                </label>
                <Input
                  id="provision-name"
                  placeholder="e.g. Alex Rivera"
                  value={provisionForm.name}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="border-border/40 h-9 text-sm"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="provision-email" className="text-xs font-medium text-muted-foreground">
                  Email
                </label>
                <Input
                  id="provision-email"
                  type="email"
                  placeholder="alex@institution.edu"
                  value={provisionForm.email}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="border-border/40 h-9 text-sm"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="provision-institution" className="text-xs font-medium text-muted-foreground">
                  Institution name
                </label>
                <Input
                  id="provision-institution"
                  placeholder="e.g. TechVision Institute"
                  value={provisionForm.institution}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, institution: e.target.value }))}
                  className="border-border/40 h-9 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="provision-password" className="text-xs font-medium text-muted-foreground">
                  Temporary password
                </label>
                <Input
                  id="provision-password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={provisionForm.password}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="border-border/40 h-9 text-sm"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProvisionDialog(false)}
                  disabled={isProvisioning}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isProvisioning} size="sm">
                  {isProvisioning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                      Create admin
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
