"use client";

import type { Program } from "@/lib/programs";
import { getProgramUrl } from "@/lib/programs";
import type { ModalityResult, ScoringResult } from "@/lib/scoring/types";

export interface ProgramCardProps {
  program: Program;
  result: ScoringResult;
  rank: number;
  isExpanded?: boolean;
  modalityRecommendation?: ModalityResult["recommendation"];
  /** When provided the card becomes selectable (radar overlay target). */
  onClick?: (program: Program) => void;
}

export function ProgramCard({
  program,
  result,
  rank,
  isExpanded = false,
  modalityRecommendation,
  onClick,
}: ProgramCardProps) {
  const inner = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-neon-primary)]/40 bg-[var(--color-neon-primary)]/15 text-sm font-extrabold text-[var(--color-neon-primary)]">
        {rank}
      </span>
      <span className="flex-1 font-bold text-[var(--color-text-primary)]">{program.name}</span>
      <span
        data-accent="neon"
        className="rounded-lg bg-[var(--color-neon-primary)]/10 border border-[var(--color-neon-primary)]/30 px-3 py-1 text-lg font-extrabold text-[var(--color-neon-primary)]"
      >
        {Math.round(result.overallScore)}%
      </span>
    </>
  );

  const innerExpanded = (
    <>
      {program.image && (
        <div className="relative -mx-5 -mt-5 mb-0 h-32 sm:h-40 overflow-hidden rounded-t-2xl">
          <a href={getProgramUrl(program.id)} target="_blank" rel="noreferrer" aria-label={`Conoce ${program.name}`}>
            <img
              src={program.image}
              alt={program.name}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </a>
        </div>
      )}
      <div className="flex items-center gap-3">{inner}</div>
      {modalityRecommendation && (
        <span className="inline-block rounded-full border border-[var(--color-neon-secondary)]/40 bg-[var(--color-neon-secondary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-neon-secondary)]">
          Recomendado: {modalityRecommendation}
        </span>
      )}
      {isExpanded && (
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
          result.overallScore >= 85
            ? "border border-[var(--color-neon-primary)]/40 bg-[var(--color-neon-primary)]/10 text-[var(--color-neon-primary)]"
            : "border border-[var(--color-neon-secondary)]/40 bg-[var(--color-neon-secondary)]/10 text-[var(--color-neon-secondary)]"
        }`}>
          {result.overallScore >= 85 ? "Legendaria" : result.overallScore >= 70 ? "Épica" : "Rara"}
        </span>
      )}
    </>
  );

  const baseClassName =
    "w-full text-left rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface)]/70 p-5 space-y-3 backdrop-blur-sm";

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        data-theme="dark"
        onClick={() => onClick(program)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick(program);
          }
        }}
        aria-label={`${program.name} — ranking ${rank}, ${Math.round(result.overallScore)}% de afinidad`}
        className={`${baseClassName} cursor-pointer transition-colors hover:border-[var(--color-neon-primary)]/50`}
      >
        {innerExpanded}
      </div>
    );
  }

  return (
    <div data-theme="dark" className={baseClassName}>
      {innerExpanded}
    </div>
  );
}
