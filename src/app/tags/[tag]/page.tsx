import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { getAllTags, getPostsByTag, paginatePosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

type TagPageProps = {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `#${decodedTag}`,
    description: `${siteConfig.name}의 ${decodedTag} 태그 글 목록`,
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params;
  const query = await searchParams;
  const decodedTag = decodeURIComponent(tag);
  const page = Number(query.page ?? "1");
  const posts = getPostsByTag(decodedTag);

  if (!posts.length) {
    notFound();
  }

  const pagination = paginatePosts(posts, Number.isNaN(page) ? 1 : page);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">Tag</p>
        <h1 className="text-3xl font-bold tracking-tight">#{decodedTag}</h1>
      </header>

      <div className="space-y-4">
        {pagination.items.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <Pagination
        basePath={`/tags/${encodeURIComponent(decodedTag)}`}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
