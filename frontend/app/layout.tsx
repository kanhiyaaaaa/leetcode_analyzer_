import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://leetpro.vercel.app"), // ← Replace with your actual domain
  title: "LeetCode Profile Analyzer",
  description: "Get personalized DSA mentoring based on your LeetCode profile",
  keywords: ["LeetCode", "DSA", "Algorithms", "Data Structures", "Coding", "Programming", "Mentoring"],
  authors: [{ name: "LeetCode Analyzer Team" }],
  openGraph: {
    title: "LeetCode Profile Analyzer",
    description: "Get personalized DSA mentoring based on your LeetCode profile",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
