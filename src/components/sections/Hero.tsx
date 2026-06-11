import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import heroImage from "@/assets/hero-tech-education.png"

export function Hero() {
  return (
    <section className="relative w-full min-h-[70vh] flex items-center bg-background">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Conference audience in a dimly lit venue"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 lg:px-8 w-full pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-2xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] text-foreground mb-6">
            Where Events
            <br />
            <span className="text-primary">Come to Life.</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-lg mb-10 leading-relaxed">
            Discover, register, and attend events hosted by leading universities and tech organizations.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link to="/events">
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors">
                Explore Events
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link to="/create-event">
              <span className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors">
                Host an Event
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
