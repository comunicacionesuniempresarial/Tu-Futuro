"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";

/** Number of segments per layer: L1=5, L2=5, L3=5 → 15 total. */
export const LAYER_SEGMENTS: readonly [number, number, number] = [
  5, 5, 5,
];

/** Question positions that complete a layer (last segment of each group). */
const LAYER_FINAL_STEPS: readonly number[] = [5, 10, 15];

/** Map a 1-indexed question position to its layer group (1-3). */
export function getLayerForSegment(step: number): 1 | 2 | 3 {
  if (step <= 5) return 1;
  if (step <= 10) return 2;
  return 3;
}

/** Whether reaching this step completes a layer (triggers the neon pulse). */
export function isLayerFinalStep(step: number): boolean {
  return LAYER_FINAL_STEPS.includes(step);
}

interface GamifiedProgressProps {
  /** 1-indexed current question position (0 = pre-test welcome). */
  currentStep: number;
  /** Total questions (15). */
  totalSteps: number;
  /** Current layer (1-3), used to highlight the active group. */
  currentLayer: 1 | 2 | 3;
  /** Fired once when a layer-final segment lights up. */
  onSegmentComplete?: (step: number) => void;
}

/**
 * Game-style HP bar: 15 neon segments grouped by the three layers (5/5/5).
 * The active segment glows; completing a layer fires a short scale pulse.
 * All animation is transform-only and suppressed under reduced motion.
 */
export default function GamifiedProgress({
  currentStep,
  totalSteps,
  currentLayer,
  onSegmentComplete,
}: GamifiedProgressProps) {
  const prefersReduced = useReducedMotion();
  const [pulseStep, setPulseStep] = useState<number | null>(null);
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (isLayerFinalStep(currentStep) && !firedRef.current.has(currentStep)) {
      firedRef.current.add(currentStep);
      setPulseStep(currentStep);
      onSegmentComplete?.(currentStep);
    }
  }, [currentStep, onSegmentComplete]);

  // Build the three layer groups with their global 1-indexed step numbers.
  const groups = LAYER_SEGMENTS.map((count, index) => {
    const layer = (index + 1) as 1 | 2 | 3;
    const cursor = LAYER_SEGMENTS.slice(0, index).reduce((sum, value) => sum + value, 0);
    const steps = Array.from(
      { length: count },
      (_, idx) => cursor + idx + 1
    );
    return { layer, steps };
  });

  return (
    <div
      role="progressbar"
      aria-label="Progreso del test"
      aria-valuemin={0}
      aria-valuemax={totalSteps}
      aria-valuenow={Math.min(Math.max(currentStep, 0), totalSteps)}
      data-motion={prefersReduced ? "static" : "animated"}
      className="w-full space-y-3"
    >
      <div className="flex items-stretch gap-1.5">
        {groups.map(({ layer, steps }) => (
          <div
            key={layer}
            data-layer-active={layer === currentLayer}
            className="flex flex-1 gap-1.5"
          >
            {steps.map((step) => {
              const filled = step <= currentStep;
              const active = step === currentStep;
              const pulse = active && step === pulseStep && !prefersReduced;
              return (
                <div
                  key={step}
                  data-step={step}
                  data-layer={layer}
                  data-filled={filled}
                  data-active={active}
                  data-glow={active}
                  data-pulse={pulse}
                  aria-hidden="true"
                  className={`h-2.5 flex-1 rounded-full will-change-transform transition-transform duration-300 ${
                    filled
                      ? "bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))]"
                      : "bg-[var(--color-border)]"
                  } ${
                    active
                      ? prefersReduced
                        ? "neon-glow-primary"
                        : "neon-glow-primary scale-y-[1.6]"
                      : ""
                  } ${pulse ? "animate-segment-pulse" : ""}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
