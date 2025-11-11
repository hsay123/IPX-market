import { Navbar } from "@/components/navbar"
import { DatasetDetail } from "@/components/dataset-detail"

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-foreground">
      <Navbar />
      <DatasetDetail id={id} />
    </div>
  )
}
