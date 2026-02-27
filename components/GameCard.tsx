import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Game } from "@/types"
import { GAME_CATEGORY_COLORS } from "@/lib/theme"
import { Zap, Grid2x2, CircleDot, Brain } from "lucide-react"

const GAME_ICONS: Record<string, React.ReactNode> = {
  snake: <Zap className="w-12 h-12" strokeWidth={1.5} />,
  "2048": <Grid2x2 className="w-12 h-12" strokeWidth={1.5} />,
  gomoku: <CircleDot className="w-12 h-12" strokeWidth={1.5} />,
  memory: <Brain className="w-12 h-12" strokeWidth={1.5} />,
}

interface Props {
  game: Game
}

export function GameCard({ game }: Props) {
  const color = GAME_CATEGORY_COLORS[game.category]

  return (
    <Link href={`/games/${game.slug}`} className="block cursor-pointer">
      <Card
        className="bg-[#111118] border-[#1e1e2e] hover:border-current transition-all duration-200 group overflow-hidden"
        style={{ ["--hover-color" as string]: color }}
      >
        <CardContent className="p-0">
          <div
            className="h-36 flex items-center justify-center transition-all duration-200"
            style={{
              background: `${color}10`,
              color: `${color}88`,
            }}
          >
            <div
              className="group-hover:drop-shadow-lg transition-all duration-300"
              style={{
                filter: `drop-shadow(0 0 0px ${color})`,
              }}
            >
              {GAME_ICONS[game.slug] ?? <Grid2x2 className="w-12 h-12" strokeWidth={1.5} />}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 gap-2">
          <h3
            className="font-['Press_Start_2P'] text-xs text-white group-hover:text-current transition-colors leading-relaxed"
            style={{ ["--tw-text-opacity" as string]: "1" }}
          >
            <span style={{ color: "inherit" }} className="group-hover:text-[var(--hover-color)]">
              {game.name}
            </span>
          </h3>
          <p className="text-xs text-gray-500 font-mono leading-relaxed line-clamp-2">
            {game.description}
          </p>
          <Badge
            variant="outline"
            className="text-xs font-mono mt-1 border-current"
            style={{
              backgroundColor: `${color}15`,
              color,
              borderColor: `${color}44`,
            }}
          >
            {game.category}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
