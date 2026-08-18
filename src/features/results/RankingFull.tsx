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
      className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 space-y-4"
    >
      <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
        Ranking completo
      </h3>
      {modalityRecommendation && (
        <span className="inline-block rounded-full border border-[#0033A5]/40 bg-[#0033A5]/10 px-3 py-1 text-xs font-bold text-[#7aa2ff]">
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