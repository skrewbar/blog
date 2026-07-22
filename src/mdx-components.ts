import { AtDifficulty, CfDifficulty } from "@/components/mdx-difficulty"
import { Collapsible } from "@/components/mdx-collapsible"
import { MdxFigure } from "@/components/mdx-figure"

export const mdxComponents = {
  figure: MdxFigure,
  Collapsible,
  CfDifficulty,
  AtDifficulty,
} satisfies Record<string, React.ElementType>

declare global {
  type MDXProvidedComponents = typeof mdxComponents
}
