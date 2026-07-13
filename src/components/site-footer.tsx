import Link from "next/link"
import { siteConfig } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.author}. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-foreground">
            개인정보 처리방침
          </Link>
          <Link href="/rss.xml" className="hover:text-foreground">
            RSS
          </Link>
        </div>
      </div>
    </footer>
  )
}
