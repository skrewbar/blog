import { Pagination } from "@/components/pagination"
import { PostCard } from "@/components/post-card"
import { getPublishedPosts, paginatePosts, parsePageParam } from "@/lib/posts"
import { siteConfig } from "@/lib/site"

type HomePageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const posts = getPublishedPosts()
  const pagination = paginatePosts(posts, parsePageParam(params.page))

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{siteConfig.name}</h1>
        <p className="text-muted-foreground">{siteConfig.description}</p>
      </section>

      <div className="space-y-4">
        {pagination.items.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <Pagination basePath="/" currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
    </div>
  )
}
