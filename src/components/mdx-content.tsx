"use client"

import { createElement, useMemo } from "react"
import * as runtime from "react/jsx-runtime"
import { mdxComponents } from "@/mdx-components"

type MdxComponents = Record<string, React.ElementType>

function getMDXComponent(code: string) {
  const fn = new Function(code)
  return fn({ ...runtime }).default as React.ComponentType<{
    components?: MdxComponents
  }>
}

type MdxContentProps = {
  code: string
}

export function MdxContent({ code }: MdxContentProps) {
  const Component = useMemo(() => getMDXComponent(code), [code])

  return (
    <article className="prose prose-neutral dark:prose-invert prose-pre:my-0 prose-code:before:content-none prose-code:after:content-none prose-a:transition-colors prose-a:hover:text-brand max-w-none min-w-0">
      {createElement(Component, { components: mdxComponents })}
    </article>
  )
}
