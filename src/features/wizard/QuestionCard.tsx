"use client";

import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";
import type { Question } from "@/lib/scoring/types";

interface QuestionCardProps {
  question: Question;
  value: number | undefined;
  onChange: (value: number) => void;
}

/**
 * AnswerStamp — brief spring/glow feedback shown on the selected option.
 * Transform-only pop-in plus a neon glow; rendered static under reduced motion.
 * Visual only — it never changes the answer value.
 */
function AnswerStamp({ prefersReduced }: { prefersReduced: boolean }) {
  return (
    <span
      data-stamp={prefersReduced ? "static" : "animated"}
      className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] shadow-[0_0_16px_color-mix(in_srgb,var(--color-neon-primary)_45%,transparent)] will-change-transform ${
        prefersReduced ? "" : "animate-pop-in"
      }`}
    >
      <svg
        className="w-5 h-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

const selectedClasses =
  "neon-border neon-glow-primary bg-[var(--color-surface-hover)]";
const idleClasses =
  "border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-neon-secondary)]/50 backdrop-blur-md";

/** Underline decorativo con el degradado de marca bajo el título */
function QuestionTitle({ text }: { text: string }) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text-primary)] leading-tight">
        {text}
      </h2>
      <div className="mt-3 h-1.5 w-24 bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] rounded-full" />
    </div>
  );
}

/**
 * Enhanced question card with per-answer selection feedback:
 * a neon highlight ring on the selected option plus an AnswerStamp pop-in.
 * Works for single-choice, likert-5 and binary questions.
 */
export default function QuestionCard({
  question,
  value,
  onChange,
}: QuestionCardProps) {
  const prefersReduced = useReducedMotion();

  // Single choice (cards)
  if (question.type === "single-choice" && question.options) {
    return (
      <div className="space-y-5">
        <QuestionTitle text={question.text} />
        <div className="grid gap-3">
          {question.options.map((option, index) => {
            const selected = value === index;
            return (
              <button
                key={index}
                data-option={index}
                data-selected={selected}
                data-ring={selected}
                onClick={() => onChange(index)}
                className={`group relative w-full text-left p-4 md:p-5 rounded-2xl transition-all duration-300 will-change-transform ${
                  selected ? selectedClasses : idleClasses
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-all duration-300 shrink-0 ${
                      selected
                        ? "bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] text-white"
                        : "bg-[var(--color-neon-secondary)]/15 text-[var(--color-neon-secondary)] group-hover:bg-[var(--color-neon-secondary)]/25"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span
                    className={`flex-1 text-xl md:text-2xl font-semibold transition-colors ${
                      selected
                        ? "text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {option}
                  </span>
                  {selected && <AnswerStamp prefersReduced={prefersReduced} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Likert 5-point
  if (question.type === "likert-5" && question.options) {
    return (
      <div className="space-y-6">
        <QuestionTitle text={question.text} />
        <div className="flex flex-col gap-3">
          {question.options.map((option, index) => {
            const selected = value === index + 1;
            return (
              <button
                key={index}
                data-option={index}
                data-selected={selected}
                data-ring={selected}
                onClick={() => onChange(index + 1)}
                className={`group w-full text-left p-4 md:p-5 rounded-2xl transition-all duration-300 will-change-transform ${
                  selected ? selectedClasses : idleClasses
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
                      selected
                        ? "border-transparent bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] shadow-[0_0_10px_color-mix(in_srgb,var(--color-neon-primary)_40%,transparent)]"
                        : "border-[var(--color-neon-secondary)]/25 group-hover:border-[var(--color-neon-secondary)]/50"
                    }`}
                  >
                    {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span
                    className={`flex-1 text-xl md:text-2xl font-semibold transition-colors ${
                      selected
                        ? "text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {option}
                  </span>
                  {selected && <AnswerStamp prefersReduced={prefersReduced} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Binary
  if (question.type === "binary" && question.options) {
    return (
      <div className="space-y-6">
        <QuestionTitle text={question.text} />
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            const selected = value === index;
            return (
              <button
                key={index}
                data-option={index}
                data-selected={selected}
                data-ring={selected}
                onClick={() => onChange(index)}
                className={`group relative p-6 md:p-8 rounded-2xl transition-all duration-300 text-center will-change-transform ${
                  selected ? selectedClasses : idleClasses
                }`}
              >
                <span
                  className={`block text-2xl md:text-3xl font-bold transition-colors ${
                    selected
                      ? "text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {option}
                </span>
                <span className="absolute top-3 right-3">
                  {selected && <AnswerStamp prefersReduced={prefersReduced} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}