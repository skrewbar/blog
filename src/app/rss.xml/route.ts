import { Feed } from "feed";
import { getPublicPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export async function GET() {
  const posts = getPublicPosts();
  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: "ko",
    favicon: `${siteConfig.url}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.author}`,
    updated: posts[0] ? new Date(posts[0].date) : new Date(),
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${siteConfig.url}${post.permalink}`,
      link: `${siteConfig.url}${post.permalink}`,
      description: post.description,
      date: new Date(post.date),
      category: [{ name: post.category }],
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
