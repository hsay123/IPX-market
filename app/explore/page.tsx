"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatasetGrid } from "@/components/dataset-grid"
import { ModelGrid } from "@/components/model-grid"
import { SearchBar } from "@/components/search-bar"
import { CategoryFilter } from "@/components/category-filter"

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("datasets")
  const [searchValue, setSearchValue] = useState("")
  const [activeSearch, setActiveSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const handleSearch = () => {
    setActiveSearch(searchValue)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Reset filters when switching tabs
    setSearchValue("")
    setActiveSearch("")
    setSelectedCategory("All")
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#05000d" }}>
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            Explore <span className="text-[#9383c7]">Marketplace</span>
          </h1>
          <p className="text-gray-400">Browse all available datasets and AI models</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-8 bg-white/5 border border-white/10 backdrop-blur-xl p-1 rounded-full">
            <TabsTrigger
              value="datasets"
              className="rounded-full data-[state=active]:bg-[#602fc0] data-[state=active]:text-white"
            >
              Datasets
            </TabsTrigger>
            <TabsTrigger
              value="models"
              className="rounded-full data-[state=active]:bg-[#602fc0] data-[state=active]:text-white"
            >
              AI Models
            </TabsTrigger>
          </TabsList>

          <div className="mb-8">
            <SearchBar
              type={activeTab === "datasets" ? "datasets" : "models"}
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
            />
          </div>

          <div className="mb-8">
            <CategoryFilter
              type={activeTab === "datasets" ? "datasets" : "models"}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          <TabsContent value="datasets">
            <DatasetGrid category={selectedCategory} search={activeSearch} />
          </TabsContent>

          <TabsContent value="models">
            <ModelGrid category={selectedCategory} search={activeSearch} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
