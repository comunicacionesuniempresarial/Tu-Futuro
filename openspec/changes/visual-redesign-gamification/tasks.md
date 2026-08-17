# Tasks: Visual Redesign Gamification

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~2200 (PR1 ~700, PR2 ~600, PR3 ~900) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR #1 Landing → PR #2 Wizard → PR #3 Results |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units
| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Dark theme + shared primitives + Landing | PR #1 | `npx vitest run src/features/landing` | `next dev` → home renders dark, narrative scroll | revert `globals.css` + `src/features/landing` + `src/app/page.tsx` |
| 2 | Gamified Wizard | PR #2 | `npx vitest run src/features/wizard` | `next dev` → /test transitions + HP bar | revert `src/features/wizard` + `src/components/test` delegates |
| 3 | Results + Share Cards | PR #3 | `npx vitest run src/features/results src/lib/share-card` | `next dev` → /resultados share + confetti | revert `src/features/results` + `src/app/resultados/page.tsx` |

Bases: PR#1→feature/visual-redesign; PR#2→PR#1 branch; PR#3→PR#2 branch. Tracker merges to main only.

## PR #1 — Landing (base: feature/visual-redesign) [TDD: RED then GREEN]

- [x] 1.1 **globals.css** — add dark/neon CSS vars (`--color-bg`, `--color-surface`, `--color-neon-*`, `--font-heading/-body`) + `@theme` tokens + `prefers-reduced-motion` utilities. *TDD*: `src/features/shared/hooks/useReducedMotion.test.tsx` asserts computed dark bg class applied. *AC*: bg dark; neon accents = brand colors (#D51933 primary, #0033A5 secondary).
- [x] 1.2 **vitest.config.ts** + **src/test/setup.ts** — set `environment:'jsdom'`, `setupFiles`; add jest-dom + `vi.mock('next/navigation')`. *TDD*: setup loads without error (`npx vitest run` green). *AC*: jsdom env active.
- [x] 1.3 **shared/ui/NeonButton.tsx** — neon CTA + press micro-animation. *TDD*: `NeonButton.test.tsx` asserts neon class + press scale. *AC*: neon accent, transform-only.
- [x] 1.4 **shared/ui/AnimatedCard.tsx** + **ReducedMotionWrapper.tsx** — entrance/hover lift (`will-change`) + reduced-motion guard. *TDD*: `AnimatedCard.test.tsx` asserts hover class; suppressed under reduced motion. *AC*: transform-only.
- [x] 1.5 **shared/hooks/useReducedMotion.ts** + **useScrollReveal.ts** — `matchMedia` + `IntersectionObserver`. *TDD*: `useReducedMotion.test.tsx` / `useScrollReveal.test.tsx` mock media/IO, assert boolean + reveal callback. *AC*: responsive to query change.
- [x] 1.6 **landing/BrandHeader.tsx** — persistent logo header. *TDD*: `BrandHeader.test.tsx` asserts logo visible in DOM. *AC*: persists on scroll (sticky).
- [x] 1.7 **landing/Hero.tsx** — asymmetric bold hero, animated entrance. *TDD*: `Hero.test.tsx` asserts large heading + entrance class. *AC*: bold type, narrative (not above-fold dump).
- [x] 1.8 **landing/NarrativeSection.tsx** — scroll-reveal section (replaces 6 redundant stat blocks). *TDD*: `NarrativeSection.test.tsx` asserts IntersectionObserver reveal + each stat once. *AC*: no duplicate stats.
- [x] 1.9 **landing/LandingPage.tsx** — compose Hero + sections + BrandHeader. *TDD*: `LandingPage.test.tsx` integration asserts narrative order, dark canvas, no repeated stats. *AC*: spec landing AC 1-6.
- [x] 1.10 **app/page.tsx** — delegate to `LandingPage`; delete inline sections/archetypes/stats/features/programs/CTA. *TDD*: re-run full landing suite. *AC*: no scoring/store/Supabase touched.

## PR #2 — Wizard (base: PR #1 branch) [TDD: RED then GREEN]

- [ ] 2.1 **wizard/GamifiedProgress.tsx** — 25-segment neon HP bar, layer grouping, animated fill. *TDD*: `GamifiedProgress.test.tsx` asserts 5/12 fill + neon class + segment pulse. *AC*: game-style progress.
- [ ] 2.2 **wizard/QuestionCard.tsx** — selection pulse + neon ring. *TDD*: `QuestionCard.test.tsx` asserts selection feedback without reload. *AC*: per-answer feedback.
- [ ] 2.3 **wizard/LayerTransition.tsx** — Framer `AnimatePresence` enter/exit. *TDD*: `LayerTransition.test.tsx` asserts transition classes; suppressed under reduced motion. *AC*: transform-only.
- [ ] 2.4 **wizard/TestWizard.tsx** — gamified flow, transitions, HP bar, per-answer feedback; keep store + scoring call. *TDD*: `TestWizard.test.tsx` integration (mocked store) asserts Q transition + progress update + no scoring call. *AC*: no scoring coupling.
- [ ] 2.5 **components/test/TestWizard.tsx** — delegate to new `TestWizard`, preserve store/scoring. *TDD*: existing wizard test still green. *AC*: unchanged scoring behavior.
- [ ] 2.6 **components/test/QuestionCard.tsx** — delegate to new `QuestionCard`, preserve answer handling. *TDD*: re-run. *AC*: answers recorded only.

## PR #3 — Results + Share Cards (base: PR #2 branch) [TDD: RED then GREEN]

- [ ] 3.1 **lib/share-card/radar-svg.ts** — pure SVG radar drawing. *TDD*: `radar-svg.test.ts` snapshot SVG for sample profile. *AC*: dark/neon radar.
- [ ] 3.2 **lib/share-card/generate.ts** — `generateShareCardSVG` + `svgToPngBlob`. *TDD*: `generate.test.ts` asserts archetype emoji+name+radar present; `svgToPngBlob` returns valid Blob. *AC*: 1200x630 composition.
- [ ] 3.3 **shared/hooks/useShareCard.ts** — SVG→PNG→`navigator.share`→download→clipboard. *TDD*: `useShareCard.test.tsx` mocks share/absent, asserts fallback chain. *AC*: Web Share primary, PNG+clipboard fallback.
- [ ] 3.4 **results/ShareCard.tsx** — SVG compose + export + share affordance. *TDD*: `ShareCard.test.tsx` asserts button → blob → share/fallback. *AC*: spec share-cards AC 1-6.
- [ ] 3.5 **results/ConfettiTrigger.tsx** — `canvas-confetti` + reduced-motion guard, fires once. *TDD*: `ConfettiTrigger.test.tsx` asserts single fire, none under reduced motion. *AC*: confetti once.
- [ ] 3.6 **results/{ArchetypeCard,RadarChart,ModalityCard,ProgramCard,GapAnalysis,RankingFull}.tsx** — dark/neon restyle. *TDD*: per-component tests assert dark bg + neon accent. *AC*: results-display polish AC 2.
- [ ] 3.7 **results/ResultsPage.tsx** — dark layout, confetti trigger, share affordance. *TDD*: `ResultsPage.test.tsx` (mock sessionStorage) asserts confetti once + share button. *AC*: results-display AC 1,3.
- [ ] 3.8 **app/resultados/page.tsx** — delegate to `ResultsPage`, keep sessionStorage load. *TDD*: re-run. *AC*: data flow intact.
- [ ] 3.9 **Delete src/components/results/*.tsx** (6) — removed, replaced by slice. *TDD*: full suite green, no import errors. *AC*: no dead refs.

## Cross-cutting
- All slices: TDD `npx vitest run` green; regression `src/lib/__tests__/*` untouched & passing; `tsc --noEmit` clean; respect `prefers-reduced-motion` at trigger points.
