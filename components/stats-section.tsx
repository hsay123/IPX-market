"use client"
import { Database, Brain, Users, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: Database,
    value: 5000,
    label: "Datasets",
    suffix: "+",
    color: "text-primary",
  },
  {
    icon: Brain,
    value: 2500,
    label: "AI Models",
    suffix: "+",
    color: "text-accent",
  },
  {
    icon: Users,
    value: 10000,
    label: "Active Users",
    suffix: "+",
    color: "text-primary",
  },
  {
    icon: TrendingUp,
    value: 1.5,
    label: "ETH Volume",
    suffix: "M",
    color: "text-accent",
  },
]

export function StatsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <Icon className="h-8 w-8 mb-4 text-[#602fc0]" />
                <div className="text-3xl font-bold mb-1 text-white">
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
