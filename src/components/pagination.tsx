import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
};

export function Pagination({ basePath, currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const hrefFor = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`);

  return (
    <div className="flex items-center justify-between gap-4 pt-8">
      {prevPage ? (
        <Link
          href={hrefFor(prevPage)}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          이전
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </span>
      {nextPage ? (
        <Link
          href={hrefFor(nextPage)}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          다음
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
