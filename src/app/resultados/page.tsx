"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ResultsPage,
  type ResultsData,
} from "@/features/results/ResultsPage";
import { useTestStore } from "@/stores/test-store";

function loadResults(): ResultsData | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem("tufuturo-results");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function DuelCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Lienzo del duelo — orbes dorados y turquesas */}
      <div aria-hidden="true" className="ambient-bg" />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[var(--color-neon-primary)]/5 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-[var(--color-neon-secondary)]/8 blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 w-[440px] h-[440px] rounded-full bg-[var(--color-primary-container)]/8 blur-[110px]" />
      </div>
      {children}
    </div>
  );
}

function MissingResults() {
  const router = useRouter();
  const { resetTest } = useTestStore();
  return (
    <DuelCanvas>
      <div className="text-center space-y-6 max-w-md relative z-10">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] flex items-center justify-center text-[var(--color-deep)] shadow-[0_0_30px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)]">
          <svg
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
          No encontramos tus resultados
        </h1>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          Cerraste la pestaña y perdimos el resultado de tu duelo. Invocalo de
          nuevo.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => {
              resetTest();
              router.push("/test");
            }}
            className="card-glow inline-flex items-center gap-3 bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] text-[var(--color-deep)] font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            Hacer el test de nuevo
          </button>
          <Link
            href="/"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-neon-primary)] transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </DuelCanvas>
  );
}

export default function ResultadosPage() {
  const [data, setData] = useState<ResultsData | null>(null);
  // Zustand persist hidrata async desde localStorage; esperamos a que termine
  // para decidir si existe un resultado sin provocar un render incorrecto.
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsub = useTestStore.persist.onFinishHydration(() => setHasHydrated(true));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación del store Zustand persist
    if (useTestStore.persist.hasHydrated()) setHasHydrated(true);
    return () => unsub();
  }, []);

  // Lee sessionStorage tras la hidratación, no en el initializer del estado:
  // leerlo durante el primer render del cliente genera hydration mismatch
  // (el server renderiza "Cargando..." y el cliente el resultado completo).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura post-hidratación para evitar hydration mismatch
    setData(loadResults());
  }, []);

  if (!hasHydrated || !data) {
    if (hasHydrated) return <MissingResults />;
    return (
      <DuelCanvas>
        <div className="text-[var(--color-text-secondary)]">
          Invocando tus resultados...
        </div>
      </DuelCanvas>
    );
  }

  return <ResultsPage data={data} />;
}
