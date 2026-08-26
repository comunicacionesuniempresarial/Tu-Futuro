"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTestStore } from "@/stores/test-store";
import { programs } from "@/lib/programs";
import type { RIASECProfile, ModalityResult, Archetype, ScoringResult } from "@/lib/scoring/types";
import LeadForm from "./LeadForm";
import BrandHeader from "@/features/landing/BrandHeader";

interface ResultsData {
  riasecProfile: RIASECProfile;
  modalityResult: ModalityResult;
  archetype: Archetype;
  aptitudeVec: number[];
  valuesVec: number[];
  rankedResults: ScoringResult[];
  answers: Record<string, number>;
}

function loadResults(): ResultsData | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem("tufuturo-results");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function LeadFormStep({ esPrueba = false }: { esPrueba?: boolean }) {
  const router = useRouter();
  const { isCompleted, resetTest } = useTestStore();
  const [data, setData] = useState<ResultsData | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsub = useTestStore.persist.onFinishHydration(() => setHasHydrated(true));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación del store Zustand persist
    if (useTestStore.persist.hasHydrated()) setHasHydrated(true);
    return () => unsub();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura post-hidratación para evitar hydration mismatch
    setData(loadResults());
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!data && !isCompleted) {
      router.push("/test");
    }
  }, [data, isCompleted, router, hasHydrated]);

  if (!hasHydrated || !data) {
    if (hasHydrated && isCompleted) {
      return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="w-16 h-16 mx-auto rounded-2xl brand-gradient flex items-center justify-center shadow-[0_0_30px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)]">
              <svg className="w-8 h-8 text-[var(--color-deep)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                <path d="M11 8v4" />
                <path d="M11 15.5h.01" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[var(--color-text-primary)]">
              No encontramos tus resultados
            </h1>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
              Cerraste la pestaña y perdimos el resultado de tu duelo.
            </p>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => {
                  resetTest();
                  router.push("/test");
                }}
                className="inline-flex items-center gap-3 bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] text-[var(--color-deep)] font-bold text-lg px-8 py-4 rounded-2xl shadow-[0_0_24px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)] transition-all duration-300 hover:scale-105"
              >
                Hacer el test de nuevo
              </button>
              <Link
                href="/"
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-neon-secondary)] transition-colors font-medium"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-[var(--color-text-secondary)] font-medium" role="status" aria-label="Cargando resultados">Cargando...</div>
      </div>
    );
  }

  const top3 = data.rankedResults.slice(0, 3);
  const top3ForLead = top3.map((r) => {
    const prog = programs.find((p) => p.id === r.programId);
    return {
      carrera: prog?.name || "",
      compatibilidad: Math.round(r.overallScore),
    };
  });

  const scores = {
    intereses: Math.round(data.riasecProfile.R * 100),
    personalidad: Math.round(data.riasecProfile.I * 100),
    habilidades: Math.round(data.riasecProfile.A * 100),
    motivacion: Math.round(data.riasecProfile.S * 100),
  };

  const riasecProfile = {
    R: Math.round(data.riasecProfile.R * 100),
    I: Math.round(data.riasecProfile.I * 100),
    A: Math.round(data.riasecProfile.A * 100),
    S: Math.round(data.riasecProfile.S * 100),
    E: Math.round(data.riasecProfile.E * 100),
    C: Math.round(data.riasecProfile.C * 100),
  };

  return (
    <div data-theme="dark" className="min-h-screen bg-[var(--color-bg)] flex flex-col relative overflow-hidden">
      {/* Lienzo del duelo — orbes dorados y turquesas */}
      <div aria-hidden="true" className="ambient-bg" />
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[var(--color-neon-primary)]/6 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-[var(--color-neon-secondary)]/8 blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[440px] h-[440px] rounded-full bg-[var(--color-primary-container)]/8 blur-[120px]" />
      </div>

      <BrandHeader />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pt-32 pb-16">
        <div className="w-full max-w-lg animate-fade-in">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-neon-primary)]/40 bg-[var(--color-surface)]/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-neon-primary)] mb-4">
              ✦ Paso final
            </span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-[var(--color-neon-primary)] drop-shadow-[0_0_20px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)]">
              Guardá tu resultado
            </h1>
            <p className="text-[var(--color-text-secondary)] text-lg md:text-xl font-medium">
              Registrate para que no pierdas tu análisis.
            </p>
          </div>

          <div className="glass-panel neon-border rounded-3xl p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
            <LeadForm
              scores={scores}
              riasecProfile={riasecProfile}
              arquetipo={data.archetype.id}
              top3={top3ForLead}
              respuestas={data.answers}
              esPrueba={esPrueba}
              modality={data.modalityResult.recommendation}
              confidence={data.modalityResult.confidence}
              aptitudeVec={data.aptitudeVec}
              valuesVec={data.valuesVec}
              ranking={(data.rankedResults ?? []).map((r) => ({
                programId: r.programId,
                compatibility: Math.round(r.overallScore),
              }))}
            />
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/resultados")}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-neon-secondary)] transition-colors font-medium min-h-11 px-4 py-2"
            >
              Omitir por ahora →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
