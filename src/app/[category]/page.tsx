import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Pagination } from "@/components/pagination"
import { PostCard } from "@/components/post-card"
import {
  decodeCategoryParam,
  getAllCategories,
  getCategoryHref,
  getPostsByCategory,
  paginatePosts,
  parsePageParam,
} from "@/lib/posts"
import { siteConfig } from "@/lib/site"

const RESERVED_CATEGORIES = new Set([
  "posts",
  "tags",
  "categories",
  "archive",
  "about",
  "api",
  "privacy",
  "rss.xml",
  "_next",
])

type CategoryPageProps = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeCategoryParam(category)
  return {
    title: `${decodedCategory} 글 목록`,
    description: `${siteConfig.name}의 ${decodedCategory} 카테고리 글 목록`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params
  const decodedCategory = decodeCategoryParam(category)

  if (RESERVED_CATEGORIES.has(decodedCategory)) {
    notFound()
  }

  const query = await searchParams
  const posts = getPostsByCategory(decodedCategory)

  if (!posts.length && !getAllCategories().includes(decodedCategory)) {
    notFound()
  }

  const pagination = paginatePosts(posts, parsePageParam(query.page))

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">Category</p>
        <h1 className="text-3xl font-bold tracking-tight">{decodedCategory}</h1>
      </header>

      <div className="space-y-4">
        {pagination.items.length ? (
          pagination.items.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p className="text-muted-foreground">아직 글이 없습니다.</p>
        )}
      </div>

      <Pagination
        basePath={getCategoryHref(decodedCategory)}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
    </div>
  )
}
