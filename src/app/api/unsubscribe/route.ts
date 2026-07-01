import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Unsubscribe is not configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("comments")
    .update({ notify: false })
    .eq("unsubscribe_token", token)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return new NextResponse(
      "<html><body><h1>Invalid unsubscribe link</h1></body></html>",
      {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  }

  return new NextResponse(
    "<html><body><h1>알림 수신이 해제되었습니다.</h1><p>더 이상 답글 알림 이메일을 받지 않습니다.</p></body></html>",
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
}
