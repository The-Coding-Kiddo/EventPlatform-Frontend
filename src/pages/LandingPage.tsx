import { Navbar } from "@/components/layout/Navbar"
import { Hero } from "@/components/sections/Hero"
import { EventList } from "@/components/sections/EventList"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { Features } from "@/components/sections/Features"
import { Footer } from "@/components/layout/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <EventList initialLimit={6} />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
