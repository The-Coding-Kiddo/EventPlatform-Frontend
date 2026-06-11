import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CalendarPlus } from "lucide-react"
import heroImage from "@/assets/hero-tech-education.png"
import { eventService } from "@/services/eventService"

export function Hero() {
  const [eventCount, setEventCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await eventService.getPublicEvents()
        const events = Array.isArray(response) ? response : (response?.items || response?.data || [])
        setEventCount(Array.isArray(events) ? events.length : 0)
      } catch (error) {
        setEventCount(0)
      }
    }
    fetchStats()
  }, [])

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-background">
      {/* Atmospheric background — deep, layered, like a venue coming to life */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/[0.08] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/[0.08] rounded-full blur-[120px]" />
      <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] bg-blue-500/[0.05] rounded-full blur-[100px]" />
      <div className="absolute inset-0 z-0 opacity-[0.02]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest mb-6 lg:mb-8 border border-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>The Hub for Tech & Education Events</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight mb-6 lg:mb-8 leading-[1.1] text-foreground">
              Everything <br />
              Happens <span className="text-primary">Here.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 lg:mb-12 leading-relaxed max-w-md mx-auto lg:mx-0">
              Discover, register, and attend events hosted by the world's leading universities
              and tech organizations. One platform, endless opportunities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 lg:mb-12">
              <Link to="/events" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-xl text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Explore Events
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/create-event" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-xl text-base">
                  <CalendarPlus className="mr-2 w-4 h-4" />
                  Host an Event
                </Button>
              </Link>
            </div>

            {eventCount !== null && eventCount > 0 && (
              <div className="inline-flex items-center gap-3 pt-6 border-t border-border/40">
                <span className="text-3xl font-bold text-foreground tracking-tight">{eventCount}+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold leading-tight">
                  Events<br />on the Platform
                </span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7 relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <img
                src={heroImage}
                alt="Students and professionals engaging in a high-quality educational event"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -z-10" />
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
