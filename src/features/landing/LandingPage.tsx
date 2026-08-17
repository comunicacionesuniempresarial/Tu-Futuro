"use client";

import BrandHeader from "./BrandHeader";
import Hero from "./Hero";
import NarrativeSection from "./NarrativeSection";
import NeonButton from "@/features/shared/ui/NeonButton";
import { getUniquePrograms } from "@/lib/programs";

const steps = [
  {
    number: "01",
    title: "Responde preguntas breves",
    desc: "Intereses, aptitudes, valores y tu preferencia por lo presencial o virtual. Unos 5 minutos.",
  },
  {
    number: "02",
    title: "Conoce tu perfil RIASEC",
    desc: "Un radar de 6 dimensiones muestra cómo se combinan tus intereses: Realista, Investigador, Artístico, Social, Emprendedor y Convencional.",
  },
  {
    number: "03",
    title: "Descubre tu arquetipo",
    desc: "Un arquetipo profesional resume tu forma natural de trabajar.",
  },
  {
    number: "04",
    title: "Recibe tu ranking",
    desc: "Los programas de Uniempresarial ordenados por afinidad real con tu perfil, y tu modalidad recomendada.",
  },
];

const features = [
  {
    title: "Radar RIASEC",
    desc: "Visualiza tus intereses profesionales en 6 dimensiones y entiende qué actividades te motivan de verdad.",
  },
  {
    title: "Modalidad presencial o virtual",
    desc: "El test analiza tu estilo de aprendizaje y te recomienda la modalidad del Modelo Dual que mejor se adapta a ti.",
  },
  {
    title: "Análisis de brechas",
    desc: "Identifica las aptitudes que puedes fortalecer para acercarte a tu programa ideal y crecer en tu perfil.",
  },
];

const archetypes = [
  { name: "El Constructor", desc: "Optimizas todo lo que tocas. Procesos, recursos, tiempo — encuentras la forma más inteligente de hacer las cosas." },
  { name: "El Investigador", desc: "Tu curiosidad no tiene límites. Analizas, experimentas y descubres patrones que otros pasan por alto." },
  { name: "El Creador", desc: "Transformas ideas en experiencias. Tu creatividad es tu lenguaje natural y tu mayor ventaja." },
  { name: "El Conector", desc: "Entiendes a las personas como nadie. Empatía, comunicación y habilidades sociales son tu superpoder." },
  { name: "El Estratega", desc: "Planificas, organizas y ejecutas con precisión. Ves el panorama completo donde otros ven caos." },
  { name: "El Analista", desc: "Los datos cuentan historias para ti. Metódico, preciso y orientado a la excelencia." },
  { name: "El Visionario", desc: "Conectas creatividad con negocio. Ves oportunidades donde otros ven problemas." },
  { name: "El Líder", desc: "Inspiras, motivas y llevas equipos a resultados extraordinarios. Tu energía es contagiosa." },
];

interface LandingPageProps {
  /** Fired when the user activates a CTA to start the test. */
  onStart?: () => void;
}

/**
 * Redesigned landing: exactly 3 sections (Hero, "Cómo funciona",
 * Archetypes + CTA), narrative scroll reveal, dark/neon canvas.
 * UI-only — no scoring store, no pipeline, no Supabase.
 */
export default function LandingPage({ onStart }: LandingPageProps) {
  const programs = getUniquePrograms();

  return (
    <>
      <BrandHeader />

      <main>
        <Hero onStart={onStart} />

        <NarrativeSection
          id="como-funciona"
          eyebrow="Cómo funciona"
          title="No es solo un test. Es tu mapa de futuro."
        >
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7"
              >
                <div className="font-heading text-4xl font-extrabold text-[var(--color-neon-primary)]">
                  {step.number}
                </div>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7"
              >
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-xl font-bold">Programas del Modelo Dual</h3>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <div
                  key={program.baseId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4"
                >
                  <span className="font-semibold">{program.name}</span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {program.modalities.includes("presencial") && (
                      <span className="rounded-full bg-[var(--color-neon-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-neon-primary)]">
                        Presencial
                      </span>
                    )}
                    {program.modalities.includes("virtual") && (
                      <span className="rounded-full bg-[var(--color-neon-secondary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-neon-secondary)]">
                        Virtual
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </NarrativeSection>

        <NarrativeSection
          id="arquetipos"
          eyebrow="Tu perfil profesional"
          title="Arquetipos basados en los tipos de Jung."
        >
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {archetypes.map((archetype, index) => (
              <div
                key={archetype.name}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <div className="font-heading text-sm font-extrabold tracking-widest text-[var(--color-neon-secondary)]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-3 text-lg font-bold">{archetype.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {archetype.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="mx-auto max-w-xl text-lg text-[var(--color-text-secondary)]">
              Toma el test y descubre qué carrera se alinea con quién eres. Sin costos, sin
              compromisos.
            </p>
            <div className="mt-8">
              <NeonButton href="/test" onClick={onStart}>
                Comenzar ahora
              </NeonButton>
            </div>
          </div>
        </NarrativeSection>
      </main>

      <footer className="border-t border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-text-secondary)]">
        <p>Fundación Universitaria Empresarial de la CCB — Uniempresarial</p>
      </footer>
    </>
  );
}