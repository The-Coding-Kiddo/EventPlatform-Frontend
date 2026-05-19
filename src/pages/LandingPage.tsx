import { Navbar } from "@/components/layout/Navbar"
import { Hero } from "@/components/sections/Hero"
import { EventList } from "@/components/sections/EventList"
import { Features } from "@/components/sections/Features"
import { Footer } from "@/components/layout/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <EventList />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
