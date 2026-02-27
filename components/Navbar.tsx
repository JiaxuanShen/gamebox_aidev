"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Gamepad2, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

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
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400 hidden sm:block">
                {user.email?.split("@")[0] ?? user.user_metadata?.user_name ?? "玩家"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-[#ff2d78] cursor-pointer p-1"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogin}
              className="border-[#1e1e2e] text-gray-400 hover:border-[#00ffcc] hover:text-[#00ffcc] transition-all duration-200 cursor-pointer font-mono text-xs"
            >
              登录
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
