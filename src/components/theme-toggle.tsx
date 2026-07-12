"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="flex items-center gap-0.5" aria-hidden>
        <div
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "pointer-events-none opacity-50",
          )}
        >
          자동
        </div>
        <div
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "pointer-events-none opacity-50",
          )}
        />
      </div>
    );
  }

  const isSystemTheme = theme === "system";

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        aria-label="자동"
        aria-pressed={isSystemTheme}
        className={cn(isSystemTheme && "bg-muted text-foreground")}
        onClick={() => setTheme("system")}
      >
        자동
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="테마 전환"
        aria-pressed={!isSystemTheme}
        onClick={() =>
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
}
