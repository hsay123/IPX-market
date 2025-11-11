import { Database, Brain, Star, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const featured = [
  {
    type: "dataset",
    title: "High-Quality Image Dataset",
    description: "A comprehensive collection of 100,000+ labeled images",
    price: "0.5 ETH",
    rating: 4.8,
    downloads: 1250,
    image: "/ai-neural-network.png",
  },
  {
    type: "model",
    title: "ResNet-50 Image Classifier",
    description: "Pre-trained model fine-tuned on custom dataset",
    price: "0.8 ETH",
    rating: 4.8,
    downloads: 456,
    image: "/machine-learning-model-3d.jpg",
  },
  {
    type: "dataset",
    title: "Social Media Sentiment Analysis",
    description: "Comprehensive social media posts with sentiment labels",
    price: "0.45 ETH",
    rating: 4.8,
    downloads: 1450,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CDtvNewIOVmcmI5HgkaXWIe1nyLd9C.png",
  },
]

export function FeaturedSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Featured Assets</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover premium datasets and AI models from our top creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white/5 border backdrop-blur-xl overflow-hidden border-[rgba(96,47,192,1)]"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-6 border-[rgba(96,47,192,1)]">
                <div className="flex items-center gap-2 mb-3">
                  {item.type === "dataset" ? (
                    <Database className="h-4 w-4 text-[#602fc0]" />
                  ) : (
                    <Brain className="h-4 w-4 text-[#602fc0]" />
                  )}
                  <span className="text-xs font-medium text-gray-400 uppercase">{item.type}</span>
                </div>

                <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{item.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{item.downloads}</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[#602fc0]">{item.price}</div>
                </div>

                <Button
                  className="w-full px-6 py-2 rounded-full font-medium bg-[#602fc0] text-white hover:bg-[#5027a8] transition-all duration-200"
                  asChild
                >
                  <Link href={`/${item.type}s/${index + 1}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="px-6 py-2 rounded-full font-medium bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all duration-200"
            asChild
          >
            <Link href="/explore">View All Assets</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
