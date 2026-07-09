import { NextResponse } from "next/server";
import { createVisitorHash } from "@/lib/hash";
import { getClientIp, getUserAgent } from "@/lib/request";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ viewCount: 0, incremented: false });
  }

  try {
    const { slug } = (await request.json()) as { slug?: string };

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    if (!getPostBySlug(slug)) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const ip = await getClientIp();
    const userAgent = await getUserAgent();
    const visitorHash = createVisitorHash(ip, userAgent);

    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("increment_view_count", {
      p_slug: slug,
      p_visitor_hash: visitorHash,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const result = data as { view_count: number; incremented: boolean };

    return NextResponse.json({
      viewCount: result.view_count,
      incremented: result.incremented,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
