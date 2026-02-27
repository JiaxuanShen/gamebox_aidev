"use client"
import { useCallback, useState } from "react"
import { initGomoku, placeStone, GomokuState } from "@/lib/games/gomoku"

export function useGomoku() {
  const [state, setState] = useState<GomokuState>(() => initGomoku())
  const start = useCallback(() => setState(s => ({ ...s, status: "playing" })), [])
  const restart = useCallback(() => setState(initGomoku()), [])
  const place = useCallback((r: number, c: number) => setState(s => placeStone(s, r, c)), [])
  return { state, start, restart, place }
}
