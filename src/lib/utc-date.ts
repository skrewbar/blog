const UTC_DATE_RE =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2})(?::(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?)?$/

/** Parse a date string as UTC when no timezone is given (including date-only). */
export function parseUtcDate(value: string): Date {
  const trimmed = value.trim()

  if (/([zZ]|[+-]\d{2}:?\d{2})$/.test(trimmed)) {
    return new Date(trimmed)
  }

  const match = trimmed.match(UTC_DATE_RE)
  if (!match) {
    return new Date(NaN)
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4] ?? 0)
  const minute = Number(match[5] ?? 0)
  const second = Number(match[6] ?? 0)
  const millisecond = match[7] ? Number(match[7].padEnd(3, "0").slice(0, 3)) : 0

  return new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond))
}

/** Format an ISO date string as yyyy.MM.dd in UTC. */
export function formatUtcDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const year = parts.find((part) => part.type === "year")?.value
  const month = parts.find((part) => part.type === "month")?.value
  const day = parts.find((part) => part.type === "day")?.value

  return `${year}.${month}.${day}`
}
