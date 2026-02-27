export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          slug: string
          name: string
          category: string
          description: string
          thumbnail: string | null
          created_at: string
        }
        Insert: {
          slug: string
          name: string
          category: string
          description?: string
          thumbnail?: string | null
        }
      }
      scores: {
        Row: {
          id: string
          user_id: string
          game_slug: string
          score: number
          created_at: string
        }
        Insert: {
          user_id: string
          game_slug: string
          score: number
        }
      }
    }
  }
}
