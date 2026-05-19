import { motion } from "framer-motion"
import { Shield, Zap, Globe, BarChart3, Users, Smartphone } from "lucide-react"

const features = [
  {
    title: "Global Reach",
    description: "Host events for audiences anywhere in the world with built-in multi-currency support.",
    icon: Globe,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Instant Analytics",
    description: "Get real-time insights into ticket sales, attendee engagement, and revenue.",
    icon: BarChart3,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Lightning Fast",
    description: "Our platform is optimized for speed, ensuring a smooth experience for your attendees.",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Secure Payments",
    description: "Enterprise-grade security for all transactions with integrated fraud protection.",
    icon: Shield,
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    title: "Community First",
    description: "Build lasting relationships with your audience using our integrated community tools.",
    icon: Users,
    color: "bg-rose-500/10 text-rose-500",
  },
  {
    title: "Mobile Ready",
    description: "Manage your events on the go with our fully responsive mobile experience.",
    icon: Smartphone,
    color: "bg-purple-500/10 text-purple-500",
  },
]

export function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Everything you need to succeed</h2>
          <p className="text-muted-foreground leading-relaxed">
            Stop juggling multiple tools. Evently brings everything together so you can focus on what matters: your event.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl border bg-card/50 hover:bg-card hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
