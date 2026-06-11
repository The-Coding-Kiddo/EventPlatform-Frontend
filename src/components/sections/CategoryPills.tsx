import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Monitor,
  BookOpen,
  Palette,
  Music,
  UtensilsCrossed,
  Trophy,
  Briefcase,
  Heart,
} from "lucide-react"
import { CATEGORIES } from "@/lib/categories"

const categoryIcons: Record<string, typeof Monitor> = {
  Technology: Monitor,
  Education: BookOpen,
  Art: Palette,
  Music: Music,
  Food: UtensilsCrossed,
  Sports: Trophy,
  Business: Briefcase,
  Health: Heart,
}

const categories = CATEGORIES.map((label) => ({ label, icon: categoryIcons[label] }))

export function CategoryPills() {
  const navigate = useNavigate()
  const [active, setActive] = useState<string | null>(null)

  const handleClick = (label: string) => {
    setActive(label === active ? null : label)
    navigate(`/events?category=${label}`)
  }

  return (
    <section className="py-5 lg:py-8 bg-background border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = active === cat.label
            return (
              <button
                key={cat.label}
                onClick={() => handleClick(cat.label)}
                className={`flex flex-col items-center gap-1 sm:gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border transition-colors ${
                  isActive
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-foreground/30"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                <span className="text-[11px] sm:text-xs font-medium text-foreground">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
