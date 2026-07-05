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
  return (
    <Card className="transition-colors hover:bg-muted/40">
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
