import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { game_slug, score } = body

  if (!game_slug || typeof score !== "number" || score < 0) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  const { error } = await supabase
    .from("scores")
    .insert({ user_id: user.id, game_slug, score })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
