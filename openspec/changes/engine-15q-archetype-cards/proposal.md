# Proposal: Motor 15Q + Tarjetas de Arquetipo

## Intent

El motor evalúa con 25 preguntas en 4 capas, con MODALIDAD como capa 4. El usuario eliminó MODALIDAD: el test pasa a 15 preguntas en 3 capas y "Dual" se redefine como RIASEC + 8 arquetipos. Las 8 tarjetas PNG (derechos confirmados) pasan a ser la identidad visual: front-and-center en resultados, 4 curadas en landing + 4 teaser. El diseño table-driven elimina los 16 hardcouplings al conteo. Las 5 specs activas se reescriben como deltas. El motor de scoring se AFINA para la nueva distribución (retune de epsilon y recalibración de pesos con evidencia, no solo repartición mecánica de preguntas). El diseño frontend YA ESTÁ maquetado en Stitch ("TuFuturoDual: Gamified Vocational Test", 18 screens + DESIGN.md) y es la fuente de verdad visual; Impeccable (DESIGN.md, .impeccable/design.json, tokens, craft-floor) se usa para implementar y refinar ese diseño, no para diseñar de nuevo.

## Current State Gap

- 25Q/4 capas (12+5+5+3); L4 modalidad activa.
- 16 acoplamientos: TOTAL_STEPS=25, LAYER_BOUNDARIES/SEGMENTS, getLayerForPosition/Segment, isFirstStepOfLayer, IDs límite, detectOldFormat, literales Q23-Q25/Q18-Q22 en modality.ts.
- Arquetipos emoji-only; PNGs fuera del repo.
- Specs hardcodean "25", "12 L1", "emoji único".

## Scope

### In Scope
- Banco 15Q/3 capas, distribución 6-4-5 (1/dim RIASEC, 4 aptitudes 1/slot, 5 valores).
- **Afinamiento del motor**: retune de `NEAR_TIE_EPSILON` y recalibración de pesos RIASEC/aptitud para 1Q/dim; decisión de diseño con evidencia (no repartición mecánica).
- Eliminar L4: modality.ts, spec modality-recommendation, paso de modalidad en pipeline.
- Table-driven TOTAL_STEPS/LAYER_BOUNDARIES/LAYER_SEGMENTS desde buckets del banco.
- Assets: public/archetypes/{id}.png (slug por ID), campo image en Archetype/ARCHETYPES, next/image.
- UI: tarjeta del usuario en hero de resultados; landing 4 PNG + 4 teaser; share card PNG.
- **Coordinación Impeccable**: el diseño visual YA está maquetado en Stitch (proyecto "TuFuturoDual: Gamified Vocational Test", 18 screens + DESIGN.md) y es la fuente de verdad; Impeccable implementa/refina sobre ese diseño usando DESIGN.md, tokens y .impeccable/design.json; actualizar design.json si los nuevos componentes/tokens lo requieren.
- Identidad "Dual" = RIASEC + arquetipos (copy, README, labels).
- Deltas: question-bank, riasec-scoring, archetype-system, results-display; REMOVER modality-recommendation.

### Out of Scope
- Mocks .impeccable/ (perdidos); flujo lead/admin de tu-futuro-dual; copiar PNGs / editar src/lib (apply).

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `question-bank`: 15Q/3 capas, 6-4-5, sin L4.
- `riasec-scoring`: ≥1 pregunta/dimensión; retune de epsilon en design.
- `archetype-system`: campo image, 8 PNG slug-by-id, mapeo dominant+secondary intacto.
- `results-display`: tarjeta PNG front-and-center, share PNG, showcase landing 4+4.

### Removed Capabilities
- `modality-recommendation`: L4 eliminada del producto.

## Approach

1. Banco 15Q en 3 capas; eliminar Q23-Q25.
2. Borrar modality.ts; pipeline sin paso de modalidad; wizard a 3 capas.
3. **Afinar el motor**: retune de epsilon y pesos con evidencia (simulaciones/ejemplos reales), manteniendo ≥1Q/dim y discriminación de arquetipos.
4. TOTAL_STEPS/LAYER_BOUNDARIES/LAYER_SEGMENTS derivados de buckets → 16 acoplamientos muertos.
5. public/archetypes/{id}.png slug por ID (El-visionario_2.png→visionario); image en Archetype; next/image.
6. Resultados: tarjeta PNG en hero; landing 4 curadas + 4 teaser; share PNG baked.
7. "Dual" = RIASEC + 8 arquetipos.
8. Deltas de 5 specs.
9. **Impeccable**: implementar/refinar sobre el diseño de Stitch (fuente de verdad) — aplicar shape/extract/craft-floor sobre tarjetas, landing y resultados; mantener coherencia con DESIGN.md y design.json.

## Alternatives Considered

8-3-2-2 (L2/L3 cortos) y 7-4-3-1 (colapsaba L4, ya eliminada) descartadas. 6-4-5 maximiza L2+L3 pero sacrifica redundancia L1 (12→6) — riesgo clave a resolver en design.

## Affected Areas

| Area | Impact | Desc |
|------|--------|------|
| src/lib/questions/question-bank.ts | Modified | 25→15, 3 capas |
| src/lib/scoring/{modality.ts, pipeline.ts} | Removed/Modified | L4 fuera, sin modalidad |
| src/stores/test-store.ts | Modified | Table-driven |
| src/features/wizard/* | Modified | Segmentos derivados, sin L4 |
| src/features/results/* | Modified | PNG front-and-center |
| src/features/landing/LandingPage.tsx | Modified | 4 PNG + 4 teaser |
| src/lib/scoring/archetypes.ts | Modified | image + slug-by-id |
| public/archetypes/ | New | 8 PNG |
| openspec/specs/* (5) | Modified/Removed | Deltas |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| 1Q/dim vs NEAR_TIE_EPSILON=0.05 → cosine-fallback constante, arquetipos planos | High | **Afinar el motor**: retune ε a 0.07-0.10 con evidencia; validar discriminación con casos reales antes de aplicar |
| "Dual" = RIASEC+modalidad en copy/README/labels | Med | Sync producto; flag en aceptación de specs |
| ~9 MB PNG en LCP | Med | Hero ≤200 KB + next/image responsive |
| Filenames divergen (El-constructor→realizador, _2) | Med | Slug desde ID, guard en archetypes.ts |
| Deltas resucitan archive 2026-08-14 | Low | Congelado; deltas solo sobre specs activas |
| Impeccable inconsistente (tokens/design.json desactualizados) | Med | Design.json y DESIGN.md se actualizan en este cambio; verificación en apply/verify |

## Rollback Plan

git revert por área (banco, motor, UI, assets). modality.ts/L4 restauran desde git; archive congelado intacto. Sin migraciones de datos.

## Dependencies

- Ninguna de cambios activos (visual-redesign-gamification paralelo; tu-futuro-dual archivable, fuera de scope).

## Success Criteria

- [ ] 15Q en 3 capas; TOTAL_STEPS derivado del banco, cero hardcodes (16 acoplamientos eliminados, verificado por grep).
- [ ] **Motor afinado**: NEAR_TIE_EPSILON retuneado con evidencia (simulaciones o casos reales); tasa de cosine-fallback < 5% en muestra; discriminación de arquetipos verificada con casos representativos.
- [ ] modality.ts y spec eliminados; copy "Dual" = RIASEC + arquetipos en UI, README y labels.
- [ ] 8 PNG slug-by-id en public/archetypes/; resultados con tarjeta front-and-center; hero ≤200 KB.
- [ ] Landing 4 PNG + 4 teaser; share card PNG.
- [ ] DESIGN.md / .impeccable/design.json coherentes con la UI final (tokens, componentes nuevos de tarjeta/landing).
- [ ] vitest + tsc --noEmit verdes.