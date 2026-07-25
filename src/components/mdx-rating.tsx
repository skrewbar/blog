import { cn } from "@/lib/utils"

type RatingProps = {
  /** 문제/유저 레이팅 */
  rating: number
  /** 표시할 텍스트. 생략 시 rating 숫자를 그대로 표시 */
  children?: React.ReactNode
  className?: string
}

type ColorStop = {
  min: number
  color: string
}

const CF_COLORS: ColorStop[] = [
  { min: 3000, color: "#FF0000" }, // Legendary Grandmaster (특수 표기)
  { min: 2400, color: "#FF0000" }, // GM / IGM
  { min: 2100, color: "#FF8C00" }, // Master / IM
  { min: 1900, color: "#AA00AA" }, // Candidate Master
  { min: 1600, color: "#0000FF" }, // Expert
  { min: 1400, color: "#03A89E" }, // Specialist
  { min: 1200, color: "#008000" }, // Pupil
  { min: 0, color: "#808080" }, // Newbie
]

const AT_COLORS: ColorStop[] = [
  { min: 3600, color: "#FFD700" }, // 금
  { min: 2800, color: "#FF0000" }, // 적
  { min: 2400, color: "#FF8000" }, // 주황
  { min: 2000, color: "#C0C000" }, // 황
  { min: 1600, color: "#0000FF" }, // 청
  { min: 1200, color: "#00C0C0" }, // 수색
  { min: 800, color: "#008000" }, // 녹
  { min: 400, color: "#804000" }, // 갈
  { min: 0, color: "#808080" }, // 회
]

function resolveColor(stops: ColorStop[], rating: number): string {
  for (const stop of stops) {
    if (rating >= stop.min) return stop.color
  }
  return stops[stops.length - 1]!.color
}

function RatingSpan({
  color,
  className,
  children,
}: {
  color: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn("font-semibold not-prose", className)}
      style={{ color }}
    >
      {children}
    </span>
  )
}

/**
 * Codeforces 레이팅/난이도 색상.
 *
 * @example
 * <CfRating rating={1600} />
 * <CfRating rating={3000}>tourist</CfRating>
 */
export function CfRating({ rating, children, className }: RatingProps) {
  const text = children ?? String(rating)
  const color = resolveColor(CF_COLORS, rating)

  // Legendary Grandmaster: 첫 글자 검정(다크모드에선 흰), 나머지 빨강
  if (rating >= 3000 && typeof text === "string" && text.length > 0) {
    return (
      <span className={cn("font-semibold not-prose", className)}>
        <span className="text-black dark:text-white">{text[0]}</span>
        <span style={{ color: "#FF0000" }}>{text.slice(1)}</span>
      </span>
    )
  }

  return (
    <RatingSpan color={color} className={className}>
      {text}
    </RatingSpan>
  )
}

/**
 * AtCoder 레이팅/난이도 색상.
 *
 * @example
 * <AtRating rating={800} />
 * <AtRating rating={1200}>水色</AtRating>
 */
export function AtRating({ rating, children, className }: RatingProps) {
  const text = children ?? String(rating)
  const color = resolveColor(AT_COLORS, rating)

  // 금(≥3600)·적(≥2800): 첫 글자 검정(다크모드에선 흰), 나머지 해당 색
  if (rating >= 2800 && typeof text === "string" && text.length > 0) {
    return (
      <span className={cn("font-semibold not-prose", className)}>
        <span className="text-black dark:text-white">{text[0]}</span>
        <span style={{ color }}>{text.slice(1)}</span>
      </span>
    )
  }

  return (
    <RatingSpan color={color} className={className}>
      {text}
    </RatingSpan>
  )
}
