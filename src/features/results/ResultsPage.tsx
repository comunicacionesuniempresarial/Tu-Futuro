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
import { RankingFull } from "./RankingFull";
import { ShareCard, type ShareCardLayout } from "./ShareCard";
import type { ShareCardData } from "@/lib/share-card/generate";

export interface ResultsData {
  riasecProfile: RIASECProfile;
  archetype: Archetype;
  aptitudeVec: number[];
  valuesVec: number[];
  rankedResults: ScoringResult[];
  answers: Record<string, number>;
}

const LAYOUT_OPTIONS: { layout: ShareCardLayout; label: string }[] = [
  { layout: "stories", label: "Instagram Stories" },
  { layout: "feed", label: "Instagram Feed" },
];

/**
 * Renders the full results experience for a hydrated ResultsData payload:
 * dark/neon cards, custom SVG radar with program overlay, confetti reveal,
 * share card with layout control, ranking and gap analysis.
 */
export function ResultsPage({ data }: { data: ResultsData }) {
  const { resetTest } = useTestStore();
  const prefersReduced = useReducedMotion();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null
  );
  const [focusedProgramIndex, setFocusedProgramIndex] = useState(0);
  const [layout, setLayout] = useState<ShareCardLayout>("stories");

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
        {Array.from({ length: 26 }, (_, index) => <span key={index} />)}
      </div>
      <div aria-hidden="true" className="results-energy-field"><span /><span /><span /><span /></div>
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[var(--color-neon-primary)]/5 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[540px] h-[540px] rounded-full bg-[var(--color-neon-secondary)]/8 blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 w-[460px] h-[460px] rounded-full bg-[var(--color-primary-container)]/8 blur-[130px]" />
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
          style={prefersReduced ? undefined : { animationDelay: "100ms" }}
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
          className={`glass-panel mx-auto max-w-3xl rounded-3xl border border-[var(--color-border)] p-4 md:p-6 ${
            prefersReduced ? "" : "animate-slide-up"
          }`}
          style={prefersReduced ? undefined : { animationDelay: "200ms" }}
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
          className={`space-y-6 ${prefersReduced ? "" : "animate-slide-up"}`}
          style={prefersReduced ? undefined : { animationDelay: "300ms" }}
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
            className="program-carousel relative mx-auto h-auto min-h-[420px] max-w-[960px] md:h-[430px]"
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
                        ? "translateX(-50%) translateY(0) scale(1.08)"
                        : slot === 1
                          ? "translateX(calc(-50% + 245px)) translateY(54px) rotate(7deg) scale(.9)"
                          : "translateX(calc(-50% - 245px)) translateY(54px) rotate(-7deg) scale(.9)",
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
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SHARE CARD ── */}
        <div
          className={`space-y-4 ${prefersReduced ? "" : "animate-slide-up"}`}
          style={prefersReduced ? undefined : { animationDelay: "450ms" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
              Compartí tu resultado
            </h2>
            <div className="flex gap-2" aria-label="Formato de la tarjeta">
              {LAYOUT_OPTIONS.map((option) => (
                <button
                  key={option.layout}
                  type="button"
                  onClick={() => setLayout(option.layout)}
                  aria-pressed={layout === option.layout}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-4 py-1.5 text-xs font-bold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-neon-primary)]/50 hover:text-[var(--color-neon-primary)]"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <ShareCard data={shareData} layout={layout} />
        </div>

        {/* ── FULL RANKING ── */}
        <div
          className={prefersReduced ? "" : "animate-slide-up"}
          style={prefersReduced ? undefined : { animationDelay: "500ms" }}
        >
          <RankingFull
            results={filteredResults}
            modalityRecommendation={undefined}
          />
        </div>

        {/* ── ACTIONS ── */}
        <div
          className={`mx-auto max-w-xl ${
            prefersReduced ? "" : "animate-slide-up"
          }`}
          style={prefersReduced ? undefined : { animationDelay: "550ms" }}
        >
          {/* Navigation actions */}
          <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-6">
            <div className="space-y-3">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-6 py-4 text-base font-bold text-[var(--color-text-secondary)] transition-all duration-300 hover:border-[var(--color-neon-primary)] hover:text-[var(--color-neon-primary)]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descargar resultados
              </button>
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-6 py-4 text-base font-bold text-[var(--color-text-secondary)] transition-all duration-300 hover:border-[var(--color-neon-primary)] hover:text-[var(--color-neon-primary)]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Compartir con un amigo
              </button>
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
