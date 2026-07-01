import Link from "next/link";
import { getAllCategories } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const categories = getAllCategories();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {siteConfig.name}
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/${category}`}
                className="transition-colors hover:text-foreground"
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
