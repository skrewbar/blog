import type { Metadata } from "next"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: `${siteConfig.name} 개인정보 처리방침`,
}

export default function PrivacyPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert prose-a:transition-colors prose-a:hover:text-brand max-w-none">
      <h1>개인정보 처리방침</h1>
      <p>{siteConfig.name}(이하 &quot;블로그&quot;)는 댓글 서비스 제공을 위해 아래와 같이 개인정보를 처리합니다.</p>

      <h2>수집하는 개인정보</h2>
      <ul>
        <li>댓글 작성 시: 이름, 이메일, 댓글 내용</li>
        <li>조회수/좋아요: IP와 User-Agent를 해시 처리한 식별값</li>
        <li>스팸 방지: IP, User-Agent (Akismet 전송)</li>
      </ul>

      <h2>이용 목적</h2>
      <ul>
        <li>댓글 표시 및 Gravatar 프로필 이미지 제공</li>
        <li>대댓글 알림 이메일 발송 (사용자가 선택한 경우)</li>
        <li>새 댓글 알림 이메일 발송 (블로그 운영자)</li>
        <li>조회수/좋아요 중복 방지</li>
        <li>스팸 및 악성 댓글 방지</li>
      </ul>

      <h2>보관 기간</h2>
      <p>
        댓글 정보는 삭제 요청 또는 운영자 판단에 따라 삭제될 수 있습니다. 조회 로그는 24시간 중복 방지 목적으로
        활용됩니다.
      </p>

      <h2>제3자 제공</h2>
      <ul>
        <li>Gravatar: 프로필 이미지 제공</li>
        <li>Akismet: 스팸 필터링</li>
        <li>Resend: 이메일 발송</li>
        <li>Supabase: 데이터 저장</li>
      </ul>

      <h2>문의</h2>
      <p>개인정보 관련 문의는 블로그 운영자에게 연락해 주세요.</p>
    </article>
  )
}
