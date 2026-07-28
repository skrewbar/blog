"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { CornerLeftUp } from "lucide-react"
import { CommentForm } from "@/components/comments/comment-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Comment = {
  id: string
  slug: string
  parentId: string | null
  authorName: string
  gravatarHash: string
  body: string
  createdAt: string
}

type CommentSectionProps = {
  slug: string
}

async function loadCommentData(slug: string): Promise<Comment[]> {
  const response = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
  const data = await response.json()
  return (data.comments ?? []) as Comment[]
}

export function CommentSection({ slug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [highlight, setHighlight] = useState<{ id: string; nonce: number } | null>(null)
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    void loadCommentData(slug)
      .then((nextComments) => {
        if (!cancelled) {
          setComments(nextComments)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setComments([])
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    return () => {
      if (highlightTimer.current) {
        clearTimeout(highlightTimer.current)
      }
    }
  }, [])

  const refreshComments = useCallback(async () => {
    setLoading(true)

    try {
      setComments(await loadCommentData(slug))
    } catch {
      setComments([])
    } finally {
      setLoading(false)
    }
  }, [slug])

  const focusComment = useCallback((id: string) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document
      .getElementById(`comment-${id}`)
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" })
    setHighlight((prev) => ({ id, nonce: (prev?.nonce ?? 0) + 1 }))

    if (highlightTimer.current) {
      clearTimeout(highlightTimer.current)
    }
    highlightTimer.current = setTimeout(() => setHighlight(null), 2000)
  }, [])

  const byId = new Map(comments.map((comment) => [comment.id, comment]))

  function resolveRootId(comment: Comment): string {
    let current = comment
    let steps = 0
    const maxSteps = comments.length

    while (current.parentId && steps < maxSteps) {
      const parent = byId.get(current.parentId)
      if (!parent) {
        return current.id
      }
      current = parent
      steps += 1
    }

    return current.id
  }

  const roots = comments.filter((comment) => !comment.parentId || !byId.has(comment.parentId))
  const repliesByRoot = comments.reduce<Record<string, Comment[]>>((acc, comment) => {
    if (!comment.parentId || !byId.has(comment.parentId)) {
      return acc
    }
    const rootId = resolveRootId(comment)
    acc[rootId] = [...(acc[rootId] ?? []), comment]
    return acc
  }, {})

  function renderReplyForm() {
    if (!replyTo) {
      return null
    }

    return (
      <CommentForm
        slug={slug}
        parentId={replyTo.id}
        parentAuthor={replyTo.authorName}
        onSuccess={() => {
          setReplyTo(null)
          void refreshComments()
        }}
        onCancel={() => setReplyTo(null)}
      />
    )
  }

  function commentKey(comment: Comment) {
    return comment.id + (highlight?.id === comment.id ? `-${highlight.nonce}` : "")
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">댓글</h2>
        <p className="text-muted-foreground text-sm">이름과 이메일을 입력해 댓글을 남겨주세요.</p>
      </div>

      <CommentForm
        slug={slug}
        onSuccess={() => {
          void refreshComments()
        }}
      />

      <Separator />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : roots.length === 0 ? (
        <p className="text-muted-foreground text-sm">아직 댓글이 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {roots.map((root) => (
            <li key={root.id} className="space-y-4">
              <CommentItem
                key={commentKey(root)}
                comment={root}
                highlighted={highlight?.id === root.id}
                onReply={() => setReplyTo(root)}
              />
              {replyTo?.id === root.id ? renderReplyForm() : null}

              {(repliesByRoot[root.id] ?? []).map((reply) => (
                <div key={reply.id} className="ml-10 border-l pl-4">
                  <CommentItem
                    key={commentKey(reply)}
                    comment={reply}
                    highlighted={highlight?.id === reply.id}
                    replyTargetName={reply.parentId ? byId.get(reply.parentId)?.authorName : undefined}
                    onNavigateToTarget={
                      reply.parentId ? () => focusComment(reply.parentId!) : undefined
                    }
                    onReply={() => setReplyTo(reply)}
                  />
                  {replyTo?.id === reply.id ? renderReplyForm() : null}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function CommentItem({
  comment,
  highlighted = false,
  replyTargetName,
  onNavigateToTarget,
  onReply,
}: {
  comment: Comment
  highlighted?: boolean
  replyTargetName?: string
  onNavigateToTarget?: () => void
  onReply?: () => void
}) {
  return (
    <div
      id={`comment-${comment.id}`}
      className={cn(
        "-mx-2 flex scroll-mt-20 gap-3 rounded-lg px-2 py-1",
        highlighted && "comment-highlight",
      )}
    >
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
          {replyTargetName ? (
            <button
              type="button"
              onClick={onNavigateToTarget}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 underline-offset-2 hover:underline"
              aria-label={`${replyTargetName}님의 댓글로 이동`}
            >
              <CornerLeftUp className="size-3.5" aria-hidden />
              {replyTargetName}
            </button>
          ) : null}
          <time className="text-muted-foreground" dateTime={comment.createdAt}>
            {format(new Date(comment.createdAt), "yyyy.MM.dd HH:mm")}
          </time>
        </div>
        <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
        {onReply ? (
          <Button variant="ghost" size="sm" onClick={onReply}>
            답글
          </Button>
        ) : null}
      </div>
    </div>
  )
}
