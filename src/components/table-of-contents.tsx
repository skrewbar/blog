"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type TocEntry = {
  title: string
  url: string
  items?: TocEntry[]
}

type TableOfContentsProps = {
  toc: TocEntry[]
}

/** Matches `.prose :is(h2…h6) { scroll-margin-top: 5rem }` plus subpixel slack. */
function getActivationOffsetPx(): number {
  const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  return rem * 5 + 2
}

function collectUrls(entries: TocEntry[]): string[] {
  return entries.flatMap((entry) => [entry.url, ...collectUrls(entry.items ?? [])])
}

function buildAncestorMap(entries: TocEntry[], ancestors: string[] = []): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const entry of entries) {
    map.set(entry.url, ancestors)
    const childMap = buildAncestorMap(entry.items ?? [], [...ancestors, entry.url])
    for (const [url, chain] of childMap) {
      map.set(url, chain)
    }
  }
  return map
}

function headingIdFromUrl(url: string): string {
  return decodeURIComponent(url.replace(/^#/, ""))
}

type TocListProps = {
  entries: TocEntry[]
  activeUrl: string | null
  activeChain: Set<string>
  onNavigate: (url: string) => void
}

function TocList({ entries, activeUrl, activeChain, onNavigate }: TocListProps) {
  return (
    <ul className="text-muted-foreground space-y-2 text-sm">
      {entries.map((entry) => {
        const isActive = entry.url === activeUrl
        const isInChain = activeChain.has(entry.url)
        const children = entry.items ?? []
        const showChildren = isInChain && children.length > 0

        return (
          <li key={entry.url} data-toc-url={entry.url}>
            <a
              href={entry.url}
              className={cn(
                "hover:text-brand transition-colors",
                isActive && "text-brand font-medium",
                isInChain && !isActive && "text-foreground",
              )}
              onClick={() => onNavigate(entry.url)}
            >
              {entry.title}
            </a>
            {showChildren ? (
              <div className="mt-2 pl-3">
                <TocList
                  entries={children}
                  activeUrl={activeUrl}
                  activeChain={activeChain}
                  onNavigate={onNavigate}
                />
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const urls = useMemo(() => collectUrls(toc), [toc])
  const ancestorMap = useMemo(() => buildAncestorMap(toc), [toc])
  const [activeUrl, setActiveUrl] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  const activeChain = useMemo(() => {
    if (!activeUrl) return new Set<string>()
    const ancestors = ancestorMap.get(activeUrl) ?? []
    return new Set([...ancestors, activeUrl])
  }, [activeUrl, ancestorMap])

  useEffect(() => {
    if (!urls.length) return

    const headings = urls
      .map((url) => {
        const el = document.getElementById(headingIdFromUrl(url))
        return el ? { url, el } : null
      })
      .filter((item): item is { url: string; el: HTMLElement } => item !== null)

    if (!headings.length) return

    const updateActive = () => {
      const offset = getActivationOffsetPx()
      let current: string | null = null
      for (const { url, el } of headings) {
        if (el.getBoundingClientRect().top <= offset) {
          current = url
        } else {
          break
        }
      }
      setActiveUrl((prev) => (prev === current ? prev : current))
    }

    updateActive()

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateActive)
    }

    const onHashChange = () => {
      const hash = decodeURIComponent(window.location.hash)
      if (hash && urls.includes(hash)) {
        setActiveUrl(hash)
      } else {
        updateActive()
      }
    }

    // IntersectionObserver: thin band under the sticky header.
    // Scroll listener covers cases where IO misses fast scrolls.
    const syncObserver = () => {
      const offset = getActivationOffsetPx()
      const bottomClamp = Math.max(0, window.innerHeight - offset - 1)
      return new IntersectionObserver(updateActive, {
        rootMargin: `-${offset}px 0px -${bottomClamp}px 0px`,
        threshold: 0,
      })
    }

    let observer = syncObserver()
    for (const { el } of headings) {
      observer.observe(el)
    }

    const onResize = () => {
      observer.disconnect()
      observer = syncObserver()
      for (const { el } of headings) {
        observer.observe(el)
      }
      onScroll()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    window.addEventListener("hashchange", onHashChange)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("hashchange", onHashChange)
    }
  }, [urls])

  useEffect(() => {
    if (!activeUrl || !navRef.current) return
    const item = Array.from(navRef.current.querySelectorAll("[data-toc-url]")).find(
      (el) => el.getAttribute("data-toc-url") === activeUrl,
    )
    if (!(item instanceof HTMLElement)) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    item.scrollIntoView({
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }, [activeUrl])

  if (!urls.length) return null

  return (
    <nav
      ref={navRef}
      aria-label="Table of contents"
      className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border p-4"
    >
      <h2 className="mb-3 text-sm font-semibold">목차</h2>
      <TocList
        entries={toc}
        activeUrl={activeUrl}
        activeChain={activeChain}
        onNavigate={setActiveUrl}
      />
    </nav>
  )
}
