import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { CommentSection } from "@/components/comments/comment-section";
import { MdxContent } from "@/components/mdx-content";
import { PostStats } from "@/components/post-stats";
import { TableOfContents } from "@/components/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

type PostPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({
    slug: [post.slug],
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const postSlug = slug.join("/");
  const post = getPostBySlug(postSlug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${siteConfig.url}${post.permalink}`,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const postSlug = slug.join("/");
  const post = getPostBySlug(postSlug);

  if (!post) {
    notFound();
  }

  const postUrl = `${siteConfig.url}${post.permalink}`;

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.date}>{format(new Date(post.date), "yyyy.MM.dd")}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
          <span>·</span>
          <Link href={`/${post.category}`} className="hover:text-foreground">
            {post.category}
          </Link>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-lg text-muted-foreground">{post.description}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
              <Badge variant="secondary">{tag}</Badge>
            </Link>
          ))}
        </div>
        {post.cover ? (
          <div className="relative aspect-[2/1] overflow-hidden rounded-xl border">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : null}
        <PostStats slug={post.slug} />
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        <MdxContent code={post.content} />
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents toc={post.toc} />
          </div>
        </aside>
      </div>

      <Separator />

      <CommentSection slug={post.slug} postTitle={post.title} postUrl={postUrl} />
    </article>
  );
}
