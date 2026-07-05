import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description: `${siteConfig.name} 소개`,
};

export default function AboutPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>소개</h1>
      <p>
        안녕하세요, {siteConfig.author}입니다.
      </p>
      <p>{siteConfig.description}</p>
      <p>
        이 블로그에서는 개발과 일상에 대한 생각을 기록합니다. 궁금한 점이
        있으시면 댓글로 남겨 주세요.
      </p>
    </article>
  );
}
