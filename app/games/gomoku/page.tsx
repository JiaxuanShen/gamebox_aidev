"use client"
import { GameLayout } from "@/components/GameLayout"
import { useGomoku } from "@/hooks/useGomoku"

const CELL = 32
const CYAN = "#00ffcc"
const PURPLE = "#b344ff"
const GRID_BG = "#0a0a0f"
const LINE_COLOR = "#1e1e2e"

export default function GomokuPage() {
  const { state, start, restart, place } = useGomoku()
  const size = state.size
  const boardPx = (size - 1) * CELL

  return (
    <GameLayout
      gameName="五子棋"
      score={0}
      bestScore={0}
      status={state.status}
      onStart={start}
      onPause={() => {}}
      onRestart={restart}
    >
      <div
        className="flex flex-col items-center p-4"
        style={{ backgroundColor: GRID_BG }}
      >
        {/* 当前玩家提示 */}
        <div className="mb-3 text-xs font-mono text-gray-400">
          {state.status === "game_over"
            ? <span style={{ color: state.winner === 1 ? CYAN : PURPLE }}>
                {state.winner === 1 ? "⚫ 黑棋获胜！" : "⚪ 白棋获胜！"}
              </span>
            : state.status === "playing"
            ? <span>当前：<span style={{ color: state.current === 1 ? CYAN : PURPLE }}>
                {state.current === 1 ? "⚫ 黑棋" : "⚪ 白棋"}
              </span></span>
            : <span>点击开始游戏</span>
          }
        </div>

        {/* 棋盘 */}
        <div
          className="relative overflow-auto"
          style={{ width: boardPx + CELL, height: boardPx + CELL }}
        >
          {/* SVG 棋盘线和棋子 */}
          <svg
            className="absolute top-0 left-0"
            width={boardPx + CELL}
            height={boardPx + CELL}
            style={{ overflow: "visible" }}
          >
            {/* 棋盘线 */}
            {Array.from({ length: size }).map((_, i) => (
              <g key={i}>
                <line
                  x1={CELL / 2} y1={CELL / 2 + i * CELL}
                  x2={boardPx + CELL / 2} y2={CELL / 2 + i * CELL}
                  stroke={LINE_COLOR} strokeWidth={1}
                />
                <line
                  x1={CELL / 2 + i * CELL} y1={CELL / 2}
                  x2={CELL / 2 + i * CELL} y2={boardPx + CELL / 2}
                  stroke={LINE_COLOR} strokeWidth={1}
                />
              </g>
            ))}
            {/* 棋子 */}
            {state.board.map((row, r) =>
              row.map((cell, c) =>
                cell !== 0 ? (
                  <circle
                    key={`${r}-${c}`}
                    cx={CELL / 2 + c * CELL}
                    cy={CELL / 2 + r * CELL}
                    r={CELL / 2 - 3}
                    fill={cell === 1 ? "#111" : "#eee"}
                    stroke={cell === 1 ? CYAN : PURPLE}
                    strokeWidth={1.5}
                  />
                ) : null
              )
            )}
          </svg>
          {/* 点击区域 */}
          {state.board.map((row, r) =>
            row.map((_, c) => (
              <div
                key={`${r}-${c}`}
                className="absolute cursor-pointer"
                style={{
                  left: c * CELL,
                  top: r * CELL,
                  width: CELL,
                  height: CELL,
                }}
                onClick={() => place(r, c)}
                title={`${r},${c}`}
              />
            ))
          )}
        </div>
      </div>
    </GameLayout>
  )
}
