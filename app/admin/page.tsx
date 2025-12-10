"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Plus, Edit2, Trash2, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  productId: string
  title: string
  description: string
  category: string
  price: string
  fileSize: number
  checksum: string
  version: string
  createdAt: string
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: "0" })

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Computer Vision",
    price: "0.01",
    fileSize: 0,
    checksum: "",
    version: "1.0.0",
  })

  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      if (data.success && data.products) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = editingProduct ? "PUT" : "POST"
      const url = editingProduct ? `/api/products/${editingProduct.productId}` : "/api/products"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Product ${editingProduct ? "updated" : "created"} successfully`,
        })
        setShowForm(false)
        setEditingProduct(null)
        setFormData({
          title: "",
          description: "",
          category: "Computer Vision",
          price: "0.01",
          fileSize: 0,
          checksum: "",
          version: "1.0.0",
        })
        fetchProducts()
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Deleted",
          description: "Product deleted successfully",
        })
        fetchProducts()
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      fileSize: product.fileSize,
      checksum: product.checksum,
      version: product.version,
    })
    setShowForm(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <Loader2 className="h-12 w-12 text-[#602fc0] mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage products and view marketplace statistics</p>
          </div>
          <Button
            size="lg"
            onClick={() => {
              setShowForm(true)
              setEditingProduct(null)
            }}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-3xl font-bold mt-1">{stats.totalProducts}</p>
              </div>
              <BarChart3 className="h-10 w-10 text-[#602fc0] opacity-50" />
            </div>
          </Card>
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-3xl font-bold mt-1">{stats.totalOrders}</p>
              </div>
              <BarChart3 className="h-10 w-10 text-green-500 opacity-50" />
            </div>
          </Card>
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">{stats.totalRevenue} IP</p>
              </div>
              <BarChart3 className="h-10 w-10 text-yellow-500 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Add/Edit Product Form */}
        {showForm && (
          <Card className="p-6 bg-white/5 border-white/10 mb-8">
            <h2 className="text-2xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-4 py-2 bg-black/30 border border-white/10 rounded text-white placeholder-gray-500"
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-2 bg-black/30 border border-white/10 rounded text-white"
                >
                  <option>Computer Vision</option>
                  <option>Natural Language Processing</option>
                  <option>Audio Processing</option>
                  <option>Climate Data</option>
                </select>
                <input
                  type="number"
                  placeholder="Price (IP)"
                  step="0.001"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="px-4 py-2 bg-black/30 border border-white/10 rounded text-white placeholder-gray-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="px-4 py-2 bg-black/30 border border-white/10 rounded text-white placeholder-gray-500"
                  required
                />
              </div>
              <textarea
                placeholder="Product Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded text-white placeholder-gray-500 h-24"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="File Size (bytes)"
                  value={formData.fileSize}
                  onChange={(e) => setFormData({ ...formData, fileSize: Number.parseInt(e.target.value) })}
                  className="px-4 py-2 bg-black/30 border border-white/10 rounded text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  placeholder="SHA-256 Checksum"
                  value={formData.checksum}
                  onChange={(e) => setFormData({ ...formData, checksum: e.target.value })}
                  className="px-4 py-2 bg-black/30 border border-white/10 rounded text-white placeholder-gray-500"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingProduct ? "Update" : "Create"} Product</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Products Table */}
        <Card className="p-6 bg-white/5 border-white/10">
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No products yet. Create your first product to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Version</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.productId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">{product.title}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">{product.price} IP</td>
                      <td className="py-3 px-4">{product.version}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(product.productId)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
