"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gamepad2 } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b border-[#1e1e2e] bg-[#111118]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Gamepad2
            className="w-5 h-5 text-[#00ffcc] group-hover:drop-shadow-[0_0_6px_#00ffcc] transition-all"
            strokeWidth={1.5}
          />
          <span
            className="font-['Press_Start_2P'] text-sm text-white tracking-wider"
            style={{ textShadow: "0 0 10px #00ffcc44" }}
          >
            GAME<span className="text-[#00ffcc]">BOX</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#1e1e2e] text-gray-400 hover:border-[#00ffcc] hover:text-[#00ffcc] transition-all duration-200 cursor-pointer font-mono text-xs"
          >
            登录
          </Button>
        </div>
      </div>
    </nav>
  )
}
