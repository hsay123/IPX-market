import { Navbar } from "@/components/navbar"
import { DatasetUploadForm } from "@/components/dataset-upload-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UploadDatasetPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#05000d" }}>
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <Link href="/upload" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Upload Options
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">Upload Dataset</h1>
            <p className="text-gray-300">
              Share your valuable datasets with the AI community. All uploads are protected by blockchain technology.
            </p>
          </div>

          <DatasetUploadForm />
        </div>
      </div>
    </div>
  )
}
