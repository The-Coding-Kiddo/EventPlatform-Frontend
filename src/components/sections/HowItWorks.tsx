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
    <section className="py-20 lg:py-28 bg-background border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-border rounded text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            How It Works
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            From Discovery to Impact in Three Steps.
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            Whether you are searching for your next learning opportunity or organizing a world-class event,
            Eventim makes the journey intuitive for everyone involved.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">For Attendees</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-0">
              {attendeeSteps.map((step, i) => (
                <div key={step.title} className="flex gap-5 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center shrink-0">
                      <step.icon className="w-4 h-4 text-foreground" />
                    </div>
                    {i < attendeeSteps.length - 1 && (
                      <div className="w-px flex-1 bg-border my-1" />
                    )}
                  </div>
                  <div className="pb-8 pt-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Step {i + 1}
                      </span>
                    </div>
                    <h4 className="text-base font-bold mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">For Organizers</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-0">
              {organizerSteps.map((step, i) => (
                <div key={step.title} className="flex gap-5 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center shrink-0">
                      <step.icon className="w-4 h-4 text-foreground" />
                    </div>
                    {i < organizerSteps.length - 1 && (
                      <div className="w-px flex-1 bg-border my-1" />
                    )}
                  </div>
                  <div className="pb-8 pt-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Step {i + 1}
                      </span>
                    </div>
                    <h4 className="text-base font-bold mb-1">{step.title}</h4>
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
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link to="/events">
              <Button className="bg-foreground text-background hover:bg-foreground/90 text-sm font-semibold px-6 py-3 h-auto rounded-none">
                Find an Event
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/create-event">
              <Button variant="outline" className="border-border text-sm font-semibold px-6 py-3 h-auto rounded-none">
                Host Your First Event
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
