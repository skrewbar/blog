import { posts as allPosts, type Post } from "#site/content";
import { siteConfig } from "@/lib/site";

export type { Post };

export function getCategoryHref(category: string): string {
  return `/${encodeURIComponent(category)}`;
}

export function decodeCategoryParam(category: string): string {
  return decodeURIComponent(category);
}

export function getPublishedPosts(): Post[] {
  return allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
  return [...new Set(getPublishedPosts().map((post) => post.category))].sort();
}

export function getAllTags(): string[] {
  const tags = getPublishedPosts().flatMap((post) => post.tags);
  return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
}

export function paginatePosts<T>(items: T[], page: number, perPage = siteConfig.postsPerPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
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
