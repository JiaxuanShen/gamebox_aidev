"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trophy } from "lucide-react"

interface Entry {
  rank: number
  user_id: string
  score: number
  created_at: string
}

const RANK_COLORS = ["#ffe600", "#aaaaaa", "#cd7f32"]

export function Leaderboard({ gameSlug }: { gameSlug: string }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchScores = async () => {
    const res = await fetch(`/api/leaderboard/${gameSlug}`)
    if (!res.ok) return
    const data = await res.json()
    setEntries(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.map((e: any, i: number) => ({ ...e, rank: i + 1 }))
    )
    setLoading(false)
  }

  useEffect(() => {
    fetchScores()
    const supabase = createClient()
    const channel = supabase
      .channel(`leaderboard:${gameSlug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "scores",
          filter: `game_slug=eq.${gameSlug}`,
        },
        fetchScores
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSlug])

  return (
    <div className="mt-6 border border-[#1e1e2e] rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-[#111118] flex items-center gap-2">
        <Trophy className="w-3 h-3 text-[#ffe600]" strokeWidth={1.5} />
        <span className="font-mono text-[#ffe600] text-xs tracking-widest">LEADERBOARD</span>
      </div>
      {loading ? (
        <div className="p-4 text-center text-xs font-mono text-gray-600">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="p-4 text-center text-xs font-mono text-gray-600">
          暂无记录，登录后开始挑战！
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-[#1e1e2e] hover:bg-transparent">
              <TableHead className="text-gray-600 text-xs w-10">#</TableHead>
              <TableHead className="text-gray-600 text-xs">玩家</TableHead>
              <TableHead className="text-gray-600 text-xs text-right">分数</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((e) => (
              <TableRow key={`${e.user_id}-${e.rank}`} className="border-[#1e1e2e] hover:bg-[#111118]">
                <TableCell className="font-mono text-xs py-2">
                  <span style={{ color: RANK_COLORS[e.rank - 1] ?? "#555" }}>
                    {e.rank <= 3 ? ["🥇", "🥈", "🥉"][e.rank - 1] : e.rank}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400 font-mono text-xs py-2">
                  {e.user_id.slice(0, 8)}…
                </TableCell>
                <TableCell className="text-right font-mono text-xs py-2 text-[#00ffcc]">
                  {e.score.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
