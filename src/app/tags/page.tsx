import type { Metadata } from "next"
import Link from "next/link"
import { getAllTags } from "@/lib/posts"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "태그",
  description: `${siteConfig.name}의 태그 목록`,
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">Tags</p>
        <h1 className="text-3xl font-bold tracking-tight">태그</h1>
      </header>

      {tags.length ? (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/tags/${encodeURIComponent(tag)}`}
                className="hover:bg-muted inline-flex rounded-full border px-3 py-1 text-sm transition-colors"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">아직 태그가 없습니다.</p>
      )}
    </div>
  )
}
