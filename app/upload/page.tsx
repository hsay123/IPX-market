import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Database, Brain, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function UploadPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#05000d" }}>
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">Upload Your Assets</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Share your datasets and AI models with the community. Earn ETH from every download while maintaining full
              IP rights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-[#602fc0]/20">
                  <Database className="h-6 w-6 text-[#602fc0]" />
                </div>
                <h2 className="text-xl font-bold text-white">Upload Dataset</h2>
              </div>
              <p className="text-gray-300 mb-6">Share your valuable datasets for AI training and research</p>
              <ul className="space-y-2 mb-6 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-[#602fc0] mt-1">•</span>
                  <span>Support for multiple formats (CSV, JSON, ZIP, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#602fc0] mt-1">•</span>
                  <span>Blockchain-verified ownership</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#602fc0] mt-1">•</span>
                  <span>Story Protocol IP protection</span>
                </li>
              </ul>
              <Button
                className="w-full px-6 py-2 rounded-full font-medium bg-[#602fc0] text-white hover:bg-[#5027a8]"
                asChild
              >
                <Link href="/upload/dataset">
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-[#602fc0]/20">
                  <Brain className="h-6 w-6 text-[#602fc0]" />
                </div>
                <h2 className="text-xl font-bold text-white">Upload AI Model</h2>
              </div>
              <p className="text-gray-300 mb-6">Share your trained models and earn from every use</p>
              <ul className="space-y-2 mb-6 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-[#602fc0] mt-1">•</span>
                  <span>Support for PyTorch, TensorFlow, ONNX, and more</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#602fc0] mt-1">•</span>
                  <span>Include training details and performance metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#602fc0] mt-1">•</span>
                  <span>Automated licensing with smart contracts</span>
                </li>
              </ul>
              <Button
                className="w-full px-6 py-2 rounded-full font-medium bg-[#602fc0] text-white hover:bg-[#5027a8]"
                asChild
              >
                <Link href="/upload/model">
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl border border-white/10 bg-white/5">
            <h3 className="font-semibold mb-2 text-white">Need Help?</h3>
            <p className="text-sm text-gray-300">
              Check out our{" "}
              <Link href="/docs" className="text-[#602fc0] hover:underline">
                documentation
              </Link>{" "}
              for guidelines on preparing your datasets and models for upload.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
