import type { Metadata } from "next"
import { PostTitleList } from "@/components/post-title-list"
import { getPublishedPosts } from "@/lib/posts"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "아카이브",
  description: `${siteConfig.name}의 전체 글 목록`,
}

export default function ArchivePage() {
  const posts = getPublishedPosts()

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">Archive</p>
        <h1 className="text-3xl font-bold tracking-tight">아카이브</h1>
      </header>

      <PostTitleList posts={posts} />
    </div>
  )
}
