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

const categories = [
  { label: "Technology", icon: Monitor },
  { label: "Education", icon: BookOpen },
  { label: "Art", icon: Palette },
  { label: "Music", icon: Music },
  { label: "Food", icon: UtensilsCrossed },
  { label: "Sports", icon: Trophy },
  { label: "Business", icon: Briefcase },
  { label: "Health", icon: Heart },
]

export function CategoryPills() {
  const navigate = useNavigate()
  const [active, setActive] = useState<string | null>(null)

  const handleClick = (label: string) => {
    setActive(label === active ? null : label)
    navigate(`/events?category=${label}`)
  }

  return (
    <section className="py-8 lg:py-10 bg-background border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = active === cat.label
            return (
              <button
                key={cat.label}
                onClick={() => handleClick(cat.label)}
                className={`flex flex-col items-center gap-2 px-5 py-4 rounded-xl border transition-colors shrink-0 ${
                  isActive
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-foreground/30"
                }`}
              >
                <Icon className="w-5 h-5 text-foreground" />
                <span className="text-xs font-medium text-foreground">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
