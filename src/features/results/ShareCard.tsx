"use client";

import { useEffect, useState } from "react";
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
  const [selectedLayout, setSelectedLayout] = useState<ShareCardLayout>(layout);
  useEffect(() => setSelectedLayout(layout), [layout]);
  const size = SHARE_CARD_LAYOUT_SIZES[selectedLayout];
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
    <div data-share-card="true" data-layout={selectedLayout} className="share-card-shell">
      <div
        className="share-card-preview share-card-stage group relative mx-auto flex flex-col items-center justify-start overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0c14] p-5 shadow-[0_20px_70px_rgba(0,0,0,.45)] sm:p-8"
        style={{ aspectRatio: `${size.width} / ${size.height}` }}
      >
        <div aria-hidden="true" className="share-card-ambient absolute inset-0" />
        <div className="share-card-brand relative z-20 flex h-[16%] w-full shrink-0 items-center justify-center rounded-xl bg-white px-2 py-2 shadow-[0_8px_24px_rgba(255,255,255,.16)]">
          <img src="/brand/uniempresarial-logo.png" alt="Uniempresarial" className="relative h-auto w-[86%] max-w-[34rem]" />
        </div>
        <div className="share-card-art relative z-10 flex min-h-0 flex-1 w-full items-center justify-center pt-3">
          <img
            src={`/archetypes/${data.archetype.id}.webp`}
            alt={`Carta de arquetipo ${data.archetype.name}`}
            loading="lazy"
            className="share-card-artwork h-full w-auto max-w-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,.7)]"
          />
        </div>
        <div aria-hidden="true" className="share-card-shine pointer-events-none absolute inset-0 z-20" />
      </div>
      <div className="mt-4 flex justify-center gap-2" role="group" aria-label="Formato de Instagram">
        {(["stories", "feed"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelectedLayout(option)}
            aria-pressed={selectedLayout === option}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${selectedLayout === option ? "border-[var(--color-neon-primary)] bg-[var(--color-neon-primary)]/15 text-[var(--color-neon-primary)]" : "border-white/15 text-[var(--color-text-secondary)] hover:border-[var(--color-neon-primary)]/60"}`}
          >
            {option === "stories" ? "Historia · 9:16" : "Publicación · 4:5"}
          </button>
        ))}
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
