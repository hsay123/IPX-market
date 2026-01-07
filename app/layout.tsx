import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { Web3Provider } from "@/lib/web3"
import { StoryProvider } from "@/app/providers"
import { Space_Grotesk, JetBrains_Mono, Inter as V0_Font_Inter, Playfair_Display as V0_Font_Playfair_Display } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _playfairDisplay = V0_Font_Playfair_Display({ subsets: ['latin'], weight: ["400","500","600","700","800","900"] })

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "DataVault AI - Decentralized AI Marketplace",
  description: "Trade datasets and AI models on the blockchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-serif antialiased`}>
        <StoryProvider>
          <Web3Provider>{children}</Web3Provider>
        </StoryProvider>
      </body>
    </html>
  )
}
