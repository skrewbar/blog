export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Dev Blog",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    "개발과 일상을 기록하는 개인 블로그",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR ?? "Author",
  postsPerPage: 10,
};
