# Gamified Wizard Specification

## Purpose
Game-like test wizard: per-answer micro-interactions (AnswerStamp, DimTicker, JourneyBar, Streak), animated layer transitions (LayerUnlock), and directional spring navigation. Consumes answers only; no scoring engine, store, or Supabase changes.

## Requirements

### Requirement: REQ-WIZARD-01 AnswerStamp (spring + glow)
The AnswerStamp component SHALL animate a spring scale-up and a glow pulse when an option is selected. Animation MUST be transform/opacity only and MUST be suppressed under `prefers-reduced-motion`. (Priority: must)

- **SC-WIZARD-01-A** — GIVEN a single-choice question / WHEN the student selects an option / THEN the selected AnswerStamp applies a spring scale and glow class; unselected options do not
- **SC-WIZARD-01-B** — GIVEN `prefers-reduced-motion: reduce` / WHEN an option is selected / THEN no spring/glow animation runs but selection state still applies

### Requirement: REQ-WIZARD-02 DimTicker (live RIASEC 6-dim bars)
The DimTicker SHALL render six live mini-bars for Realista, Investigador, Artístico, Social, Emprendedor, Convencional, derived ONLY from currently selected answers (tallied by each option's RIASEC tag). It SHALL show a growth label for the leading dimension (e.g., "tu perfil Realista crece"). It MUST NOT call the scoring pipeline. (Priority: must)

- **SC-WIZARD-02-A** — GIVEN answers with 2 Realista-tagged and 1 Artístico-tagged selections / WHEN DimTicker renders / THEN the Realista bar is tallest and the label names Realista
- **SC-WIZARD-02-B** — GIVEN no answers selected / WHEN DimTicker renders / THEN all six bars are at zero and no growth label is shown

### Requirement: REQ-WIZARD-03 JourneyBar (layer trail)
The JourneyBar SHALL render a layer-trail of nodes (one per test layer/section) showing current position. The percentage counter MUST become secondary (non-primary) visual. (Priority: must)

- **SC-WIZARD-03-A** — GIVEN 4 layers and current layer 2 / WHEN JourneyBar renders / THEN 4 nodes show, node 2 is highlighted as current, and the % value is present but visually secondary
- **SC-WIZARD-03-B** — GIVEN a completed layer / WHEN JourneyBar renders / THEN that layer's node shows a completed state

### Requirement: REQ-WIZARD-04 Streak (visual)
The wizard SHALL render a 100% visual streak indicator reflecting consecutive answered questions. It MUST NOT persist numeric points to the store/scoring. (Priority: should)

- **SC-WIZARD-04-A** — GIVEN 3 consecutive answered questions / WHEN the streak renders / THEN it shows a streak of 3
- **SC-WIZARD-04-B** — GIVEN a skipped question breaks the streak / WHEN the streak renders / THEN the streak resets to 0

### Requirement: REQ-WIZARD-05 LayerUnlock (confetti + ring + summary)
Upon completing all questions in a layer, the wizard SHALL play a LayerUnlock transition: a confetti burst, a ring animation around the layer badge, and a layer-summary panel describing the layer's dimension. (Priority: must)

- **SC-WIZARD-05-A** — GIVEN the last question of layer 2 is answered / WHEN the layer completes / THEN confetti fires once, a ring element appears, and a layer-summary panel is visible
- **SC-WIZARD-05-B** — GIVEN `prefers-reduced-motion: reduce` / WHEN a layer completes / THEN confetti and ring are suppressed but the summary still shows

### Requirement: REQ-WIZARD-06 Directional spring transitions
Question enter/exit transitions SHALL be directional: advancing uses a forward variant, going back uses a reverse variant, both with spring physics. (Priority: must)

- **SC-WIZARD-06-A** — GIVEN the student advances N→N+1 / WHEN the transition runs / THEN the forward enter/exit variant is used
- **SC-WIZARD-06-B** — GIVEN the student goes back N→N-1 / WHEN the transition runs / THEN the reverse variant is used

### Requirement: REQ-WIZARD-07 Reduced-motion compliance
All wizard animations SHALL be transform/opacity only and MUST honor `prefers-reduced-motion` (no layout shift). (Priority: must)

- **SC-WIZARD-07-A** — GIVEN `prefers-reduced-motion: reduce` / WHEN any wizard animation would run / THEN motion is disabled and content remains correctly laid out

### Requirement: REQ-WIZARD-08 No scoring/store/Supabase coupling
The wizard SHALL record and consume answers only. It MUST NOT modify `runScoringPipeline`, Zustand scoring state, or Supabase. (Priority: must)

- **SC-WIZARD-08-A** — GIVEN an answer is recorded / WHEN state updates / THEN no scoring pipeline call occurs and only UI/answer state changes

## Acceptance Criteria
1. AnswerStamp springs + glows on select; suppressed under reduced motion.
2. DimTicker shows 6 live RIASEC bars from answers; leading dimension labeled.
3. JourneyBar shows layer trail; % is secondary.
4. Streak is visual only (no points persisted).
5. LayerUnlock fires confetti + ring + summary on layer complete.
6. Transitions are directional (forward/back) with spring.
7. `prefers-reduced-motion` honored everywhere.
8. No scoring pipeline / store / Supabase changes.
