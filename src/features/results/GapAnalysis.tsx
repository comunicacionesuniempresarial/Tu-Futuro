"use client";

import { useMemo } from "react";
import { getProgramProfile } from "@/lib/scoring/programs-matrix";
import { RADAR_DIMENSION_LABELS } from "@/lib/share-card/radar-svg";
import type { RIASECProfile } from "@/lib/scoring/types";

export interface GapAnalysisProps {
  riasecProfile: RIASECProfile;
  topProgramIds: string[];
}

interface ProgramGap {
  programId: string;
  programName: string;
  /** Largest positive gap between the program requirement and the profile. */
  gap: number;
}

/**
 * For each top program, shows the biggest dimension where the student's
 * profile falls short of the program's RIASEC requirement.
 */
export function GapAnalysis({
  riasecProfile,
  topProgramIds,
}: GapAnalysisProps) {
  const gaps = useMemo<ProgramGap[]>(
    () =>
      topProgramIds.map((programId) => {
        const programProfile = getProgramProfile(programId);
        if (!programProfile) {
          return { programId, programName: programId, gap: 0 };
        }
        const perDimension = (
          Object.keys(RADAR_DIMENSION_LABELS) as (keyof RIASECProfile)[]
        ).map(
          (dimension) =>
            Math.max(0, programProfile.riasec[dimension] - riasecProfile[dimension])
        );
        return {
          programId,
          programName: programProfile.name,
          gap: Math.max(...perDimension),
        };
      }),
    [riasecProfile, topProgramIds]
  );

  return (
    <div
      data-theme="dark"
      className="rounded-3xl border border-[var(--color-border)]/70 bg-[var(--color-surface)]/90 p-8 space-y-4"
    >
      <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        Lo que podrías fortalecer
      </h3>
      {gaps.map((programGap) => (
        <div
          key={programGap.programId}
          className="flex items-center justify-between gap-3"
        >
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {programGap.programName}
          </span>
          <span
            data-gap={programGap.gap.toFixed(2)}
            data-accent="neon"
            className="rounded-lg bg-[var(--color-neon-primary)]/10 border border-[var(--color-neon-primary)]/30 px-3 py-1 text-sm font-extrabold text-[var(--color-neon-primary)]"
          >
            {Math.round(programGap.gap * 100)}% de distancia
          </span>
        </div>
      ))}
    </div>
  );
}
