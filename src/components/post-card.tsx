import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatUtcDate } from "@/lib/utc-date"
import { getCategoryHref, type Post } from "@/lib/posts"

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const isDraftPreview = process.env.NODE_ENV === "development" && post.draft

  return (
    <Card className="hover:bg-brand-wash has-[:focus-visible]:ring-ring relative transition-colors has-[:focus-visible]:ring-2">
      <Link href={post.permalink} className="absolute inset-0 z-0">
        <span className="sr-only">{post.title}</span>
      </Link>
      {isDraftPreview ? (
        <Badge
          variant="outline"
          className="pointer-events-none absolute top-3 right-3 z-10 border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        >
          초안
        </Badge>
      ) : null}
      <CardHeader className="pointer-events-none relative z-10">
        <div className="text-muted-foreground flex items-center gap-2 text-sm transition-colors group-hover/card:text-brand-500 dark:group-hover/card:text-brand-400">
          <time dateTime={post.date}>{formatUtcDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
          <span>·</span>
          <Link
            href={getCategoryHref(post.category)}
            className="hover:text-brand pointer-events-auto transition-colors"
          >
            {post.category}
          </Link>
        </div>
        <CardTitle className="text-xl transition-colors group-hover/card:text-brand-500 group-hover/card:underline dark:group-hover/card:text-brand-300">
          {post.title}
        </CardTitle>
        {post.description ? (
          <CardDescription className="transition-colors group-hover/card:text-brand-500 dark:group-hover/card:text-brand-400">
            {post.description}
          </CardDescription>
        ) : null}
        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="pointer-events-auto">
                <Badge variant="tag">{tag}</Badge>
              </Link>
            ))}
          </div>
        ) : null}
      </CardHeader>
    </Card>
  )
}
