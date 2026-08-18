"use client";

import type { Program } from "@/lib/programs";
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
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0033A5]/20 text-sm font-extrabold text-[#7aa2ff]">
        {rank}
      </span>
      <span className="flex-1 font-bold text-white">{program.name}</span>
      <span
        data-accent="neon"
        className="rounded-lg bg-[#D51933]/10 px-3 py-1 text-lg font-extrabold text-[#D51933]"
      >
        {Math.round(result.overallScore)}%
      </span>
    </>
  );

  const innerExpanded = (
    <>
      <div className="flex items-center gap-3">{inner}</div>
      {modalityRecommendation && (
        <span className="inline-block rounded-full border border-[#0033A5]/40 bg-[#0033A5]/10 px-3 py-1 text-xs font-bold text-[#7aa2ff]">
          Recomendado: {modalityRecommendation}
        </span>
      )}
      {isExpanded && (
        <div className="space-y-2 border-t border-white/5 pt-3 text-sm">
          <div className="flex justify-between text-neutral-300">
            <span>Personalidad</span>
            <span className="font-bold text-white">
              {Math.round(result.fitBreakdown.personality)}
            </span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Aptitud técnica</span>
            <span className="font-bold text-white">
              {Math.round(result.fitBreakdown.technical)}
            </span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Estilo de vida</span>
            <span className="font-bold text-white">
              {Math.round(result.fitBreakdown.lifestyle)}
            </span>
          </div>
        </div>
      )}
    </>
  );

  const baseClassName =
    "w-full text-left rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 space-y-3";

  if (onClick) {
    return (
      <button
        type="button"
        data-theme="dark"
        onClick={() => onClick(program)}
        className={`${baseClassName} cursor-pointer transition-colors hover:border-[#D51933]/40`}
      >
        {innerExpanded}
      </button>
    );
  }

  return (
    <div data-theme="dark" className={baseClassName}>
      {innerExpanded}
    </div>
  );
}