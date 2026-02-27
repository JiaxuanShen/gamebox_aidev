// lib/theme.ts
export const CYBER_COLORS = {
  cyan: "#00ffcc",
  purple: "#b344ff",
  pink: "#ff2d78",
  yellow: "#ffe600",
  bg: "#0a0a0f",
  card: "#111118",
  border: "#1e1e2e",
} as const

export type CyberColor = keyof typeof CYBER_COLORS

export const GAME_CATEGORY_COLORS: Record<string, string> = {
  puzzle: CYBER_COLORS.cyan,
  arcade: CYBER_COLORS.pink,
  board: CYBER_COLORS.purple,
  casual: CYBER_COLORS.yellow,
}
