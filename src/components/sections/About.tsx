import { motion } from "framer-motion"

export function About() {
  return (
    <section id="about" className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Our Mission at Eventim</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that every gathering is an opportunity for connection, growth, and transformation. Our platform was born from a simple idea: that technology should empower creators, not complicate their work.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, Eventim is trusted by organizers around the world to deliver seamless experiences—from intimate workshops to massive festivals. We're committed to building tools that are as beautiful as they are functional.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden glass p-4 rotate-3 shadow-2xl border border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=60" 
                alt="Event Team" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-1" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
