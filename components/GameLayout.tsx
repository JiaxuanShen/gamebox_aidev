"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GameStatus } from "@/types"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"

interface Props {
  gameName: string
  score: number
  bestScore: number
  status: GameStatus
  onStart: () => void
  onPause: () => void
  onRestart: () => void
  children: React.ReactNode
}

export function GameLayout({
  gameName,
  score,
  bestScore,
  status,
  onStart,
  onPause,
  onRestart,
  children,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 顶栏 */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-gray-500 hover:text-[#00ffcc] transition-colors text-xs font-mono cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          返回大厅
        </Link>
        <h2
          className="font-['Press_Start_2P'] text-sm text-[#00ffcc]"
          style={{ textShadow: "0 0 10px #00ffcc66" }}
        >
          {gameName}
        </h2>
        <div className="flex gap-4 text-xs font-mono">
          <span className="text-gray-500">
            SCORE <span className="text-white ml-1">{score}</span>
          </span>
          <span className="text-gray-500">
            BEST <span className="text-[#ffe600] ml-1">{bestScore}</span>
          </span>
        </div>
      </div>

      {/* 游戏区域 */}
      <div className="border border-[#1e1e2e] rounded-lg overflow-hidden bg-[#0a0a0f]">
        {children}
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-2 mt-4 justify-center">
        {status === "idle" && (
          <Button
            onClick={onStart}
            className="bg-[#00ffcc] text-black hover:bg-[#00ffcc]/80 font-mono text-xs cursor-pointer"
          >
            <Play className="w-3 h-3 mr-1" />
            开始游戏
          </Button>
        )}
        {status === "playing" && (
          <Button
            onClick={onPause}
            variant="outline"
            className="border-[#1e1e2e] text-gray-300 hover:border-[#00ffcc] font-mono text-xs cursor-pointer"
          >
            <Pause className="w-3 h-3 mr-1" />
            暂停
          </Button>
        )}
        {status === "paused" && (
          <Button
            onClick={onStart}
            className="bg-[#00ffcc] text-black hover:bg-[#00ffcc]/80 font-mono text-xs cursor-pointer"
          >
            <Play className="w-3 h-3 mr-1" />
            继续
          </Button>
        )}
        {status === "game_over" && (
          <>
            <Button
              onClick={onRestart}
              className="bg-[#ff2d78] text-white hover:bg-[#ff2d78]/80 font-mono text-xs cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              再来一局
            </Button>
            <Button
              variant="outline"
              className="border-[#1e1e2e] text-gray-400 hover:border-[#1e1e2e] font-mono text-xs cursor-pointer"
              asChild
            >
              <Link href="/">返回大厅</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
