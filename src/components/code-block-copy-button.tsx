"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CodeBlockCopyButtonProps = {
  containerRef: React.RefObject<HTMLElement | null>
  className?: string
}

export function CodeBlockCopyButton({ containerRef, className }: CodeBlockCopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const code = containerRef.current?.querySelector("code")
    const text = code?.textContent ?? ""

    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      className={cn(
        buttonVariants({ variant: "outline", size: "icon-xs" }),
        "bg-background/90 absolute top-2 right-2 z-10 shadow-sm backdrop-blur-sm hover:border-brand-border hover:bg-brand-subtle hover:text-brand-chip-foreground dark:hover:border-brand-border dark:hover:bg-brand-subtle dark:hover:text-brand-chip-foreground",
        className,
      )}
      onClick={handleCopy}
      aria-label={copied ? "복사됨" : "코드 복사"}
    >
      {copied ? <Check /> : <Copy />}
    </button>
  )
}
