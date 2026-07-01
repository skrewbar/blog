import { NextResponse } from "next/server";
import { isSpamComment } from "@/lib/akismet";
import {
  createGravatarHash,
  createUnsubscribeToken,
  createVisitorHash,
} from "@/lib/hash";
import { sendReplyNotification } from "@/lib/resend";
import { getClientIp, getUserAgent } from "@/lib/request";
import { siteConfig } from "@/lib/site";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MINUTES = 5;
const RATE_LIMIT_MAX_COMMENTS = 3;

type CommentRow = {
  id: string;
  slug: string;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  gravatar_hash: string;
  body: string;
  notify: boolean;
  unsubscribe_token: string;
  created_at: string;
};

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ comments: [] });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      "id, slug, parent_id, author_name, gravatar_hash, body, created_at",
    )
    .eq("slug", slug)
    .eq("is_spam", false)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const comments = (data ?? []).map((comment) => ({
    id: comment.id,
    slug: comment.slug,
    parentId: comment.parent_id,
    authorName: comment.author_name,
    gravatarHash: comment.gravatar_hash,
    body: comment.body,
    createdAt: comment.created_at,
  }));

  return NextResponse.json({ comments });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Comments are not configured" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as {
      slug?: string;
      postTitle?: string;
      postUrl?: string;
      parentId?: string | null;
      authorName?: string;
      authorEmail?: string;
      body?: string;
      notify?: boolean;
      website?: string;
    };

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const {
      slug,
      postTitle = "",
      postUrl = "",
      parentId = null,
      authorName,
      authorEmail,
      body: commentBody,
      notify = false,
    } = body;

    if (!slug || !authorName || !authorEmail || !commentBody) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 },
      );
    }

    const ip = await getClientIp();
    const userAgent = await getUserAgent();
    const ipHash = createVisitorHash(ip, userAgent);
    const supabase = createAdminClient();

    const since = new Date(
      Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
    ).toISOString();

    const { count: recentCount, error: rateError } = await supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);

    if (rateError) {
      return NextResponse.json({ error: rateError.message }, { status: 500 });
    }

    if ((recentCount ?? 0) >= RATE_LIMIT_MAX_COMMENTS) {
      return NextResponse.json(
        { error: "댓글을 너무 자주 작성했습니다. 잠시 후 다시 시도해주세요." },
        { status: 429 },
      );
    }

    if (parentId) {
      const { data: parentComment, error: parentError } = await supabase
        .from("comments")
        .select("id, parent_id")
        .eq("id", parentId)
        .eq("slug", slug)
        .maybeSingle();

      if (parentError) {
        return NextResponse.json({ error: parentError.message }, { status: 500 });
      }

      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 },
        );
      }

      if (parentComment.parent_id) {
        return NextResponse.json(
          { error: "Replies are limited to one level" },
          { status: 400 },
        );
      }
    }

    const spam = await isSpamComment({
      userIp: ip,
      userAgent,
      author: authorName,
      authorEmail,
      content: commentBody,
      permalink: postUrl || `${siteConfig.url}/posts/${slug}`,
    });

    const unsubscribeToken = createUnsubscribeToken();

    const { data: inserted, error: insertError } = await supabase
      .from("comments")
      .insert({
        slug,
        parent_id: parentId,
        author_name: authorName.trim(),
        author_email: authorEmail.trim().toLowerCase(),
        gravatar_hash: createGravatarHash(authorEmail),
        body: commentBody.trim(),
        notify: Boolean(notify),
        unsubscribe_token: unsubscribeToken,
        ip_hash: ipHash,
        is_spam: spam,
        is_hidden: spam,
      })
      .select(
        "id, slug, parent_id, author_name, author_email, gravatar_hash, body, notify, unsubscribe_token, created_at",
      )
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    if (!spam && parentId) {
      const { data: parent } = await supabase
        .from("comments")
        .select("author_name, author_email, notify, unsubscribe_token")
        .eq("id", parentId)
        .maybeSingle();

      if (parent?.notify && parent.author_email) {
        await sendReplyNotification({
          to: parent.author_email,
          parentAuthor: parent.author_name,
          replyAuthor: authorName,
          postTitle,
          postUrl: postUrl || `${siteConfig.url}/posts/${slug}`,
          replyBody: commentBody.trim(),
          unsubscribeUrl: `${siteConfig.url}/api/unsubscribe?token=${parent.unsubscribe_token}`,
        });
      }
    }

    if (spam) {
      return NextResponse.json({ success: true });
    }

    const comment = inserted as CommentRow;

    return NextResponse.json({
      comment: {
        id: comment.id,
        slug: comment.slug,
        parentId: comment.parent_id,
        authorName: comment.author_name,
        gravatarHash: comment.gravatar_hash,
        body: comment.body,
        createdAt: comment.created_at,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
