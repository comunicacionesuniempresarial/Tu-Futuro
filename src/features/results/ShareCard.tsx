"use client";

import { useState } from "react";
import { useShareCard } from "@/features/shared/hooks/useShareCard";
import type { ShareCardData } from "@/lib/share-card/generate";

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
    <div data-share-card="true" data-layout={layout} className="share-card-shell">
      <div
        className="share-card-preview share-card-stage group relative mx-auto flex items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0c14] p-5 shadow-[0_20px_70px_rgba(0,0,0,.45)] sm:p-8"
        style={{ aspectRatio: `${size.width} / ${size.height}` }}
      >
        <div aria-hidden="true" className="share-card-ambient absolute inset-0" />
        <div className="share-card-art relative z-10 flex h-full w-full items-center justify-center">
          <img
            src={`/archetypes/${data.archetype.id}.webp`}
            alt={`Carta de arquetipo ${data.archetype.name}`}
            loading="eager"
            className="share-card-artwork h-full w-auto max-w-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,.7)]"
          />
        </div>
        <div aria-hidden="true" className="share-card-shine pointer-events-none absolute inset-0 z-20" />
      </div>
      <button
        type="button"
        onClick={handleShare}
        disabled={status === "sharing"}
        className="share-card-button card-glow mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] px-6 py-3.5 font-bold text-[var(--color-deep)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
      >
        {status === "sharing" ? "Preparando tu carta…" : "Compartir en Instagram"}
      </button>
      <p className="mt-3 text-center text-xs text-[var(--color-text-secondary)]">
        En celular se abrirá el menú para elegir Instagram. En computador se descargará la imagen.
      </p>
      {status === "done" && <p role="status" className="mt-2 text-center text-xs text-[var(--color-neon-secondary)]">¡Carta lista para compartir!</p>}
      {status === "error" && <p role="alert" className="mt-2 text-center text-xs text-[var(--color-error)]">No pudimos preparar la carta. Intenta de nuevo.</p>}
    </div>
  );
}
