import { Link } from "react-router-dom"
import { EventimLogo } from "@/components/brand/EventimLogo"
import { Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card mt-20">
      <div className="h-0.5 bg-primary/20" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-5">
              <EventimLogo size={22} />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Connecting people to the events that shape the future of technology and education.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-foreground mb-5">
              Navigate
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Host an Event
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-foreground mb-5">
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@eventim.io"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="h-3.5 w-3.5" />
                  hello@eventim.io
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Twitter</a>
              <span className="text-xs text-border/60">/</span>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">GitHub</a>
              <span className="text-xs text-border/60">/</span>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Eventim. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <span className="text-border/60 text-[10px]">◆</span>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <span className="text-border/60 text-[10px]">◆</span>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
