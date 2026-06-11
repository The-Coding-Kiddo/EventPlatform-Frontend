import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, MapPin, LogOut, User, ShieldCheck, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { EventimLogo } from "@/components/brand/EventimLogo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function LandingHeader() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (location.trim()) params.set("location", location.trim())
    const qs = params.toString()
    navigate(qs ? `/events?${qs}` : "/events")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0" aria-label="Eventim home">
          <EventimLogo size={20} />
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl mx-auto">
          <div className="flex items-center w-full border border-border rounded-full overflow-hidden bg-background focus-within:border-foreground/30 transition-colors">
            <div className="flex items-center flex-1 min-w-0 px-4">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search events, topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 min-w-0 bg-transparent border-0 outline-none px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center px-4">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-24 bg-transparent border-0 outline-none px-2 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/events" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            Find Events
          </Link>
          <Link to="/create-event" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            Create
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="bg-muted text-foreground uppercase text-xs">
                      {user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-border" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {(user?.role === 'institution_admin' || user?.role === 'super_admin') && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1 ml-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-sm font-medium">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="text-sm font-medium">Get Started</Button>
              </Link>
            </div>
          )}
        </nav>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false) }} className="flex items-center border border-border rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Search events..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none px-4 py-2.5 text-sm"
            />
            <button type="submit" className="p-2.5 bg-foreground text-background">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="flex flex-col gap-1">
            <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm hover:bg-muted rounded-lg">Find Events</Link>
            <Link to="/create-event" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm hover:bg-muted rounded-lg">Create Event</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm hover:bg-muted rounded-lg">Profile</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false) }} className="px-3 py-2 text-sm hover:bg-muted rounded-lg text-left text-destructive">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm hover:bg-muted rounded-lg">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm hover:bg-muted rounded-lg">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
