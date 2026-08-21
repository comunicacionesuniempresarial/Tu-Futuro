"use client";

import { useMemo } from "react";
import { renderRadarSVG } from "@/lib/share-card/radar-svg";
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

  return (
    <div
      data-theme="dark"
      className={`rounded-3xl border border-[var(--color-neon-primary)]/30 bg-[var(--color-surface)]/60 p-6 backdrop-blur-sm ${className}`}
    >
      <div data-radar="true" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}