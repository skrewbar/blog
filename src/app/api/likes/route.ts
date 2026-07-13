import { NextResponse } from "next/server"
import { createVisitorHash } from "@/lib/hash"
import { getPostBySlug } from "@/lib/posts"
import { getClientIp, getUserAgent } from "@/lib/request"
import { parseLikeRpcResult } from "@/lib/supabase/rpc"
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ likeCount: 0, liked: false })
  }

  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 })
  }

  if (!getPostBySlug(slug)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const ip = await getClientIp()
  const userAgent = await getUserAgent()
  const visitorHash = createVisitorHash(ip, userAgent)
  const supabase = createAdminClient()

  const [{ data: stats }, { data: like }] = await Promise.all([
    supabase.from("post_stats").select("like_count").eq("slug", slug).maybeSingle(),
    supabase.from("likes").select("id").eq("slug", slug).eq("visitor_hash", visitorHash).maybeSingle(),
  ])

  return NextResponse.json({
    likeCount: stats?.like_count ?? 0,
    liked: Boolean(like),
  })
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ likeCount: 0, liked: false })
  }

  try {
    const { slug } = (await request.json()) as { slug?: string }

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 })
    }

    const ip = await getClientIp()
    const userAgent = await getUserAgent()
    const visitorHash = createVisitorHash(ip, userAgent)
    const supabase = createAdminClient()

    const { data, error } = await supabase.rpc("add_like", {
      p_slug: slug,
      p_visitor_hash: visitorHash,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const result = parseLikeRpcResult(data)

    return NextResponse.json({
      likeCount: result.like_count,
      liked: result.liked,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
