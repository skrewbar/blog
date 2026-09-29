import { basename, extname } from "node:path"
import { context, defineCollection, defineConfig, defineSchema, s } from "velite"
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

const COVER_ASPECT_PATTERN = /^(?:auto|[1-9]\d*\/[1-9]\d*)$/

const coverAspect = defineSchema(() =>
  s.string().refine((value) => COVER_ASPECT_PATTERN.test(value), "Invalid coverAspect: use auto or integer/integer"),
)

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Slug derived from the file name (category folders are ignored) and lowercased,
 * e.g. `posts/PS/CF-990D.mdx` → `cf-990d`. Must be kebab-case and unique across all posts.
 */
const fileSlug = defineSchema(() =>
  s
    .unknown()
    .transform(() => basename(context().file.path, extname(context().file.path)).toLowerCase())
    .pipe(
      s
        .string()
        .regex(SLUG_PATTERN, "Invalid file name: use letters, digits and hyphens (e.g. cf-990d.mdx)")
        .pipe(s.unique("post-slug")),
    ),
)

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(200),
      description: s.string().max(500).optional(),
      date: utcDate(),
      slug: fileSlug(),
      category: s.string(),
      tags: s.array(s.string()).default([]),
      cover: s.string().optional(),
      coverAspect: coverAspect().optional(),
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
