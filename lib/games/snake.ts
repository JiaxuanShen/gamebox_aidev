export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"
export interface Point { x: number; y: number }

export interface SnakeState {
  snake: Point[]
  food: Point
  direction: Direction
  score: number
  status: "idle" | "playing" | "paused" | "game_over"
  gridSize: number
}

function randomPoint(size: number, exclude: Point[]): Point {
  let p: Point
  do {
    p = { x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size) }
  } while (exclude.some(e => e.x === p.x && e.y === p.y))
  return p
}

export function initSnake(gridSize = 20): SnakeState {
  const snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
  return { snake, food: randomPoint(gridSize, snake), direction: "RIGHT", score: 0, status: "idle", gridSize }
}

export function tickSnake(state: SnakeState): SnakeState {
  if (state.status !== "playing") return state
  const head = state.snake[0]
  const dirs = { UP: {x:0,y:-1}, DOWN: {x:0,y:1}, LEFT: {x:-1,y:0}, RIGHT: {x:1,y:0} }
  const d = dirs[state.direction]
  const next = { x: head.x + d.x, y: head.y + d.y }
  const { gridSize } = state
  if (next.x < 0 || next.x >= gridSize || next.y < 0 || next.y >= gridSize ||
      state.snake.some(s => s.x === next.x && s.y === next.y)) {
    return { ...state, status: "game_over" }
  }
  const ateFood = next.x === state.food.x && next.y === state.food.y
  const newSnake = [next, ...state.snake.slice(0, ateFood ? undefined : -1)]
  const newFood = ateFood ? randomPoint(gridSize, newSnake) : state.food
  return { ...state, snake: newSnake, food: newFood, score: state.score + (ateFood ? 10 : 0) }
}

export function changeDirection(state: SnakeState, dir: Direction): SnakeState {
  const opposites: Record<Direction, Direction> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" }
  if (opposites[dir] === state.direction) return state
  return { ...state, direction: dir }
}
