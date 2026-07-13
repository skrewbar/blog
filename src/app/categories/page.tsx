import type { Metadata } from "next"
import { CategoryPreviewCard } from "@/components/category-preview-card"
import { getAllCategories } from "@/lib/posts"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "카테고리",
  description: `${siteConfig.name}의 카테고리 목록`,
}

export default function CategoriesPage() {
  const categories = getAllCategories()

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">Categories</p>
        <h1 className="text-3xl font-bold tracking-tight">카테고리</h1>
      </header>

      {categories.length ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((category) => (
            <CategoryPreviewCard key={category} category={category} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">아직 카테고리가 없습니다.</p>
      )}
    </div>
  )
}
