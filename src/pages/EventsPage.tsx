import { EventList } from "@/components/sections/EventList"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="bg-primary/5 py-12 border-b border-white/5">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Events</h1>
            <p className="text-muted-foreground text-lg">
              Find and register for the best upcoming events from verified institutions.
            </p>
          </div>
        </div>
        <EventList showPastEvents />
      </main>
      <Footer />
    </div>
  )
}
