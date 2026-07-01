"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type PostStatsProps = {
  slug: string;
};

type StatsResponse = {
  viewCount: number;
  likeCount: number;
  liked: boolean;
};

export function PostStats({ slug }: PostStatsProps) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const viewResponse = await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });

        const viewData = await viewResponse.json();
        const likeResponse = await fetch(`/api/likes?slug=${encodeURIComponent(slug)}`);
        const likeData = await likeResponse.json();

        if (!cancelled) {
          setStats({
            viewCount: viewData.viewCount ?? 0,
            likeCount: likeData.likeCount ?? 0,
            liked: likeData.liked ?? false,
          });
        }
      } catch {
        if (!cancelled) {
          setStats({ viewCount: 0, likeCount: 0, liked: false });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleLike() {
    if (!stats || stats.liked || liking) return;

    setLiking(true);
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await response.json();

      if (response.ok) {
        setStats({
          viewCount: stats.viewCount,
          likeCount: data.likeCount ?? stats.likeCount,
          liked: data.liked ?? stats.liked,
        });
      }
    } finally {
      setLiking(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>조회 {stats.viewCount.toLocaleString()}</span>
      <Button
        variant={stats.liked ? "secondary" : "outline"}
        size="sm"
        onClick={handleLike}
        disabled={stats.liked || liking}
        className="gap-2"
      >
        <Heart className={`h-4 w-4 ${stats.liked ? "fill-current" : ""}`} />
        좋아요 {stats.likeCount.toLocaleString()}
      </Button>
    </div>
  );
}
