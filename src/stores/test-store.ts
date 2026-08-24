"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RIASECProfile, ModalityResult } from "@/lib/scoring/types";

// ── Layer boundaries (1-indexed question positions) ──
// Three layers with five questions each: 1-5, 6-10, 11-15.
const LAYER_BOUNDARIES = [5, 10] as const; // Q5→Q6, Q10→Q11

export const TOTAL_STEPS = 15;

/** Layer names for display */
export const LAYER_NAMES: Record<1 | 2 | 3, string> = {
  1: "Tus intereses",
  2: "Aptitudes",
  3: "Valores y Estilo de Vida",
};

/** Layer descriptions shown on transition screens */
export const LAYER_DESCRIPTIONS: Record<1 | 2 | 3, string> = {
  1: "Empecemos por lo que naturalmente despierta tu curiosidad.",
  2: "Ufff, vas muy bien. Ahora descubre lo que se te da especialmente bien.",
  3: "Ya falta poco. Conozcamos qué necesitas para sentirte a gusto en tu futuro.",
};

/**
 * Determine which layer a 1-indexed question position belongs to.
 * New distribution: 1-5 → Layer 1, 6-10 → Layer 2, 11-15 → Layer 3
 */
export function getLayerForPosition(position: number): 1 | 2 | 3 {
  if (position <= 5) return 1;
  if (position <= 10) return 2;
  return 3;
}

/** Check if a position is at a layer boundary (last question of a layer) */
export function isLayerBoundary(position: number): boolean {
  return LAYER_BOUNDARIES.includes(position as 5 | 10);
}

interface TestState {
  // Current step (1-indexed: 1 = first question, 15 = last question)
  step: number;
  // Current layer (1-3)
  currentLayer: 1 | 2 | 3;
  // Answers keyed by question ID — all numeric (option index or 1-based likert)
  answers: Record<string, number>;
  // Cached RIASEC profile after test completion
  riasecProfile: RIASECProfile | null;
  // Cached modality result after test completion
  modalityResult: ModalityResult | null;
  // Archetype ID after test completion
  archetypeId: string | null;
  // Whether test is completed
  isCompleted: boolean;
  // Disclaimer accepted
  disclaimerAccepted: boolean;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAnswer: (questionId: string, value: number) => void;
  setRiasecProfile: (profile: RIASECProfile) => void;
  setModalityResult: (result: ModalityResult) => void;
  setArchetypeId: (id: string) => void;
  completeTest: () => void;
  acceptDisclaimer: () => void;
  resetTest: () => void;
}

/**
 * Detect old formats so persisted answers cannot be interpreted with the
 * current three-layer question bank.
 */
function detectOldFormat(answers: Record<string, string | number>): boolean {
  // Old format had Q16 as a free-text question (string value)
  const q16Value = answers["Q16"];
  if (typeof q16Value === "string" && q16Value.length > 0) return true;

  // Also detect if there are numeric answers outside the current Q1-Q22 bank.
  const numericKeys = Object.keys(answers).filter((k) => /^Q\d+$/.test(k));
  const maxQ = Math.max(
    0,
    ...numericKeys.map((k) => parseInt(k.replace("Q", ""), 10))
  );
  if (maxQ > 22) return true;

  return false;
}

export const useTestStore = create<TestState>()(
  persist(
    (set, get) => ({
      step: 1,
      currentLayer: 1,
      answers: {},
      riasecProfile: null,
      modalityResult: null,
      archetypeId: null,
      isCompleted: false,
      disclaimerAccepted: false,

      setStep: (step) =>
        set({ step, currentLayer: getLayerForPosition(step) }),

      nextStep: () => {
        const { step } = get();
        if (step < TOTAL_STEPS) {
          const next = step + 1;
          set({ step: next, currentLayer: getLayerForPosition(next) });
        }
      },

      prevStep: () => {
        const { step } = get();
        if (step > 1) {
          const prev = step - 1;
          set({ step: prev, currentLayer: getLayerForPosition(prev) });
        }
      },

      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
        })),

      setRiasecProfile: (profile) => set({ riasecProfile: profile }),
      setModalityResult: (result) => set({ modalityResult: result }),
      setArchetypeId: (id) => set({ archetypeId: id }),
      completeTest: () => set({ isCompleted: true }),

      acceptDisclaimer: () => set({ disclaimerAccepted: true }),

      resetTest: () =>
        set({
          step: 1,
          currentLayer: 1,
          answers: {},
          riasecProfile: null,
          modalityResult: null,
          archetypeId: null,
          isCompleted: false,
          disclaimerAccepted: false,
        }),
    }),
    {
      name: "tu-futuro-dual-test",
      partialize: (state) => ({
        step: state.step,
        currentLayer: state.currentLayer,
        answers: state.answers,
        disclaimerAccepted: state.disclaimerAccepted,
        riasecProfile: state.riasecProfile,
        modalityResult: state.modalityResult,
        archetypeId: state.archetypeId,
        isCompleted: state.isCompleted,
      }),
      // Migration: detect old persisted question formats and reset via merge.
      // Using `merge` avoids calling actions inside onRehydrateStorage,
      // which can throw because `set` is not bound there.
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<TestState>;
        if (
          persisted &&
          persisted.answers &&
          detectOldFormat(persisted.answers as Record<string, string | number>)
        ) {
          // Old format detected — return a fresh state, ignoring persisted data
          return {
            ...currentState,
            step: 1,
            currentLayer: 1,
            answers: {},
            riasecProfile: null,
            modalityResult: null,
            archetypeId: null,
            isCompleted: false,
            disclaimerAccepted: false,
          };
        }
        return { ...currentState, ...persisted };
      },
    }
  )
);
