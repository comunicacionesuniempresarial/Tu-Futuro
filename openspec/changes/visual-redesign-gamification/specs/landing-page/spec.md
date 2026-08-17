# Landing Page Specification

## Purpose
Redesigned entry screen: 6→3 sections (Hero with inline stats, "Cómo funciona" absorbing features/programs, Archetypes + CTA), narrative scroll, no stat repetition. UI-only. (No prior main spec exists; authored as a new full spec under this change.)

## Requirements

### Requirement: REQ-LANDING-01 Section reduction 6→3
The landing SHALL render exactly 3 top-level sections: Hero, "Cómo funciona", and Archetypes + CTA. Former features and programs sections MUST be merged into "Cómo funciona". (Priority: must)

- **SC-LANDING-01-A** — GIVEN the redesigned landing / WHEN it renders / THEN exactly 3 `<section>` landmarks exist
- **SC-LANDING-01-B** — GIVEN "Cómo funciona" renders / WHEN audited / THEN former features and programs content is present within it

### Requirement: REQ-LANDING-02 Hero inline stats
The Hero SHALL display the key statistics inline within the hero block, not as a separate repeated section. (Priority: must)

- **SC-LANDING-02-A** — GIVEN the landing loads / WHEN the hero renders / THEN the key stats are present inside the hero

### Requirement: REQ-LANDING-03 No stat redundancy
The four stats (25/4/8/12) MUST each appear at most once across the page; no section repeats them. (Priority: must)

- **SC-LANDING-03-A** — GIVEN the full landing document / WHEN the stat values are queried / THEN each of the four values appears exactly once

### Requirement: REQ-LANDING-04 Narrative scroll
The landing SHALL reveal sections progressively on scroll (narrative), not all above the fold. (Priority: should)

- **SC-LANDING-04-A** — GIVEN the page mounts / WHEN above-the-fold is measured / THEN only the hero is fully visible
- **SC-LANDING-04-B** — GIVEN scroll occurs / WHEN a section enters view / THEN it animates in via IntersectionObserver

### Requirement: REQ-LANDING-05 Archetypes + CTA
The landing SHALL include an Archetypes showcase and a final CTA button to start the test. (Priority: must)

- **SC-LANDING-05-A** — GIVEN the Archetypes + CTA section / WHEN it renders / THEN archetype items and a CTA button are present

### Requirement: REQ-LANDING-06 Dark / neon + reduced motion
The landing SHALL use the dark native canvas, neon accents, and bold typography. Animations MUST be transform/opacity only and honor `prefers-reduced-motion`. (Priority: must)

- **SC-LANDING-06-A** — GIVEN reduced motion / WHEN the landing renders / THEN scroll/entrance animations are suppressed and no layout shift occurs

### Requirement: REQ-LANDING-07 No backend coupling
The landing SHALL be UI-only: no Zustand store scoring, no scoring pipeline, no Supabase calls. (Priority: must)

- **SC-LANDING-07-A** — GIVEN the landing mounts / WHEN it renders / THEN no scoring pipeline or Supabase call occurs

## Acceptance Criteria
1. Exactly 3 sections (Hero, Cómo funciona, Archetypes + CTA).
2. Stats inline in hero; no stat repeats.
3. Narrative scroll reveal on scroll.
4. Archetypes showcase + CTA present.
5. Dark/neon, bold type, reduced-motion safe.
6. UI-only; no backend coupling.
