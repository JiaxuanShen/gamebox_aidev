"use client"
import { useCallback, useEffect, useState } from "react"
import { initMemory, flipCard, resolveFlip, MemoryState } from "@/lib/games/memory"
import { submitScore } from "@/lib/submitScore"

export function useMemory() {
  const [state, setState] = useState<MemoryState>(() => initMemory())

  // 游戏结束时自动提交分数
  useEffect(() => {
    if (state.status === "game_over" && state.score > 0) {
      submitScore("memory", state.score)
    }
  }, [state.status, state.score])

  const start = useCallback(() => setState(s => ({ ...s, status: "playing" })), [])
  const restart = useCallback(() => setState(initMemory()), [])
  const flip = useCallback((id: number) => setState(s => flipCard(s, id)), [])

  // 0.8秒后自动翻回不匹配的牌
  useEffect(() => {
    if (state.status === "checking") {
      const t = setTimeout(() => setState(s => resolveFlip(s)), 800)
      return () => clearTimeout(t)
    }
  }, [state.status, state.selected])

  return { state, start, restart, flip }
}
