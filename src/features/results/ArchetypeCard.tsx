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
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 text-center space-y-6"
    >
      <div
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#D51933] to-[#0033A5] text-5xl shadow-lg shadow-[#D51933]/25"
        aria-hidden="true"
      >
        {archetype.emoji}
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-extrabold text-white md:text-4xl">
          {archetype.name}
        </h2>
        {typeof affinity === "number" && (
          <span
            data-accent="neon"
            className="inline-block rounded-full border border-[#D51933]/40 bg-[#D51933]/10 px-3 py-1 text-xs font-bold text-[#D51933]"
          >
            {affinity}% de afinidad con tu perfil
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed text-neutral-400">{whyText}</p>

      {relatedArchetypes.length > 0 && (
        <div className="space-y-2" data-testid="related-archetypes">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
            Arquetipos cercanos
          </h3>
          {relatedArchetypes.map(({ archetype: related, similarity }) => (
            <div
              key={related.id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
                <span aria-hidden="true">{related.emoji}</span>
                <span>{related.name}</span>
              </span>
              <span className="text-xs font-bold text-[#0033A5]">
                {Math.round(similarity * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {topDimensions.length > 0 && (
        <div className="space-y-2" data-testid="top-dimensions">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
            Tus dimensiones dominantes
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {topDimensions.map((dimension) => (
              <span
                key={dimension.dim}
                className="rounded-full border border-[#0033A5]/40 bg-[#0033A5]/10 px-3 py-1 text-xs font-bold text-[#7aa2ff]"
              >
                {dimension.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}