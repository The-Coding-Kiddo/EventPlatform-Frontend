import { motion } from "framer-motion"
import { Search, UserCheck, QrCode, CalendarPlus, LayoutDashboard, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const attendeeSteps = [
  {
    icon: Search,
    title: "Browse",
    description: "Explore events by category, location, or date across leading institutions and organizations.",
  },
  {
    icon: UserCheck,
    title: "Register",
    description: "Secure your spot in one click—or join the waitlist if the event reaches capacity.",
  },
  {
    icon: QrCode,
    title: "Attend",
    description: "Check in seamlessly with your QR ticket and connect with a community of peers.",
  },
]

const organizerSteps = [
  {
    icon: CalendarPlus,
    title: "Create",
    description: "Set up your event with venue details, capacity, pricing, and a custom image in minutes.",
  },
  {
    icon: LayoutDashboard,
    title: "Manage",
    description: "Track registrations, check in attendees, invite participants, and communicate updates.",
  },
  {
    icon: BarChart3,
    title: "Analyze",
    description: "Gain insights from attendance data, registration velocity, and engagement metrics.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest mb-6 border border-primary/10">
            <span>How It Works</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight text-foreground">
            From Discovery to Impact <br />
            <span className="text-primary">in Three Steps.</span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Whether you are searching for your next learning opportunity or organizing a world-class event,
            Eventim makes the journey intuitive for everyone involved.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Attendee Flow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-12 flex items-center gap-3">
              <span className="h-px flex-1 bg-border/60" />
              For Attendees
              <span className="h-px flex-1 bg-border/60" />
            </h3>

            <div className="space-y-0">
              {attendeeSteps.map((step, i) => (
                <div key={step.title} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <step.icon className="w-5 h-5" />
                    </div>
                    {i < attendeeSteps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/30 to-transparent my-1.5" />
                    )}
                  </div>
                  <div className="pb-11 pt-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        Step {i + 1}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold mb-1 text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Organizer Flow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-12 flex items-center gap-3">
              <span className="h-px flex-1 bg-border/60" />
              For Organizers
              <span className="h-px flex-1 bg-border/60" />
            </h3>

            <div className="space-y-0">
              {organizerSteps.map((step, i) => (
                <div key={step.title} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <step.icon className="w-5 h-5" />
                    </div>
                    {i < organizerSteps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/30 to-transparent my-1.5" />
                    )}
                  </div>
                  <div className="pb-11 pt-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        Step {i + 1}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold mb-1 text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link to="/events">
              <Button size="lg" className="rounded-xl h-14 px-10 text-base shadow-xl shadow-primary/20">
                Find an Event
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/create-event">
              <Button size="lg" variant="outline" className="rounded-xl h-14 px-10 text-base">
                Host Your First Event
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
