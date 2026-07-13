"use client"

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4 py-20">
      <h1 className="text-3xl font-bold">문제가 발생했습니다</h1>
      <p className="text-muted-foreground">요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
      <button type="button" onClick={reset} className="hover:bg-muted rounded-md border px-4 py-2 text-sm">
        다시 시도
      </button>
    </div>
  )
}
