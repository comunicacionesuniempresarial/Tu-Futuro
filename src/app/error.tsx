"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-5xl">🃏</div>
        <h1 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
          El duelo se interrumpió
        </h1>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          Ocurrió un error inesperado. Reintenta la invocación.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="card-glow inline-flex items-center gap-3 bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] text-[var(--color-deep)] font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-neon-primary)] transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}