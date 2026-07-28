import Link from "next/link"
import { siteConfig } from "@/lib/site"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { href: "/categories", label: "카테고리" },
  { href: "/archive", label: "아카이브" },
  { href: "/tags", label: "태그" },
  { href: "/about", label: "소개" },
] as const

export function SiteHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-brand text-lg font-semibold tracking-tight transition-colors">
            {siteConfig.name}
          </Link>
          <nav className="text-muted-foreground hidden items-center gap-4 text-sm md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-brand transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
