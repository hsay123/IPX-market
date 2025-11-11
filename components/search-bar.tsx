"use client"

import type React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  type: "datasets" | "models"
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

export function SearchBar({ type, value, onChange, onSearch }: SearchBarProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder={`Search ${type}...`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-400 backdrop-blur-xl"
        />
      </div>
      <Button type="submit" className="bg-[#602fc0] hover:bg-[#5027a0] text-white rounded-full px-6">
        Search
      </Button>
    </form>
  )
}
