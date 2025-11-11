"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/lib/web3"
import { Database, Brain, Search, Menu, Wallet, Home } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const { account, isConnecting, connect, disconnect } = useWeb3()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
      <div className="flex justify-between items-center px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#602fc0]">
            <span className="text-sm font-bold text-white">IPX</span>
          </div>
          <span className="text-3xl font-bold text-white hidden sm:inline">
            IP<span style={{ color: "#582BB1", fontWeight: "bold" }}>X</span> Market
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/datasets"
            className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300"
          >
            <Database className="h-4 w-4" />
            Datasets
          </Link>
          <Link
            href="/models"
            className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300"
          >
            <Brain className="h-4 w-4" />
            AI Models
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300"
          >
            <Search className="h-4 w-4" />
            Explore
          </Link>
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center gap-3">
          {account ? (
            <>
              <Button
                variant="outline"
                asChild
                className="hidden md:flex px-6 py-2 rounded-full font-medium bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all duration-200"
              >
                <Link href="/upload">Upload Asset</Link>
              </Button>
              <Button
                onClick={disconnect}
                className="px-6 py-2 rounded-full font-medium bg-[#602fc0] text-white hover:bg-[#5027a8] transition-all duration-200"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {formatAddress(account)}
              </Button>
            </>
          ) : (
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="px-6 py-2 rounded-full font-medium bg-[#602fc0] text-white hover:bg-[#5027a8] transition-all duration-200"
            >
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#05000d] border-white/10">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" className="flex items-center gap-2 text-lg font-medium text-gray-300 hover:text-white">
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link
                  href="/datasets"
                  className="flex items-center gap-2 text-lg font-medium text-gray-300 hover:text-white"
                >
                  <Database className="h-5 w-5" />
                  Datasets
                </Link>
                <Link
                  href="/models"
                  className="flex items-center gap-2 text-lg font-medium text-gray-300 hover:text-white"
                >
                  <Brain className="h-5 w-5" />
                  AI Models
                </Link>
                <Link
                  href="/explore"
                  className="flex items-center gap-2 text-lg font-medium text-gray-300 hover:text-white"
                >
                  <Search className="h-5 w-5" />
                  Explore
                </Link>
                {account && (
                  <Link href="/upload">
                    <Button className="w-full px-6 py-2 rounded-full font-medium bg-[#602fc0] text-white hover:bg-[#5027a8] transition-all duration-200">
                      Upload Asset
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
