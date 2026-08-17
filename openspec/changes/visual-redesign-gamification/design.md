# Design: Visual Redesign Gamification

## Technical Approach

Redesign the three main screens (Landing → Wizard → Results) as an iterative UI-only transformation. Apply a native dark canvas with neon/vibrant accents, bold typography, and gamified interactions. Replace the current light institutional theme with a game-like aesthetic. Introduce share-card generation using a lightweight SVG-native approach. All animations are transform-only with `will-change` and respect `prefers-reduced-motion`. The scoring engine (`runScoringPipeline`, Zustand store, Supabase) remains completely untouched.

## Architecture Decisions

### Decision: Share Card Image Generation

**Choice**: Native SVG with `@svgdotjs/svgdom` for server/client generation + `canvas.toBlob()` for PNG export  
**Alternatives considered**: `html2canvas` (40KB gzipped, renders entire DOM), `dom-to-image` (similar weight)  
**Rationale**: Share cards are simple compositions (archetype badge + radar chart + text). Generating SVG directly avoids DOM rendering overhead, keeps bundle size minimal (~8KB for svgdom vs 40KB for html2canvas), and produces crisp output at any resolution. PNG export via a temporary canvas is a one-liner. No runtime DOM dependency means it works in edge/serverless contexts if needed later.

### Decision: Animation Architecture

**Choice**: Framer Motion for complex sequences (wizard transitions, confetti), CSS-only with `IntersectionObserver` for scroll reveals (landing)  
**Alternatives considered**: Pure CSS for everything, GSAP  
**Rationale**: Framer Motion handles `prefers-reduced-motion` natively, provides `animatePresence` for enter/exit transitions (wizard), and tree-shakes well. Landing scroll animations are already implemented with `IntersectionObserver` — extend that pattern. Confetti stays with `canvas-confetti` (already in deps).

### Decision: Dark Canvas Theme System (Brand-Neon Combination)

**Choice**: Extend Tailwind 4 config with CSS custom properties for the dark/neon palette; use `@theme` directive for design tokens  
**Alternatives considered**: CSS-in-JS, separate theme context provider  
**Rationale**: Tailwind 4's `@theme` integrates with CSS variables natively. No runtime provider needed. All components consume tokens via `bg-[var(--color-bg)]`, `text-[var(--color-neon)]` etc. Single source of truth in `globals.css` / `tailwind.config.ts`.

**Resolved decision (user sign-off)**: The neon palette uses **brand colors** — `--color-neon-primary: #D51933` (rojo Uniempresarial) and `--color-neon-secondary: #0033A5` (azul Uniempresarial) — on the dark canvas (#050505 / #0d0d0d). This combines the dark/neon game aesthetic (from the prior session's direction) with the existing institutional identity. Green/cyan/violet neons are removed from the primary palette (can remain as rare tertiary accents only). Share card uses these same brand colors as flat solids for html-to-image fidelity.

### Decision: Wizard Progress — Game-Style "HP Bar"

**Choice**: Animated gradient bar with "segments" lighting up per question; neon glow on active segment  
**Alternatives considered**: Circular progress, simple linear bar, stepper dots  
**Rationale**: Matches "vida de videojuego" metaphor from proposal. Segments map 1:1 to questions (25 segments grouped by layer). Neon fill animation on answer submission provides micro-feedback.

### Decision: Component Structure for Iterative Delivery

**Choice**: Three feature-slice folders under `src/features/` mirroring the delivery order  
```
src/features/
├── landing/          # Slice 1 — LandingPage, Hero, NarrativeSection, BrandHeader
├── wizard/           # Slice 2 — TestWizard, QuestionCard, GamifiedProgress, LayerTransition
├── results/          # Slice 3 — ResultsPage, ArchetypeCard, RadarChart, ShareCard, ConfettiTrigger
└── shared/
    ├── ui/           # NeonButton, AnimatedCard, ReducedMotionWrapper
    ├── hooks/        # useReducedMotion, useShareCard, useScrollReveal
    └── theme/        # DarkNeonProvider (CSS vars only, no context)
```
**Rationale**: Enables independent PRs per slice. Shared primitives prevent duplication. No breaking changes to existing imports until each slice lands.

---

## Data Flow

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Landing   │────▶│     Wizard       │────▶│    Results      │
│  (marketing)│     │  (answer collect)│     │  (display only) │
└─────────────┘     └────────┬─────────┘     └────────┬────────┘
                             │                        │
                    ┌────────▼────────┐       ┌────────▼────────┐
                    │  Zustand Store  │       │  sessionStorage │
                    │  (answers only) │       │  (scoring output)│
                    └─────────────────┘       └─────────────────┘
                                                         │
                                                ┌────────▼────────┐
                                                │  ShareCard Gen  │
                                                │  (SVG → PNG)    │
                                                └─────────────────┘
```

- **Landing → Wizard**: `resetTest()` clears Zustand, navigates to `/test`
- **Wizard → Results**: `runScoring()` writes to sessionStorage, navigates to `/resultados`
- **Results → ShareCard**: Reads `riasecProfile` + `archetype` from sessionStorage (or props), generates SVG → PNG → Web Share API / download / clipboard
- **Scoring engine**: Called once at test completion. Results page and share cards **only read** persisted output. No re-scoring.

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/globals.css` | Modify | Add CSS custom properties for dark/neon palette (`--color-bg`, `--color-surface`, `--color-neon-primary`, `--color-neon-secondary`, `--font-heading`, `--font-body`); extend Tailwind 4 `@theme` with design tokens and `prefers-reduced-motion` media query utilities (Tailwind 4 is CSS-first — no `tailwind.config.ts`) |
| `src/features/landing/LandingPage.tsx` | Create | New landing page: narrative scroll sections, dark canvas, neon CTAs, persistent brand header |
| `src/features/landing/Hero.tsx` | Create | Asymmetric hero with bold typography, animated entrance |
| `src/features/landing/NarrativeSection.tsx` | Create | Scroll-reveal section component (replaces 6 redundant stat sections) |
| `src/features/landing/BrandHeader.tsx` | Create | Persistent header with logo, replaces Header slot usage |
| `src/app/page.tsx` | Modify | Delegate to `LandingPage`; remove inline sections, archetypes, stats, features, programs, CTA |
| `src/features/wizard/TestWizard.tsx` | Create | Gamified wizard: Framer Motion transitions, HP-bar progress, per-answer feedback |
| `src/features/wizard/QuestionCard.tsx` | Create | Enhanced with selection pulse animation, neon highlight ring |
| `src/features/wizard/GamifiedProgress.tsx` | Create | 25-segment neon progress bar, layer grouping, animated fill |
| `src/features/wizard/LayerTransition.tsx` | Create | Framer Motion enter/exit between layers |
| `src/components/test/TestWizard.tsx` | Modify | Delegate to new `TestWizard`; keep store integration, scoring call |
| `src/components/test/QuestionCard.tsx` | Modify | Delegate to new `QuestionCard`; preserve answer handling |
| `src/features/results/ResultsPage.tsx` | Create | Dark/neon results layout, share affordance, confetti trigger |
| `src/features/results/ArchetypeCard.tsx` | Create | Dark card, neon accent border, bold typography |
| `src/features/results/RadarChart.tsx` | Create | Recharts with dark theme, neon strokes, dark grid |
| `src/features/results/ModalityCard.tsx` | Create | Dark card, neon recommendation badge |
| `src/features/results/ProgramCard.tsx` | Create | Dark card, neon compatibility bar |
| `src/features/results/GapAnalysis.tsx` | Create | Dark theme, neon gap indicators |
| `src/features/results/RankingFull.tsx` | Create | Dark theme, neon bars |
| `src/features/results/ShareCard.tsx` | Create | SVG composition (archetype badge + radar), PNG export, Web Share API + fallbacks |
| `src/features/results/ConfettiTrigger.tsx` | Create | Wrapper around `canvas-confetti` with `prefers-reduced-motion` guard |
| `src/app/resultados/page.tsx` | Modify | Delegate to `ResultsPage`; keep sessionStorage loading logic |
| `src/components/results/*.tsx` | Delete | Old result components (6 files) — replaced by feature-slice versions |
| `src/features/shared/ui/NeonButton.tsx` | Create | Reusable neon CTA with press micro-animation |
| `src/features/shared/ui/AnimatedCard.tsx` | Create | Card with entrance animation, hover lift, `will-change` |
| `src/features/shared/ui/ReducedMotionWrapper.tsx` | Create | Conditionally renders children only if motion allowed |
| `src/features/shared/hooks/useReducedMotion.ts` | Create | `matchMedia('(prefers-reduced-motion: reduce)')` hook |
| `src/features/shared/hooks/useShareCard.ts` | Create | Generates SVG, exports PNG, invokes Web Share / download / clipboard |
| `src/features/shared/hooks/useScrollReveal.ts` | Create | IntersectionObserver hook for landing animations |
| `src/lib/share-card/generate.ts` | Create | Pure SVG generation (no React) — archetype + radar → SVG string |
| `src/lib/share-card/radar-svg.ts` | Create | SVG radar chart drawing (no Recharts dependency) |
| `vitest.config.ts` | Modify | Add `environment: 'jsdom'` for component tests, `setupFiles` |
| `src/test/setup.ts` | Create | Vitest setup: `@testing-library/jest-dom`, `vi.mock` for `next/navigation` |

---

## Interfaces / Contracts

### Share Card Generation

```typescript
// src/lib/share-card/generate.ts
export interface ShareCardData {
  archetype: {
    id: string;
    name: string;
    emoji: string;          // e.g. "🏗️"
    color: string;          // neon hex for accent
  };
  riasecProfile: RIASECProfile;  // 6 values 0-1
  studentName?: string;          // optional, for personalization
}

export function generateShareCardSVG(data: ShareCardData): string {
  // Returns complete SVG string (1200x630px, Instagram story ratio)
  // Composed of: dark bg, neon grid, archetype badge (emoji + name), radar chart, brand logo
}

export function svgToPngBlob(svg: string): Promise<Blob> {
  // Creates offscreen canvas, draws SVG via ImageBitmap, returns PNG blob
}
```

### Share Hook

```typescript
// src/features/shared/hooks/useShareCard.ts
export interface ShareOptions {
  data: ShareCardData;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useShareCard(): (options: ShareOptions) => Promise<void> {
  // 1. Generate SVG → PNG blob
  // 2. Try navigator.share({ files: [pngFile] })
  // 3. Fallback: download PNG (anchor.click)
  // 4. Fallback: navigator.clipboard.write([pngItem])
}
```

### Reduced Motion Hook

```typescript
// src/features/shared/hooks/useReducedMotion.ts
export function useReducedMotion(): boolean {
  // Returns true if user prefers reduced motion
  // Updates on media query change
}
```

### Gamified Progress

```typescript
// src/features/wizard/GamifiedProgress.tsx
interface GamifiedProgressProps {
  currentStep: number;      // 1-25
  totalSteps: number;       // 25
  currentLayer: 1 | 2 | 3 | 4;
  onSegmentComplete?: (step: number) => void;  // triggers neon pulse
}
```

---

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| **Unit** | `generateShareCardSVG`, `svgToPngBlob`, `radar-svg` | Pure function tests with snapshot SVG output; test PNG blob validity |
| **Unit** | `useReducedMotion`, `useShareCard`, `useScrollReveal` | Render hook tests with `act()`; mock `matchMedia`, `navigator.share`, `IntersectionObserver` |
| **Unit** | `NeonButton`, `AnimatedCard`, `GamifiedProgress` | Component tests: render, interactions, `prefers-reduced-motion` classes |
| **Integration** | `QuestionCard` selection → progress update → layer transition | Test wizard flow with mocked store; verify animation classes applied |
| **Integration** | `ResultsPage` → `ShareCard` generation → Web Share / download | Mock sessionStorage data; test share button click → blob creation → fallback chain |
| **E2E** | Landing → Wizard → Results → Share | Playwright: full flow, verify dark theme, animations suppressed in reduced-motion mode |
| **Regression** | Scoring engine unchanged | Existing `src/lib/__tests__/*.test.ts` must pass without modification |

**TDD Order per Slice**:
1. **Landing**: `generateShareCardSVG` tests → `Hero` tests → `NarrativeSection` tests → `LandingPage` integration
2. **Wizard**: `GamifiedProgress` tests → `QuestionCard` tests → `LayerTransition` tests → `TestWizard` integration
3. **Results**: `radar-svg` tests → `ShareCard` tests → each result component → `ResultsPage` integration

---

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary changes. This is a pure UI redesign.

---

## Migration / Rollout

No data migration required. Feature flag not needed — iterative PRs replace screens one at a time:

1. **PR #1 (Landing)**: `src/app/page.tsx` → `LandingPage`; old sections removed. Dark theme activates globally via CSS vars.
2. **PR #2 (Wizard)**: `TestWizard` + `QuestionCard` replaced; progress bar + transitions added.
3. **PR #3 (Results)**: All 6 result components replaced; `ShareCard` + `ConfettiTrigger` added.

Each PR is independently revertible. Scoring engine untouched throughout.

---

## Open Questions

- [x] **Final neon palette values** — **RESOLVED**: `--color-neon-primary: #D51933`, `--color-neon-secondary: #0033A5` (brand combination). Green/cyan/violet demoted to optional tertiary accents.
- [ ] Whether archetype emojis are fixed or configurable — current `ArchetypeIcon` uses SVG, share card needs emoji fallback
- [ ] Share card dimensions: 1200x630 (IG story) vs 1080x1080 (IG post) — propose 1200x630 as primary
- [ ] Audio toggle behavior in new dark theme — current audio buttons use light-theme colors; needs neon restyle

---

## Key Learnings

1. Share card generation via native SVG avoids heavy DOM-to-canvas libraries and keeps bundle size under control.
2. Iterative slice delivery (Landing → Wizard → Results) allows independent review and rollback without scoring engine risk.
3. `prefers-reduced-motion` must be checked at animation trigger points, not just component mount, to handle dynamic changes.
4. Tailwind 4's `@theme` with CSS variables enables a zero-runtime theme switch — critical for dark-native canvas.
5. Existing `IntersectionObserver` scroll-reveal pattern on landing extends naturally to narrative sections.