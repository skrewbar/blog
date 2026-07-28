import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type MdxCollapsibleProps = {
  title: string
  defaultOpen?: boolean
  className?: string
  children: React.ReactNode
}

export function Collapsible({ title, defaultOpen = false, className, children }: MdxCollapsibleProps) {
  return (
    <details
      className={cn("group border-border bg-muted/30 my-6 overflow-hidden rounded-lg border", className)}
      open={defaultOpen || undefined}
    >
      <summary className="not-prose text-foreground hover:bg-muted/50 flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium transition-colors [&::-webkit-details-marker]:hidden">
        <ChevronRight className="text-muted-foreground size-4 shrink-0 transition-transform duration-150 ease-in-out group-open:rotate-90" />
        {title}
      </summary>
      <div className="border-border text-foreground border-t px-4 py-3 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </details>
  )
}
