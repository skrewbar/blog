import { Resend } from "resend"
import { siteConfig } from "@/lib/site"
import { escapeHtml, escapeHtmlAttribute, escapeHtmlWithLineBreaks } from "@/lib/utils"

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return null
  }
  return new Resend(apiKey)
}

type ReplyNotificationParams = {
  to: string
  parentAuthor: string
  replyAuthor: string
  postTitle: string
  postUrl: string
  replyBody: string
  unsubscribeUrl: string
}

type OwnerNotificationParams = {
  authorName: string
  authorEmail: string
  postTitle: string
  postUrl: string
  commentBody: string
  isReply: boolean
}

export async function sendOwnerNotification(params: OwnerNotificationParams): Promise<void> {
  const resend = getResend()
  const to = process.env.SITE_OWNER_EMAIL
  if (!resend || !to) {
    return
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"
  const commentType = params.isReply ? "답글" : "댓글"
  const postTitle = escapeHtml(params.postTitle)
  const authorName = escapeHtml(params.authorName)
  const authorEmail = escapeHtml(params.authorEmail)
  const commentBody = escapeHtmlWithLineBreaks(params.commentBody)
  const postUrl = escapeHtmlAttribute(params.postUrl)

  await resend.emails.send({
    from,
    to,
    subject: `[${siteConfig.name}] 새 ${commentType}: ${params.postTitle}`,
    html: `
      <p><strong>${postTitle}</strong>에 새 ${commentType}이 달렸습니다.</p>
      <p>
        <strong>${authorName}</strong>
        &lt;${authorEmail}&gt;
      </p>
      <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555;">
        ${commentBody}
      </blockquote>
      <p><a href="${postUrl}">글 보러 가기</a></p>
    `,
  })
}

export async function sendReplyNotification(params: ReplyNotificationParams): Promise<void> {
  const resend = getResend()
  if (!resend) {
    return
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"
  const parentAuthor = escapeHtml(params.parentAuthor)
  const replyAuthor = escapeHtml(params.replyAuthor)
  const replyBody = escapeHtmlWithLineBreaks(params.replyBody)
  const postUrl = escapeHtmlAttribute(params.postUrl)
  const unsubscribeUrl = escapeHtmlAttribute(params.unsubscribeUrl)

  await resend.emails.send({
    from,
    to: params.to,
    subject: `[${siteConfig.name}] ${params.postTitle}에 새 댓글이 달렸습니다`,
    html: `
      <p>안녕하세요 ${parentAuthor}님,</p>
      <p><strong>${replyAuthor}</strong>님이 회원님의 댓글에 답글을 남겼습니다.</p>
      <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555;">
        ${replyBody}
      </blockquote>
      <p><a href="${postUrl}">글 보러 가기</a></p>
      <p style="font-size:12px;color:#888;">
        더 이상 알림을 받지 않으려면 <a href="${unsubscribeUrl}">수신 거부</a>를 클릭하세요.
      </p>
    `,
  })
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY)
}
