export type GameCategory = "puzzle" | "arcade" | "board" | "casual"

export interface Game {
  slug: string
  name: string
  category: GameCategory
  description: string
  thumbnail?: string
  created_at?: string
}

export interface Score {
  id: string
  user_id: string
  game_slug: string
  score: number
  created_at: string
}

export interface LeaderboardEntry {
  rank: number
  user_id: string
  score: number
  created_at: string
}

export type GameStatus = "idle" | "playing" | "paused" | "game_over"
