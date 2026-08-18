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
  const recommendation =
    modality.recommendation === "presencial" ? "Presencial" : "Virtual";

  return (
    <div
      data-theme="dark"
      className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 space-y-4"
    >
      <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
        Modalidad recomendada
      </h3>
      <div className="flex items-center gap-3">
        <span
          data-accent="neon"
          className="rounded-xl bg-[#D51933]/10 px-4 py-2 text-2xl font-extrabold text-[#D51933]"
        >
          {recommendation}
        </span>
        <span
          data-accent="neon"
          className="rounded-full border border-[#0033A5]/40 bg-[#0033A5]/10 px-3 py-1 text-xs font-bold text-[#7aa2ff]"
        >
          {CONFIDENCE_LABELS[modality.confidence]}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-neutral-400">
        {modality.explanation}
      </p>
    </div>
  );
}