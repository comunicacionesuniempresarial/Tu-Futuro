"use client";

import { useMemo, useState } from "react";
import { computeRadarPoints, renderRadarSVG } from "@/lib/share-card/radar-svg";
import { RADAR_AXIS_ORDER, RADAR_DIMENSION_LABELS } from "@/lib/share-card/radar-svg";
import type { RIASECProfile } from "@/lib/scoring/types";

export interface RadarChartProps {
  profile: RIASECProfile;
  programProfile?: RIASECProfile;
  className?: string;
}

/**
 * Dark-themed custom SVG radar. Renders the pure SVG from radar-svg.ts;
 * the optional program profile appears as a dashed neon secondary overlay.
 */
export function RadarChart({
  profile,
  programProfile,
  className = "",
}: RadarChartProps) {
  const svg = useMemo(
    () =>
      renderRadarSVG({
        profile,
        programProfile,
        width: 420,
        height: 420,
      }),
    [profile, programProfile]
  );
  const dominant = [...RADAR_AXIS_ORDER].sort(
    (a, b) => profile[b] - profile[a]
  )[0];
  const [activeDimension, setActiveDimension] = useState<keyof RIASECProfile | null>(null);
  const points = useMemo(() => computeRadarPoints(profile, 420, 420), [profile]);
  const activeValue = activeDimension ? Math.round(profile[activeDimension] * 100) : null;
  const comparisonValue = activeDimension && programProfile
    ? Math.round(programProfile[activeDimension] * 100)
    : null;

  return (
    <div
      data-theme="dark"
      className={`radar-stage rounded-3xl border border-[var(--color-neon-primary)]/30 bg-[var(--color-surface)]/60 p-4 backdrop-blur-sm sm:p-6 ${className}`}
    >
      <div className="radar-orbit relative mx-auto max-w-2xl">
        <div data-radar="true" dangerouslySetInnerHTML={{ __html: svg }} />
        <div className="absolute inset-0" aria-label="Explora tus estadísticas por dimensión">
          {RADAR_AXIS_ORDER.map((dimension, index) => {
            const point = points[index];
            const isActive = activeDimension === dimension;
            return (
              <button
                key={dimension}
                type="button"
                className={`radar-point absolute flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-black transition-all ${
                  isActive
                    ? "z-30 scale-150 border-white bg-[var(--color-neon-primary)] text-[var(--color-deep)] shadow-[0_0_24px_var(--color-neon-primary)]"
                    : "z-10 border-[var(--color-neon-secondary)] bg-[var(--color-deep)] text-[var(--color-neon-secondary)] hover:z-20 hover:scale-125 hover:shadow-[0_0_18px_var(--color-neon-secondary)]"
                }`}
                style={{ left: `${(point.x / 420) * 100}%`, top: `${(point.y / 420) * 100}%`, transform: "translate(-50%, -50%)" }}
                onMouseEnter={() => setActiveDimension(dimension)}
                onMouseLeave={() => setActiveDimension(null)}
                onFocus={() => setActiveDimension(dimension)}
                onBlur={() => setActiveDimension(null)}
                onClick={() => setActiveDimension((current) => current === dimension ? null : dimension)}
                aria-label={`${RADAR_DIMENSION_LABELS[dimension]}: ${Math.round(profile[dimension] * 100)}%`}
              >
                {dimension}
              </button>
            );
          })}
        </div>
        {activeDimension && (
          <div className="radar-tooltip pointer-events-none absolute left-1/2 top-1/2 z-40 min-w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--color-neon-primary)]/70 bg-[var(--color-deep)]/95 p-4 text-center shadow-[0_0_35px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)] backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-neon-secondary)]">{activeDimension} · {RADAR_DIMENSION_LABELS[activeDimension]}</p>
            <p className="mt-1 font-display text-3xl font-black text-[var(--color-neon-primary)]">{activeValue}%</p>
            <p className="text-xs text-[var(--color-text-secondary)]">fuerza en tu perfil</p>
            {comparisonValue !== null && <p className="mt-2 border-t border-white/10 pt-2 text-xs text-[var(--color-neon-secondary)]">Programa seleccionado: {comparisonValue}%</p>}
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Dimensiones del perfil">
        {RADAR_AXIS_ORDER.map((dimension) => (
          <span
            key={dimension}
            className={`radar-legend rounded-full border px-3 py-1 text-xs transition-all ${
              dimension === dominant
                ? "border-[var(--color-neon-primary)] bg-[var(--color-neon-primary)]/15 font-bold text-[var(--color-neon-primary)] shadow-[0_0_16px_color-mix(in_srgb,var(--color-neon-primary)_25%,transparent)]"
                : "border-[var(--color-border)] bg-black/20 text-[var(--color-text-secondary)]"
            }`}
          >
            {dimension} · {RADAR_DIMENSION_LABELS[dimension]}
          </span>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
        La dimensión resaltada es tu punto de partida más fuerte.
        {programProfile ? " La línea secundaria compara tu perfil con el programa seleccionado." : " Compárala con cada carrera para encontrar tu mejor encaje."}
      </p>
    </div>
  );
}
