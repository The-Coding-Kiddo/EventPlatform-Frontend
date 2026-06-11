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
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Link to="/" className="shrink-0" aria-label="Eventim home">
          <EventimLogo size={18} />
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl mx-auto">
          <div className="flex items-center w-full border border-border rounded-full overflow-hidden bg-background focus-within:border-foreground/30 transition-colors">
            <div className="flex items-center flex-1 min-w-0 px-3 sm:px-4">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search events, topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 min-w-0 bg-transparent border-0 outline-none px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="w-px h-5 sm:h-6 bg-border shrink-0" />
            <div className="items-center px-2 sm:px-4 hidden sm:flex">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-20 sm:w-24 bg-transparent border-0 outline-none px-1.5 sm:px-2 py-2 sm:py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-foreground text-background text-xs sm:text-sm font-medium hover:bg-foreground/90 transition-colors shrink-0"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden lg:inline">Search</span>
            </button>
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-0.5 sm:gap-1">
          <Link to="/events" className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors font-medium whitespace-nowrap">
            Find Events
          </Link>
          <Link to="/create-event" className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors font-medium whitespace-nowrap">
            Create
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full ml-1 sm:ml-2">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-border">
                    <AvatarFallback className="bg-muted text-foreground uppercase text-[10px] sm:text-xs">
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
            <div className="flex items-center gap-1 sm:gap-1 ml-1 sm:ml-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm font-medium h-8 sm:h-9 px-2 sm:px-3">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="text-xs sm:text-sm font-medium h-8 sm:h-9 px-3 sm:px-4">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </nav>

        <button
          className="md:hidden flex items-center justify-center p-2 -mr-2 h-10 w-10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <Search className="w-4 h-4 text-muted-foreground ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search events..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-none px-3 py-2.5 text-sm"
              />
            </div>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <MapPin className="w-4 h-4 text-muted-foreground ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-none px-3 py-2.5 text-sm"
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-foreground text-background text-sm font-medium">
              Search
            </button>
          </form>
          <div className="border-t border-border pt-3 flex flex-col gap-0.5">
            <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm hover:bg-muted rounded-md">Find Events</Link>
            <Link to="/create-event" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm hover:bg-muted rounded-md">Create Event</Link>
            {isAuthenticated ? (
              <>
                <div className="border-t border-border my-2" />
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Signed in as <span className="font-medium text-foreground">{user?.name}</span>
                </div>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm hover:bg-muted rounded-md">Profile</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false) }} className="px-3 py-2.5 text-sm hover:bg-muted rounded-md text-left text-destructive">Log out</button>
              </>
            ) : (
              <>
                <div className="border-t border-border my-2" />
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm hover:bg-muted rounded-md">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted rounded-md">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
