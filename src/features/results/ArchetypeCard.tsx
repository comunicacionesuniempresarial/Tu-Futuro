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
      className="mystic-card group card-foil relative overflow-hidden rounded-3xl border border-[var(--color-neon-primary)]/50 bg-[var(--color-deep)]/90 px-4 py-5 shadow-[0_0_60px_color-mix(in_srgb,var(--color-neon-primary)_25%,transparent)] sm:px-8 sm:py-7 cursor-default"
    >
      {/* ── Badges top row ── */}
      <div className="relative z-20 flex items-start justify-between gap-3 px-1 pb-4 sm:px-2">
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

      {/* The artwork is a real card asset; contain preserves its frame and typography. */}
      <div className="relative z-20 mx-auto w-full max-w-[390px] [perspective:1000px]">
        <div className="relative aspect-[617/768] animate-card-reveal transition-transform duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-[1.08] group-hover:rotate-[1deg]">
          <div aria-hidden="true" className="absolute -inset-4 rounded-[2.5rem] bg-[var(--color-neon-primary)]/20 blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
          <h2 className="sr-only">{archetype.name}</h2>
          <img
            src={`/archetypes/${archetype.id}.webp`}
            alt={`Carta del arquetipo ${archetype.name}`}
            loading="lazy"
            className="relative h-full w-full object-contain drop-shadow-[0_24px_28px_rgba(0,0,0,0.65)]"
          />
        </div>
      </div>

      {/* Supporting explanation stays outside the artwork, so the card remains readable. */}
      <div className="relative z-20 mx-auto mt-5 w-full max-w-2xl space-y-5 text-center">
        <div className="rounded-2xl border border-white/15 bg-black/50 p-4 shadow-lg backdrop-blur-md sm:p-5">
          <p className="text-sm leading-relaxed text-white sm:text-base">{whyText}</p>
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
