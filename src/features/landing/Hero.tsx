"use client";

import NeonButton from "@/features/shared/ui/NeonButton";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";
import { useRef, type PointerEvent } from "react";

// El Duelo de Destinos: editorial dark, serif display, oro como protagonista.
// Sin proof social, sin mecánicas: solo valor y un CTA impecable.

const heroValueProps = [
  {
    title: "Sin respuestas correctas",
    subtitle: "Elige lo que más se parece a ti y avanza a tu ritmo.",
  },
];

interface HeroProps {
  onStart?: () => void;
}

/**
 * Hero del Duelo: badge de apertura, titular serif, propuesta de valor
 * sobre mecánicas, CTA dorado y la carta legendaria flotante.
 */
export default function Hero({ onStart }: HeroProps) {
  const reducedMotion = useReducedMotion();
  const cardStageRef = useRef<HTMLDivElement>(null);

  const handleCardPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const stage = cardStageRef.current;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stage.style.setProperty("--hero-card-rotate-x", `${-y * 12}deg`);
    stage.style.setProperty("--hero-card-rotate-y", `${x * 16}deg`);
    stage.style.setProperty("--hero-card-glow-x", `${(x + 0.5) * 100}%`);
    stage.style.setProperty("--hero-card-glow-y", `${(y + 0.5) * 100}%`);
  };

  const resetCardTilt = () => {
    const stage = cardStageRef.current;
    if (!stage) return;
    stage.style.removeProperty("--hero-card-rotate-x");
    stage.style.removeProperty("--hero-card-rotate-y");
    stage.style.removeProperty("--hero-card-glow-x");
    stage.style.removeProperty("--hero-card-glow-y");
  };

  return (
    <section
      aria-labelledby="hero-heading"
      data-entrance={reducedMotion ? "static" : "animated"}
      className="relative overflow-hidden border-b border-[var(--color-border)]"
    >
      {/* Tinte dorado sutil — acento deliberado, no decoración */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--color-neon-primary) 0%, var(--color-neon-secondary) 100%)",
          opacity: reducedMotion ? 0.03 : 0.05,
          transition: "opacity 0.2s ease",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
        <div className="space-y-6">
          {/* Badge de apertura del duelo */}
          <span className="uppercase tracking-widest text-xs font-bold text-[var(--color-neon-secondary)]">
            ✦ EL COMIENZO DE LA AVENTURA
          </span>

          {/* Titular serif — la marquesina del Duelo */}
          <h1
            id="hero-heading"
            className="font-display text-3xl sm:text-5xl font-extrabold leading-[0.95] tracking-tight lg:text-7xl xl:text-8xl"
          >
            <span className="block">Descubre tu</span>
            <span className="block text-[var(--color-neon-primary)] drop-shadow-[0_0_24px_color-mix(in_srgb,var(--color-neon-primary)_40%,transparent)]">
              Futuro Dual
            </span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-[var(--color-text-secondary)] lg:text-xl">
            Responde situaciones cercanas a tu vida y descubre qué tipo de
            entorno, carrera y forma de aprender pueden encajar mejor contigo.
            En pocos minutos tendrás una guía para tomar tu siguiente decisión.
          </p>

          <p className="max-w-lg border-l-2 border-[var(--color-neon-primary)]/70 pl-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Tus decisiones cotidianas revelan tu arquetipo oculto: una carta
            simbólica para entender qué futuro puede encajar contigo. Como el
            modelo dual une estudio y experiencia real en empresas, aquí no
            solo descubres quién eres: también encuentras por dónde empezar.
          </p>

          {/* Propuesta de valor — "para qué es el duelo", no "cómo funciona" */}
          <div className="mt-6 grid grid-cols-1 gap-4 max-w-sm">
            {heroValueProps.map((vp, i) => (
              <div
                key={i}
                className="group p-4 border border-[var(--color-border)]/40 rounded-xl bg-[var(--color-surface)]/50 transition-colors hover:border-[var(--color-neon-primary)]/50"
              >
                <h3 className="font-display font-bold text-sm tracking-wider text-[var(--color-neon-primary)] mb-1">
                  {vp.title}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {vp.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* CTA impecable del duelo */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
            <NeonButton
              href="/test"
              onClick={onStart}
              className="card-glow card-foil border border-[var(--color-neon-secondary)] relative flex items-center justify-center rounded-xl px-10 py-4 font-display font-bold text-[var(--color-deep)] text-lg transition-all"
            >
              Inicia el test
            </NeonButton>

            <div className="flex items-center gap-3 text-sm font-medium text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-2">~5 min</span>
              <span className="flex items-center gap-2">Gratis</span>
            </div>
          </div>
        </div>

        {/* Carta legendaria flotante — promesa del arquetipo que se revelará */}
        <div className="mt-6 hidden justify-center lg:flex" aria-hidden="true">
          <div
            ref={cardStageRef}
            className="hero-card-stage relative flex items-center justify-center"
            onPointerMove={handleCardPointerMove}
            onPointerLeave={resetCardTilt}
          >
            {/* Background card 1 */}
            <div
              className="absolute -left-14 -top-4 w-60 aspect-[2/3] rounded-2xl border border-[var(--color-neon-primary)]/30 bg-[var(--color-surface)]/40 opacity-40 -rotate-6 magical-float overflow-hidden shadow-xl"
              style={{ animationDelay: "1s" }}
            >
              <img
                src="/archetypes/creador.webp"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover opacity-50"
              />
            </div>
            {/* Background card 2 */}
            <div
              className="absolute -right-14 -top-2 w-60 aspect-[2/3] rounded-2xl border border-[var(--color-neon-primary)]/30 bg-[var(--color-surface)]/40 opacity-40 rotate-6 magical-float overflow-hidden shadow-xl"
              style={{ animationDelay: "2s" }}
            >
              <img
                src="/archetypes/estratega.webp"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover opacity-50"
              />
            </div>
            {/* Foreground main card */}
            <div className="hero-card-tilt relative z-10">
              <div className="card-foil magical-float relative w-72 aspect-[2/3] rounded-2xl border border-[var(--color-neon-primary)]/60 bg-[var(--color-deep)] overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)]">
                <div className="absolute inset-0">
                  <img
                    src="/archetypes/visionario.webp"
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-deep)] via-transparent to-transparent" />
                </div>
                <div className="absolute top-3 left-3 rounded-full border border-[var(--color-neon-primary)]/40 bg-[var(--color-deep)]/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-neon-primary)] z-10">
                  Arquetipo Mítico
                </div>
                <div className="absolute top-3 right-3 text-[var(--color-neon-primary)] z-10">
                  ✦
                </div>
                <div className="absolute bottom-6 inset-x-6 flex flex-col items-center gap-2 text-center z-10">
                  <div className="font-display text-2xl font-bold text-[var(--color-text-primary)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Tu destino te espera
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    ¿Qué carta invocarás?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
