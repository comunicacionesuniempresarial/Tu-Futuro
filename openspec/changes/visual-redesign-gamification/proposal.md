# Proposal: Visual Redesign Gamification

## Intent

El test vocacional se siente largo, estático y corporativo. Feedback directo de usuarios (incluido el jefe del equipo): no se conecta, no genera ganas de compartir, la landing repite las mismas 4 stats (25/4/8/12) en 6 secciones. Este cambio rediseña las 3 pantallas principales (landing, wizard, resultados) con gamificación, motion y share cards, para que la experiencia se sienta como un juego interactivo y los resultados se puedan compartir en stories/feed.

## Scope

### In Scope
- **Wizard gamificado**: AnswerStamp (spring/glow al seleccionar), DimTicker (mini-barras RIASEC en vivo), JourneyBar (mapa trail por capas), Streak (100% visual), LayerUnlock (confetti + ring + resumen en transiciones de capa)
- **Resultados compartibles**: ResultShareCard (9:16 stories / 4:5 feed), radar SVG custom (Recharts no serializable), exportación PNG vía html-to-image (pixelRatio 2-3), Web Share API con fallback download
- **Landing de-duplicada**: 6→3 secciones (Hero con stats inline, "Cómo funciona" absorbiendo features/programs, Archetypes + CTA), eliminar repetición de "25/4/8/12"
- **Scoring helpers**: extraer helpers parciales del pipeline como single source of truth + tests de equivalencia (sin tocar pipeline.ts)
- **Librerías nuevas**: motion (React 19 compatible), html-to-image

### Out of Scope
- Cambios al motor de scoring (`pipeline.ts`), Zustand store, o Supabase backend
- Nuevas dimensiones psicométricas o cambios al algoritmo RIASEC
- App móvil nativa, soporte multi-idioma
- Dark mode toggle (el dark mode nativo ya es el canvas)

## Capabilities

### New Capabilities
- `gamified-wizard`: Wizard con micro-interacciones (AnswerStamp, DimTicker, JourneyBar), transiciones animadas (LayerUnlock) y feedback visual en cada respuesta
- `share-cards`: Generación de share cards (ResultShareCard 9:16/4:5), radar SVG custom, exportación PNG vía html-to-image, Web Share API con fallback

### Modified Capabilities
- `results-display`: Presentación compartible — ArchetypeCard, RadarChart (SVG custom), ModalityCard, ProgramCard, GapAnalysis, RankingFull con polish visual
- `landing-page`: Reducción 6→3 secciones, Hero con stats inline, scroll narrativo, eliminación de redundancia

## Approach

5 slices con TDD estricto (Vitest):

| Slice | Deliverable | Test-first |
|-------|-------------|------------|
| **0** | Scoring helpers + tests de equivalencia | Helpers extraídos, tests prueban equivalencia con pesos del pipeline |
| **1** | Landing de-duplicada | Tests de renderizado de secciones, ausencia de stats repetidos |
| **2** | Wizard micro-interactions | Tests de AnswerStamp, DimTicker, JourneyBar (render + eventos) |
| **3** | Transitions/celebrations | Tests de LayerUnlock, confetti, animaciones (mock de motion) |
| **4** | Share card + export | Tests de ResultShareCard, generación PNG, Web Share API (mock) |

**Orden de ejecución**: 0 → 1 → 2 → 3 → 4. Cada slice es mergeable independientemente.

**Librerías**: `motion` (Framer Motion v12+, React 19 compatible), `html-to-image` (html-to-image v2). Ambas evaluar bundle size antes de merge.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/scoring/` | Modified | Helpers parciales extraídos como single source of truth |
| `src/app/page.tsx` | Modified | Landing rediseñada 3 secciones |
| `src/components/test/TestWizard.tsx` | Modified | Transiciones, JourneyBar, LayerUnlock |
| `src/components/test/QuestionCard.tsx` | Modified | AnswerStamp, feedback visual |
| `src/components/test/ProgressBar.tsx` | Modified | Reemplazado por JourneyBar |
| `src/app/resultados/page.tsx` | Modified | Polish visual + share card |
| `src/components/results/*` | Modified | ArchetypeCard, RadarChart (SVG custom), ModalityCard, ProgramCard, GapAnalysis, RankingFull |
| `src/components/results/ResultShareCard.tsx` | New | Share card 9:16/4:5 con html-to-image |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Score duplication (helpers vs pipeline) | Med | Tests de equivalencia en slice 0, single source of truth |
| Animation perf en Android viejo | Med | transform/opacity only, `prefers-reduced-motion`, `will-change` |
| Web Share API ausente en desktop | Med | Feature-detect → fallback download PNG |
| html-to-image falla con gradients/backdrop-blur | Med | Colores flat, client-only rendering, test de exportación |
| Bundle size motion + html-to-image | Bajo | Evaluar antes de merge, lazy-load si necesario |
| Recharts ResponsiveContainer no serializable | Bajo | Radar SVG custom, no depender de Recharts para export |

## Rollback Plan

Cambios UI-only, sin migraciones de datos. Cada slice es un commit separado y revertible. Motor de scoring y Supabase intactos. Revert = `git revert` del commit del slice.

## Dependencies

- `motion` (npm: motion, v12+ — React 19 compatible)
- `html-to-image` (npm: html-to-image, v2)
- Tailwind 4, Recharts, canvas-confetti (ya en proyecto)
- Vitest (ya en proyecto, strict TDD activo)

## Success Criteria

- [ ] Landing: 3 secciones, sin stats repetidas, scroll narrativo
- [ ] Wizard: AnswerStamp, DimTicker, JourneyBar funcionando
- [ ] Transiciones: LayerUnlock con confetti al completar capa
- [ ] Results: ResultShareCard exportable (PNG) y compartible (Web Share)
- [ ] `prefers-reduced-motion` respetado en todas las animaciones
- [ ] Scoring helpers extraídos con tests de equivalencia pasando
- [ ] `npx vitest run` sin fallos, `tsc --noEmit` sin errores
