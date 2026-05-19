import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for small meetups and workshops.",
    features: ["Up to 50 attendees", "Basic analytics", "Standard support", "Community forums"],
    buttonText: "Get Started",
    popular: false
  },
  {
    name: "Professional",
    price: "$49",
    description: "Ideal for growing businesses and organizations.",
    features: ["Up to 500 attendees", "Advanced analytics", "Priority email support", "Custom branding", "Ticket management"],
    buttonText: "Go Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale global conferences and festivals.",
    features: ["Unlimited attendees", "White-label solution", "Dedicated account manager", "API access", "On-site support"],
    buttonText: "Contact Sales",
    popular: false
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose the plan that's right for your event. No hidden fees, ever.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl glass border border-white/20 flex flex-col h-full hover:shadow-2xl transition-all duration-500 ${plan.popular ? "scale-105 shadow-xl border-primary/30" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.price !== "Free" && plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? "default" : "outline"} 
                className={`w-full h-12 rounded-xl font-bold ${!plan.popular ? "bg-white/50" : ""}`}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] -z-1" />
    </section>
  )
}
