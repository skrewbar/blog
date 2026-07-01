import { siteConfig } from "@/lib/site";

type AkismetParams = {
  userIp: string;
  userAgent: string;
  author: string;
  authorEmail: string;
  content: string;
  permalink: string;
};

export async function isSpamComment(params: AkismetParams): Promise<boolean> {
  const apiKey = process.env.AKISMET_API_KEY;
  if (!apiKey) {
    return false;
  }

  const body = new URLSearchParams({
    blog: siteConfig.url,
    user_ip: params.userIp,
    user_agent: params.userAgent,
    comment_type: "comment",
    comment_author: params.author,
    comment_author_email: params.authorEmail,
    comment_content: params.content,
    permalink: params.permalink,
  });

  const response = await fetch(
    `https://${apiKey}.rest.akismet.com/1.1/comment-check`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    },
  );

  const result = await response.text();
  return result.trim() === "true";
}
