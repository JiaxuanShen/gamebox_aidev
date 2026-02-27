export type Board = number[][]
export type SwipeDir = "up" | "down" | "left" | "right"

export interface Game2048State {
  board: Board
  score: number
  status: "idle" | "playing" | "game_over" | "won"
}

function emptyBoard(): Board {
  return Array.from({ length: 4 }, () => Array(4).fill(0))
}

function addRandomTile(board: Board): Board {
  const empty: [number, number][] = []
  board.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]) }))
  if (!empty.length) return board
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const next = board.map(row => [...row])
  next[r][c] = Math.random() < 0.9 ? 2 : 4
  return next
}

export function initGame2048(): Game2048State {
  let board = emptyBoard()
  board = addRandomTile(board)
  board = addRandomTile(board)
  return { board, score: 0, status: "idle" }
}

function slideRow(row: number[]): { row: number[]; score: number } {
  const nums = row.filter(Boolean)
  let score = 0
  const merged: number[] = []
  let i = 0
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      merged.push(nums[i] * 2)
      score += nums[i] * 2
      i += 2
    } else {
      merged.push(nums[i++])
    }
  }
  while (merged.length < 4) merged.push(0)
  return { row: merged, score }
}

function transpose(board: Board): Board {
  return board[0].map((_, i) => board.map(row => row[i]))
}

export function move2048(state: Game2048State, dir: SwipeDir): Game2048State {
  if (state.status !== "playing") return state

  let board = state.board.map(r => [...r])
  let totalScore = 0

  // 统一转换为"向左滑"
  if (dir === "right") board = board.map(r => [...r].reverse())
  if (dir === "up") board = transpose(board)
  if (dir === "down") board = transpose(board).map(r => [...r].reverse())

  const newBoard = board.map(row => {
    const { row: slid, score } = slideRow(row)
    totalScore += score
    return slid
  })

  // 反转换回来
  let finalBoard = newBoard
  if (dir === "right") finalBoard = finalBoard.map(r => [...r].reverse())
  if (dir === "up") finalBoard = transpose(finalBoard)
  if (dir === "down") finalBoard = transpose(finalBoard.map(r => [...r].reverse()))

  const changed = JSON.stringify(finalBoard) !== JSON.stringify(state.board)
  if (!changed) return state

  const withTile = addRandomTile(finalBoard)
  const won = withTile.some(r => r.some(v => v >= 2048))
  const hasMove = withTile.some(r => r.some(v => !v)) ||
    withTile.some((r, i) => r.some((v, j) =>
      (i < 3 && withTile[i + 1][j] === v) || (j < 3 && v === r[j + 1])
    ))

  return {
    board: withTile,
    score: state.score + totalScore,
    status: won ? "won" : hasMove ? "playing" : "game_over",
  }
}
