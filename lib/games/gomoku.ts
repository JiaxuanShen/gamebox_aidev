export type Cell = 0 | 1 | 2  // 0=空 1=黑 2=白
export type GomokuBoard = Cell[][]

export interface GomokuState {
  board: GomokuBoard
  current: 1 | 2
  winner: 0 | 1 | 2
  status: "idle" | "playing" | "game_over"
  size: number
}

export function initGomoku(size = 15): GomokuState {
  return {
    board: Array.from({ length: size }, () => Array(size).fill(0) as Cell[]),
    current: 1,
    winner: 0,
    status: "idle",
    size,
  }
}

function checkWin(board: GomokuBoard, r: number, c: number, player: 1 | 2, size: number): boolean {
  const dirs: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]]
  return dirs.some(([dr, dc]) => {
    let count = 1
    for (const d of [1, -1]) {
      let nr = r + dr * d
      let nc = c + dc * d
      while (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc] === player) {
        count++
        nr += dr * d
        nc += dc * d
      }
    }
    return count >= 5
  })
}

export function placeStone(state: GomokuState, r: number, c: number): GomokuState {
  if (state.status !== "playing" || state.board[r][c] !== 0) return state
  const board = state.board.map(row => [...row] as Cell[])
  board[r][c] = state.current
  const won = checkWin(board, r, c, state.current, state.size)
  return {
    ...state,
    board,
    winner: won ? state.current : 0,
    status: won ? "game_over" : "playing",
    current: won ? state.current : (state.current === 1 ? 2 : 1),
  }
}
