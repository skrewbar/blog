import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategoryHref, type Post } from "@/lib/posts";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const isDraftPreview =
    process.env.NODE_ENV === "development" && post.draft;

  return (
    <Card className="relative transition-colors hover:bg-muted/40">
      {isDraftPreview ? (
        <Badge
          variant="outline"
          className="absolute top-3 right-3 border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        >
          초안
        </Badge>
      ) : null}
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.date}>{format(new Date(post.date), "yyyy.MM.dd")}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
          <span>·</span>
          <Link href={getCategoryHref(post.category)} className="hover:text-foreground">
            {post.category}
          </Link>
        </div>
        <CardTitle className="text-xl">
          <Link href={post.permalink} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription>{post.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
              <Badge variant="secondary">{tag}</Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
