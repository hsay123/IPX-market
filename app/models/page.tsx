"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ModelGrid } from "@/components/model-grid"
import { SearchBar } from "@/components/search-bar"
import { CategoryFilter } from "@/components/category-filter"

export default function ModelsPage() {
  const [searchValue, setSearchValue] = useState("")
  const [activeSearch, setActiveSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const handleSearch = () => {
    setActiveSearch(searchValue)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#05000d" }}>
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            Browse <span className="text-[#9383c7]">AI Models</span>
          </h1>
          <p className="text-gray-400">Discover pre-trained AI models ready to deploy</p>
        </div>

        <div className="mb-8">
          <SearchBar type="models" value={searchValue} onChange={setSearchValue} onSearch={handleSearch} />
        </div>

        <div className="mb-8">
          <CategoryFilter type="models" selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <ModelGrid category={selectedCategory} search={activeSearch} />
      </div>
    </div>
  )
}
