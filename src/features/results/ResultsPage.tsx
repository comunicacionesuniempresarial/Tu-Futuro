"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTestStore } from "@/stores/test-store";
import { getProgramById } from "@/lib/programs";
import { cosineSimilarity } from "@/lib/scoring/riasec";
import { ARCHETYPES } from "@/lib/scoring/archetypes";
import { getProgramProfile } from "@/lib/scoring/programs-matrix";
import {
  RADAR_AXIS_ORDER,
  RADAR_DIMENSION_LABELS,
} from "@/lib/share-card/radar-svg";
import type {
  Archetype,
  ModalityResult,
  RIASECProfile,
  ScoringResult,
} from "@/lib/scoring/types";
import BrandHeader from "@/features/landing/BrandHeader";
import { ConfettiTrigger } from "./ConfettiTrigger";
import { ArchetypeCard } from "./ArchetypeCard";
import { RadarChart } from "./RadarChart";
import { ModalityCard } from "./ModalityCard";
import { ProgramCard } from "./ProgramCard";
import { GapAnalysis } from "./GapAnalysis";
import { RankingFull } from "./RankingFull";
import { ShareCard, type ShareCardLayout } from "./ShareCard";
import type { ShareCardData } from "@/lib/share-card/generate";

export interface ResultsData {
  riasecProfile: RIASECProfile;
  modalityResult: ModalityResult;
  archetype: Archetype;
  aptitudeVec: number[];
  valuesVec: number[];
  rankedResults: ScoringResult[];
  answers: Record<string, number>;
}

const LAYOUT_OPTIONS: { layout: ShareCardLayout; label: string }[] = [
  { layout: "default", label: "Horizontal" },
  { layout: "stories", label: "Historias" },
  { layout: "feed", label: "Feed" },
];

/**
 * Renders the full results experience for a hydrated ResultsData payload:
 * dark/neon cards, custom SVG radar with program overlay, confetti reveal,
 * share card with layout control, ranking and gap analysis.
 */
export function ResultsPage({ data }: { data: ResultsData }) {
  const { resetTest } = useTestStore();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null
  );
  const [layout, setLayout] = useState<ShareCardLayout>("default");

  const recommendation = data.modalityResult.recommendation;
  const confidence = data.modalityResult.confidence;

  const filteredResults = useMemo(() => {
    const dedupedLowResults = (() => {
      const byBase = new Map<string, ScoringResult>();
      for (const result of data.rankedResults) {
        const baseId = result.programId.replace(/-virtual$/, "");
        const existing = byBase.get(baseId);
        if (!existing || result.overallScore > existing.overallScore) {
          byBase.set(baseId, result);
        }
      }
      return [...byBase.values()];
    })();

    return confidence === "low"
      ? dedupedLowResults
      : data.rankedResults.filter((result) => {
          const program = getProgramById(result.programId);
          return program?.modality === recommendation;
        });
  }, [data, recommendation, confidence]);

  const top3 = filteredResults.slice(0, 3);
  const top3Programs = top3.map((result) => ({
    ...result,
    program: getProgramById(result.programId)!,
  }));

  const affinity = Math.round(
    cosineSimilarity(
      Object.values(data.riasecProfile),
      Object.values(data.archetype.riasecProfile)
    ) * 100
  );

  const relatedArchetypes = ARCHETYPES.filter(
    (candidate) => candidate.id !== data.archetype.id
  )
    .map((candidate) => ({
      archetype: candidate,
      similarity: cosineSimilarity(
        Object.values(data.riasecProfile),
        Object.values(candidate.riasecProfile)
      ),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 2);

  const topDimensions = [...RADAR_AXIS_ORDER]
    .map((dimension) => ({
      dim: dimension,
      label: RADAR_DIMENSION_LABELS[dimension],
      value: data.riasecProfile[dimension],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const modalityLabel =
    recommendation === "presencial" ? "Presencial" : "Virtual";

  const selectedProfile = selectedProgramId
    ? getProgramProfile(selectedProgramId)?.riasec
    : undefined;

  const shareData: ShareCardData = useMemo(
    () => ({
      archetype: {
        id: data.archetype.id,
        name: data.archetype.name,
        emoji: data.archetype.emoji,
        color: "#D51933",
      },
      riasecProfile: data.riasecProfile,
      topPrograms: top3Programs.map(({ program }) => ({
        id: program.id,
        name: program.name,
      })),
    }),
    [data, top3Programs]
  );

  return (
    <div data-theme="dark" className="min-h-screen bg-[#050505] text-white">
      <ConfettiTrigger />
      <BrandHeader />

      <main className="relative z-10 mx-auto max-w-4xl space-y-12 px-4 pt-10 pb-16">
        {/* Hero result */}
        <div className="relative space-y-5 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl">
            <span className="bg-gradient-to-r from-[#D51933] to-[#0033A5] bg-clip-text text-transparent">
              Tu resultado
            </span>
          </h1>
          <p className="text-lg text-neutral-400">
            Descubriste tu arquetipo:{" "}
            <span className="font-bold text-white">{data.archetype.name}</span>
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-neutral-500">Modalidad recomendada:</span>
            <span
              data-accent="neon"
              className="rounded-full border border-[#D51933]/40 bg-[#D51933]/10 px-3 py-1 text-sm font-bold text-[#D51933]"
            >
              {modalityLabel}
            </span>
          </div>
        </div>

        <ArchetypeCard
          archetype={data.archetype}
          affinity={affinity}
          relatedArchetypes={relatedArchetypes}
          topDimensions={topDimensions}
        />

        <div className="space-y-3">
          <h3 className="flex items-center gap-3 text-2xl font-black text-white">
            Tu perfil RIASEC
          </h3>
          <RadarChart
            profile={data.riasecProfile}
            programProfile={selectedProfile}
          />
        </div>

        <ModalityCard modality={data.modalityResult} />

        <div className="space-y-5">
          <h3 className="text-2xl font-black text-white">Tus 3 carreras ideales</h3>
          <p className="text-sm leading-relaxed text-neutral-400">
            Ordenamos los programas por afinidad con tu personalidad, tus
            aptitudes y tu estilo de vida. El primero es tu mejor coincidencia.
            Tocá una carrera para ver su requisito sobre tu radar.
          </p>
          <div className="space-y-3">
            {top3Programs.map((result, index) => (
              <ProgramCard
                key={result.programId}
                program={result.program}
                result={result}
                rank={index + 1}
                isExpanded
                modalityRecommendation={
                  confidence === "low" ? undefined : recommendation
                }
                onClick={(program) =>
                  setSelectedProgramId((current) =>
                    current === program.id ? null : program.id
                  )
                }
              />
            ))}
          </div>
        </div>

        <GapAnalysis
          riasecProfile={data.riasecProfile}
          topProgramIds={top3.map((result) => result.programId)}
        />

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-2xl font-black text-white">Compartí tu resultado</h3>
            <div className="flex gap-2" aria-label="Formato de la tarjeta">
              {LAYOUT_OPTIONS.map((option) => (
                <button
                  key={option.layout}
                  type="button"
                  onClick={() => setLayout(option.layout)}
                  aria-pressed={layout === option.layout}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-bold text-neutral-300 transition-colors hover:border-[#D51933]/40 hover:text-white"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <ShareCard data={shareData} layout={layout} />
        </div>

        <RankingFull
          results={filteredResults}
          modalityRecommendation={
            confidence === "low" ? undefined : recommendation
          }
        />

        <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
          <Link
            href="/test"
            onClick={resetTest}
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#D51933] to-[#0033A5] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#D51933]/25 transition-all duration-300 hover:scale-105"
          >
            Repetir el test
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-2xl border border-white/15 px-8 py-4 text-lg font-bold text-neutral-300 transition-all duration-300 hover:border-[#0033A5] hover:text-white"
          >
            Volver al inicio
          </Link>
        </div>

        <div className="pt-4 pb-8 text-center text-xs text-neutral-500">
          <p>
            Los resultados son una guía basada en auto-percepción y no
            constituyen un diagnóstico psicológico certificado.
          </p>
        </div>
      </main>
    </div>
  );
}