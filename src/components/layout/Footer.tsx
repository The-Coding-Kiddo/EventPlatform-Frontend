import { Link } from "react-router-dom"
import { EventimLogo } from "@/components/brand/EventimLogo"
import { Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-4">
              <EventimLogo size={20} />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Connecting people to the events that shape the future of technology and education.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-foreground mb-4">
              Navigate
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Host an Event
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-foreground mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:hello@eventim.io"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="h-3.5 w-3.5" />
                  hello@eventim.io
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mt-5">
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Twitter</a>
              <span className="text-xs text-border">/</span>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
              <span className="text-xs text-border">/</span>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Eventim. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span className="text-border">/</span>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <span className="text-border">/</span>
            <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
