"use client"
import { GameLayout } from "@/components/GameLayout"
import { use2048 } from "@/hooks/use2048"

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0:    { bg: "#1e1e2e", text: "#1e1e2e" },
  2:    { bg: "#2a2a3e", text: "#888" },
  4:    { bg: "#3a3a5e", text: "#aaa" },
  8:    { bg: "#00ccaa", text: "#000" },
  16:   { bg: "#00ffcc", text: "#000" },
  32:   { bg: "#9933ee", text: "#fff" },
  64:   { bg: "#b344ff", text: "#fff" },
  128:  { bg: "#ff2d78", text: "#fff" },
  256:  { bg: "#ff5588", text: "#fff" },
  512:  { bg: "#ffe600", text: "#000" },
  1024: { bg: "#ffaa00", text: "#000" },
  2048: { bg: "#ff6600", text: "#fff" },
}

function getTileStyle(val: number) {
  const colors = TILE_COLORS[val] ?? { bg: "#ff4400", text: "#fff" }
  return colors
}

export default function Game2048Page() {
  const { state, start, restart } = use2048()

  return (
    <GameLayout
      gameName="2048"
      score={state.score}
      bestScore={state.score}
      status={state.status === "won" ? "game_over" : state.status}
      onStart={start}
      onPause={() => {}}
      onRestart={restart}
    >
      <div className="bg-[#0a0a0f] p-6">
        <div
          className="grid gap-2 mx-auto"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            maxWidth: "280px",
          }}
        >
          {state.board.flat().map((val, i) => {
            const { bg, text } = getTileStyle(val)
            return (
              <div
                key={i}
                className="aspect-square flex items-center justify-center rounded font-mono font-bold text-base transition-all duration-150"
                style={{ backgroundColor: bg, color: text }}
              >
                {val > 0 ? val : ""}
              </div>
            )
          })}
        </div>
        {(state.status === "game_over" || state.status === "won") && (
          <div
            className="text-center mt-4 font-mono text-lg font-bold"
            style={{ color: state.status === "won" ? "#ffe600" : "#ff2d78" }}
          >
            {state.status === "won" ? "YOU WIN!" : "GAME OVER"}
          </div>
        )}
        {state.status === "playing" && (
          <p className="text-center mt-3 text-xs font-mono text-gray-600">方向键滑动合并方块</p>
        )}
      </div>
    </GameLayout>
  )
}
