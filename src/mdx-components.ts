import { AtRating, CfRating } from "@/components/mdx-rating"
import { Collapsible } from "@/components/mdx-collapsible"
import { MdxFigure } from "@/components/mdx-figure"

export const mdxComponents = {
  figure: MdxFigure,
  Collapsible,
  CfRating,
  AtRating,
} satisfies Record<string, React.ElementType>

declare global {
  type MDXProvidedComponents = typeof mdxComponents
}
