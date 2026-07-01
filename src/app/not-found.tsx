import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-20">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-muted-foreground">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="text-sm underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
