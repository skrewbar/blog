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
        <li key={post.slug}>
          <Link href={post.permalink} className="group grid grid-cols-[10ch_1fr] items-baseline gap-x-3 text-sm">
            <time dateTime={post.date} className="text-muted-foreground tabular-nums">
              {formatUtcDate(post.date)}
            </time>
            <span className="text-foreground/90 group-hover:text-foreground font-medium transition-colors">
              {post.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
