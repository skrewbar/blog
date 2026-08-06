import { Calendar, Clock, Folder } from "lucide-react"
import Link from "next/link"
import { formatUtcDate } from "@/lib/utc-date"
import { getCategoryHref } from "@/lib/posts"
import { cn } from "@/lib/utils"

type PostMetaProps = {
  category: string
  date: string
  readingTime: string
  className?: string
  categoryClassName?: string
}

function MetaSeparator() {
  return (
    <span className="text-border select-none" aria-hidden>
      |
    </span>
  )
}

export function PostMeta({
  category,
  date,
  readingTime,
  className,
  categoryClassName,
}: PostMetaProps) {
  return (
    <div className={cn("text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm", className)}>
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="size-3.5 shrink-0" aria-hidden />
        <time dateTime={date}>{formatUtcDate(date)}</time>
      </span>
      <MetaSeparator />
      <span className="inline-flex items-center gap-1.5">
        <Clock className="size-3.5 shrink-0" aria-hidden />
        <span>{readingTime}</span>
      </span>
      <MetaSeparator />
      <Link
        href={getCategoryHref(category)}
        className={cn(
          "inline-flex items-center gap-1.5 transition-colors hover:text-brand",
          categoryClassName,
        )}
      >
        <Folder className="size-3.5 shrink-0" aria-hidden />
        {category}
      </Link>
    </div>
  )
}
