"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { CommentForm } from "@/components/comments/comment-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type Comment = {
  id: string;
  slug: string;
  parentId: string | null;
  authorName: string;
  gravatarHash: string;
  body: string;
  createdAt: string;
};

type CommentSectionProps = {
  slug: string;
  postTitle: string;
  postUrl: string;
};

export function CommentSection({ slug, postTitle, postUrl }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  const loadComments = useCallback(async () => {
    const response = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
    const data = await response.json();
    setComments(data.comments ?? []);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    async function fetchComments() {
      try {
        const response = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
        const data = await response.json();
        if (!cancelled) {
          setComments(data.comments ?? []);
        }
      } catch {
        if (!cancelled) {
          setComments([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchComments();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const topLevel = comments.filter((comment) => !comment.parentId);
  const repliesByParent = comments.reduce<Record<string, Comment[]>>((acc, comment) => {
    if (comment.parentId) {
      acc[comment.parentId] = [...(acc[comment.parentId] ?? []), comment];
    }
    return acc;
  }, {});

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">댓글</h2>
        <p className="text-sm text-muted-foreground">
          이름과 이메일을 입력해 댓글을 남겨주세요.
        </p>
      </div>

      <CommentForm
        slug={slug}
        postTitle={postTitle}
        postUrl={postUrl}
        parentId={replyTo?.id ?? null}
        parentAuthor={replyTo?.authorName}
        onSuccess={() => {
          setReplyTo(null);
          void loadComments();
        }}
        onCancel={replyTo ? () => setReplyTo(null) : undefined}
      />

      <Separator />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : topLevel.length === 0 ? (
        <p className="text-sm text-muted-foreground">아직 댓글이 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {topLevel.map((comment) => (
            <li key={comment.id} className="space-y-4">
              <CommentItem
                comment={comment}
                onReply={() => setReplyTo(comment)}
              />
              {(repliesByParent[comment.id] ?? []).map((reply) => (
                <div key={reply.id} className="ml-10 border-l pl-4">
                  <CommentItem comment={reply} />
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CommentItem({
  comment,
  onReply,
}: {
  comment: Comment;
  onReply?: () => void;
}) {
  return (
    <div className="flex gap-3">
      <Image
        src={`https://www.gravatar.com/avatar/${comment.gravatarHash}?s=80&d=identicon`}
        alt={`${comment.authorName} avatar`}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">{comment.authorName}</span>
          <time className="text-muted-foreground" dateTime={comment.createdAt}>
            {format(new Date(comment.createdAt), "yyyy.MM.dd HH:mm")}
          </time>
        </div>
        <p className="whitespace-pre-wrap text-sm">{comment.body}</p>
        {onReply ? (
          <Button variant="ghost" size="sm" onClick={onReply}>
            답글
          </Button>
        ) : null}
      </div>
    </div>
  );
}
