import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import heroImage from "@/assets/hero-event.png"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden mesh-gradient">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
              <Sparkles className="w-3 h-3" />
              <span>The next generation of event management</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-tight">
              Create Unforgettable <br /> Experiences with Ease
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
              From intimate workshops to global conferences, Eventim provides everything you need to plan, promote, and manage your events in one beautiful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
              <Link to="/create-event">
                <Button size="lg" className="h-12 px-8 rounded-full text-base font-semibold group">
                  Start Planning Now
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-base font-semibold bg-background/50 backdrop-blur-sm">
                Watch Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 glass p-2 rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src={heroImage} 
                alt="Vibrant Event" 
                className="rounded-2xl w-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            
            {/* Floating stats element */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl shadow-xl border border-white/20 z-20"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">10k+</p>
                  <p className="text-xs text-muted-foreground">Successful Events</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-1" />
    </section>
  )
}
