"use client";

import BrandHeader from "./BrandHeader";
import Hero from "./Hero";
import NarrativeSection from "./NarrativeSection";
import { Footer } from "@/components/shared/Footer";

// Arquetipos destacados (no los 8 — baja la carga cognitiva; el resto
// se descubre dentro del test, donde pertenece).
const archetypes = [
  { name: "El Constructor", emoji: "⚙️" },
  { name: "El Investigador", emoji: "🔬" },
  { name: "El Creador", emoji: "🎨" },
  { name: "El Conector", emoji: "🤝" },
];

interface LandingPageProps {
  /** Fired when the user activates a CTA to start the test. */
  onStart?: () => void;
}

/**
 * Landing: Hero → arquetipos + CTA, sin revelar la estructura del resultado.
 * Canvas oscuro del Duelo, narrativa gamificada, carga cognitiva dosificada.
 * Sin proof social: solo valor, CTA y la promesa del test.
 */
export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="experience-canvas landing-experience relative overflow-hidden">
      <div aria-hidden="true" className="ambient-bg" />
      <div aria-hidden="true" className="ambient-rays" />
      <div aria-hidden="true" className="ambient-stars"><span className="star" /><span className="star" /><span className="star" /><span className="star-spark" /><span className="star-spark" /></div>
      <BrandHeader />

      <main className="pt-20">
        <Hero onStart={onStart} />

        <NarrativeSection id="arquetipos" title="Tu futuro tiene un personaje.">
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            El test te asigna un arquetipo según cómo sos de verdad. Estos son
            algunos de los que vas a poder invocar.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {archetypes.map((archetype) => (
              <div
                key={archetype.name}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 text-center transition-all duration-300 hover:border-[var(--color-neon-primary)]/50 hover:shadow-[0_0_24px_color-mix(in_srgb,var(--color-neon-primary)_18%,transparent)]"
              >
                <span aria-hidden="true" className="text-4xl">
                  {archetype.emoji}
                </span>
                <h3 className="font-display text-base font-bold">{archetype.name}</h3>
              </div>
            ))}
          </div>
        </NarrativeSection>
      </main>

      <Footer />
    </div>
  );
}
