"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type CommentFormProps = {
  slug: string
  parentId?: string | null
  parentAuthor?: string
  onSuccess: () => void
  onCancel?: () => void
}

export function CommentForm({ slug, parentId = null, parentAuthor, onSuccess, onCancel }: CommentFormProps) {
  const [authorName, setAuthorName] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [body, setBody] = useState("")
  const [notify, setNotify] = useState(false)
  const [website, setWebsite] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          parentId,
          authorName,
          authorEmail,
          body,
          notify,
          website,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? "댓글 등록에 실패했습니다.")
        return
      }

      setAuthorName("")
      setAuthorEmail("")
      setBody("")
      setNotify(false)
      setWebsite("")
      onSuccess()
    } catch {
      setError("댓글 등록에 실패했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      {parentAuthor ? (
        <p className="text-muted-foreground text-sm">
          <strong>{parentAuthor}</strong>님에게 답글 작성 중
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="authorName">이름</Label>
          <Input
            id="authorName"
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            required
            maxLength={50}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="authorEmail">이메일</Label>
          <Input
            id="authorEmail"
            type="email"
            value={authorEmail}
            onChange={(event) => setAuthorEmail(event.target.value)}
            required
            maxLength={100}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">댓글</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
          rows={4}
          maxLength={2000}
        />
      </div>

      {parentId ? (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={notify} onChange={(event) => setNotify(event.target.checked)} />
          답글 알림 이메일 받기
        </label>
      ) : (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={notify} onChange={(event) => setNotify(event.target.checked)} />내 댓글에
          답글이 달리면 이메일 받기
        </label>
      )}

      <input
        type="text"
        name="website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "등록 중..." : parentId ? "답글 등록" : "댓글 등록"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        ) : null}
      </div>
    </form>
  )
}
