import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Plus, 
  Loader2, 
  UserPlus,
  Search,
  Ban,
  UserCheck,
  QrCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const [activeTab, setActiveTab] = useState("all")

  // Analytics states
  const [analytics, setAnalytics] = useState<any>(null)
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false)

  // Users tab states
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null)

  // Provision Institution Admin dialog
  const [showProvisionDialog, setShowProvisionDialog] = useState(false)
  const [provisionForm, setProvisionForm] = useState({ name: '', email: '', password: '', institution: '' })
  const [isProvisioning, setIsProvisioning] = useState(false)

  const isSuperAdmin = user?.role === "super_admin"

  useEffect(() => {
    if (user?.role === "super_admin") {
      setActiveTab("analytics")
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

  // Fetch analytics if super_admin
  useEffect(() => {
    if (isSuperAdmin) {
      const fetchAnalytics = async () => {
        setIsAnalyticsLoading(true)
        try {
          const data = await eventService.getAnalytics()
          setAnalytics(data)
        } catch (error) {
          toast.error("Failed to load platform analytics")
        } finally {
          setIsAnalyticsLoading(false)
        }
      }
      fetchAnalytics()
    }
  }, [isSuperAdmin])

  // Fetch users when Users tab is selected
  useEffect(() => {
    if (isSuperAdmin && activeTab === "users" && platformUsers.length === 0) {
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
  }, [isSuperAdmin, activeTab])

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
      // Add the new user to the list immediately
      if (result?.user) {
        setPlatformUsers(prev => [{
          suspended: false,
          createdAt: new Date().toISOString(),
          ...result.user,
        }, ...prev])
        setRoleFilter('institution_admin')
      } else {
        // Force refresh users list
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
              <TabsTrigger value="analytics">Executive Analytics</TabsTrigger>
            )}
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
            <TabsContent value="analytics" className="space-y-6">
              {isAnalyticsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="glass border-white/10 h-32 animate-pulse bg-white/5" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold">Executive Analytics</h2>
                      <p className="text-sm text-muted-foreground">
                        Platform health, institutions, and event activity.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        setRoleFilter('institution_admin')
                        setShowProvisionDialog(true)
                      }}
                      className="w-full sm:w-auto"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Inst. Admin
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="glass border-white/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Platform Events</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{analytics?.totalEvents ?? 0}</div>
                      </CardContent>
                    </Card>
                    <Card className="glass border-white/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Registered Citizens</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">{analytics?.totalUsers ?? 0}</div>
                      </CardContent>
                    </Card>
                    <Card className="glass border-white/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Institutions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-emerald-500">
                          {analytics?.activeInstitutions ?? 0} <span className="text-lg font-normal text-muted-foreground">/ {analytics?.totalInstitutions ?? 0}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="glass border-white/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Approval Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-amber-500">{analytics?.approvalRate ?? 0}%</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Distribution card */}
                    <Card className="glass border-white/10">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <Activity className="w-5 h-5 text-primary" />
                          Category Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {!analytics?.categoryDistribution || analytics.categoryDistribution.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-6">No data available.</p>
                        ) : (
                          analytics.categoryDistribution.map((item: any) => {
                            const percentage = analytics.totalEvents > 0 
                              ? Math.round((item.value / analytics.totalEvents) * 100)
                              : 0
                            return (
                              <div key={item.name} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-muted-foreground">{item.value} events ({percentage}%)</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })
                        )}
                      </CardContent>
                    </Card>

                    {/* Top Cities card */}
                    <Card className="glass border-white/10">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-emerald-500" />
                          Top Cities by Events
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {!analytics?.topCities || analytics.topCities.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-6">No data available.</p>
                        ) : (
                          analytics.topCities.map((item: any, index: number) => (
                            <div key={item.city} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-muted-foreground text-sm">#{index + 1}</span>
                                <span className="font-medium">{item.city}</span>
                              </div>
                              <Badge variant="outline" className="bg-white/5">{item.count} events</Badge>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
          )}

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
                      <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 gap-4">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">{event.institution}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={
                            event.status === "approved" ? "default" :
                            event.status === "pending" ? "outline" :
                            event.status === "rejected" ? "destructive" : "secondary"
                          }>
                            {event.status}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/admin/events/${event.id}/attendees`)}
                          >
                            <Users className="w-4 h-4 mr-2" /> Attendees ({event.attendees || 0})
                          </Button>
                        </div>
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
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    All Platform Users
                    <Badge variant="outline" className="ml-auto">{filteredUsers.length} results</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search + Filter bar */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or institution..."
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        className="pl-9 bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="flex gap-2">
                      {['all', 'citizen', 'institution_admin', 'super_admin'].map(r => (
                        <Button
                          key={r}
                          size="sm"
                          variant={roleFilter === r ? 'default' : 'outline'}
                          onClick={() => setRoleFilter(r)}
                          className="capitalize text-xs"
                        >
                          {r === 'all' ? 'All' : r === 'institution_admin' ? 'Inst. Admin' : r === 'super_admin' ? 'Super Admin' : 'Citizen'}
                        </Button>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        setRoleFilter('institution_admin')
                        setShowProvisionDialog(true)
                      }}
                      className="w-full sm:w-auto"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {isUsersLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-14 bg-white/5 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      No users found matching your search.
                    </div>
                  ) : (
                    <div className="border border-white/10 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Name</th>
                            <th className="p-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Email</th>
                            <th className="p-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Role</th>
                            <th className="p-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Institution</th>
                            <th className="p-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                            <th className="p-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Joined</th>
                            <th className="p-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map(u => (
                            <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 last:border-0">
                              <td className="p-3 font-medium">{u.name}</td>
                              <td className="p-3 text-muted-foreground text-xs">{u.email}</td>
                              <td className="p-3">
                                <Badge variant="outline" className={
                                  u.role === 'super_admin' ? 'border-amber-500/50 text-amber-500' :
                                  u.role === 'institution_admin' ? 'border-primary/50 text-primary' :
                                  'border-white/20 text-muted-foreground'
                                }>
                                  {u.role === 'super_admin' ? 'Super Admin' : u.role === 'institution_admin' ? 'Inst. Admin' : 'Citizen'}
                                </Badge>
                              </td>
                              <td className="p-3 text-muted-foreground text-xs">{u.institution || '—'}</td>
                              <td className="p-3">
                                <Badge variant={u.suspended ? 'destructive' : 'default'} className="text-xs">
                                  {u.suspended ? 'Suspended' : 'Active'}
                                </Badge>
                              </td>
                              <td className="p-3 text-muted-foreground text-xs">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-3">
                                {u.role !== 'super_admin' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={togglingUserId === u.id}
                                    onClick={() => handleToggleSuspend(u)}
                                    className={u.suspended
                                      ? 'border-green-500/40 text-green-500 hover:bg-green-500/10 text-xs'
                                      : 'border-red-500/40 text-red-500 hover:bg-red-500/10 text-xs'
                                    }
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
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Dialog for provisioning institution admins */}
        <Dialog
          open={showProvisionDialog}
          onOpenChange={(open) => {
            setShowProvisionDialog(open)
            if (!open) {
              setProvisionForm({ name: '', email: '', password: '', institution: '' })
            }
          }}
        >
          <DialogContent className="glass border-white/20 text-foreground max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-primary" />
                Add Institution Admin
              </DialogTitle>
              <DialogDescription>
                Create a login for a partner institution admin using the same provision flow as Swagger.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleProvision} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="provision-name" className="text-sm font-medium">
                  Admin Name
                </label>
                <Input
                  id="provision-name"
                  placeholder="e.g. Tech Admin"
                  value={provisionForm.name}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-white/5 border-white/10"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="provision-email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="provision-email"
                  type="email"
                  placeholder="admin@institution.edu"
                  value={provisionForm.email}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="bg-white/5 border-white/10"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="provision-institution" className="text-sm font-medium">
                  Institution
                </label>
                <Input
                  id="provision-institution"
                  placeholder="e.g. TechVision Institute"
                  value={provisionForm.institution}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, institution: e.target.value }))}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="provision-password" className="text-sm font-medium">
                  Temporary Password
                </label>
                <Input
                  id="provision-password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={provisionForm.password}
                  onChange={(e) => setProvisionForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="bg-white/5 border-white/10"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProvisionDialog(false)}
                  disabled={isProvisioning}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isProvisioning}>
                  {isProvisioning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Admin
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
