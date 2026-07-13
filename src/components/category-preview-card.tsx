import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoryHref, getPostsByCategory } from "@/lib/posts"

const PREVIEW_COUNT = 3

type CategoryPreviewCardProps = {
  category: string
}

export function CategoryPreviewCard({ category }: CategoryPreviewCardProps) {
  const posts = getPostsByCategory(category)
  const previewPosts = posts.slice(0, PREVIEW_COUNT)

  return (
    <Card className="hover:bg-muted/40 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link href={getCategoryHref(category)} className="hover:underline">
            {category}
          </Link>
        </CardTitle>
        <CardDescription>{posts.length}개의 글</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {previewPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={post.permalink}
                className="text-foreground/90 hover:text-foreground line-clamp-1 text-sm transition-colors hover:underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
        {posts.length > PREVIEW_COUNT ? (
          <Link
            href={getCategoryHref(category)}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            더 보기 →
          </Link>
        ) : null}
      </CardContent>
    </Card>
  )
}
