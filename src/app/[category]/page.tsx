import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import {
  getAllCategories,
  getPostsByCategory,
  paginatePosts,
} from "@/lib/posts";
import { siteConfig } from "@/lib/site";

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
]);

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${category} 글 목록`,
    description: `${siteConfig.name}의 ${category} 카테고리 글 목록`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;

  if (RESERVED_CATEGORIES.has(category)) {
    notFound();
  }

  const query = await searchParams;
  const page = Number(query.page ?? "1");
  const posts = getPostsByCategory(category);

  if (!posts.length && !getAllCategories().includes(category)) {
    notFound();
  }

  const pagination = paginatePosts(posts, Number.isNaN(page) ? 1 : page);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">Category</p>
        <h1 className="text-3xl font-bold tracking-tight">{category}</h1>
      </header>

      <div className="space-y-4">
        {pagination.items.length ? (
          pagination.items.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p className="text-muted-foreground">아직 글이 없습니다.</p>
        )}
      </div>

      <Pagination
        basePath={`/${category}`}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
