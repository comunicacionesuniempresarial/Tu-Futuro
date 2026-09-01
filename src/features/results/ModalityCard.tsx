"use client";

import type { ModalityResult } from "@/lib/scoring/types";

export interface ModalityCardProps {
  modality: ModalityResult;
}

const CONFIDENCE_LABELS: Record<ModalityResult["confidence"], string> = {
  high: "Confianza alta",
  medium: "Confianza media",
  low: "Confianza baja",
};

export function ModalityCard({ modality }: ModalityCardProps) {
  const isPresencial = modality.recommendation === "presencial";
  const recommendation = isPresencial ? "Presencial" : "Virtual";

  return (
    <div
      data-theme="dark"
      className="card-foil relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-6 md:p-8 space-y-4 shadow-[0_0_30px_color-mix(in_srgb,var(--color-neon-primary)_10%,transparent)] transition-all duration-300 hover:border-[var(--color-neon-primary)]/40"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-2">
          <span className="material-symbols-outlined text-[var(--color-neon-primary)] text-lg">
            {isPresencial ? "domain" : "laptop_chromebook"}
          </span>
          Modalidad recomendada
        </h3>
        <span
          data-accent="neon"
          className="inline-flex items-center rounded-full border border-[var(--color-neon-primary)]/40 bg-[var(--color-neon-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-neon-primary)] shadow-sm"
        >
          {CONFIDENCE_LABELS[modality.confidence]}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="rounded-2xl border border-[var(--color-neon-primary)]/30 bg-[var(--color-surface-elevated)] px-5 py-2.5 font-display text-2xl md:text-3xl font-extrabold text-[var(--color-neon-primary)] drop-shadow-[0_0_16px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)]"
        >
          {recommendation}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {modality.explanation}
      </p>
    </div>
  );
}