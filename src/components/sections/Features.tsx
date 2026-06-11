import { motion } from "framer-motion"
import {
  ShieldCheck,
  BarChart3,
  QrCode,
  Building2,
  Clock,
  Globe
} from "lucide-react"

const features = [
  {
    title: "Institutional Control",
    description: "Manage events across your organization with role-based access for staff, organizers, and administrators.",
    icon: Building2,
  },
  {
    title: "QR Check-In",
    description: "Scan tickets at the door with real-time attendance sync for seamless entry management.",
    icon: QrCode,
  },
  {
    title: "Attendance Analytics",
    description: "Track registration trends, attendance rates, and engagement metrics across all your events.",
    icon: BarChart3,
  },
  {
    title: "Waitlist Management",
    description: "Automatically promote attendees from the waitlist as spots open up, no manual work needed.",
    icon: Clock,
  },
  {
    title: "Secure Access",
    description: "Enterprise-grade authentication and role-based permissions keep your event data safe.",
    icon: ShieldCheck,
  },
  {
    title: "Global Reach",
    description: "Connect with a diverse community of students, professionals, and organizations worldwide.",
    icon: Globe,
  },
]

export function Features() {
  return (
    <section className="py-20 lg:py-28 bg-background border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-border rounded text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Platform Capabilities
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Everything You Need to Run Great Events.
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            From ticketing to check-in to post-event analytics, Eventim provides the tools to deliver professional events at any scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="p-8 bg-background hover:bg-muted/30 transition-colors"
            >
              <div className="flex flex-col h-full">
                <div className="w-9 h-9 border border-border flex items-center justify-center mb-5">
                  <feature.icon className="w-4 h-4 text-foreground" />
                </div>

                <h3 className="text-base font-bold mb-3 leading-snug">
                  {feature.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
