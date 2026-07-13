import Link from "next/link"
import { format } from "date-fns"
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
          <Link href={post.permalink} className="group flex items-baseline gap-3 text-sm">
            <time dateTime={post.date} className="text-muted-foreground shrink-0 tabular-nums">
              {format(new Date(post.date), "yyyy.MM.dd")}
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
