import { GameCard } from "@/components/GameCard"
import { Game } from "@/types"
import { Zap } from "lucide-react"

const GAMES: Game[] = [
  {
    slug: "snake",
    name: "贪吃蛇",
    category: "arcade",
    description: "经典街机游戏，控制蛇吃食物，越长越高分",
  },
  {
    slug: "2048",
    name: "2048",
    category: "puzzle",
    description: "滑动方块合并数字，达到 2048 即为胜利",
  },
  {
    slug: "gomoku",
    name: "五子棋",
    category: "board",
    description: "双人对战棋盘游戏，先连五子者获胜",
  },
  {
    slug: "memory",
    name: "记忆翻牌",
    category: "casual",
    description: "翻开配对相同图案的卡片，考验你的记忆力",
  },
]

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="mb-12 relative">
        <div
          className="absolute -top-10 -left-10 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: "#00ffcc" }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#00ffcc]" strokeWidth={1.5} />
            <span className="text-xs font-mono text-[#00ffcc] tracking-widest uppercase">
              Online Games
            </span>
          </div>
          <h1
            className="font-['Press_Start_2P'] text-2xl md:text-3xl text-white mb-4 leading-tight"
            style={{ textShadow: "0 0 30px #00ffcc33" }}
          >
            GAME<span className="text-[#00ffcc]">BOX</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm max-w-md leading-relaxed">
            经典小游戏合集，登录后参与全球排行榜挑战
          </p>
        </div>
      </div>

      {/* 分隔线标题 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-[#00ffcc33] to-transparent" />
        <span className="text-xs font-['Press_Start_2P'] text-[#00ffcc] tracking-widest">
          SELECT GAME
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-[#00ffcc33] to-transparent" />
      </div>

      {/* 游戏卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GAMES.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-xs font-mono text-gray-600 tracking-widest">
          MORE GAMES COMING SOON...
        </p>
      </div>
    </main>
  )
}
