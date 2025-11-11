"use client"

import { Button } from "@/components/ui/button"

const DATASET_CATEGORIES = [
  "All",
  "Computer Vision",
  "Natural Language",
  "Healthcare",
  "Finance",
  "Audio",
  "Time Series",
  "Tabular",
]

const MODEL_CATEGORIES = [
  "All",
  "Computer Vision",
  "Natural Language",
  "Healthcare",
  "Finance",
  "Audio",
  "Reinforcement Learning",
  "Generative AI",
]

interface CategoryFilterProps {
  type: "datasets" | "models"
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ type, selected, onSelect }: CategoryFilterProps) {
  const categories = type === "datasets" ? DATASET_CATEGORIES : MODEL_CATEGORIES

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={category === selected ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(category)}
          className={
            category === selected
              ? "bg-[#602fc0] hover:bg-[#5027a0] text-white rounded-full"
              : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white rounded-full backdrop-blur-xl"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
