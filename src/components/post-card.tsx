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
    <Card className="hover:bg-muted/40 relative transition-colors">
      {isDraftPreview ? (
        <Badge
          variant="outline"
          className="absolute top-3 right-3 border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        >
          초안
        </Badge>
      ) : null}
      <CardHeader>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <time dateTime={post.date}>{formatUtcDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
          <span>·</span>
          <Link href={getCategoryHref(post.category)} className="hover:text-foreground">
            {post.category}
          </Link>
        </div>
        <CardTitle className="text-xl">
          <Link href={post.permalink} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription>{post.description}</CardDescription>
        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                <Badge variant="secondary">{tag}</Badge>
              </Link>
            ))}
          </div>
        ) : null}
      </CardHeader>
    </Card>
  )
}
