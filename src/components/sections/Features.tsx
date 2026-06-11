import { motion } from "framer-motion"
import { 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Users, 
  QrCode, 
  Building2,
  Clock,
  Globe
} from "lucide-react"

const features = [
  {
    title: "Institutional Control",
    description: "Robust administrative suite designed for universities and enterprises to manage complex event hierarchies.",
    icon: Building2,
  },
  {
    title: "Optical Verification",
    description: "High-speed QR scanning console with instant database synchronization for seamless entry management.",
    icon: QrCode,
  },
  {
    title: "Real-time Analytics",
    description: "Deep insights into attendee occupancy, registration velocity, and institutional engagement metrics.",
    icon: BarChart3,
  },
  {
    title: "Waitlist Automation",
    description: "Dynamic queue management that automatically promotes participants as capacity becomes available.",
    icon: Clock,
  },
  {
    title: "Secure Infrastructure",
    description: "Enterprise-grade authentication and role-based access control to protect institutional data integrity.",
    icon: ShieldCheck,
  },
  {
    title: "Global Discovery",
    description: "A professional gateway connecting top-tier organizations with a global community of students and experts.",
    icon: Globe,
  },
]

export function Features() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Structural Accent: Vertical lines mimicking industrial blueprint/grid */}
      <div className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '100px 100px' }} 
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest mb-6 border border-primary/10">
            <Zap className="w-3 h-3" />
            <span>Platform Capabilities</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight text-foreground">
            A Sophisticated Ecosystem for <br />
            <span className="text-primary">Impactful Experiences.</span>
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Eventim provides the precision tools required by leading organizations to deliver professional events at scale, ensuring every interaction is meaningful and every data point is actionable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/40 border border-border/40 rounded-3xl overflow-hidden shadow-2xl">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="p-10 bg-background hover:bg-muted/30 transition-colors duration-500 group"
            >
              <div className="flex flex-col h-full">
                <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center mb-8 border border-primary/10 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-5 h-5" />
                </div>
                
                <h3 className="text-lg font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="mt-8 pt-6 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    Professional Grade <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
