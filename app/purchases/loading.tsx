export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 border-4 border-[#602fc0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading purchases...</p>
      </div>
    </div>
  )
}
