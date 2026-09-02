"use client";

import { useState } from "react";
import { useDownloadShareCard, useShareCard } from "@/features/shared/hooks/useShareCard";
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
  const download = useDownloadShareCard();
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
  const handleDownload = () => {
    setStatus("sharing");
    void download({ data, size, onSuccess: () => setStatus("done"), onError: () => setStatus("error") });
  };

  return (
    <div data-share-card="true" data-layout={layout} className="share-card-shell">
      <div
        className="share-card-preview share-card-stage group relative mx-auto flex items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0c14] p-5 shadow-[0_20px_70px_rgba(0,0,0,.45)] sm:p-8"
        style={{ aspectRatio: `${size.width} / ${size.height}` }}
      >
        <div aria-hidden="true" className="share-card-ambient absolute inset-0" />
        <div aria-hidden="true" className="absolute top-0 z-20 h-14 w-56 rounded-full bg-white/80 blur-xl sm:top-1 sm:h-20 sm:w-80" />
        <img src="/brand/uniempresarial-logo.png" alt="Uniempresarial" className="absolute top-1 z-20 h-auto w-44 drop-shadow-[0_0_5px_rgba(255,255,255,.95)] drop-shadow-[0_0_18px_rgba(255,225,109,.8)] sm:top-2 sm:w-64" />
        <div className="share-card-art relative z-10 flex h-full w-full items-center justify-center">
          <img
            src={`/archetypes/${data.archetype.id}.webp`}
            alt={`Carta de arquetipo ${data.archetype.name}`}
            loading="lazy"
            className="share-card-artwork h-full w-auto max-w-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,.7)]"
          />
        </div>
        <div aria-hidden="true" className="share-card-shine pointer-events-none absolute inset-0 z-20" />
      </div>
      <div className="mt-4 flex justify-center gap-3">
      <button
        type="button"
        onClick={handleShare}
        disabled={status === "sharing"}
        className="share-card-button card-glow inline-flex min-w-36 items-center justify-center gap-2 rounded-xl border border-[var(--color-neon-primary)]/70 bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] px-6 py-3 text-sm font-extrabold text-[var(--color-deep)] transition-[transform,box-shadow] duration-200 hover:scale-[1.03] disabled:cursor-wait disabled:opacity-60"
      >
        {status === "sharing" ? "Preparando…" : "Compartir"}
      </button>
      <button type="button" onClick={handleDownload} disabled={status === "sharing"} aria-label="Descargar carta como JPG" className="inline-flex min-w-36 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-bold text-[var(--color-text-primary)] transition hover:border-[var(--color-neon-primary)] hover:text-[var(--color-neon-primary)] disabled:opacity-60">Descargar</button>
      </div>
      <p className="mt-3 text-center text-xs text-[var(--color-text-secondary)]">
        En celular se abrirá el menú para elegir Instagram. En computador se descargará la imagen.
      </p>
      {status === "done" && <p role="status" className="mt-2 text-center text-xs text-[var(--color-neon-secondary)]">¡Carta lista para compartir!</p>}
      {status === "error" && <p role="alert" className="mt-2 text-center text-xs text-[var(--color-error)]">No pudimos preparar la carta. Intenta de nuevo.</p>}
    </div>
  );
}
