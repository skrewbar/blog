type TocEntry = {
  title: string
  url: string
  items?: TocEntry[]
}

type FlatTocItem = {
  title: string
  url: string
  depth: number
}

function flattenToc(entries: TocEntry[], depth = 2): FlatTocItem[] {
  return entries.flatMap((entry) => [
    { title: entry.title, url: entry.url, depth },
    ...flattenToc(entry.items ?? [], depth + 1),
  ])
}

type TableOfContentsProps = {
  toc: TocEntry[]
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const items = flattenToc(toc)

  if (!items.length) return null

  return (
    <nav aria-label="Table of contents" className="rounded-lg border p-4">
      <h2 className="mb-3 text-sm font-semibold">목차</h2>
      <ul className="text-muted-foreground space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.url} style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}>
            <a href={item.url} className="hover:text-brand transition-colors">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
