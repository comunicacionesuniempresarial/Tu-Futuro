# Results Display — Delta Spec

Delta for `results-display` (modified). Replaces the radar library with a custom SVG and adds visual polish, share-card integration, and confetti on reveal. Existing requirements (Fit Breakdown, Modality Card, Gap Analysis, Archetype Card Redesign, Program Card Enhancement, Responsive Design, Data Flow) remain unchanged unless restated.

## MODIFIED Requirements

### Requirement: Radar Chart — 6 RIASEC Dimensions

The system SHALL display a radar chart (spider chart) showing the student's 6 RIASEC dimensions (R, I, A, S, E, C) using a HAND-BUILT SVG component (no Recharts). Data flows from `riasecProfile[6]` → SVG polygon points → rendered inline SVG. Axes labeled in Spanish. Positioned below the archetype card, above program ranking. The chart MUST show the student profile (filled area) and, on program selection, a dotted program-requirement overlay.

(Previously: rendered via the recharts `RadarChart` component)

#### Scenario: Radar chart renders with 6 axes

- GIVEN a student with RIASEC profile [0.8, 0.6, 0.3, 0.2, 0.4, 0.5]
- WHEN results page loads
- THEN an `<svg>` radar with 6 axes is visible (no Recharts container)
- AND each axis is labeled: Realista, Investigador, Artístico, Social, Emprendedor, Convencional
- AND the filled area covers the student's profile shape

#### Scenario: Radar chart shows program overlay on hover

- GIVEN a student viewing results
- WHEN they hover/click a program card
- THEN the SVG shows the program's requirement vector as a dotted overlay polygon
- AND the student's profile remains visible underneath

## ADDED Requirements

### Requirement: Dark / Neon Visual Polish

All results components (ArchetypeCard, RadarChart, ModalityCard, ProgramCard, GapAnalysis, RankingFull) SHALL adopt the dark native canvas with neon accents and bold typography. No institutional blue palette remains. (Priority: must)

- **SC-RESULTS-01-A** — GIVEN the results components render / WHEN styles apply / THEN backgrounds are dark with neon highlights and no institutional blue
- **SC-RESULTS-01-B** — GIVEN a component renders / WHEN audited / THEN bold typography is applied to headings

### Requirement: Share Card Integration

The results page SHALL mount the `ResultShareCard` (see `share-cards`) and pass it the archetype, `riasecProfile`, and top-3 programs. The card SHALL support both stories and feed layouts. (Priority: must)

- **SC-RESULTS-02-A** — GIVEN results are displayed / WHEN the page renders / THEN a `ResultShareCard` is present receiving the results data
- **SC-RESULTS-02-B** — GIVEN the user switches layout / WHEN the control changes / THEN the mounted card reflects the selected layout

### Requirement: Confetti Celebration on Reveal

The results page SHALL trigger a confetti celebration exactly once when results are first revealed. It MUST be suppressed under `prefers-reduced-motion`. (Priority: must)

- **SC-RESULTS-03-A** — GIVEN a student reaches the results page / WHEN results finish revealing / THEN confetti plays once
- **SC-RESULTS-03-B** — GIVEN `prefers-reduced-motion: reduce` / WHEN results reveal / THEN no confetti plays

## Acceptance Criteria
1. Radar is custom SVG (6 axes, no Recharts), overlay on selection.
2. All results components use dark/neon polish + bold type.
3. `ResultShareCard` mounted with data, both layouts.
4. Confetti plays once on reveal; suppressed under reduced motion.
5. All previously specified results behavior remains intact.
