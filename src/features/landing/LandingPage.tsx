"use client";

import BrandHeader from "./BrandHeader";
import Hero from "./Hero";
import NarrativeSection from "./NarrativeSection";
import { Footer } from "@/components/shared/Footer";

// Las 4 Capas del Poder — estructura del duelo, no mecánicas.
const powerLayers = [
  {
    title: "Intereses",
    description:
      "La primera capa del poder: qué actividades invocan tu atención de forma natural.",
    accent: "border-[var(--color-neon-primary)]/40",
    orb: "bg-[var(--color-neon-primary)]",
    glow: "shadow-[0_0_14px_color-mix(in_srgb,var(--color-neon-primary)_50%,transparent)]",
  },
  {
    title: "Aptitudes",
    description:
      "Tus fortalezas en combate: qué se te da bien sin esfuerzo y con qué fuerza golpeas.",
    accent: "border-[var(--color-neon-secondary)]/40",
    orb: "bg-[var(--color-neon-secondary)]",
    glow: "shadow-[0_0_14px_color-mix(in_srgb,var(--color-neon-secondary)_50%,transparent)]",
  },
  {
    title: "Valores",
    description:
      "Los hechizos que rigen tus decisiones: qué forma de vida sostiene tu futuro.",
    accent: "border-[var(--color-error)]/40",
    orb: "bg-[var(--color-error)]",
    glow: "shadow-[0_0_14px_color-mix(in_srgb,var(--color-error)_50%,transparent)]",
  },
  {
    title: "Modalidad",
    description:
      "El escenario del duelo: presencial o virtual, dónde se librará tu batalla académica.",
    accent: "border-[var(--color-primary-lav)]/40",
    orb: "bg-[var(--color-primary-lav)]",
    glow: "shadow-[0_0_14px_color-mix(in_srgb,var(--color-primary-lav)_50%,transparent)]",
  },
];

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
 * Landing: Hero (el duelo real) → Las 4 Capas del Poder → Arquetipos + CTA.
 * Canvas oscuro del Duelo, narrativa gamificada, carga cognitiva dosificada.
 * Sin proof social: solo valor, CTA y la promesa del test.
 */
export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <>
      <BrandHeader />

      <main className="pt-20">
        <Hero onStart={onStart} />

        <NarrativeSection id="para-que-es" title="Las 4 Capas del Poder">
          <p className="max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)] mb-8">
            Un test vocacional gamificado que revela qué carrera se alinea con
            quién sos. Cada respuesta te acerca a un arquetipo real del Modelo
            Dual de Uniempresarial: tu mazo de poder se construye capa por capa.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {powerLayers.map((layer) => (
              <div
                key={layer.title}
                className={`group card-foil rounded-2xl border ${layer.accent} bg-[var(--color-surface)]/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--color-surface)]`}
              >
                <div className={`mb-4 h-2.5 w-2.5 rounded-full ${layer.orb} ${layer.glow}`} />
                <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
                  {layer.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {layer.description}
                </p>
              </div>
            ))}
          </div>
        </NarrativeSection>

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
    </>
  );
}