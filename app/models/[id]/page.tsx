import { Navbar } from "@/components/navbar"
import { ModelDetail } from "@/components/model-detail"

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-foreground">
      <Navbar />
      <ModelDetail id={id} />
    </div>
  )
}
