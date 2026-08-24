"use client";

import BrandHeader from "./BrandHeader";
import Hero from "./Hero";
import { Footer } from "@/components/shared/Footer";

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
      <div aria-hidden="true" className="landing-energy"><span /><span /><span /><span /><span /><span /><span /><span /></div>
      <BrandHeader />

      <main className="pt-20">
        <Hero onStart={onStart} />
      </main>

      <Footer />
    </div>
  );
}
