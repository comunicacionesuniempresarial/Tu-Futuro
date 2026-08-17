"use client";

import NeonButton from "@/features/shared/ui/NeonButton";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";

const heroStats = [
  { value: "25", label: "Preguntas" },
  { value: "4", label: "Capas" },
  { value: "8", label: "Arquetipos" },
  { value: "12", label: "Programas" },
];

interface HeroProps {
  onStart?: () => void;
}

/**
 * Asymmetric bold hero: oversized headline on the left, inline key stats
 * and a neon CTA on the right. Entrance animation is transform/opacity
 * only and is suppressed under `prefers-reduced-motion` (no layout shift).
 */
export default function Hero({ onStart }: HeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      data-entrance={reducedMotion ? "static" : "animated"}
      className="relative overflow-hidden border-b border-[var(--color-border)]"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:pt-24">
        <div className="space-y-8">
          <h1
            id="hero-heading"
            className="font-heading text-5xl font-extrabold leading-[0.95] tracking-tight lg:text-7xl xl:text-8xl"
          >
            <span className="gradient-text-neon">Descubre</span>{" "}
            <span className="block">tu carrera ideal</span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-[var(--color-text-secondary)] lg:text-xl">
            Un test vocacional gamificado que revela qué carrera se alinea con quién eres. En
            minutos, no en semanas.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <NeonButton href="/test" onClick={onStart}>
              Empezar el test
            </NeonButton>
            <div className="flex items-center gap-5 text-sm font-medium text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-2">~5 min</span>
              <span className="flex items-center gap-2">Gratis</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4" aria-label="Datos del test">
          {heroStats.map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center"
            >
              <div className="font-heading text-4xl font-extrabold gradient-text-neon lg:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}