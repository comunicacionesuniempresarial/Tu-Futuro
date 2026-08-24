"use client";

import type { CSSProperties } from "react";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";
import type { Question } from "@/lib/scoring/types";

interface QuestionCardProps {
  question: Question;
  value: number | undefined;
  onChange: (value: number) => void;
}

/**
 * AnswerStamp — brief spring/glow feedback shown on the selected option.
 * Transform-only pop-in plus a golden glow and a tiny sparkle burst;
 * rendered static under reduced motion. Visual only — never changes the value.
 */
function AnswerStamp({ prefersReduced }: { prefersReduced: boolean }) {
  const sparks = Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2;
    return {
      tx: `${(Math.cos(angle) * 26).toFixed(1)}px`,
      ty: `${(Math.sin(angle) * 26).toFixed(1)}px`,
      delay: `${index * 14}ms`,
    };
  });
  return (
    <span
      data-stamp={prefersReduced ? "static" : "animated"}
      className={`relative w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] shadow-[0_0_16px_color-mix(in_srgb,var(--color-neon-primary)_45%,transparent)] will-change-transform ${
        prefersReduced ? "" : "animate-pop-in"
      }`}
    >
      <svg
        className="w-5 h-5 text-[var(--color-deep)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {!prefersReduced && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0">
          {sparks.map((spark, index) => (
            <span
              key={index}
              className="spark"
              style={
                {
                  "--tx": spark.tx,
                  "--ty": spark.ty,
                  "--delay": spark.delay,
                } as CSSProperties
              }
            />
          ))}
        </span>
      )}
    </span>
  );
}

/**
 * Panel del título con panel de vidrio y brillo holográfico
 */
function QuestionTitle({ text }: { text: string }) {
  return (
    <div className="glass-panel holographic-glow w-full max-w-3xl mx-auto rounded-2xl p-4 md:p-5 mb-3 flex flex-col items-center text-center relative">
      <span className="material-symbols-outlined text-[var(--color-neon-secondary)] text-2xl mb-1 opacity-80">menu_book</span>
      <h2 className="font-display text-2xl md:text-4xl font-bold text-[var(--color-neon-primary)] drop-shadow-[0_0_18px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)] leading-tight">
        {text}
      </h2>
      <div className="mt-2 h-1 w-20 mx-auto bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] rounded-full" />
    </div>
  );
}

/**
 * Card de opción — Duelo de Destinos:
 * Fondo completo de la ilustración (full-bleed) detrás del texto con scrim oscuro
 * para legibilidad perfecta, badge de letra en la esquina y feedback de selección.
 */
function OptionCard({
  option,
  index,
  selected,
  image,
  onChange,
  prefersReduced,
}: {
  option: string;
  index: number;
  selected: boolean;
  image: string | undefined;
  onChange: (value: number) => void;
  prefersReduced: boolean;
}) {
  return (
    <button
      type="button"
      data-option={index}
      data-selected={selected}
      onClick={() => onChange(index)}
      aria-label={`${option} — opción ${String.fromCharCode(65 + index)}`}
      aria-pressed={selected}
      className={`question-card mystic-card group relative flex shrink-0 snap-center flex-col justify-between aspect-[4/5] min-h-[250px] w-[78vw] max-w-[300px] sm:w-auto sm:max-w-none sm:min-h-[280px] md:min-h-[310px] rounded-2xl overflow-hidden text-center will-change-transform hover:-translate-y-3 hover:scale-[1.035] cursor-pointer ${
        selected
          ? "neon-border mystic-card-glow ring-2 ring-[var(--color-neon-primary)] scale-[1.02]"
          : "border border-[var(--color-border)] hover:border-[var(--color-neon-primary)]/70 hover:shadow-[0_0_28px_color-mix(in_srgb,var(--color-neon-primary)_30%,transparent)]"
      } bg-[var(--color-surface)]`}
    >
      {/* Fondo completo detrás de las letras (Full-bleed card art) */}
      <div
        data-card-image={image ?? undefined}
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
        style={
          image
            ? {
                backgroundImage: `url('${image}')`,
              }
            : undefined
        }
      >
        {!image && (
          <div className="absolute inset-0 bg-[linear-gradient(145deg,var(--color-surface-elevated),var(--color-deep))]" />
        )}
      </div>

      {/* Scrim / Degradado oscuro sobre la imagen para legibilidad cristalina del texto */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-10 transition-opacity duration-300 ${
          selected
            ? "bg-gradient-to-t from-[var(--color-deep)]/98 via-[var(--color-deep)]/85 to-[var(--color-deep)]/50"
            : "bg-gradient-to-t from-[var(--color-deep)]/95 via-[var(--color-deep)]/75 to-[var(--color-deep)]/35 group-hover:from-[var(--color-deep)]/92 group-hover:via-[var(--color-deep)]/65"
        }`}
      />

      {/* Sutil brillo foil dorado si está seleccionado */}
      {selected && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-neon-primary)_18%,transparent),transparent_60%)] pointer-events-none"
        />
      )}

      {/* Letra de la opción (A, B, C, D, E) en la esquina superior derecha */}
      <div className="relative z-20 flex justify-end p-3 sm:p-4">
        <span
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-300 shadow-lg backdrop-blur-md ${
            selected
              ? "bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] text-[var(--color-deep)] shadow-[0_0_16px_color-mix(in_srgb,var(--color-neon-primary)_70%,transparent)]"
              : "bg-black/65 text-white/95 border border-white/20 group-hover:border-[var(--color-neon-primary)]/60 group-hover:bg-black/85"
          }`}
        >
          {String.fromCharCode(65 + index)}
        </span>
      </div>

      {/* Contenido de texto: caja de texto con fondo translúcido y tipografía grande y clara */}
      <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-3.5 py-2 sm:px-4 sm:py-3 text-center">
        <div className="w-full rounded-xl bg-black/55 backdrop-blur-md border border-white/15 p-4 sm:p-5 group-hover:border-[var(--color-neon-primary)]/40 transition-colors shadow-lg">
            <p className="font-bold text-lg sm:text-xl md:text-[21px] leading-snug tracking-tight text-white text-balance drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
              {option}
            </p>
        </div>
      </div>

      {/* Zona inferior para el sello de confirmación */}
      <div className="relative z-20 flex justify-center items-center pb-3 sm:pb-4 min-h-[40px]">
        {selected && (
          <div className="flex items-center justify-center">
            <AnswerStamp prefersReduced={prefersReduced} />
          </div>
        )}
      </div>
    </button>
  );
}

/**
 * Cuadrícula de cards responsiva y simétrica según la cantidad de opciones:
 * 5 opciones -> grid 5 columnas en lg
 * 4 opciones -> grid 4 columnas en lg
 * 2 opciones -> grid 2 columnas
 */
function getCardsGridClass(count: number): string {
  if (count === 5) {
    return "question-options-grid flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-1 pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full max-w-6xl mx-auto justify-start sm:justify-center auto-rows-fr";
  }
  if (count === 4) {
    return "question-options-grid flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-1 pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 gap-4 w-full max-w-5xl mx-auto justify-start sm:justify-center auto-rows-fr";
  }
  if (count === 2) {
    return "question-options-grid flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-1 pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible gap-4 w-full max-w-2xl mx-auto justify-start sm:justify-center auto-rows-fr";
  }
  if (count === 3) {
    return "question-options-grid flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-1 pb-3 sm:grid sm:grid-cols-3 sm:overflow-visible gap-4 w-full max-w-4xl mx-auto justify-start sm:justify-center auto-rows-fr";
  }
  return "question-options-grid flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-1 pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 gap-4 w-full max-w-4xl mx-auto justify-start sm:justify-center auto-rows-fr";
}

/**
 * Componente principal de tarjeta de pregunta.
 * Soporta single-choice, likert-5 y binary question types.
 */
export default function QuestionCard({
  question,
  value,
  onChange,
}: QuestionCardProps) {
  const prefersReduced = useReducedMotion();

  // Single choice
  if (question.type === "single-choice" && question.options) {
    const visibleOptions = question.options.slice(0, 4);
    const gridClass = getCardsGridClass(visibleOptions.length);
    return (
      <div className="space-y-4">
        <QuestionTitle text={question.text} />
        <div className={gridClass}>
          {visibleOptions.map((option, index) => {
            const selected = value === index;
            return (
              <OptionCard
                key={index}
                option={option}
                index={index}
                selected={selected}
                image={question.images?.[index]}
                onChange={onChange}
                prefersReduced={prefersReduced}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Likert 5-point
  if (question.type === "likert-5" && question.options) {
    // Likert values are 1-based (1–5); OptionCard sends 0-based index.
    const likertChange = (idx: number) => onChange([1, 2, 3, 5][idx] ?? 5);
    const visibleOptions = question.options.slice(0, 4);
    const gridClass = getCardsGridClass(visibleOptions.length);
    return (
      <div className="space-y-5">
        <QuestionTitle text={question.text} />
        <div className={gridClass}>
          {visibleOptions.map((option, index) => {
            const selected = value === index + 1;
            return (
              <OptionCard
                key={index}
                option={option}
                index={index}
                selected={selected}
                image={question.images?.[index]}
                onChange={likertChange}
                prefersReduced={prefersReduced}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Binary
  if (question.type === "binary" && question.options) {
    const gridClass = getCardsGridClass(question.options.length);
    return (
      <div className="space-y-5">
        <QuestionTitle text={question.text} />
        <div className={gridClass}>
          {question.options.map((option, index) => {
            const selected = value === index;
            return (
              <OptionCard
                key={index}
                option={option}
                index={index}
                selected={selected}
                image={question.images?.[index]}
                onChange={onChange}
                prefersReduced={prefersReduced}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
