import { LandingHeader } from "@/components/layout/LandingHeader"
import { Hero } from "@/components/sections/Hero"
import { CategoryPills } from "@/components/sections/CategoryPills"
import { EventList } from "@/components/sections/EventList"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { Features } from "@/components/sections/Features"
import { Footer } from "@/components/layout/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-grow pt-16">
        <Hero />
        <CategoryPills />
        <EventList initialLimit={6} />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
