"use client";

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

export function ShareCard({ data, layout = "default" }: ShareCardProps) {
  const size = SHARE_CARD_LAYOUT_SIZES[layout];

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
            className="share-card-artwork h-full w-auto max-w-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,.7)]"
          />
        </div>
        <div aria-hidden="true" className="share-card-shine pointer-events-none absolute inset-0 z-20" />
      </div>
      <p className="mt-4 text-center text-xs text-[var(--color-text-secondary)]">Tu carta está lista para guardar o compartir.</p>
    </div>
  );
}
