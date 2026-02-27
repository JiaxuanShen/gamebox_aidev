"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { initSnake, tickSnake, changeDirection, SnakeState, Direction } from "@/lib/games/snake"
import { submitScore } from "@/lib/submitScore"

const TICK_MS = 150

export function useSnake() {
  const [state, setState] = useState<SnakeState>(() => initSnake())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    setState(s => ({ ...s, status: s.status === "idle" || s.status === "paused" ? "playing" : s.status }))
  }, [])

  const pause = useCallback(() => {
    setState(s => s.status === "playing" ? { ...s, status: "paused" } : s)
  }, [])

  const restart = useCallback(() => {
    setState(initSnake())
  }, [])

  useEffect(() => {
    if (state.status === "playing") {
      intervalRef.current = setInterval(() => setState(s => tickSnake(s)), TICK_MS)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [state.status])

  // 游戏结束时自动提交分数
  useEffect(() => {
    if (state.status === "game_over" && state.score > 0) {
      submitScore("snake", state.score)
    }
  }, [state.status, state.score])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      }
      if (map[e.key]) {
        e.preventDefault()
        setState(s => changeDirection(s, map[e.key]))
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return { state, start, pause, restart }
}
