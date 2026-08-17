# Share Cards Specification

## Purpose
Generate Instagram-style shareable ResultShareCards (archemester + custom SVG radar + top-3 programs) and export/share them. UI-only; consumes display data only.

## Requirements

### Requirement: REQ-SHARE-01 Layouts (9:16 stories / 4:5 feed)
The ResultShareCard SHALL support two aspect-ratio layouts: `stories` (9:16) and `feed` (4:5), selectable via prop. (Priority: must)

- **SC-SHARE-01-A** — GIVEN layout="stories" / WHEN the card renders / THEN the root container has a 9:16 aspect ratio
- **SC-SHARE-01-B** — GIVEN layout="feed" / WHEN the card renders / THEN the root container has a 4:5 aspect ratio

### Requirement: REQ-SHARE-02 Brand gradient via flat colors
The card background SHALL use the brand gradient composed of FLAT solid colors (no CSS `gradient`, no `backdrop-filter`) to guarantee html-to-image fidelity. (Priority: must)

- **SC-SHARE-02-A** — GIVEN the card renders / WHEN styles are inspected / THEN the background uses solid color stops and no `backdrop-filter` is applied

### Requirement: REQ-SHARE-03 Archetype name + icon
The card SHALL display the archetype emoji/icon and name. (Priority: must)

- **SC-SHARE-03-A** — GIVEN archetype "El Constructor" with emoji ⚙️ / WHEN the card renders / THEN both the emoji and the name are visible

### Requirement: REQ-SHARE-04 Top-3 programs
The card SHALL list the student's top-3 programs by compatibility. (Priority: must)

- **SC-SHARE-04-A** — GIVEN top programs [Software, Negocios, Marketing] / WHEN the card renders / THEN all three program names appear in order

### Requirement: REQ-SHARE-05 Custom SVG radar (no Recharts)
The card SHALL render a hand-built SVG radar of the 6 RIASEC dimensions. It MUST NOT use Recharts. (Priority: must)

- **SC-SHARE-05-A** — GIVEN a riasecProfile of 6 values / WHEN the card renders / THEN an `<svg>` with 6 axis spokes and a filled polygon is present and no Recharts `ResponsiveContainer` exists

### Requirement: REQ-SHARE-06 PNG export (html-to-image, pixelRatio 2-3)
The card SHALL export as PNG via `html-to-image`'s `toPng` with `pixelRatio` between 2 and 3. (Priority: must)

- **SC-SHARE-06-A** — GIVEN an export is triggered / WHEN `toPng` is invoked / THEN it is called with `pixelRatio` in the range [2, 3]

### Requirement: REQ-SHARE-07 Web Share API + download fallback
The card SHALL feature-detect `navigator.share` (with file support). If unsupported, it SHALL fall back to PNG download via the exported blob. (Priority: must)

- **SC-SHARE-07-A** — GIVEN `navigator.share` is undefined / WHEN the user shares / THEN a PNG download is triggered and `navigator.share` is not called
- **SC-SHARE-07-B** — GIVEN `navigator.share` is defined / WHEN the user shares / THEN `navigator.share` is called with a File of the card image

### Requirement: REQ-SHARE-08 Client-only rendering
Card generation (html-to-image) SHALL run client-side only, never during SSR. (Priority: must)

- **SC-SHARE-08-A** — GIVEN the component mounts on the server / WHEN SSR occurs / THEN no `html-to-image` call happens; export is only available after client mount

### Requirement: REQ-SHARE-09 No scoring/backend coupling
Share-card generation SHALL consume only display data (archetype, riasecProfile, top programs). It MUST NOT invoke the scoring pipeline or write Supabase. (Priority: must)

- **SC-SHARE-09-A** — GIVEN export runs / WHEN data is read / THEN no scoring pipeline call and no Supabase write occur

## Acceptance Criteria
1. Stories (9:16) and feed (4:5) layouts both render.
2. Brand gradient uses flat colors; no backdrop-filter.
3. Archetype emoji + name and top-3 programs shown.
4. Radar is custom SVG (no Recharts).
5. PNG export uses html-to-image pixelRatio 2-3.
6. Web Share used when available; PNG download fallback otherwise.
7. Generation is client-only.
8. No scoring/backend coupling.
