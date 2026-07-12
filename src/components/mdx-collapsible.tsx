import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type MdxCollapsibleProps = {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Collapsible({
  title,
  defaultOpen = false,
  className,
  children,
}: MdxCollapsibleProps) {
  return (
    <details
      className={cn(
        "group my-6 overflow-hidden rounded-lg border border-border bg-muted/30 not-prose",
        className,
      )}
      open={defaultOpen || undefined}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
        {title}
      </summary>
      <div className="border-t border-border px-4 py-3 text-foreground [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </details>
  );
}
