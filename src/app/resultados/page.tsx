"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTestStore } from "@/stores/test-store";
import {
  ResultsPage,
  type ResultsData,
} from "@/features/results/ResultsPage";

function loadResults(): ResultsData | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem("tufuturo-results");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function MissingResults() {
  const router = useRouter();
  const { resetTest } = useTestStore();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF3F0] via-white to-[#E8EEFF] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Fondo con blobs de marca */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[#D51933]/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-[#0033A5]/15 blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 w-[440px] h-[440px] rounded-full bg-[#D51933]/5 blur-[110px]" />
      </div>
      <div className="text-center space-y-6 max-w-md relative z-10">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#D51933] to-[#0033A5] flex items-center justify-center text-white shadow-lg shadow-[#D51933]/25">
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
        <h1 className="text-2xl font-bold text-slate-900">
          No encontramos tus resultados
        </h1>
        <p className="text-slate-500 leading-relaxed">
          Cerraste la pestaña y perdimos el resultado de tu test.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => {
              resetTest();
              router.push("/test");
            }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#D51933] to-[#0033A5] text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-[#D51933]/25 transition-all duration-300 hover:scale-105"
          >
            Hacer el test de nuevo
          </button>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-[#0033A5] transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultadosPage() {
  const router = useRouter();
  const { isCompleted } = useTestStore();
  const [data, setData] = useState<ResultsData | null>(null);
  // Zustand persist hidrata async desde localStorage; en el primer render
  // isCompleted es el default (false) hasta que hidrata. Sin este guard,
  // el redirect a /test disparaba prematuramente (race condition).
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

  useEffect(() => {
    // No decidir el redirect hasta que el store se hidrate: si no,
    // isCompleted=false (default) causaría un redirect prematuro a /test.
    if (!hasHydrated) return;
    if (!data && !isCompleted) {
      router.push("/test");
    }
  }, [data, isCompleted, router, hasHydrated]);

  if (!hasHydrated || !data) {
    if (hasHydrated && isCompleted) {
      return <MissingResults />;
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF3F0] via-white to-[#E8EEFF] flex items-center justify-center relative overflow-hidden">
        {/* Fondo con blobs de marca */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[#D51933]/10 blur-[120px]" />
          <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-[#0033A5]/15 blur-[130px]" />
          <div className="absolute bottom-0 left-1/4 w-[440px] h-[440px] rounded-full bg-[#D51933]/5 blur-[110px]" />
        </div>
        <div className="text-slate-400">Cargando resultados...</div>
      </div>
    );
  }

  return <ResultsPage data={data} />;
}