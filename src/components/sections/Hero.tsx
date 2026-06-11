import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full min-h-[60vh] lg:min-h-[70vh] flex items-center bg-background">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=85"
          alt="Conference stage with presentation screen and audience seating"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto px-5 lg:px-8 w-full pt-28 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-2xl">
          <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1] sm:leading-[0.95] text-foreground mb-4 sm:mb-6">
            Where Events
            <br />
            <span className="text-primary">Come to Life.</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-foreground/85 max-w-lg mb-8 sm:mb-10 leading-relaxed">
            Discover, register, and attend events hosted by leading universities and tech organizations.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4 w-full sm:w-auto">
            <Link to="/events" className="w-full sm:w-auto">
              <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors">
                Explore Events
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link to="/create-event" className="w-full sm:w-auto">
              <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors">
                Host an Event
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
