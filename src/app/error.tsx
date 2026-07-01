"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-4 py-20">
      <h1 className="text-3xl font-bold">문제가 발생했습니다</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
      >
        다시 시도
      </button>
    </div>
  );
}
