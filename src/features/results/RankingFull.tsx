"use client";

import { getProgramById } from "@/lib/programs";
import type { ModalityResult, ScoringResult } from "@/lib/scoring/types";
import { ProgramCard } from "./ProgramCard";

export interface RankingFullProps {
  results: ScoringResult[];
  modalityRecommendation?: ModalityResult["recommendation"];
}

export function RankingFull({
  results,
  modalityRecommendation,
}: RankingFullProps) {
  return (
    <div
      data-theme="dark"
      className="rounded-3xl border border-[var(--color-border)]/70 bg-[var(--color-surface)]/90 p-8 space-y-4"
    >
      <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        Ranking completo
      </h3>
      {modalityRecommendation && (
        <span className="inline-block rounded-full border border-[var(--color-neon-secondary)]/40 bg-[var(--color-neon-secondary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-neon-secondary)]">
          Modalidad recomendada: {modalityRecommendation}
        </span>
      )}
      {results.map((result, index) => {
        const program = getProgramById(result.programId);
        if (!program) return null;
        return (
          <ProgramCard
            key={result.programId}
            program={program}
            result={result}
            rank={index + 1}
            modalityRecommendation={modalityRecommendation}
          />
        );
      })}
    </div>
  );
}