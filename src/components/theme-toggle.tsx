"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const mounted = useIsMounted()
  const [iconDark, setIconDark] = useState(false)
  const isFirstSync = useRef(true)

  useEffect(() => {
    if (!mounted || resolvedTheme == null) return

    const next = resolvedTheme === "dark"

    // Initial sync: match the resolved theme without animating from a default.
    if (isFirstSync.current) {
      isFirstSync.current = false
      setIconDark(next)
      return
    }

    // defer past next-themes' disableTransitionOnChange window so the page
    // color swap stays instant while the icons still crossfade (MOTION.md).
    const id = window.setTimeout(() => setIconDark(next), 20)
    return () => window.clearTimeout(id)
  }, [mounted, resolvedTheme])

  if (!mounted) {
    return (
      <div className="flex items-center gap-0.5" aria-hidden>
        <div className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "pointer-events-none opacity-50")}>
          자동
        </div>
        <div className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "pointer-events-none opacity-50")} />
      </div>
    )
  }

  const isSystemTheme = theme === "system"

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        aria-label="자동"
        aria-pressed={isSystemTheme}
        className={cn(isSystemTheme && "bg-muted text-foreground")}
        onClick={() => setTheme(isSystemTheme ? (resolvedTheme ?? "light") : "system")}
      >
        자동
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="테마 전환"
        aria-pressed={!isSystemTheme}
        className="relative"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <Sun
          aria-hidden
          className={cn(
            "h-4 w-4 transition-transform duration-150 ease-in-out",
            iconDark ? "scale-0 -rotate-90" : "scale-100 rotate-0",
          )}
        />
        <Moon
          aria-hidden
          className={cn(
            "absolute h-4 w-4 transition-transform duration-150 ease-in-out",
            iconDark ? "scale-100 rotate-0" : "scale-0 rotate-90",
          )}
        />
      </Button>
    </div>
  )
}
