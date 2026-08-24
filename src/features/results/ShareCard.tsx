"use client";

import { useMemo, useState } from "react";
import { useShareCard } from "@/features/shared/hooks/useShareCard";
import {
  generateShareCardSVG,
  type ShareCardData,
} from "@/lib/share-card/generate";

export type ShareCardLayout = "default" | "stories" | "feed";

export const SHARE_CARD_LAYOUT_SIZES: Record<
  ShareCardLayout,
  { width: number; height: number }
> = {
  default: { width: 1200, height: 630 },
  stories: { width: 1080, height: 1920 },
  feed: { width: 1080, height: 1350 },
};

export interface ShareCardProps {
  data: ShareCardData;
  layout?: ShareCardLayout;
}

type ShareStatus = "idle" | "sharing" | "done" | "error";

export function ShareCard({ data, layout = "default" }: ShareCardProps) {
  const share = useShareCard();
  const size = SHARE_CARD_LAYOUT_SIZES[layout];
  const [status, setStatus] = useState<ShareStatus>("idle");

  const svg = useMemo(() => generateShareCardSVG(data, size), [data, size]);

  const handleShare = () => {
    setStatus("sharing");
    void share({
      data,
      size,
      onSuccess: () => setStatus("done"),
      onError: () => setStatus("error"),
    });
  };

  return (
    <div data-share-card="true" data-layout={layout}>
      <p className="sr-only">{data.archetype.emoji} {data.archetype.name}</p>
      <div
        className="share-card-preview relative overflow-hidden rounded-2xl border border-[var(--color-neon-primary)]/30 bg-[var(--color-deep)] p-2 shadow-[0_0_32px_color-mix(in_srgb,var(--color-neon-primary)_12%,transparent)]"
        style={{ aspectRatio: `${size.width} / ${size.height}` }}
      >
        <div className="overflow-hidden rounded-xl" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <button
        type="button"
        onClick={handleShare}
        disabled={status === "sharing"}
        className="share-card-button card-glow mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] px-6 py-3.5 font-bold text-[var(--color-deep)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sharing" ? "Preparando tu historia…" : "Compartir en Instagram Stories"}
      </button>
      {status === "error" && (
        <p role="alert" className="share-card-error mt-3 text-sm text-[var(--color-error)]">
          No se pudo compartir tu resultado. Probá de nuevo.
        </p>
      )}
    </div>
  );
}
