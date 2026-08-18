"use client";

import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";
import { LAYER_NAMES, LAYER_DESCRIPTIONS } from "@/stores/test-store";

interface LayerTransitionProps {
  layer: 1 | 2 | 3 | 4;
  onContinue: () => void;
}

/** Layer icon per layer — simple line SVGs, kept from the previous theme. */
function LayerIcon({ layer }: { layer: 1 | 2 | 3 | 4 }) {
  const cls = "w-10 h-10 text-white";
  switch (layer) {
    case 1:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case 2:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      );
    case 3:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
          <path d="M2 9h20" />
          <path d="M12 21 8 9l4-6 4 6-4 12" />
        </svg>
      );
    case 4:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M5 21V8l7-5 7 5v13" />
          <path d="M9 21v-6h6v6" />
          <path d="M9 11h.01M15 11h.01M9 14h.01M15 14h.01" />
        </svg>
      );
  }
}

/**
 * Layer transition screen shown between wizard layers.
 * Framer Motion enter/exit (spring) between layer panels, transform/opacity
 * only, fully suppressed under prefers-reduced-motion.
 */
export default function LayerTransition({
  layer,
  onContinue,
}: LayerTransitionProps) {
  const prefersReduced = useReducedMotion();

  return (
    <MotionConfig reducedMotion={prefersReduced ? "always" : "never"}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={layer}
          data-layer-transition
          data-motion={prefersReduced ? "static" : "animated"}
          initial={prefersReduced ? false : { opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            prefersReduced
              ? undefined
              : { opacity: 0, y: -28, scale: 0.98 }
          }
          transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
          className="space-y-8 will-change-transform"
        >
          <div className="neon-border rounded-3xl p-8 md:p-12 space-y-6 text-center bg-[var(--color-surface)] shadow-[0_8px_40px_rgba(0,51,165,0.10)]">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] flex items-center justify-center shadow-[0_0_30px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)]">
              <LayerIcon layer={layer} />
            </div>
            <div>
              <p className="text-[var(--color-neon-secondary)]/60 text-sm font-bold uppercase tracking-widest mb-2">
                Capa {layer} de 4
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--color-text-primary)]">
                {LAYER_NAMES[layer]}
              </h2>
            </div>
            <p className="text-[var(--color-text-secondary)] text-xl md:text-2xl leading-relaxed max-w-lg mx-auto">
              {LAYER_DESCRIPTIONS[layer]}
            </p>
          </div>

          <button
            onClick={onContinue}
            className="w-full font-bold py-4 rounded-2xl text-[var(--color-text-primary)] bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] transition-transform duration-150 will-change-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_24px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)]"
          >
            Continuar
          </button>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}