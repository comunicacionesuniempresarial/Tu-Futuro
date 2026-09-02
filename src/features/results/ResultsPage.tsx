"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTestStore } from "@/stores/test-store";
import { getProgramById } from "@/lib/programs";
import { cosineSimilarity } from "@/lib/scoring/riasec";
import { ARCHETYPES } from "@/lib/scoring/archetypes";
import { getProgramProfile } from "@/lib/scoring/programs-matrix";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";
import {
  RADAR_AXIS_ORDER,
  RADAR_DIMENSION_LABELS,
} from "@/lib/share-card/radar-svg";
import type {
  Archetype,
  RIASECProfile,
  ScoringResult,
} from "@/lib/scoring/types";
import BrandHeader from "@/features/landing/BrandHeader";
import { Footer } from "@/components/shared/Footer";
import { ConfettiTrigger } from "./ConfettiTrigger";
import { ArchetypeCard } from "./ArchetypeCard";
import { RadarChart } from "./RadarChart";
import { ProgramCard } from "./ProgramCard";
import { ShareCard } from "./ShareCard";
import type { ShareCardData } from "@/lib/share-card/generate";

export interface ResultsData {
  riasecProfile: RIASECProfile;
  archetype: Archetype;
  aptitudeVec: number[];
  valuesVec: number[];
  rankedResults: ScoringResult[];
  answers: Record<string, number>;
}

const DIMENSION_NAMES: Record<keyof RIASECProfile, string> = {
  R: "lo práctico", I: "la curiosidad", A: "la creatividad",
  S: "la colaboración", E: "la iniciativa", C: "la organización",
};
const APTITUDE_NAMES = ["el análisis", "la planificación", "la creatividad", "la comunicación"];
const VALUE_NAMES = ["la autonomía", "el gusto por los retos", "la flexibilidad", "el trabajo con personas"];

function buildMatchReason(
  profile: RIASECProfile,
  result: ScoringResult,
  programId: string
) {
  const program = getProgramProfile(programId);
  if (!program) return "Tus respuestas muestran una afinidad general con este programa y con la forma de aprender que propone.";
  const shared = (Object.keys(profile) as (keyof RIASECProfile)[])
    .map((dim) => ({ dim, value: profile[dim] * program.riasec[dim] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map(({ dim }) => DIMENSION_NAMES[dim]);
  const programDimensions = (Object.keys(program.riasec) as (keyof RIASECProfile)[])
    .sort((a, b) => program.riasec[b] - program.riasec[a])
    .slice(0, 2)
    .map((dim) => DIMENSION_NAMES[dim]);
  const aptitude = program.aptitude
    .map((value, index) => ({ value, name: APTITUDE_NAMES[index] }))
    .sort((a, b) => b.value - a.value)[0];
  const lifestyle = program.values
    .map((value, index) => ({ value, name: VALUE_NAMES[index] }))
    .sort((a, b) => b.value - a.value)[0];
  const strongestLayer = Object.entries(result.fitBreakdown)
    .sort(([, a], [, b]) => b - a)[0]?.[0];
  const layerText = strongestLayer === "technical"
    ? "tus aptitudes para resolver y desarrollar ideas"
    : strongestLayer === "lifestyle"
      ? "el estilo de vida que buscas"
      : "tu manera natural de pensar";
  const sharedText = shared.length === 2
    ? `${shared[0]} y ${shared[1]}`
    : shared[0];
  return `Tus respuestas muestran ${sharedText}; ${program.name} busca precisamente ${programDimensions.join(" y ")}. Además, aquí podrías aprovechar ${aptitude.name} y encontrar un entorno que valora ${lifestyle.name}. En tu caso, la coincidencia se nota en ${layerText}: no elegiste una etiqueta, elegiste comportamientos que esta carrera utiliza todos los días.`;
}

/**
 * Renders the full results experience for a hydrated ResultsData payload:
 * dark/neon cards, custom SVG radar with program overlay, confetti reveal,
 * share card with layout control and compact statistics.
 */
export function ResultsPage({ data }: { data: ResultsData }) {
  const { resetTest } = useTestStore();
  const prefersReduced = useReducedMotion();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null
  );
  const [focusedProgramIndex, setFocusedProgramIndex] = useState(0);

  // Show all programs deduped (no modality filter)
  const filteredResults = useMemo(() => {
    const byBase = new Map<string, ScoringResult>();
    for (const result of data.rankedResults) {
      const baseId = result.programId.replace(/-virtual$/, "");
      const existing = byBase.get(baseId);
      if (!existing || result.overallScore > existing.overallScore) {
        byBase.set(baseId, result);
      }
    }
    return [...byBase.values()];
  }, [data]);

  const top3 = filteredResults.slice(0, 3);
  const top3Programs = top3
    .map((result) => {
      const program = getProgramById(result.programId);
      return program ? { ...result, program } : null;
    })
    .filter(Boolean) as Array<ScoringResult & { program: NonNullable<ReturnType<typeof getProgramById>> }>;

  const affinity = Math.round(
    cosineSimilarity(
      Object.values(data.riasecProfile),
      Object.values(data.archetype.riasecProfile)
    ) * 100
  );

  const mainArchetypeSimilarity = affinity / 100;
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
    // Related profiles must never contradict the main result.
    .filter(({ similarity }) => similarity < mainArchetypeSimilarity)
    .slice(0, 2);

  const topDimensions = [...RADAR_AXIS_ORDER]
    .map((dimension) => ({
      dim: dimension,
      label: RADAR_DIMENSION_LABELS[dimension],
      value: data.riasecProfile[dimension],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const selectedProfile = selectedProgramId
    ? getProgramProfile(selectedProgramId)?.riasec
    : undefined;

  const shareData: ShareCardData = useMemo(
    () => ({
      archetype: {
        id: data.archetype.id,
        name: data.archetype.name,
        emoji: data.archetype.emoji,
        color: "var(--color-gold-dim)",
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
    <div data-theme="dark" className="results-victory min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] relative overflow-hidden">
      {/* Ambient Canvas */}
      <div aria-hidden="true" className="ambient-bg" />
      <div aria-hidden="true" className="ambient-rays" />
      <div aria-hidden="true" className="ambient-stars"><span className="star" /><span className="star" /><span className="star" /><span className="star-spark" /><span className="star-spark" /></div>
      <div aria-hidden="true" className="results-orb-field">
        {Array.from({ length: 8 }, (_, index) => <span key={index} />)}
      </div>
      <div aria-hidden="true" className="results-energy-field"><span /><span /></div>
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[var(--color-neon-primary)]/5 blur-[140px]" style={{ willChange: "transform", contain: "layout style paint" }} />
        <div className="absolute top-1/3 -right-40 w-[540px] h-[540px] rounded-full bg-[var(--color-neon-secondary)]/8 blur-[150px]" style={{ willChange: "transform", contain: "layout style paint" }} />
        <div className="absolute bottom-10 left-1/3 w-[460px] h-[460px] rounded-full bg-[var(--color-primary-container)]/8 blur-[130px]" style={{ willChange: "transform", contain: "layout style paint" }} />
      </div>

      <ConfettiTrigger />
      <div className="victory-sparkles" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <BrandHeader />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-24 pb-16 space-y-10">

        {/* ── HERO: full-width title ── */}
        <div
          className={`relative space-y-4 text-center ${
            prefersReduced ? "" : "animate-fade-in"
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-neon-primary)]/40 bg-[var(--color-surface)]/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-neon-primary)]">
            ✦ El códice ha hablado
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight lg:text-6xl">
            <span className="text-[var(--color-neon-primary)] drop-shadow-[0_0_24px_color-mix(in_srgb,var(--color-neon-primary)_40%,transparent)]">
              Tu Destino Revelado
            </span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Tu arquetipo mítico:{" "}
            <span className="font-bold text-[var(--color-text-primary)]">{data.archetype.name}</span>
          </p>
        </div>

        {/* ── ARCHETYPE CARD: full-width, image as background ── */}
        <div
          className={prefersReduced ? "" : "animate-persona-pop"}
        >
          <ArchetypeCard
            archetype={data.archetype}
            affinity={affinity}
            relatedArchetypes={relatedArchetypes}
            topDimensions={topDimensions}
          />
        </div>

        {/* ── RADAR: Tu Sello de Poder — below the archetype ── */}
        <div
          className={`results-lazy-section glass-panel mx-auto max-w-3xl rounded-3xl border border-[var(--color-border)] p-4 md:p-6 ${
            prefersReduced ? "" : "animate-slide-up"
          }`}
        >
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-bold text-[var(--color-neon-primary)]">
              Tu Sello de Poder
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Descubre qué dimensión domina tu pensamiento
            </p>
          </div>
          <RadarChart
            profile={data.riasecProfile}
            programProfile={selectedProfile}
            className="mx-auto"
          />
        </div>

        {/* ── TU MANO INICIAL: top 3 programs ── */}
        <div
          className={`results-lazy-section space-y-6 ${prefersReduced ? "" : "animate-slide-up"}`}
        >
          <div className="text-center">
            <h2 className="font-display text-3xl font-black text-[var(--color-neon-primary)]">
              Tu Mano Inicial
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)] max-w-xl mx-auto">
              Ordenamos los programas por afinidad con tu personalidad, tus
              aptitudes y tu estilo de vida. La primera carta es tu mejor
              coincidencia. Toca una carrera para explorar qué tan bien encaja contigo.
            </p>
          </div>
          <div
            className="program-carousel relative mx-auto h-auto min-h-[680px] max-w-[960px] md:min-h-[650px]"
          >
            {top3Programs.map((result, index) => {
              const slot = (index - focusedProgramIndex + 3) % 3;
              const carouselStyle = prefersReduced
                ? undefined
                : {
                    zIndex: slot === 0 ? 30 : 10,
                    opacity: slot === 0 ? 1 : 0.72,
                    transform:
                      slot === 0
                        ? "translateX(-50%) translateY(0) scale(1.04)"
                        : slot === 1
                          ? "translateX(calc(-50% + 180px)) translateY(30px) rotate(3deg) scale(.94)"
                          : "translateX(calc(-50% - 180px)) translateY(30px) rotate(-3deg) scale(.94)",
                  };
              return (
                <div
                  key={result.programId}
                  className={`program-carousel-card ${slot === 0 ? "program-carousel-center" : slot === 1 ? "program-carousel-right" : "program-carousel-left"}`}
                  style={carouselStyle}
                  onMouseEnter={() => setFocusedProgramIndex(index)}
                  onFocus={() => setFocusedProgramIndex(index)}
                >
                  <ProgramCard
                    program={result.program}
                    result={result}
                    rank={index + 1}
                    isExpanded={slot === 0}
                    modalityRecommendation={undefined}
                    onClick={(program) => {
                      setFocusedProgramIndex(index);
                      setSelectedProgramId((current) => current === program.id ? null : program.id);
                    }}
                    matchReason={buildMatchReason(data.riasecProfile, result, result.program.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SHARE CARD ── */}
        <div
          className={`results-lazy-section space-y-4 ${prefersReduced ? "" : "animate-slide-up"}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
              Tu carta para compartir
            </h2>
          </div>
          <ShareCard data={shareData} layout="stories" />
        </div>

        {/* ── COMPACT STATS ── */}
        <div
          className={`results-lazy-section ${prefersReduced ? "" : "animate-slide-up"}`}
        >
          <div className="glass-panel rounded-3xl border border-[var(--color-border)] p-6">
            <h2 className="font-display text-2xl font-bold text-[var(--color-neon-primary)]">Tus estadísticas</h2>
            <div className="mt-4 divide-y divide-white/10">
              {top3Programs.map((result, index) => (
                <div key={result.programId} className="py-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-5 shrink-0 text-xs font-bold text-[var(--color-text-secondary)]">{index + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-[var(--color-text-primary)]">{result.program.name}</span>
                    <strong className="shrink-0 text-[var(--color-neon-primary)]">{Math.round(result.overallScore)}%</strong>
                  </div>
                  <div className="ml-8 mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-neon-secondary),var(--color-neon-primary))]" style={{ width: `${Math.max(0, Math.min(100, result.overallScore))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ACTIONS ── */}
        <div
          className={`results-lazy-section mx-auto max-w-xl ${
            prefersReduced ? "" : "animate-slide-up"
          }`}
        >
          {/* Navigation actions */}
          <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-6">
            <div className="space-y-3">
              <Link
                href="/test"
                onClick={resetTest}
                className="card-glow inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] px-6 py-4 text-base font-bold text-[var(--color-deep)] transition-all duration-300 hover:scale-[1.02]"
              >
                Repetir el test
              </Link>
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--color-border)] px-6 py-4 text-base font-bold text-[var(--color-text-secondary)] transition-all duration-300 hover:border-[var(--color-neon-primary)] hover:text-[var(--color-neon-primary)]"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>

      </main>

      <Footer disclaimer="Los resultados son una gu&#237;a basada en auto-percepci&#243;n y no constituyen un diagn&#243;stico psicol&#243;gico certificado." />
    </div>
  );
}
