import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export function escapeHtmlAttribute(value: string): string {
  return escapeHtml(value).replaceAll("\n", "").replaceAll("\r", "")
}

export function escapeHtmlWithLineBreaks(value: string): string {
  return escapeHtml(value).replaceAll("\r\n", "\n").replaceAll("\n", "<br>")
}
