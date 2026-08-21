"use client";

import type { Archetype, RIASECDimension } from "@/lib/scoring/types";

export interface RelatedArchetype {
  archetype: Archetype;
  similarity: number;
}

export interface TopDimension {
  dim: RIASECDimension;
  label: string;
  value: number;
}

export interface ArchetypeCardProps {
  archetype: Archetype;
  affinity?: number;
  relatedArchetypes?: RelatedArchetype[];
  topDimensions?: TopDimension[];
}

export function ArchetypeCard({
  archetype,
  affinity,
  relatedArchetypes = [],
  topDimensions = [],
}: ArchetypeCardProps) {
  const topLabels = topDimensions.map((d) => d.label);
  const whyText =
    topLabels.length >= 3
      ? `Tus dimensiones dominantes son ${topLabels[0]}, ${topLabels[1]} y ${topLabels[2]}. ${archetype.name} se construye sobre esa combinación: refleja cómo piensas, cómo decides y cómo afrontas los retos, y por eso sus rasgos te resultan tan familiares.`
      : archetype.description;

  return (
    <div
      data-theme="dark"
      className="mystic-card group card-foil relative overflow-hidden rounded-3xl border border-[var(--color-neon-primary)]/50 shadow-[0_0_60px_color-mix(in_srgb,var(--color-neon-primary)_20%,transparent)] flex flex-col min-h-[560px] cursor-default"
    >
      {/* ── Full-bleed background image ── */}
      <img
        src={`/archetypes/${archetype.id}.webp`}
        alt={`Ilustración del arquetipo ${archetype.name}`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 z-0"
      />

      {/* ── Scrim: heavy gradient from bottom so text is crystal clear ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--color-deep)]/98 via-[var(--color-deep)]/78 to-[var(--color-deep)]/25"
      />

      {/* ── Golden foil sheen on hover ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-neon-primary)_12%,transparent),transparent_55%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* ── Badges top row ── */}
      <div className="relative z-20 flex items-start justify-between p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-neon-primary)]/50 bg-[var(--color-deep)]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-neon-primary)] shadow-lg backdrop-blur-md">
          <span aria-hidden="true">{archetype.emoji}</span>
          <span>Arquetipo Mítico</span>
        </span>

        {typeof affinity === "number" && (
          <span
            data-accent="neon"
            className="inline-block rounded-full border border-[var(--color-neon-primary)]/50 bg-[var(--color-deep)]/80 px-3 py-1 text-xs font-bold text-[var(--color-neon-primary)] shadow-lg backdrop-blur-md"
          >
            {affinity}% de afinidad con tu perfil
          </span>
        )}
      </div>

      {/* ── Content anchored to bottom ── */}
      <div className="relative z-20 mt-auto p-6 md:p-8 space-y-5 text-center">
        {/* Title */}
        <div className="space-y-2">
          <h2 className="font-display text-4xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] md:text-5xl leading-tight">
            {archetype.name}
          </h2>
          <div className="h-1 w-20 mx-auto bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] rounded-full" />
        </div>

        {/* Description — frosted glass box */}
        <div className="rounded-xl bg-black/55 backdrop-blur-md border border-white/15 p-4 shadow-lg">
          <p className="text-sm sm:text-base leading-relaxed text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {whyText}
          </p>
        </div>

        {/* Related Archetypes */}
        {relatedArchetypes.length > 0 && (
          <div className="space-y-2" data-testid="related-archetypes">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-neon-secondary)]">
              Arquetipos cercanos
            </h3>
            {relatedArchetypes.map(({ archetype: related, similarity }) => (
              <div
                key={related.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm px-4 py-2 hover:border-[var(--color-neon-primary)]/40 transition-colors"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span aria-hidden="true">{related.emoji}</span>
                  <span>{related.name}</span>
                </span>
                <span className="text-xs font-bold text-[var(--color-neon-primary)]">
                  {Math.round(similarity * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Top Dimensions */}
        {topDimensions.length > 0 && (
          <div className="space-y-2" data-testid="top-dimensions">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-neon-secondary)]">
              Tus dimensiones dominantes
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {topDimensions.map((dimension) => (
                <span
                  key={dimension.dim}
                  className="rounded-full border border-[var(--color-neon-primary)]/50 bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-bold text-[var(--color-neon-primary)]"
                >
                  {dimension.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}