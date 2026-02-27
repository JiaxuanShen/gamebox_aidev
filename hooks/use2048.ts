"use client"
import { useCallback, useEffect, useState } from "react"
import { initGame2048, move2048, Game2048State, SwipeDir } from "@/lib/games/2048"
import { submitScore } from "@/lib/submitScore"

export function use2048() {
  const [state, setState] = useState<Game2048State>(() => initGame2048())

  const start = useCallback(() => setState(s => ({ ...s, status: "playing" })), [])
  const restart = useCallback(() => setState(initGame2048()), [])

  // 游戏结束时自动提交分数
  useEffect(() => {
    if ((state.status === "game_over" || state.status === "won") && state.score > 0) {
      submitScore("2048", state.score)
    }
  }, [state.status, state.score])

  useEffect(() => {
    const map: Record<string, SwipeDir> = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    }
    const handler = (e: KeyboardEvent) => {
      if (map[e.key]) {
        e.preventDefault()
        setState(s => move2048(s, map[e.key]))
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return { state, start, restart }
}
