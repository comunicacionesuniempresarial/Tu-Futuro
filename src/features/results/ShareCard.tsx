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
      onSuccess: () => setStatus("done"),
      onError: () => setStatus("error"),
    });
  };

  return (
    <div data-share-card="true" data-layout={layout}>
      <div
        className="share-card-preview"
        style={{ aspectRatio: `${size.width} / ${size.height}` }}
      >
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <button
        type="button"
        onClick={handleShare}
        disabled={status === "sharing"}
        className="share-card-button"
      >
        {status === "sharing" ? "Generando…" : "Compartir mi resultado"}
      </button>
      {status === "error" && (
        <p role="alert" className="share-card-error">
          No se pudo compartir tu resultado. Probá de nuevo.
        </p>
      )}
    </div>
  );
}