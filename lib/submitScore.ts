export async function submitScore(gameSlug: string, score: number): Promise<boolean> {
  if (score <= 0) return false
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
