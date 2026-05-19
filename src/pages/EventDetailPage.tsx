import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Calendar, MapPin, Tag, ArrowLeft, Users, Building2, Bookmark, BookmarkCheck, CreditCard, Lock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { eventService } from "@/services/eventService"
import type { Event } from "@/services/eventService"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated, refreshUser } = useAuth()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const [isSaved, setIsSaved] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  // Payment simulation state
  const [showCheckout, setShowCheckout] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [cardName, setCardName] = useState("")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return
      try {
        const data = await eventService.getEventById(id)
        setEvent(data)
      } catch (error) {
        toast.error("Failed to load event details")
        navigate("/")
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvent()
  }, [id, navigate])

  // Synchronize saved & registered states with active user profile details
  useEffect(() => {
    if (user && event) {
      setIsSaved(user.savedEvents?.includes(event.id) || false)
      setIsRegistered(user.registeredEvents?.includes(event.id) || false)
    }
  }, [user, event])

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    if (!event) return

    setIsSaving(true)
    try {
      if (isSaved) {
        await eventService.unsaveEvent(event.id)
        toast.success("Event removed from saved")
      } else {
        await eventService.saveEvent(event.id)
        toast.success("Event saved successfully")
      }
      // Refresh user so ProfilePage and saved state stay in sync
      await refreshUser()
    } catch (error) {
      toast.error("Failed to update saved status")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    if (!event) return

    // If it is a paid event and the user is NOT registered yet, open secure checkout
    if (event.price > 0 && !isRegistered) {
      setShowCheckout(true)
      return
    }

    setIsRegistering(true)
    try {
      if (isRegistered) {
        await eventService.cancelRegistration(event.id)
        setEvent({ ...event, attendees: event.attendees - 1 })
        toast.success("Registration cancelled")
      } else {
        await eventService.registerForEvent(event.id)
        setEvent({ ...event, attendees: event.attendees + 1 })
        toast.success("Successfully registered for the event")
      }
      // Refresh user so registeredEvents stays in sync with the DB
      await refreshUser()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update registration")
    } finally {
      setIsRegistering(false)
    }
  }

  const handleSimulatedPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      toast.error("Please fill in all credit card details.")
      return
    }

    setIsProcessingPayment(true)
    
    // Simulate real bank api processing delay
    setTimeout(async () => {
      try {
        await eventService.registerForEvent(event!.id)
        setEvent({ ...event!, attendees: event!.attendees + 1 })
        toast.success("Payment successful & ticket booked!", {
          description: `Successfully paid $${event!.price} and registered for "${event!.title}".`
        })
        setShowCheckout(false)
        // Refresh user so registeredEvents stays in sync
        await refreshUser()
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to complete registration after payment.")
      } finally {
        setIsProcessingPayment(false)
      }
    }, 1800)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) return null

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl overflow-hidden h-[400px] relative"
            >
              <img 
                src={event.image || "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&auto=format&fit=crop&q=80"} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md text-sm py-1 px-3">
                {event.category}
              </Badge>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-lg">
                  {event.description}
                </p>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-secondary/50">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-white/10 sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center pb-6 border-b border-white/10">
                    <div className="text-3xl font-bold mb-1">
                      {event.price === 0 ? "Free" : `$${event.price}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.capacity - event.attendees} spots left
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="text-sm text-muted-foreground">{event.time}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{event.venue}</div>
                        <div className="text-sm text-muted-foreground">{event.location}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Institution</div>
                        <div className="text-sm text-muted-foreground">{event.institution}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Attendees</div>
                        <div className="text-sm text-muted-foreground">{event.attendees} / {event.capacity}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-3">
                    <Button 
                      className="w-full h-12 text-lg" 
                      onClick={handleRegister}
                      disabled={isRegistering || (!isRegistered && event.attendees >= event.capacity)}
                      variant={isRegistered ? "outline" : "default"}
                    >
                      {isRegistered ? "Cancel Registration" : "Register Now"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="mr-2 w-4 h-4 text-primary" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="mr-2 w-4 h-4" />
                          Save for later
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Simulated Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm px-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-xl space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-foreground">Secure Checkout</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Simulated payment — no real charge</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Encrypted</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-muted rounded-xl p-4 space-y-2 border border-border">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Order Summary</div>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm text-foreground line-clamp-1">{event.title}</div>
                <div className="font-bold text-primary text-base">${event.price}</div>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>1× Standard Entry Ticket</span>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSimulatedPayment} className="space-y-4">
              {/* Cardholder Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cardholder Name</label>
                <div className="relative">
                  <Input 
                    type="text"
                    required
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="pl-10 bg-background border-border focus-visible:ring-primary"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Card Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Card Number</label>
                <div className="relative">
                  <Input 
                    type="text"
                    required
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
                      const matches = val.match(/\d{4,16}/g)
                      const match = (matches && matches[0]) || ""
                      const parts = []
                      for (let i = 0, len = match.length; i < len; i += 4) {
                        parts.push(match.substring(i, i + 4))
                      }
                      setCardNumber(parts.length > 0 ? parts.join(" ") : val)
                    }}
                    className="pl-10 bg-background border-border focus-visible:ring-primary font-mono"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Expiry + CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Expiry</label>
                  <Input 
                    type="text"
                    required
                    placeholder="MM / YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\//g, "").replace(/[^0-9]/gi, "")
                      setCardExpiry(val.length >= 2 ? val.substring(0, 2) + "/" + val.substring(2, 4) : val)
                    }}
                    className="bg-background border-border focus-visible:ring-primary text-center font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CVC</label>
                  <Input 
                    type="password"
                    required
                    placeholder="•••"
                    maxLength={3}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/gi, ""))}
                    className="bg-background border-border focus-visible:ring-primary text-center font-mono"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCheckout(false)}
                  disabled={isProcessingPayment}
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isProcessingPayment}
                  className="flex-1 h-11 font-bold text-base"
                >
                  {isProcessingPayment ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Pay ${event.price}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
