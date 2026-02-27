# GameBox AIdev Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一个类 4399 的小游戏合集网站，包含 4 款经典游戏、用户登录和全球排行榜。

**Architecture:** Next.js 14 App Router 单体应用，游戏逻辑与 React 解耦（纯 TS 在 lib/games/），通过 React Hook 桥接到组件层。Supabase 提供 Auth、PostgreSQL 数据库和 Realtime 排行榜订阅。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Supabase (Auth + PostgreSQL + Realtime), Canvas API

---

## Task 1: 项目脚手架

**Files:**
- Create: `package.json` (由 CLI 生成)
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `tailwind.config.ts`
- Create: `components.json` (shadcn/ui 配置)

**Step 1: 初始化 Next.js 项目**

```bash
cd d:/github_code/gamebox_aidev
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

预期输出：项目文件生成完毕，包含 `app/`, `public/`, `package.json`

**Step 2: 安装 shadcn/ui**

```bash
npx shadcn@latest init
```

配置选项：
- Style: Default
- Base color: Slate
- CSS variables: Yes

**Step 3: 安装核心依赖**

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D @types/node
```

**Step 4: 验证项目启动**

```bash
npm run dev
```

打开浏览器访问 `http://localhost:3000`，应看到 Next.js 默认页面。

**Step 5: 提交**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with shadcn/ui and Supabase deps"
```

---

## Task 2: 暗色赛博朋克主题配置

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Create: `lib/theme.ts`

**Step 1: 配置 Tailwind 暗色主题色板**

修改 `tailwind.config.ts`，添加自定义颜色：

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0a0a0f",
          card: "#111118",
          border: "#1e1e2e",
          cyan: "#00ffcc",
          purple: "#b344ff",
          pink: "#ff2d78",
          yellow: "#ffe600",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
```

**Step 2: 设置全局 CSS 变量**

在 `app/globals.css` 添加：

```css
:root {
  --background: 240 10% 4%;
  --foreground: 0 0% 95%;
  --card: 240 10% 7%;
  --border: 240 6% 15%;
  --primary: 168 100% 50%;   /* cyber cyan */
  --secondary: 276 100% 63%; /* cyber purple */
}

body {
  background-color: #0a0a0f;
  color: #f0f0f5;
}
```

**Step 3: 创建主题常量文件**

```typescript
// lib/theme.ts
export const CYBER_COLORS = {
  cyan: "#00ffcc",
  purple: "#b344ff",
  pink: "#ff2d78",
  yellow: "#ffe600",
  bg: "#0a0a0f",
} as const

export const GAME_CATEGORY_COLORS: Record<string, string> = {
  puzzle: CYBER_COLORS.cyan,
  arcade: CYBER_COLORS.pink,
  board: CYBER_COLORS.purple,
  casual: CYBER_COLORS.yellow,
}
```

**Step 4: 提交**

```bash
git add -A
git commit -m "style: add cyberpunk dark theme configuration"
```

---

## Task 3: Supabase 项目配置

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `.env.local` (不提交到 git)
- Create: `.env.local.example`
- Modify: `middleware.ts`

**Step 1: 在 Supabase 控制台创建项目**

1. 访问 https://supabase.com/dashboard
2. 创建新项目，名称 `gamebox`
3. 记录 `Project URL` 和 `anon public key`

**Step 2: 创建 .env.local**

```bash
# .env.local（不提交 git）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Step 3: 创建 .env.local.example**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Step 4: 创建 Supabase 客户端**

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

**Step 5: 创建 Middleware**

```typescript
// middleware.ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  await supabase.auth.getUser()
  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
```

**Step 6: 提交**

```bash
git add -A -- ':!.env.local'
git commit -m "feat: configure Supabase client for Next.js App Router"
```

---

## Task 4: 数据库 Schema 和 RLS

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

**Step 1: 在 Supabase SQL Editor 执行建表语句**

```sql
-- 游戏元数据表
CREATE TABLE games (
  slug        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('puzzle', 'arcade', 'board', 'casual')),
  description TEXT NOT NULL DEFAULT '',
  thumbnail   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 分数表
CREATE TABLE scores (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_slug  TEXT REFERENCES games(slug) ON DELETE CASCADE NOT NULL,
  score      INTEGER NOT NULL CHECK (score >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE games  ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "games_read_public"   ON games  FOR SELECT USING (true);
CREATE POLICY "scores_read_public"  ON scores FOR SELECT USING (true);
CREATE POLICY "scores_insert_own"   ON scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 游戏初始数据
INSERT INTO games (slug, name, category, description) VALUES
  ('snake',  '贪吃蛇', 'arcade',  '经典街机游戏，控制蛇吃食物并越长越长'),
  ('2048',   '2048',   'puzzle',  '滑动方块合并数字，达到2048'),
  ('gomoku', '五子棋', 'board',   '双人对战，先连五子者获胜'),
  ('memory', '记忆翻牌', 'casual', '翻开配对的卡片，考验你的记忆力');
```

**Step 2: 保存迁移文件**

```sql
-- supabase/migrations/001_initial_schema.sql
-- （内容同上）
```

**Step 3: 提交**

```bash
git add supabase/
git commit -m "feat: add database schema with RLS policies"
```

---

## Task 5: TypeScript 类型定义

**Files:**
- Create: `types/index.ts`
- Create: `types/database.ts`

**Step 1: 定义应用类型**

```typescript
// types/index.ts
export interface Game {
  slug: string
  name: string
  category: "puzzle" | "arcade" | "board" | "casual"
  description: string
  thumbnail?: string
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
  username: string
  score: number
  created_at: string
}

export type GameStatus = "idle" | "playing" | "paused" | "game_over"
```

**Step 2: 定义数据库类型**

```typescript
// types/database.ts
export interface Database {
  public: {
    Tables: {
      games: {
        Row: { slug: string; name: string; category: string; description: string; thumbnail: string | null; created_at: string }
        Insert: Omit<Database["public"]["Tables"]["games"]["Row"], "created_at">
      }
      scores: {
        Row: { id: string; user_id: string; game_slug: string; score: number; created_at: string }
        Insert: Omit<Database["public"]["Tables"]["scores"]["Row"], "id" | "created_at">
      }
    }
  }
}
```

**Step 3: 提交**

```bash
git add types/
git commit -m "feat: add TypeScript type definitions"
```

---

## Task 6: 游戏大厅主页 UI

> 提示：使用 `ui-ux-pro-max` 插件生成暗色赛博风格的游戏大厅界面

**Files:**
- Create: `components/GameCard.tsx`
- Create: `components/GameHall.tsx`
- Create: `components/Navbar.tsx`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

**Step 1: 安装 shadcn/ui 组件**

```bash
npx shadcn@latest add card badge button avatar
npx shadcn@latest add dropdown-menu
```

**Step 2: 创建 GameCard 组件**

```typescript
// components/GameCard.tsx
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Game } from "@/types"
import { GAME_CATEGORY_COLORS } from "@/lib/theme"

interface Props { game: Game }

export function GameCard({ game }: Props) {
  const color = GAME_CATEGORY_COLORS[game.category]
  return (
    <Link href={`/games/${game.slug}`}>
      <Card className="bg-cyber-card border-cyber-border hover:border-cyber-cyan transition-all duration-200 cursor-pointer group">
        <CardContent className="p-0">
          <div
            className="h-40 flex items-center justify-center text-4xl"
            style={{ background: `${color}15` }}
          >
            {game.slug === "snake" && "🐍"}
            {game.slug === "2048" && "🔢"}
            {game.slug === "gomoku" && "⚫"}
            {game.slug === "memory" && "🃏"}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 gap-2">
          <h3 className="font-mono text-white group-hover:text-cyber-cyan transition-colors">
            {game.name}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">{game.description}</p>
          <Badge style={{ backgroundColor: `${color}22`, color, borderColor: color }} variant="outline">
            {game.category}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
```

**Step 3: 创建 Navbar 组件**

```typescript
// components/Navbar.tsx
"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="border-b border-cyber-border bg-cyber-card/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-cyber-cyan text-lg font-bold tracking-wider">
          GAME<span className="text-cyber-purple">BOX</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-cyber-border text-gray-300 hover:border-cyber-cyan">
            登录
          </Button>
        </div>
      </div>
    </nav>
  )
}
```

**Step 4: 更新主页**

```typescript
// app/page.tsx
import { GameCard } from "@/components/GameCard"
import { Game } from "@/types"

const GAMES: Game[] = [
  { slug: "snake",  name: "贪吃蛇",  category: "arcade",  description: "经典街机游戏，控制蛇吃食物并越长越长" },
  { slug: "2048",   name: "2048",    category: "puzzle",  description: "滑动方块合并数字，达到2048" },
  { slug: "gomoku", name: "五子棋",  category: "board",   description: "双人对战，先连五子者获胜" },
  { slug: "memory", name: "记忆翻牌",category: "casual",  description: "翻开配对的卡片，考验你的记忆力" },
]

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="font-mono text-3xl text-white mb-2">
          欢迎来到 <span className="text-cyber-cyan">GAMEBOX</span>
        </h1>
        <p className="text-gray-400">选择一款游戏开始挑战</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GAMES.map((game) => <GameCard key={game.slug} game={game} />)}
      </div>
    </main>
  )
}
```

**Step 5: 更新 layout.tsx**

```typescript
// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/Navbar"

export const metadata: Metadata = {
  title: "GameBox | 小游戏合集",
  description: "4款经典小游戏，支持全球排行榜",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className="dark">
      <body className="bg-cyber-bg min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
```

**Step 6: 使用 dev-browser 验证 UI**

```
启动: npm run dev
使用 dev-browser 插件：
1. 导航到 http://localhost:3000
2. 截图确认游戏卡片布局正确
3. 确认暗色赛博风格主题生效
```

**Step 7: 提交**

```bash
git add -A
git commit -m "feat: add game hall UI with cyberpunk dark theme"
```

---

## Task 7: 游戏通用布局组件

**Files:**
- Create: `components/GameLayout.tsx`
- Create: `components/ScoreBoard.tsx`
- Create: `app/games/[slug]/layout.tsx`

**Step 1: 创建 GameLayout**

```typescript
// components/GameLayout.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GameStatus } from "@/types"

interface Props {
  gameName: string
  score: number
  bestScore: number
  status: GameStatus
  onStart: () => void
  onPause: () => void
  onRestart: () => void
  children: React.ReactNode
}

export function GameLayout({
  gameName, score, bestScore, status,
  onStart, onPause, onRestart, children
}: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="text-gray-400 hover:text-cyber-cyan text-sm font-mono">
          ← 返回大厅
        </Link>
        <h2 className="font-mono text-cyber-cyan text-xl">{gameName}</h2>
        <div className="flex gap-4 text-sm font-mono">
          <span className="text-gray-400">分数: <span className="text-white">{score}</span></span>
          <span className="text-gray-400">最高: <span className="text-cyber-yellow">{bestScore}</span></span>
        </div>
      </div>
      <div className="border border-cyber-border rounded-lg overflow-hidden">
        {children}
      </div>
      <div className="flex gap-2 mt-4 justify-center">
        {status === "idle" && <Button onClick={onStart} className="bg-cyber-cyan text-black hover:bg-cyber-cyan/80">开始游戏</Button>}
        {status === "playing" && <Button onClick={onPause} variant="outline" className="border-cyber-border">暂停</Button>}
        {status === "paused" && <Button onClick={onStart} className="bg-cyber-cyan text-black">继续</Button>}
        {status === "game_over" && <Button onClick={onRestart} className="bg-cyber-pink text-white">再来一局</Button>}
      </div>
    </div>
  )
}
```

**Step 2: 提交**

```bash
git add -A
git commit -m "feat: add GameLayout shared component"
```

---

## Task 8: 游戏实现 — 贪吃蛇

**Files:**
- Create: `lib/games/snake.ts`
- Create: `hooks/useSnake.ts`
- Create: `app/games/snake/page.tsx`

**Step 1: 编写游戏逻辑（纯 TS）**

```typescript
// lib/games/snake.ts
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
  const opposites = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" }
  if (opposites[dir] === state.direction) return state
  return { ...state, direction: dir }
}
```

**Step 2: 编写 React Hook**

```typescript
// hooks/useSnake.ts
"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { initSnake, tickSnake, changeDirection, SnakeState, Direction } from "@/lib/games/snake"

const TICK_MS = 150

export function useSnake() {
  const [state, setState] = useState<SnakeState>(initSnake())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const start = useCallback(() => {
    setState(s => ({ ...s, status: "playing" }))
  }, [])

  const pause = useCallback(() => {
    setState(s => s.status === "playing" ? { ...s, status: "paused" } : { ...s, status: "playing" })
  }, [])

  const restart = useCallback(() => {
    setState(initSnake())
  }, [])

  useEffect(() => {
    if (state.status === "playing") {
      intervalRef.current = setInterval(() => setState(tickSnake), TICK_MS)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [state.status])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      }
      if (map[e.key]) {
        e.preventDefault()
        setState(s => changeDirection(s, map[e.key]))
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return { state, start, pause, restart }
}
```

**Step 3: 创建游戏页面**

```typescript
// app/games/snake/page.tsx
"use client"
import { useEffect, useRef } from "react"
import { GameLayout } from "@/components/GameLayout"
import { useSnake } from "@/hooks/useSnake"
import { CYBER_COLORS } from "@/lib/theme"

const CELL = 24

export default function SnakePage() {
  const { state, start, pause, restart } = useSnake()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const size = state.gridSize * CELL
    canvas.width = size
    canvas.height = size
    ctx.fillStyle = "#0a0a0f"
    ctx.fillRect(0, 0, size, size)
    // Draw grid
    ctx.strokeStyle = "#1e1e2e"
    ctx.lineWidth = 0.5
    for (let i = 0; i <= state.gridSize; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, size); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(size, i * CELL); ctx.stroke()
    }
    // Draw snake
    state.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? CYBER_COLORS.cyan : `${CYBER_COLORS.cyan}99`
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2)
    })
    // Draw food
    ctx.fillStyle = CYBER_COLORS.pink
    ctx.beginPath()
    ctx.arc(state.food.x * CELL + CELL / 2, state.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
    // Game over overlay
    if (state.status === "game_over") {
      ctx.fillStyle = "rgba(0,0,0,0.7)"
      ctx.fillRect(0, 0, size, size)
      ctx.fillStyle = CYBER_COLORS.pink
      ctx.font = "bold 28px monospace"
      ctx.textAlign = "center"
      ctx.fillText("GAME OVER", size / 2, size / 2)
      ctx.fillStyle = "#aaa"
      ctx.font = "16px monospace"
      ctx.fillText(`得分: ${state.score}`, size / 2, size / 2 + 36)
    }
  }, [state])

  return (
    <GameLayout
      gameName="贪吃蛇"
      score={state.score}
      bestScore={state.score}
      status={state.status}
      onStart={start}
      onPause={pause}
      onRestart={restart}
    >
      <canvas ref={canvasRef} className="block mx-auto" />
    </GameLayout>
  )
}
```

**Step 4: 使用 dev-browser 验证**

```
使用 dev-browser 插件：
1. 导航到 http://localhost:3000/games/snake
2. 截图确认 Canvas 渲染正确
3. 点击「开始游戏」，验证蛇能移动
```

**Step 5: 提交**

```bash
git add -A
git commit -m "feat: implement Snake game with Canvas rendering"
```

---

## Task 9: 游戏实现 — 2048

**Files:**
- Create: `lib/games/2048.ts`
- Create: `hooks/use2048.ts`
- Create: `app/games/2048/page.tsx`

**Step 1: 编写游戏逻辑**

```typescript
// lib/games/2048.ts
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

export function move2048(state: Game2048State, dir: SwipeDir): Game2048State {
  if (state.status !== "playing") return state
  let board = state.board.map(r => [...r])
  let totalScore = 0

  const transforms = {
    left:  (b: Board) => b,
    right: (b: Board) => b.map(r => r.reverse()),
    up:    (b: Board) => { const t = emptyBoard(); b.forEach((r,i) => r.forEach((v,j) => t[j][i] = v)); return t },
    down:  (b: Board) => { const t = emptyBoard(); b.forEach((r,i) => r.forEach((v,j) => t[3-j][i] = v)); return t },
  }
  const untransforms = {
    left:  (b: Board) => b,
    right: (b: Board) => b.map(r => r.reverse()),
    up:    (b: Board) => { const t = emptyBoard(); b.forEach((r,i) => r.forEach((v,j) => t[j][i] = v)); return t },
    down:  (b: Board) => { const t = emptyBoard(); b.forEach((r,i) => r.forEach((v,j) => t[3-j][i] = v)); return t },
  }

  board = transforms[dir](board)
  const newBoard = board.map(row => {
    const { row: slid, score } = slideRow(row)
    totalScore += score
    return slid
  })
  const finalBoard = untransforms[dir](newBoard)
  const changed = JSON.stringify(finalBoard) !== JSON.stringify(state.board)
  if (!changed) return state
  const withTile = addRandomTile(finalBoard)
  const won = withTile.some(r => r.some(v => v === 2048))
  const hasMove = withTile.some(r => r.some(v => !v)) ||
    withTile.some((r, i) => r.some((v, j) =>
      (i < 3 && withTile[i+1][j] === v) || (j < 3 && v === r[j+1])
    ))
  return {
    board: withTile,
    score: state.score + totalScore,
    status: won ? "won" : hasMove ? "playing" : "game_over",
  }
}
```

**Step 2: 编写 Hook**

```typescript
// hooks/use2048.ts
"use client"
import { useCallback, useEffect, useState } from "react"
import { initGame2048, move2048, Game2048State, SwipeDir } from "@/lib/games/2048"

export function use2048() {
  const [state, setState] = useState<Game2048State>(initGame2048())
  const start = useCallback(() => setState(s => ({ ...s, status: "playing" })), [])
  const restart = useCallback(() => setState(initGame2048()), [])

  useEffect(() => {
    const map: Record<string, SwipeDir> = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    }
    const handler = (e: KeyboardEvent) => {
      if (map[e.key]) { e.preventDefault(); setState(s => move2048(s, map[e.key])) }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return { state, start, restart }
}
```

**Step 3: 创建游戏页面**

```typescript
// app/games/2048/page.tsx
"use client"
import { GameLayout } from "@/components/GameLayout"
import { use2048 } from "@/hooks/use2048"

const TILE_COLORS: Record<number, string> = {
  0: "#1e1e2e", 2: "#2a2a3e", 4: "#3a3a5e", 8: "#00ccaa", 16: "#00ffcc",
  32: "#b344ff", 64: "#9933ee", 128: "#ff2d78", 256: "#ff5588",
  512: "#ffe600", 1024: "#ffaa00", 2048: "#ff6600",
}

export default function Game2048Page() {
  const { state, start, restart } = use2048()
  return (
    <GameLayout
      gameName="2048" score={state.score} bestScore={state.score}
      status={state.status} onStart={start} onPause={() => {}} onRestart={restart}
    >
      <div className="bg-cyber-bg p-4">
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          {state.board.flat().map((val, i) => (
            <div
              key={i}
              className="aspect-square flex items-center justify-center rounded font-mono font-bold text-lg transition-all"
              style={{ backgroundColor: TILE_COLORS[val] ?? "#ff6600", color: val > 4 ? "#fff" : "#aaa" }}
            >
              {val > 0 ? val : ""}
            </div>
          ))}
        </div>
        {(state.status === "game_over" || state.status === "won") && (
          <div className="text-center mt-4 font-mono text-xl" style={{ color: state.status === "won" ? "#ffe600" : "#ff2d78" }}>
            {state.status === "won" ? "🎉 你赢了！" : "GAME OVER"}
          </div>
        )}
      </div>
    </GameLayout>
  )
}
```

**Step 4: 提交**

```bash
git add -A
git commit -m "feat: implement 2048 game"
```

---

## Task 10: 游戏实现 — 五子棋

**Files:**
- Create: `lib/games/gomoku.ts`
- Create: `hooks/useGomoku.ts`
- Create: `app/games/gomoku/page.tsx`

**Step 1: 游戏逻辑**

```typescript
// lib/games/gomoku.ts
export type Cell = 0 | 1 | 2  // 0=空 1=黑 2=白
export type Board = Cell[][]

export interface GomokuState {
  board: Board
  current: 1 | 2
  winner: 0 | 1 | 2
  status: "idle" | "playing" | "game_over"
  size: number
}

export function initGomoku(size = 15): GomokuState {
  return {
    board: Array.from({ length: size }, () => Array(size).fill(0) as Cell[]),
    current: 1, winner: 0, status: "idle", size,
  }
}

function checkWin(board: Board, r: number, c: number, player: 1 | 2, size: number): boolean {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]]
  return dirs.some(([dr, dc]) => {
    let count = 1
    for (let d of [1, -1]) {
      let nr = r + dr*d, nc = c + dc*d
      while (nr>=0 && nr<size && nc>=0 && nc<size && board[nr][nc] === player) {
        count++; nr += dr*d; nc += dc*d
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
    ...state, board,
    winner: won ? state.current : 0,
    status: won ? "game_over" : "playing",
    current: won ? state.current : (state.current === 1 ? 2 : 1),
  }
}
```

**Step 2: Hook**

```typescript
// hooks/useGomoku.ts
"use client"
import { useCallback, useState } from "react"
import { initGomoku, placeStone, GomokuState } from "@/lib/games/gomoku"

export function useGomoku() {
  const [state, setState] = useState<GomokuState>(initGomoku())
  const start = useCallback(() => setState(s => ({ ...s, status: "playing" })), [])
  const restart = useCallback(() => setState(initGomoku()), [])
  const place = useCallback((r: number, c: number) => setState(s => placeStone(s, r, c)), [])
  return { state, start, restart, place }
}
```

**Step 3: 游戏页面**

```typescript
// app/games/gomoku/page.tsx
"use client"
import { GameLayout } from "@/components/GameLayout"
import { useGomoku } from "@/hooks/useGomoku"

const CELL = 32

export default function GomokuPage() {
  const { state, start, restart, place } = useGomoku()
  const size = state.size
  const boardPx = (size - 1) * CELL

  return (
    <GameLayout
      gameName="五子棋"
      score={0} bestScore={0}
      status={state.status}
      onStart={start} onPause={() => {}} onRestart={restart}
    >
      <div className="bg-cyber-bg p-6 flex flex-col items-center">
        <div className="mb-4 font-mono text-sm text-gray-400">
          {state.status === "game_over"
            ? `🏆 ${state.winner === 1 ? "黑棋" : "白棋"}获胜！`
            : `当前落子：${state.current === 1 ? "⚫ 黑棋" : "⚪ 白棋"}`}
        </div>
        <div
          className="relative"
          style={{ width: boardPx + CELL, height: boardPx + CELL }}
        >
          <svg
            className="absolute top-0 left-0"
            width={boardPx + CELL}
            height={boardPx + CELL}
          >
            {Array.from({ length: size }).map((_, i) => (
              <g key={i}>
                <line x1={CELL/2} y1={CELL/2 + i*CELL} x2={boardPx + CELL/2} y2={CELL/2 + i*CELL} stroke="#1e1e2e" strokeWidth={1} />
                <line x1={CELL/2 + i*CELL} y1={CELL/2} x2={CELL/2 + i*CELL} y2={boardPx + CELL/2} stroke="#1e1e2e" strokeWidth={1} />
              </g>
            ))}
            {state.board.map((row, r) =>
              row.map((cell, c) => cell !== 0 ? (
                <circle
                  key={`${r}-${c}`}
                  cx={CELL/2 + c*CELL} cy={CELL/2 + r*CELL} r={CELL/2 - 3}
                  fill={cell === 1 ? "#111" : "#eee"}
                  stroke={cell === 1 ? "#00ffcc" : "#b344ff"}
                  strokeWidth={1.5}
                />
              ) : null)
            )}
          </svg>
          {state.board.map((row, r) =>
            row.map((_, c) => (
              <div
                key={`${r}-${c}`}
                className="absolute cursor-pointer hover:bg-cyber-cyan/20 rounded-full"
                style={{ left: c*CELL, top: r*CELL, width: CELL, height: CELL }}
                onClick={() => place(r, c)}
              />
            ))
          )}
        </div>
      </div>
    </GameLayout>
  )
}
```

**Step 4: 提交**

```bash
git add -A
git commit -m "feat: implement Gomoku board game"
```

---

## Task 11: 游戏实现 — 记忆翻牌

**Files:**
- Create: `lib/games/memory.ts`
- Create: `hooks/useMemory.ts`
- Create: `app/games/memory/page.tsx`

**Step 1: 游戏逻辑**

```typescript
// lib/games/memory.ts
export interface MemoryCard {
  id: number
  emoji: string
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

const EMOJIS = ["🐍","🎮","⚡","🔥","💎","🌙","🎯","🚀"]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function initMemory(): MemoryState {
  const cards = shuffle([...EMOJIS, ...EMOJIS]).map((emoji, id) => ({
    id, emoji, flipped: false, matched: false,
  }))
  return { cards, selected: [], score: 0, moves: 0, status: "idle" }
}

export function flipCard(state: MemoryState, id: number): MemoryState {
  if (state.status !== "playing") return state
  if (state.selected.length >= 2) return state
  if (state.cards[id].flipped || state.cards[id].matched) return state

  const cards = state.cards.map(c => c.id === id ? { ...c, flipped: true } : c)
  const selected = [...state.selected, id]

  if (selected.length === 2) {
    const [a, b] = selected
    const matched = cards[a].emoji === cards[b].emoji
    const newCards = matched
      ? cards.map(c => (c.id === a || c.id === b) ? { ...c, matched: true } : c)
      : cards
    const allMatched = newCards.every(c => c.matched)
    return {
      cards: newCards, selected, moves: state.moves + 1,
      score: state.score + (matched ? 20 : 0),
      status: allMatched ? "game_over" : "checking",
    }
  }
  return { ...state, cards, selected, status: "playing" }
}

export function resolveFlip(state: MemoryState): MemoryState {
  if (state.status !== "checking") return state
  const [a, b] = state.selected
  const matched = state.cards[a].matched
  const cards = matched
    ? state.cards
    : state.cards.map(c => (c.id === a || c.id === b) ? { ...c, flipped: false } : c)
  return { ...state, cards, selected: [], status: "playing" }
}
```

**Step 2: Hook**

```typescript
// hooks/useMemory.ts
"use client"
import { useCallback, useEffect, useState } from "react"
import { initMemory, flipCard, resolveFlip, MemoryState } from "@/lib/games/memory"

export function useMemory() {
  const [state, setState] = useState<MemoryState>(initMemory())
  const start = useCallback(() => setState(s => ({ ...s, status: "playing" })), [])
  const restart = useCallback(() => setState(initMemory()), [])
  const flip = useCallback((id: number) => setState(s => flipCard(s, id)), [])

  useEffect(() => {
    if (state.status === "checking") {
      const t = setTimeout(() => setState(resolveFlip), 800)
      return () => clearTimeout(t)
    }
  }, [state.status])

  return { state, start, restart, flip }
}
```

**Step 3: 游戏页面**

```typescript
// app/games/memory/page.tsx
"use client"
import { GameLayout } from "@/components/GameLayout"
import { useMemory } from "@/hooks/useMemory"

export default function MemoryPage() {
  const { state, start, restart, flip } = useMemory()
  return (
    <GameLayout
      gameName="记忆翻牌"
      score={state.score} bestScore={state.score}
      status={state.status}
      onStart={start} onPause={() => {}} onRestart={restart}
    >
      <div className="bg-cyber-bg p-6">
        <div className="text-center mb-4 text-sm font-mono text-gray-400">
          步数：{state.moves}
          {state.status === "game_over" && <span className="text-cyber-cyan ml-4">🎉 全部配对！</span>}
        </div>
        <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
          {state.cards.map(card => (
            <div
              key={card.id}
              onClick={() => flip(card.id)}
              className="aspect-square flex items-center justify-center text-2xl rounded cursor-pointer transition-all duration-300 border"
              style={{
                backgroundColor: card.flipped || card.matched ? "#1e1e2e" : "#0a0a0f",
                borderColor: card.matched ? "#00ffcc" : "#1e1e2e",
                transform: card.flipped || card.matched ? "rotateY(0deg)" : "rotateY(90deg)",
              }}
            >
              {(card.flipped || card.matched) ? card.emoji : ""}
            </div>
          ))}
        </div>
      </div>
    </GameLayout>
  )
}
```

**Step 4: 提交**

```bash
git add -A
git commit -m "feat: implement Memory flip card game"
```

---

## Task 12: 分数提交 API

**Files:**
- Create: `app/api/scores/route.ts`
- Create: `app/api/leaderboard/[slug]/route.ts`

**Step 1: 创建分数提交 API**

```typescript
// app/api/scores/route.ts
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { game_slug, score } = await request.json()
  if (!game_slug || typeof score !== "number" || score < 0) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const { error } = await supabase.from("scores").insert({ user_id: user.id, game_slug, score })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
```

**Step 2: 创建排行榜 API**

```typescript
// app/api/leaderboard/[slug]/route.ts
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("scores")
    .select("score, created_at, user_id")
    .eq("game_slug", params.slug)
    .order("score", { ascending: false })
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
```

**Step 3: 提交**

```bash
git add -A
git commit -m "feat: add scores submission and leaderboard API routes"
```

---

## Task 13: Auth 流程

**Files:**
- Create: `app/auth/callback/route.ts`
- Modify: `components/Navbar.tsx`
- Create: `components/AuthModal.tsx`

**Step 1: Auth 回调路由**

```typescript
// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(origin)
}
```

**Step 2: 更新 Navbar 显示登录状态**

在 Navbar 中使用 Supabase client 检查 session，已登录显示头像和用户名，未登录显示「登录」按钮。

**Step 3: 提交**

```bash
git add -A
git commit -m "feat: add Supabase Auth callback and Navbar auth state"
```

---

## Task 14: 排行榜组件集成

**Files:**
- Create: `components/Leaderboard.tsx`
- Modify: `app/games/[slug]/page.tsx` (or each game page)

**Step 1: 安装 shadcn/ui 组件**

```bash
npx shadcn@latest add dialog table
```

**Step 2: 创建排行榜组件（含 Realtime 订阅）**

```typescript
// components/Leaderboard.tsx
"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Entry { rank: number; user_id: string; score: number; created_at: string }

export function Leaderboard({ gameSlug }: { gameSlug: string }) {
  const [entries, setEntries] = useState<Entry[]>([])

  const fetchScores = async () => {
    const res = await fetch(`/api/leaderboard/${gameSlug}`)
    const data = await res.json()
    setEntries(data.map((e: any, i: number) => ({ ...e, rank: i + 1 })))
  }

  useEffect(() => {
    fetchScores()
    const supabase = createClient()
    const channel = supabase
      .channel(`leaderboard:${gameSlug}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "scores", filter: `game_slug=eq.${gameSlug}` }, fetchScores)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [gameSlug])

  return (
    <div className="mt-6 border border-cyber-border rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-cyber-card font-mono text-cyber-cyan text-sm">排行榜 TOP 10</div>
      <Table>
        <TableHeader>
          <TableRow className="border-cyber-border">
            <TableHead className="text-gray-400 w-12">#</TableHead>
            <TableHead className="text-gray-400">玩家</TableHead>
            <TableHead className="text-gray-400 text-right">分数</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map(e => (
            <TableRow key={e.user_id} className="border-cyber-border">
              <TableCell className="font-mono text-cyber-yellow">{e.rank}</TableCell>
              <TableCell className="text-gray-300 font-mono text-sm">{e.user_id.slice(0, 8)}…</TableCell>
              <TableCell className="text-right font-mono text-cyber-cyan">{e.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

**Step 3: 提交**

```bash
git add -A
git commit -m "feat: add Leaderboard component with Supabase Realtime"
```

---

## Task 15: 游戏结束分数提交集成

**Files:**
- Modify: `hooks/useSnake.ts`（其他游戏 Hook 同理）
- Create: `lib/submitScore.ts`

**Step 1: 创建分数提交工具函数**

```typescript
// lib/submitScore.ts
export async function submitScore(gameSlug: string, score: number): Promise<boolean> {
  try {
    const res = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_slug: gameSlug, score }),
    })
    return res.ok
  } catch {
    return false
  }
}
```

**Step 2: 在各游戏 Hook 中集成提交**

在 `useSnake.ts` 的游戏结束时调用：

```typescript
useEffect(() => {
  if (state.status === "game_over" && state.score > 0) {
    submitScore("snake", state.score)
  }
}, [state.status])
```

**Step 3: 提交**

```bash
git add -A
git commit -m "feat: integrate score submission on game over"
```

---

## Task 16: E2E 验证（dev-browser）

> 使用 `dev-browser` 插件进行全链路验证

**Step 1: 启动开发服务器**

```bash
npm run dev
```

**Step 2: dev-browser 验证清单**

```
1. 访问 http://localhost:3000
   截图 → 确认游戏大厅 4 张卡片正常显示，暗色赛博风格正确

2. 点击「贪吃蛇」卡片
   截图 → 确认进入游戏页面，Canvas 渲染正确
   点击「开始游戏」→ 按方向键 → 截图确认蛇在移动

3. 访问 http://localhost:3000/games/2048
   截图 → 确认 4x4 网格显示
   按方向键操作 → 确认数字合并动画

4. 访问 http://localhost:3000/games/gomoku
   截图 → 确认棋盘网格渲染
   点击落子 → 确认黑白棋交替

5. 访问 http://localhost:3000/games/memory
   截图 → 确认 16 张卡片显示
   翻牌操作 → 确认翻牌动画和配对逻辑

6. 登录流程
   点击 Navbar「登录」→ 完成登录流程
   玩游戏到结束 → 确认分数自动提交
   查看排行榜 → 确认新分数出现
```

**Step 3: 修复发现的问题**

> 如遇 bug，使用 `systematic-debugging` 技能

**Step 4: 最终提交**

```bash
git add -A
git commit -m "docs: add E2E verification checklist"
```

---

## 里程碑总览

| M | 任务 | 状态 |
|---|------|------|
| M1 | Task 1-2：脚手架 + 主题 | ⬜ |
| M2 | Task 3-5：Supabase + 类型 | ⬜ |
| M3 | Task 6-7：游戏大厅 UI | ⬜ |
| M4 | Task 8-11：4 款游戏 | ⬜ |
| M5 | Task 12-15：分数 + 排行榜 + Auth | ⬜ |
| M6 | Task 16：E2E 验证 | ⬜ |

---

## 关键插件使用时机

| 阶段 | 插件/技能 | 触发条件 |
|------|----------|---------|
| Task 6 UI 设计 | `ui-ux-pro-max` | 需要生成更精细的 UI 组件 |
| Task 8-11 并行 | `dispatching-parallel-agents` | 4 款游戏同时开发 |
| 全程追踪 | `planning-with-files` | 开始写代码前调用 |
| Task 16 验证 | `dev-browser` | 每个里程碑完成后 |
| 遇到 Bug | `systematic-debugging` | 任何非预期行为 |
| 完成确认 | `verification-before-completion` | 每个 Task 完成前 |
