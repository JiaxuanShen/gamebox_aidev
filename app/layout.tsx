import type { Metadata } from "next"
import { Geist_Mono, Press_Start_2P } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: "GameBox | 小游戏合集",
  description: "4款经典小游戏，贪吃蛇、2048、五子棋、记忆翻牌，支持全球排行榜",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${geistMono.variable} ${pressStart2P.variable} antialiased bg-[#0a0a0f] text-gray-100 min-h-screen`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  )
}
