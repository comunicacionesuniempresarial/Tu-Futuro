"use client";

import Image from "next/image";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";

interface LayerTransitionProps {
  layer: 1 | 2 | 3;
  onContinue: () => void;
}

const STUDGARD_MESSAGES = {
  1: {
    title: "¡Eso es, vamos con toda!",
    message: "Ya diste el primer paso. Sigue respondiendo con el corazón: aquí empieza lo que te hace único.",
    image: { src: "/images/studgard/studgard-open.png", width: 1214, height: 1149 },
  },
  2: {
    title: "¡Te estás luciendo!",
    message: "Ya conocemos un poco de lo que te mueve. Ahora vamos a descubrir todo lo que puedes lograr.",
    image: { src: "/images/studgard/studgard-thumbs-up.png", width: 740, height: 1148 },
  },
  3: {
    title: "¡Lo tienes al alcance!",
    message: "Falta muy poco para conocer tu camino. Da este último paso y prepárate para sorprenderte.",
    image: { src: "/images/studgard/studgard-pointing.png", width: 1143, height: 1376 },
  },
} as const;

/** Studgard's game-style intermission between test missions. */
export default function LayerTransition({
  layer,
  onContinue,
}: LayerTransitionProps) {
  const prefersReduced = useReducedMotion();
  const dialogue = STUDGARD_MESSAGES[layer];

  return (
    <MotionConfig reducedMotion={prefersReduced ? "always" : "never"}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={layer}
          data-layer-transition
          data-motion={prefersReduced ? "static" : "animated"}
          initial={prefersReduced ? false : { opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReduced ? undefined : { opacity: 0, y: -28, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
          className="relative mx-auto grid min-h-0 max-w-5xl items-center gap-1 overflow-hidden rounded-[2rem] border border-[var(--color-neon-secondary)]/35 bg-[radial-gradient(circle_at_28%_42%,color-mix(in_srgb,var(--color-neon-secondary)_14%,transparent),transparent_38%),linear-gradient(120deg,color-mix(in_srgb,var(--color-surface)_94%,transparent),color-mix(in_srgb,var(--color-deep)_92%,transparent))] px-4 py-4 shadow-[0_0_55px_color-mix(in_srgb,var(--color-neon-secondary)_16%,transparent)] sm:gap-2 sm:px-8 sm:py-6 lg:grid-cols-[1.05fr_.95fr] lg:px-12"
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[var(--color-neon-secondary)]/10 blur-3xl"
            animate={prefersReduced ? undefined : { scale: [0.85, 1.2, 0.85], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute right-1/4 top-8 h-2 w-2 rounded-full bg-[var(--color-neon-primary)] shadow-[0_0_18px_var(--color-neon-primary)]"
            animate={prefersReduced ? undefined : { scale: [1, 2.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          {!prefersReduced && [
            ["12%", "18%", "0.2s"], ["25%", "82%", "0.8s"], ["58%", "12%", "1.1s"],
            ["76%", "70%", "0.4s"], ["88%", "42%", "1.6s"], ["40%", "94%", "1.9s"],
          ].map(([top, left, delay], index) => (
            <motion.span
              key={index}
              aria-hidden="true"
              className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[var(--color-neon-secondary)] shadow-[0_0_12px_var(--color-neon-secondary)]"
              style={{ top, left }}
              animate={{ y: [0, -18, 0], opacity: [0.2, 1, 0.2], scale: [0.7, 1.4, 0.7] }}
              transition={{ duration: 2.8 + index * 0.35, delay: Number.parseFloat(delay), repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-neon-secondary)]/45 bg-[var(--color-neon-secondary)]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-neon-secondary)] shadow-[0_0_18px_color-mix(in_srgb,var(--color-neon-secondary)_18%,transparent)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-neon-primary)]" />
              Studgard en línea
            </div>

            <motion.div
              className="relative w-full max-w-xl rounded-[1.75rem] border-2 border-[var(--color-neon-primary)]/65 bg-[var(--color-deep)]/90 px-5 py-5 shadow-[0_0_32px_color-mix(in_srgb,var(--color-neon-primary)_18%,transparent)] sm:px-8 sm:py-8"
              initial={prefersReduced ? false : { opacity: 0, x: -24, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.18 }}
            >
              <span aria-hidden="true" className="absolute -bottom-4 left-12 h-7 w-7 rotate-45 border-b-2 border-r-2 border-[var(--color-neon-primary)]/65 bg-[var(--color-deep)]/90" />
              <h2 className="font-display text-3xl font-black leading-tight text-[var(--color-neon-primary)] drop-shadow-[0_0_18px_color-mix(in_srgb,var(--color-neon-primary)_42%,transparent)] sm:text-4xl lg:text-5xl">
                {dialogue.title}
              </h2>
              <p className="mt-5 text-lg font-semibold leading-relaxed text-[var(--color-text-primary)] sm:text-xl">
                {dialogue.message}
              </p>
              {!prefersReduced && (
                <div aria-hidden="true" className="mt-5 flex h-4 items-end gap-1 opacity-70">
                  {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
                    <motion.span
                      key={bar}
                      className="w-1 rounded-full bg-[var(--color-neon-secondary)]"
                      animate={{ height: [5, 10 + (bar % 3) * 4, 5] }}
                      transition={{ duration: 0.8, delay: bar * 0.08, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            <button
              onClick={onContinue}
              className="relative z-10 mt-6 min-h-12 w-full max-w-xl rounded-2xl bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] py-3.5 font-black text-[var(--color-deep)] shadow-[0_0_30px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] sm:mt-8 sm:py-4"
            >
              ¡Estoy listo! <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="relative z-10 flex h-[190px] items-end justify-center sm:h-[300px] lg:h-[500px]">
            {!prefersReduced && (
              <div aria-hidden="true" className="absolute bottom-8 h-24 w-64 rounded-full bg-[var(--color-neon-primary)]/20 blur-3xl" />
            )}
            <motion.div
              className={`relative h-full ${prefersReduced ? "" : "animate-float"}`}
              initial={prefersReduced ? false : { opacity: 0, scale: 0.88, y: 22 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.12 }}
            >
              <Image
                src={dialogue.image.src}
                width={dialogue.image.width}
                height={dialogue.image.height}
                sizes="(max-width: 639px) 70vw, (max-width: 1023px) 50vw, 42vw"
                preload
                alt="Studgard, tu guía del duelo"
                className="h-full w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
