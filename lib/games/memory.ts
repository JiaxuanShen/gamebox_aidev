export interface MemoryCard {
  id: number
  symbol: string
  flipped: boolean
  matched: boolean
}

export interface MemoryState {
  cards: MemoryCard[]
  selected: number[]
  score: number
  moves: number
  status: "idle" | "playing" | "checking" | "game_over"
}

// 使用几何图形符号而非 emoji（UI 更统一）
const SYMBOLS = ["◆", "▲", "●", "★", "■", "♦", "⬟", "⬡"]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function initMemory(): MemoryState {
  const cards = shuffle([...SYMBOLS, ...SYMBOLS]).map((symbol, id) => ({
    id,
    symbol,
    flipped: false,
    matched: false,
  }))
  return { cards, selected: [], score: 0, moves: 0, status: "idle" }
}

export function flipCard(state: MemoryState, id: number): MemoryState {
  if (state.status !== "playing") return state
  if (state.selected.length >= 2) return state
  const card = state.cards[id]
  if (!card || card.flipped || card.matched) return state

  const cards = state.cards.map(c => c.id === id ? { ...c, flipped: true } : c)
  const selected = [...state.selected, id]

  if (selected.length === 2) {
    const [a, b] = selected
    const matched = cards[a].symbol === cards[b].symbol
    const newCards = matched
      ? cards.map(c => (c.id === a || c.id === b) ? { ...c, matched: true } : c)
      : cards
    const allMatched = newCards.every(c => c.matched)
    return {
      cards: newCards,
      selected,
      moves: state.moves + 1,
      score: state.score + (matched ? 20 : 0),
      status: allMatched ? "game_over" : "checking",
    }
  }

  return { ...state, cards, selected, status: "playing" }
}

export function resolveFlip(state: MemoryState): MemoryState {
  if (state.status !== "checking") return state
  const [a, b] = state.selected
  const matched = state.cards[a]?.matched ?? false
  const cards = matched
    ? state.cards
    : state.cards.map(c => (c.id === a || c.id === b) ? { ...c, flipped: false } : c)
  return { ...state, cards, selected: [], status: "playing" }
}
