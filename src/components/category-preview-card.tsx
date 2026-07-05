import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategoryHref, getPostsByCategory } from "@/lib/posts";

const PREVIEW_COUNT = 3;

type CategoryPreviewCardProps = {
  category: string;
};

export function CategoryPreviewCard({ category }: CategoryPreviewCardProps) {
  const posts = getPostsByCategory(category);
  const previewPosts = posts.slice(0, PREVIEW_COUNT);

  return (
    <Card className="transition-colors hover:bg-muted/40">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link href={getCategoryHref(category)} className="hover:underline">
            {category}
          </Link>
        </CardTitle>
        <CardDescription>{posts.length}개의 글</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {previewPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={post.permalink}
                className="line-clamp-1 text-sm text-foreground/90 transition-colors hover:text-foreground hover:underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
        {posts.length > PREVIEW_COUNT ? (
          <Link
            href={getCategoryHref(category)}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            더 보기 →
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
