import { EventList } from "@/components/sections/EventList"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-16">
        <EventList showPastEvents />
      </main>
      <Footer />
    </div>
  )
}
