"use client"
import { useEffect, useRef } from "react"
import { GameLayout } from "@/components/GameLayout"
import { useSnake } from "@/hooks/useSnake"

const CELL = 24
const CYAN = "#00ffcc"
const PINK = "#ff2d78"
const GRID_COLOR = "#1e1e2e"
const BG_COLOR = "#0a0a0f"

export default function SnakePage() {
  const { state, start, pause, restart } = useSnake()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const size = state.gridSize * CELL
    canvas.width = size
    canvas.height = size

    // 背景
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, size, size)

    // 网格线
    ctx.strokeStyle = GRID_COLOR
    ctx.lineWidth = 0.5
    for (let i = 0; i <= state.gridSize; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, size); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(size, i * CELL); ctx.stroke()
    }

    // 蛇身
    state.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? CYAN : `${CYAN}99`
      if (i === 0) {
        ctx.shadowColor = CYAN
        ctx.shadowBlur = 8
      } else {
        ctx.shadowBlur = 0
      }
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
    })
    ctx.shadowBlur = 0

    // 食物
    ctx.fillStyle = PINK
    ctx.shadowColor = PINK
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(state.food.x * CELL + CELL / 2, state.food.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // 游戏结束遮罩
    if (state.status === "game_over") {
      ctx.fillStyle = "rgba(0,0,0,0.75)"
      ctx.fillRect(0, 0, size, size)
      ctx.shadowColor = PINK
      ctx.shadowBlur = 20
      ctx.fillStyle = PINK
      ctx.font = `bold 20px 'Courier New', monospace`
      ctx.textAlign = "center"
      ctx.fillText("GAME OVER", size / 2, size / 2 - 10)
      ctx.shadowBlur = 0
      ctx.fillStyle = "#aaa"
      ctx.font = `14px monospace`
      ctx.fillText(`SCORE: ${state.score}`, size / 2, size / 2 + 20)
    }

    // 暂停遮罩
    if (state.status === "paused") {
      ctx.fillStyle = "rgba(0,0,0,0.5)"
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = CYAN
      ctx.font = `bold 18px monospace`
      ctx.textAlign = "center"
      ctx.fillText("PAUSED", size / 2, size / 2)
    }
  }, [state])

  return (
    <GameLayout
      gameName="贪吃蛇"
      score={state.score}
      bestScore={state.score}
      status={state.status}
      onStart={start}
      onPause={pause}
      onRestart={restart}
    >
      <div className="flex flex-col items-center p-4 bg-[#0a0a0f]">
        <canvas ref={canvasRef} className="block" style={{ imageRendering: "pixelated" }} />
        {state.status === "idle" && (
          <p className="mt-3 text-xs font-mono text-gray-500">方向键 / WASD 控制移动</p>
        )}
      </div>
    </GameLayout>
  )
}
