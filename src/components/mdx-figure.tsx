"use client"

import { useRef } from "react"
import { CodeBlockCopyButton } from "@/components/code-block-copy-button"
import { cn } from "@/lib/utils"

type MdxFigureProps = React.ComponentProps<"figure"> & {
  "data-rehype-pretty-code-figure"?: boolean | ""
}

export function MdxFigure({ children, className, ...props }: MdxFigureProps) {
  const isCodeBlock = props["data-rehype-pretty-code-figure"] !== undefined
  const figureRef = useRef<HTMLElement>(null)

  if (!isCodeBlock) {
    return (
      <figure className={className} {...props}>
        {children}
      </figure>
    )
  }

  return (
    <figure ref={figureRef} className={cn("relative", className)} {...props}>
      {children}
      <CodeBlockCopyButton containerRef={figureRef} />
    </figure>
  )
}
