import { defineCollection, defineConfig, defineSchema, s } from "velite"
import rehypeKatex from "rehype-katex"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkMath from "remark-math"
import { parseUtcDate } from "./src/lib/utc-date"

/** Like s.isodate(), but offset-less / date-only values are always UTC (not build-machine local). */
const utcDate = defineSchema(() =>
  s
    .string()
    .refine((value) => !Number.isNaN(parseUtcDate(value).getTime()), "Invalid date string")
    .transform((value) => parseUtcDate(value).toISOString()),
)

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(200),
      description: s.string().max(500),
      date: utcDate(),
      slug: s.string(),
      category: s.string(),
      tags: s.array(s.string()).default([]),
      cover: s.string().optional(),
      draft: s.boolean().default(false),
      content: s.mdx(),
      toc: s.toc(),
      metadata: s.metadata(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/posts/${data.slug}`,
      readingTime: `${data.metadata.readingTime} min read`,
      wordCount: data.metadata.wordCount,
    })),
})

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts },
  mdx: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeSlug,
      rehypeKatex,
      [
        rehypePrettyCode,
        {
          theme: { dark: "github-dark", light: "github-light" },
          keepBackground: false,
        },
      ],
    ],
  },
})
