"use client";

import {
  useTestStore,
  TOTAL_STEPS,
} from "@/stores/test-store";
import { QUESTION_BANK } from "@/lib/questions/question-bank";
import { runScoringPipeline } from "@/lib/scoring/pipeline";
import QuestionCard from "./QuestionCard";
import LayerTransition from "./LayerTransition";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";
import { useRef, useCallback, useEffect, useState } from "react";

/**
 * Gamified wizard: HP-bar progress (GamifiedProgress), per-answer feedback
 * (AnswerStamp in QuestionCard), directional spring question transitions and
 * Framer Motion layer transitions. Store integration and the scoring call are
 * preserved exactly from the previous wizard.
 */
const ENCOURAGEMENTS = [
  "Vas desbloqueando tu perfil.",
  "Buena jugada. Sigue con lo primero que pienses.",
  "Tu resultado empieza a tomar forma.",
  "Ufff, vas muy bien. Rómpela en el siguiente nivel.",
  "El modelo dual te espera!!!!",
  "Vamos vamoss!!!",
  "No la pienses!",
  "Esa es la actitud, confia en tu instinto",
  "Rompela, este es tu momento",
];

export default function TestWizard({ esPrueba = false }: { esPrueba?: boolean }) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const {
    step,
    answers,
    disclaimerAccepted,
    currentLayer,
    setStep,
    nextStep,
    prevStep,
    setAnswer,
    setRiasecProfile,
    setModalityResult,
    setArchetypeId,
    completeTest,
    acceptDisclaimer,
  } = useTestStore();

  // Track which layer transitions have been dismissed so we don't re-show them
  // when the user navigates back and forth.
  const [dismissedTransitions, setDismissedTransitions] = useState<Set<number>>(new Set());
  const [dismissedIntro, setDismissedIntro] = useState(false);

  const currentQuestion = step >= 1 && step <= TOTAL_STEPS
    ? QUESTION_BANK[step - 1]
    : undefined;

  const isDisclaimer = !disclaimerAccepted && step === 1 && Object.keys(answers).length === 0;

  // ── Layer transitions ──
  // After completing the last question of a layer (Q5, Q17), show a
  // transition screen before the first question of the next layer (Q13, Q18).
  const isFirstStepOfLayer = step === 6 || step === 11;
  const boundaryQuestionId =
    step === 6 ? "Q5" :
    step === 11 ? "Q17" :
    null;
  const boundaryAnswered = boundaryQuestionId
    ? answers[boundaryQuestionId] !== undefined
    : false;
  const currentAnswered = currentQuestion
    ? answers[currentQuestion.id] !== undefined
    : false;

  // Show transition only on first step of a layer, when boundary is answered,
  // current question is not yet answered, AND the user hasn't already dismissed
  // this transition (so navigating back doesn't re-show it).
  const transitionLayer =
    isFirstStepOfLayer && boundaryAnswered && !currentAnswered && !dismissedTransitions.has(step)
      ? step === 6 ? (2 as const) : step === 11 ? (3 as const) : null
      : null;

  const showTransition = transitionLayer !== null && !isDisclaimer;
  const showIntroTransition =
    disclaimerAccepted &&
    step === 1 &&
    Object.keys(answers).length === 0 &&
    !dismissedIntro &&
    !isDisclaimer;
  const showAnyTransition = showIntroTransition || showTransition;

  // Auto-advance timeout ref — cleared if user changes selection before it fires
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Slide direction for question animations
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  // In-UI warning banner for missing questions (replaces alert())
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Abandon confirmation dialog + focus restoration
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const abandonTriggerRef = useRef<HTMLButtonElement>(null);
  const abandonDialogRef = useRef<HTMLDivElement>(null);

  // Audio for test (Route 66) — se descarga recién cuando el usuario acepta
  // iniciar el test o toca el toggle (opt-in explícito, ~8MB no son gratis).
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioStarted = useRef(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Solo limpia si llegó a crearse; no crea ni descarga nada al montar.
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Focus trap for Abandon Dialog: focus the first button when dialog opens,
  // restore focus to the trigger button when it closes.
  useEffect(() => {
    if (showAbandonConfirm && abandonDialogRef.current) {
      // Focus the first focusable element inside the dialog (the "Seguir" button)
      const firstButton = abandonDialogRef.current.querySelector("button") as HTMLButtonElement | null;
      firstButton?.focus();
    }
    if (!showAbandonConfirm && abandonTriggerRef.current) {
      // Restore focus to the trigger when dialog closes
      abandonTriggerRef.current.focus();
    }
  }, [showAbandonConfirm]);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/audio/Route 66.mp3");
      audio.loop = true;
      audio.volume = 0.15;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const startTestAudio = useCallback(() => {
    if (!audioStarted.current) {
      ensureAudio().play().catch(() => {});
      setAudioPlaying(true);
      audioStarted.current = true;
    }
  }, [ensureAudio]);

  const toggleAudio = useCallback(() => {
    const audio = ensureAudio();
    if (audioPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setAudioPlaying(!audioPlaying);
  }, [audioPlaying, ensureAudio]);

  /** Abandon the duel: stop audio and return to the landing. */
  const abandonDuel = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setAudioPlaying(false);
    router.push("/");
  }, [router]);

  /** Show abandon confirmation if progress exists, otherwise abandon directly. */
  const requestAbandon = useCallback(() => {
    const hasProgress = Object.keys(answers).length > 0;
    if (hasProgress) {
      setShowAbandonConfirm(true);
    } else {
      abandonDuel();
    }
  }, [answers, abandonDuel]);

  /** Confirm abandon: close dialog and navigate. */
  const confirmAbandon = useCallback(() => {
    setShowAbandonConfirm(false);
    abandonDuel();
  }, [abandonDuel]);

  // ── Auto-advance on answer selection ──
  // When the user explicitly selects an answer, wait 300ms (so they see the selection
  // feedback) then advance to the next question automatically.
  const handleAnswerSelect = (value: number) => {
    if (!currentQuestion) return;
    setAnswer(currentQuestion.id, value);

    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }

    if (step < TOTAL_STEPS) {
      autoAdvanceTimer.current = setTimeout(() => {
        setSlideDirection("next");
        nextStep();
      }, 300);
    } else {
      // On the final answer, preserve the selection feedback briefly and go
      // directly to the form without requiring an extra click.
      autoAdvanceTimer.current = setTimeout(() => {
        runScoring();
      }, 300);
    }
  };

  // Cleanup auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, []);

  /** Run all scoring engines and store results */
  const runScoring = useCallback(() => {
    const state = useTestStore.getState();
    const { answers } = state;

    // Run the pure scoring pipeline
    const result = runScoringPipeline(answers);

    // Persist to Zustand store for cross-component access
    setRiasecProfile(result.riasecProfile);
    setModalityResult(result.modalityResult);
    setArchetypeId(result.archetype.id);

    // Store results in sessionStorage for results page
    sessionStorage.setItem(
      "tufuturo-results",
      JSON.stringify({
        riasecProfile: result.riasecProfile,
        modalityResult: result.modalityResult,
        archetype: result.archetype,
        aptitudeVec: result.aptitudeVec,
        valuesVec: result.valuesVec,
        rankedResults: result.rankedResults,
        answers,
      })
    );

    completeTest();
    // Preserva el modo prueba (?prueba=1) al pasar al formulario
    router.push(esPrueba ? "/test?step=form&prueba=1" : "/test?step=form");
  }, [
    setRiasecProfile,
    setModalityResult,
    setArchetypeId,
    completeTest,
    router,
    esPrueba,
  ]);

  const handleNext = () => {
    if (isDisclaimer) {
      acceptDisclaimer();
      setStep(1);
      startTestAudio();
      return;
    }

    // If on a layer transition screen, dismiss it and stay on the same step
    // so the user can answer the first question of the new layer.
    if (showIntroTransition) {
      setDismissedIntro(true);
      return;
    }

    if (showTransition && transitionLayer !== null) {
      setDismissedTransitions((prev) => new Set(prev).add(step));
      return;
    }

    // Validate current question is answered
    if (currentQuestion) {
      const answer = answers[currentQuestion.id];
      if (answer === undefined) {
        return; // Don't advance if unanswered
      }
    }

    if (step < TOTAL_STEPS) {
      setSlideDirection("next");
      nextStep();
    } else {
      // Test complete — stop audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setAudioPlaying(false);

      // Validate minimum answers (allow up to 2 unanswered)
      const answered = Object.keys(answers).length;
      const missing = TOTAL_STEPS - answered;
      if (missing >= 3) {
        setWarningMessage(
          `Faltan ${missing} preguntas por responder. Por favor completa al menos todas menos 2.`
        );
        // Auto-clear after 4 seconds
        setTimeout(() => setWarningMessage(null), 4000);
        return;
      }

      // Run scoring
      runScoring();
    }
  };

  const handlePrev = () => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    if (step > 1) {
      setSlideDirection("prev");
      prevStep();
    }
  };

  const canGoBack = step > 1 && !isDisclaimer;
  const canGoNext =
    isDisclaimer ||
    showAnyTransition ||
    (currentQuestion && answers[currentQuestion.id] !== undefined);

  // Determine display step for progress bar
  const displayStep = isDisclaimer ? 0 : step;

  return (
    <div className="min-h-[100dvh] bg-[var(--color-bg)] flex flex-col relative overflow-x-clip">
      {/* Ambient duel background — rayos de luz, estrellas, partículas y orbes */}
      <div aria-hidden="true" className="ambient-bg" />
      {!prefersReduced && (
        <>
          {/* Rayos de luz giratorios */}
          <div aria-hidden="true" className="ambient-rays" />
          {/* Estrellas titilantes */}
          <div aria-hidden="true" className="ambient-stars">
            {[
              { top: "8%", left: "6%", size: 3, delay: "0s", duration: "3.2s" },
              { top: "14%", left: "92%", size: 2, delay: "0.6s", duration: "4.1s" },
              { top: "24%", left: "78%", size: 3, delay: "1.2s", duration: "3.6s" },
              { top: "32%", left: "14%", size: 2, delay: "0.9s", duration: "4.4s" },
              { top: "42%", left: "88%", size: 2, delay: "1.8s", duration: "3.9s" },
              { top: "52%", left: "34%", size: 3, delay: "0.3s", duration: "4.7s" },
            ].map((s, i) => (
              <span
                key={i}
                className="star"
                style={{
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  animationDelay: s.delay,
                  animationDuration: s.duration,
                }}
              />
            ))}
            {/* Destellos de estrella (cruz de 4 puntas) */}
            {[
              { top: "18%", left: "22%", delay: "0.8s", duration: "5.2s" },
              { top: "48%", left: "12%", delay: "0.2s", duration: "5.8s" },
              { top: "82%", left: "46%", delay: "1.1s", duration: "6.4s" },
            ].map((s, i) => (
              <span
                key={`spark-${i}`}
                className="star-spark"
                style={{
                  top: s.top,
                  left: s.left,
                  animationDelay: s.delay,
                  animationDuration: s.duration,
                }}
              />
            ))}
          </div>
          <div aria-hidden="true" className="ambient-constellations" />
        </>
      )}
      {!prefersReduced && (
        <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[0, 2].map((i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${10 + i * 19}%`,
                width: 3 + (i % 3) * 2,
                height: 3 + (i % 3) * 2,
                animationDuration: `${9 + (i % 4) * 3}s`,
                animationDelay: `${i * 1.7}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header with progress */}
      <div className="sticky top-0 z-40 glass">
        <div className="w-full overflow-x-clip px-3 py-3 sm:px-6 sm:py-4 relative">
          <div className="space-y-3">
            {/* Mana bar — energía mística del duelo */}
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:flex sm:gap-3">
              <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-neon-secondary)] shrink-0">
                ✦ Energía Mística
              </span>
              <div
                role="progressbar"
                aria-label="Energía mística"
                aria-valuemin={0}
                aria-valuemax={TOTAL_STEPS}
                aria-valuenow={displayStep}
                data-motion={prefersReduced ? "static" : "animated"}
                className="h-2 flex-1 min-w-0 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden relative"
              >
                <div
                  className="mana-bar-fill h-full rounded-full"
                  style={{ transform: `scaleX(${Math.min(100, (displayStep / TOTAL_STEPS) * 100)}%)` }}
                />
                {/* Deterministic sparkle positions to avoid hydration mismatch */}
                {[
                  { left: "12%", bottom: "8%", delay: "0.3s", duration: "1.8s" },
                  { left: "28%", bottom: "14%", delay: "1.1s", duration: "2.4s" },
                  { left: "45%", bottom: "5%", delay: "0.7s", duration: "1.5s" },
                  { left: "58%", bottom: "18%", delay: "1.8s", duration: "2.1s" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-[var(--color-neon-secondary)] rounded-full animate-pulse"
                    style={{
                      left: s.left,
                      bottom: s.bottom,
                      animationDelay: s.delay,
                      animationDuration: s.duration,
                    }}
                  />
                ))}
              </div>
              <span className="hidden min-[420px]:inline text-xs font-bold text-[var(--color-text-secondary)] shrink-0 tabular-nums">
                {isDisclaimer
                  ? "Intro"
                  : `Pregunta ${displayStep} de ${TOTAL_STEPS}`}
              </span>
              {/* Audio toggle */}
              <button
                onClick={toggleAudio}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-neon-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-neon-primary)] shrink-0"
                aria-label={audioPlaying ? "Pausar música" : "Reproducir música"}
              >
                {audioPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              {/* Abandonar el duelo — texto completo en sm+, solo X en mobile */}
              <button
                ref={abandonTriggerRef}
                onClick={requestAbandon}
                className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-error)] hover:text-[var(--color-error)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-neon-primary)] shrink-0"
                aria-label="Abandonar duelo"
              >
                <svg className="w-4 h-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden sm:inline">Abandonar Duelo</span>
              </button>
            </div>

            <div className="space-y-2 min-w-0">
              {!isDisclaimer && !showAnyTransition && (
                <div className="mt-2 flex flex-col items-center justify-center gap-1 rounded-xl border border-[var(--color-neon-secondary)]/25 bg-[var(--color-neon-secondary)]/10 px-4 py-2 text-center shadow-[0_0_22px_color-mix(in_srgb,var(--color-neon-secondary)_12%,transparent)]">
                  <p className="text-sm sm:text-base font-bold text-[var(--color-neon-primary)] drop-shadow-[0_0_10px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)]" aria-live="polite">
                    {ENCOURAGEMENTS[Math.min(ENCOURAGEMENTS.length - 1, Math.floor(displayStep / 4))]}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]/80">
                    {currentLayer}/3 fases
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6 pt-5 sm:px-6 sm:pt-6 lg:flex lg:items-center lg:justify-center lg:py-6 relative z-10 overflow-x-clip">
        <div className="w-full max-w-6xl mx-auto">
          {/* Disclaimer */}
          {isDisclaimer && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-2xl p-6 md:p-8 border border-[var(--color-border)] space-y-5 bg-[var(--color-surface)]/95">
                <h2 className="flex min-w-0 items-start gap-3 text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl md:text-3xl">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl text-[var(--color-text-secondary)] sm:h-12 sm:w-12">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                      <path d="M7 21h10" />
                      <path d="M12 3v18" />
                      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                    </svg>
                  </span>
                  <span className="min-w-0 break-words">Descargo de Responsabilidad</span>
                </h2>
                <div className="space-y-3 text-[var(--color-text-secondary)] text-lg md:text-xl leading-relaxed">
                  <p>
                    El test vocacional es una herramienta de orientación{" "}
                    <strong className="text-[var(--color-text-primary)]">
                      informativa y complementaria
                    </strong>
                    . Los resultados NO constituyen:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-2">
                    <li>Diagnóstico psicológico o psicométrico certificado</li>
                    <li>Garantía de admisión a Uniempresarial</li>
                    <li>Promesa de empleabilidad o resultado profesional</li>
                    <li>Sustitución de orientación vocacional profesional</li>
                  </ul>
                  <p>
                    Los resultados son una guía basada en auto-percepción. La
                    decisión de carrera es responsabilidad del estudiante y su
                    familia.
                  </p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full font-bold py-4 rounded-2xl text-[var(--color-text-primary)] bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] transition-transform duration-150 will-change-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_24px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)]"
              >
                Entendido, empezar
              </button>
            </div>
          )}

          {/* Layer Transition Screen */}
          {!isDisclaimer && showAnyTransition && (transitionLayer || showIntroTransition) && (
            <LayerTransition
              layer={transitionLayer ?? 1}
              onContinue={handleNext}
            />
          )}

          {/* Questions */}
          {!isDisclaimer && !showAnyTransition && currentQuestion && (
            <div className="space-y-5">
              {/* Warning banner for missing questions */}
              {warningMessage && (
                <div
                  role="alert"
                  className="rounded-2xl px-5 py-3 border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 text-[var(--color-warning)] text-sm font-medium text-center max-w-3xl mx-auto"
                >
                  {warningMessage}
                </div>
              )}
              <MotionConfig reducedMotion={prefersReduced ? "always" : "never"}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentQuestion.id}
                    data-question-transition
                    data-direction={slideDirection}
                    initial={
                      prefersReduced
                        ? false
                        : slideDirection === "next"
                          ? { opacity: 0, x: 60 }
                          : { opacity: 0, x: -60 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      prefersReduced
                        ? undefined
                        : slideDirection === "next"
                          ? { opacity: 0, x: -60, transition: { duration: 0.15 } }
                          : { opacity: 0, x: 60, transition: { duration: 0.15 } }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="will-change-transform"
                  >
                    <QuestionCard
                      question={currentQuestion}
                      value={answers[currentQuestion.id]}
                      onChange={handleAnswerSelect}
                    />
                  </motion.div>
                </AnimatePresence>
              </MotionConfig>

              {/* Navigation */}
              <div className="flex items-center gap-4 max-w-4xl mx-auto">
                {canGoBack && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[var(--color-text-secondary)] hover:border-[var(--color-neon-secondary)]/50 hover:text-[var(--color-neon-secondary)] hover:bg-[var(--color-surface)]/90 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Anterior
                  </button>
                )}

                <div
                  className="flex min-h-12 flex-1 items-center justify-center rounded-2xl py-3.5 font-bold text-[var(--color-text-secondary)]/40"
                  aria-live="polite"
                >
                  {canGoNext && <span className="text-sm">Avanzando…</span>}
                </div>
              </div>
            </div>
          )}

          {/* Abandon Confirmation Dialog — WCAG compliant */}
          {showAbandonConfirm && (
            <div
              ref={abandonDialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="abandon-dialog-title"
              aria-describedby="abandon-dialog-desc"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowAbandonConfirm(false);
              }}
            >
              <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl space-y-4">
                <h3
                  id="abandon-dialog-title"
                  className="text-lg font-bold text-[var(--color-text-primary)] text-center"
                >
                  ¿Abandonar el duelo?
                </h3>
                <p
                  id="abandon-dialog-desc"
                  className="text-sm text-[var(--color-text-secondary)] text-center"
                >
                  Perderás todo el progreso del test. Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAbandonConfirm(false)}
                    className="flex-1 py-3 rounded-xl font-semibold border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] transition-colors"
                  >
                    Seguir
                  </button>
                  <button
                    type="button"
                    onClick={confirmAbandon}
                    className="flex-1 py-3 rounded-xl font-semibold bg-[var(--color-error)]/20 text-[var(--color-error)] border border-[var(--color-error)]/40 hover:bg-[var(--color-error)]/30 transition-colors"
                  >
                    Abandonar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
