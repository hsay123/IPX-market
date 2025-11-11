import { Navbar } from "@/components/navbar"
import { StatsSection } from "@/components/stats-section"
import { FeaturedSection } from "@/components/featured-section"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Globe } from "lucide-react"
import Link from "next/link"
import DarkVeil from "@/components/dark-veil"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden pt-32 pb-20">
        {/* Dark Veil Background */}
        <div className="absolute inset-0 z-0">
          <DarkVeil
            hueShift={0}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0}
            warpAmount={0}
            resolutionScale={1}
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              The Future of AI
              <br />
              <span className="text-[#602fc0]">Data Marketplace</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Trade datasets and AI models on the blockchain. Secure, transparent, and powered by Story Protocol for IP
              protection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/explore">
                <Button
                  size="lg"
                  className="px-6 py-2 rounded-full font-medium bg-[#602fc0] text-white hover:bg-[#5027a8] transition-all duration-200"
                >
                  Explore Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/upload">
                <Button
                  size="lg"
                  className="px-6 py-2 rounded-full font-medium bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all duration-200"
                >
                  Upload Your Asset
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              <div className="p-6 rounded-2xl bg-white/5 border backdrop-blur-xl border-[rgba(96,47,192,1)]">
                <Shield className="h-10 w-10 text-[#602fc0] mb-4 mx-auto" />
                <h3 className="font-bold mb-2 text-white">Blockchain Security</h3>
                <p className="text-sm text-gray-300">All transactions secured on Ethereum with smart contracts</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border backdrop-blur-xl border-[rgba(96,47,192,1)]">
                <Zap className="h-10 w-10 text-[#602fc0] mb-4 mx-auto" />
                <h3 className="font-bold mb-2 text-white">IP Protection</h3>
                <p className="text-sm text-gray-300">Story Protocol ensures your intellectual property rights</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border backdrop-blur-xl border-[rgba(96,47,192,1)]">
                <Globe className="h-10 w-10 text-[#602fc0] mb-4 mx-auto" />
                <h3 className="font-bold mb-2 text-white">Global Marketplace</h3>
                <p className="text-sm text-gray-300">Connect with data scientists and AI developers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Section */}
      <FeaturedSection />

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto relative" style={{ marginTop: '2rem' }}>
            {/* Dark Veil Background - positioned exactly behind the box */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden z-0">
              <DarkVeil
                hueShift={0}
                noiseIntensity={0}
                scanlineIntensity={0}
                speed={0.5}
                scanlineFrequency={0}
                warpAmount={0}
                resolutionScale={1}
              />
            </div>
            <div className="relative z-10 p-12 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Start Trading?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of data scientists and AI developers building the future of decentralized AI.
            </p>
            <Button
              size="lg"
              className="px-6 py-2 rounded-full font-medium bg-[#602fc0] text-white hover:bg-[#5027a8] transition-all duration-200"
            >
              Connect Your Wallet
            </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#602fc0]">
                <span className="text-sm font-bold text-white">IPX</span>
              </div>
              <span className="font-bold text-white">IPX Market</span>
            </div>
            <div className="text-sm text-gray-300">© 2025 IPX Market. All rights reserved.</div>
            <div className="flex gap-6 text-sm text-gray-300">
              <Link href="/about" className="hover:text-white transition-all duration-300">
                About
              </Link>
              <Link href="/docs" className="hover:text-white transition-all duration-300">
                Docs
              </Link>
              <Link href="/support" className="hover:text-white transition-all duration-300">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
