"use client"
import { GameLayout } from "@/components/GameLayout"
import { useMemory } from "@/hooks/useMemory"

const CYAN = "#00ffcc"
const PURPLE = "#b344ff"
const PINK = "#ff2d78"
const YELLOW = "#ffe600"
const CARD_COLORS = [CYAN, PURPLE, PINK, YELLOW, CYAN, PURPLE, PINK, YELLOW]

export default function MemoryPage() {
  const { state, start, restart, flip } = useMemory()

  return (
    <GameLayout
      gameName="记忆翻牌"
      score={state.score}
      bestScore={state.score}
      status={state.status === "checking" ? "playing" : state.status}
      onStart={start}
      onPause={() => {}}
      onRestart={restart}
    >
      <div className="bg-[#0a0a0f] p-6">
        {/* 步数 */}
        <div className="text-center mb-4 text-xs font-mono text-gray-500">
          {state.status === "game_over" ? (
            <span style={{ color: CYAN }}>全部配对！共 {state.moves} 步</span>
          ) : state.status !== "idle" ? (
            <span>步数：{state.moves}</span>
          ) : (
            <span>翻开两张相同的牌</span>
          )}
        </div>

        {/* 卡片网格 */}
        <div
          className="grid gap-3 mx-auto"
          style={{ gridTemplateColumns: "repeat(4, 1fr)", maxWidth: "280px" }}
        >
          {state.cards.map((card, idx) => {
            const isVisible = card.flipped || card.matched
            const color = CARD_COLORS[idx % CARD_COLORS.length]
            return (
              <div
                key={card.id}
                onClick={() => flip(card.id)}
                className="aspect-square flex items-center justify-center rounded cursor-pointer select-none font-bold text-lg transition-all duration-300"
                style={{
                  backgroundColor: isVisible ? "#1e1e2e" : "#111118",
                  border: `1px solid ${isVisible ? (card.matched ? CYAN : "#2e2e4e") : "#1e1e2e"}`,
                  color: card.matched ? CYAN : color,
                  boxShadow: card.matched ? `0 0 8px ${CYAN}44` : "none",
                  transform: isVisible ? "rotateY(0deg)" : "rotateY(90deg)",
                  cursor: card.matched ? "default" : "pointer",
                }}
              >
                {isVisible ? card.symbol : ""}
              </div>
            )
          })}
        </div>
      </div>
    </GameLayout>
  )
}
