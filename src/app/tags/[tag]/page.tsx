import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PostTitleList } from "@/components/post-title-list"
import { getAllTags, getPostsByTag } from "@/lib/posts"
import { siteConfig } from "@/lib/site"

type TagPageProps = {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  return {
    title: `#${decodedTag}`,
    description: `${siteConfig.name}의 ${decodedTag} 태그 글 목록`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)

  if (!posts.length) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">
          <Link href="/tags" className="hover:text-brand transition-colors">
            Tags
          </Link>
          {" / "}
          Tag
        </p>
        <h1 className="text-3xl font-bold tracking-tight">#{decodedTag}</h1>
      </header>

      <PostTitleList posts={posts} />
    </div>
  )
}
