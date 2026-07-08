import { Resend } from "resend";
import { siteConfig } from "@/lib/site";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

type ReplyNotificationParams = {
  to: string;
  parentAuthor: string;
  replyAuthor: string;
  postTitle: string;
  postUrl: string;
  replyBody: string;
  unsubscribeUrl: string;
};

type OwnerNotificationParams = {
  authorName: string;
  authorEmail: string;
  postTitle: string;
  postUrl: string;
  commentBody: string;
  isReply: boolean;
};

export async function sendOwnerNotification(
  params: OwnerNotificationParams,
): Promise<void> {
  const resend = getResend();
  const to = process.env.SITE_OWNER_EMAIL;
  if (!resend || !to) {
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const commentType = params.isReply ? "답글" : "댓글";

  await resend.emails.send({
    from,
    to,
    subject: `[${siteConfig.name}] 새 ${commentType}: ${params.postTitle}`,
    html: `
      <p><strong>${params.postTitle}</strong>에 새 ${commentType}이 달렸습니다.</p>
      <p>
        <strong>${params.authorName}</strong>
        &lt;${params.authorEmail}&gt;
      </p>
      <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555;">
        ${params.commentBody}
      </blockquote>
      <p><a href="${params.postUrl}">글 보러 가기</a></p>
    `,
  });
}

export async function sendReplyNotification(
  params: ReplyNotificationParams,
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  await resend.emails.send({
    from,
    to: params.to,
    subject: `[${siteConfig.name}] ${params.postTitle}에 새 댓글이 달렸습니다`,
    html: `
      <p>안녕하세요 ${params.parentAuthor}님,</p>
      <p><strong>${params.replyAuthor}</strong>님이 회원님의 댓글에 답글을 남겼습니다.</p>
      <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555;">
        ${params.replyBody}
      </blockquote>
      <p><a href="${params.postUrl}">글 보러 가기</a></p>
      <p style="font-size:12px;color:#888;">
        더 이상 알림을 받지 않으려면 <a href="${params.unsubscribeUrl}">수신 거부</a>를 클릭하세요.
      </p>
    `,
  });
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}
