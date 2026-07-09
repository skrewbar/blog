import { posts as allPosts, type Post } from "#site/content";
import { siteConfig } from "@/lib/site";

export type { Post };

export function getCategoryHref(category: string): string {
  return `/${encodeURIComponent(category)}`;
}

export function decodeCategoryParam(category: string): string {
  return decodeURIComponent(category);
}

const includeDrafts = process.env.NODE_ENV === "development";

function sortPostsByDate(posts: Post[]): Post[] {
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPublicPosts(): Post[] {
  return sortPostsByDate(allPosts.filter((post) => !post.draft));
}

export function getPublishedPosts(): Post[] {
  return sortPostsByDate(
    allPosts.filter((post) => !post.draft || includeDrafts),
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPublishedPosts().find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): Post[] {
  return getPublishedPosts().filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): Post[] {
  return getPublishedPosts().filter((post) =>
    post.tags.some((item) => item.toLowerCase() === tag.toLowerCase()),
  );
}

export function getAllCategories(): string[] {
  return [...new Set(getPublishedPosts().map((post) => post.category))].sort(
    (a, b) => a.localeCompare(b),
  );
}

export function getAllTags(): string[] {
  const tags = getPublishedPosts().flatMap((post) => post.tags);
  return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
}

export function parsePageParam(value?: string): number {
  const parsed = Math.trunc(Number(value ?? "1"));

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export function paginatePosts<T>(items: T[], page: number, perPage = siteConfig.postsPerPage) {
  const safePage = Math.trunc(page);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(Math.max(safePage, 1), totalPages);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  return {
    items: items.slice(start, end),
    currentPage,
    totalPages,
    totalItems: items.length,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
