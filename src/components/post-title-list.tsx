import Link from "next/link"
import { formatUtcDate } from "@/lib/utc-date"
import type { Post } from "@/lib/posts"

type PostTitleListProps = {
  posts: Post[]
}

export function PostTitleList({ posts }: PostTitleListProps) {
  if (!posts.length) {
    return <p className="text-muted-foreground">아직 글이 없습니다.</p>
  }

  return (
    <ul className="space-y-2">
      {posts.map((post) => (
        <li key={post.slug} className="grid grid-cols-[10ch_1fr] items-baseline gap-x-3 text-sm">
          <time dateTime={post.date} className="text-muted-foreground tabular-nums">
            {formatUtcDate(post.date)}
          </time>
          <Link
            href={post.permalink}
            className="text-foreground/90 hover:text-brand justify-self-start font-medium transition-colors hover:underline"
          >
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
