# Dirección de Diseño — TuFuturoDual

**Documento de síntesis**: investigación de las mejores páginas web del mundo + mecánicas de juegos + estética cyberpunk, aplicadas a un test vocacional gamificado para jóvenes.

> Estado: propuesta de dirección. Alimenta specs/design del rediseño visual. Las tarjetas están a cargo del equipo de diseño; este documento define el sistema que las contiene.

---

## 1. Resumen ejecutivo (la decisión)

**Una frase:** TuFuturoDual debe sentirse como *descubrir tu clase de personaje en un RPG*, no como llenar un formulario.

**Las 3 decisiones de criterio que derivan de la investigación:**

1. **Dark-first con UN par de acentos neón, no arcoíris.** La investigación (Linear, Vercel, Lusion + criterios de Awwwards/CSSDA) es unánime: *dark con un solo acento saturado se lee premium; arcoíris sobre negro se lee barato*. La referencia del equipo (cian/violeta/magenta/verde/dorado) es el riesgo #1 de "cheap". **Decisión: base violeta-oscura (#1E1826) + cian (#22D3EE) como acento principal de acción + violeta (#8B5CF6) como acento secundario de profundidad.** Verde/dorado/magenta solo como semántica funcional (éxito/premio/aviso), nunca decorativo.
2. **Gamificación como interfaz, no como adorno.** El sistema de juego (XP, streak, badges, niveles) debe estar *integrado en el producto*: el progreso es la barra, la XP es el contador, los logros son las transiciones. No stickers encima de un formulario.
3. **El resultado ES el shareable.** La carta de personaje final no es un informe: es el póster que el estudiante quiere postear. Todo el test construye hacia ese momento (patrón Persona 5: la UI es narrativa, no decoración).

---

## 2. Investigación — Mejores páginas web del mundo (2026)

Fuentes: Awwwards, Godly/recent.design, Brutalist Websites, Land-book, CSS Design Awards, Linear, Stripe, Vercel, Framer, Apple, Lusion.

### Los 15 patrones que definen el diseño world-class hoy

| # | Patrón | Fuente | Aplicación a nosotros |
|---|--------|--------|----------------------|
| 1 | **Hero = el producto real** (no ilustración stock) | Linear, Stripe, Vercel | El hero debe mostrar el TEST real, no una foto genérica de campus |
| 2 | **Scroll-scrubbed storytelling** (el hero "se ensambla" al scrollear) | Apple | La landing puede ensamblar el radar/hexágono del perfil al scrollear |
| 3 | **Bento grids** (cards asimétricas de distintos tamaños) | Stripe, Vercel | Resultados como bento: match fuerte grande, runners-up chicos |
| 4 | **Big display type** como elemento primario de layout | Awwwards, Lusion, Land-book | H1 gigante con gradiente cian→violeta (ya lo tenemos, reforzar) |
| 5 | **Italic serif accent words** dentro de headlines sans | Stripe | Frases con palabra en itálica serif: "Descubre tu *clase*" |
| 6 | **Dark-first con un solo acento saturado** | Linear, Lusion | Base #1E1826 + cian #22D3EE, uno solo como protagonista |
| 7 | **Eyebrow labels** (kicker en small-caps sobre el título) | Linear, Stripe | "CAPA 1 · INTERESES" arriba de cada sección |
| 8 | **Datos reales como decoración** (contadores vivos) | Stripe GDP meter | "23,481 estudiantes ya descubrieron su perfil" |
| 9 | **Micro-interacciones a nivel componente** | recent.design | Cards que tilt/hacen flip en hover; botones con respuesta táctil |
| 10 | **Bordes visibles 1px + raw grids selectivos** | Brutalist, Linear | Bordes nítidos = craft; no sombras por todos lados |
| 11 | **Logo marquee como prueba social** | Stripe, Linear, Vercel | "Empresas que confían en el Modelo Dual" |
| 12 | **Secciones numeradas estilo figura** | Linear ("FIG 0.2") | "FASE 01 — DESCUBRE" como framing técnico-cool |
| 13 | **Tags/taxonomía en cards** | Lusion | Chips en resultados: "técnica • social • creativa" |
| 14 | **Light/dark toggle visible en el diseño** | Vercel | Tema oscuro flagship + light mode limpio |
| 15 | **Restraint in motion** — una animación firma por sección | Apple, Linear | Un solo momento "wow" por pantalla; el resto sutil |

### Premium vs barato (técnicas concretas)

- **Premium:** 1 acento, grilla 8pt, contenido real en mockups, motion con easing y propósito, detalle 1px, jerarquía tipográfica (eyebrow → display → body).
- **Barato:** gradiente en todo, sombras como muleta, carouseles autoplay, ilustraciones clip-art, neón sobre negro sin anclaje neutro, "wow" CSS que rompe legibilidad.

---

## 3. Investigación — Mecánicas de juegos

Fuentes: GDC (Game Developer archives), Duolingo case study, Persona 5 UI teardown, The Walking Dead (Telltale), flow theory.

### Los primeros 5 minutos (hook)

- **Cold-open**: primera respuesta en menos de 10 segundos. Sin login, sin explicación larga, sin muro. (Los mejores juegos te tiran al core loop.)
- **Aprender haciendo**: no hay fase de "explicación" separada; la mecánica se enseña usándola.
- **Agencia inmediata**: la primera acción debe sentirse bien YA. Velocidad de respuesta = jugosidad.

### Juice & feedback — 10 técnicas concretas

1. Partículas como celebración (burst al recompensar)
2. Pop-animation del score (el número escala antes de asentarse)
3. Ratings animados ("¡Buen/Genial/Perfecto!") desde escala 0
4. **Easing, no lerping** — aceleración/desaceleración da peso (linear = muerto)
5. Screen shake (Vlambeer es canónico — usar con mucha moderación)
6. Idle motion — algo siempre se mueve (partículas, glow respirando)
7. Sparkle-burst al desaparecer (las monedas de Mario)
8. Secondary actions — una acción primaria encadena efectos chicos
9. Ilusión de responsividad — para animación lenta, posar primero (Bloodborne)
10. Jerarquía visual — importante = grande, alto contraste, animado

### Progresión & recompensas (psicología)

- **Compulsion loop = Anticipación → Actividad → Recompensa.** La dopamina se dispara en la *anticipación*, no en la recompensa. El trigger importa más que el premio.
- **Streaks = aversión a la pérdida** (Duolingo: los streak freezes suben el streak promedio 48% — 17.19 vs 11.62 días).
- **Logros en el día 1** retienen +13% (33.4% vs 20.4%).
- **Extrínseco vs intrínseco:** los logros pueden robar motivación intrínseca (efecto over-justification). Extrínseco está bien cuando la actividad es aburrida por sí sola — nuestro caso.
- **Ligas con promoción Y descenso** — la amenaza de descenso engancha más que la esperanza de promoción.
- **Mecánicas en capas** — distintas mecánicas retienen a usuarios de día 1 vs de mes 6.

### Narrativa de elección (Telltale)

- **No hay opción "buena"**: dilemas reales empoderan más que rankings bueno/malo.
- **Columna narrativa + ramas plausibles**: no simulamos el mundo; escribimos la columna y dejamos explorar lo plausible.
- **Las elecciones chicas importan más** que las grandes: la intimidad gana a la magnitud.
- **Hacer sentir el peso**: notificaciones de elección, UI que señala "esto importa".

### Duolingo — lo que hace bien

XP como moneda común (todo alimenta todo); recompensa entregada *antes* de cerrar la pantalla; metas diarias personales; logros del día 1; ligas con descenso; streaks con amigos (responsabilidad mutua); mecánicas en capas.

### Persona 5 — la lección de identidad visual

**La UI expresa el tema** (rebeldía, romper reglas) en vez de decorarlo: paletas alto contraste, formas irregulares, alineación asimétrica, íconos silueteados. Los menús son "calling cards"; las máscaras se pelan para revelar la verdad.
**Para nosotros:** el lenguaje visual debe expresar *descubrimiento de identidad* — el test no es un formulario, es una revelación. Cada capa completada "pelá" una capa más del perfil.

---

## 4. Estética Cyberpunk (wiki) — el porqué temático

- **High tech, low life**: la identidad es el tema central (¿qué queda del yo cuando la tecnología amplifica todo?). **Nuestro test ES sobre identidad** — el encaje es conceptual, no solo estético.
- Neon-lit cityscapes, densidad, contraste duro.
- Anti-autoritarismo DIY: el estudiante "hackea" su propio futuro — la narrativa del test debe empoderarlo como protagonista que descubre, no como sujeto evaluado.

**Traducción a producto:** el test es un "scanner de identidad" — el estudiante es el héroe que recorre un mapa de 4 capas y al final recibe su "clase vocacional" (arquetipo). No es un examen; es un viaje de autodescubrimiento.

---

## 5. Sistema de diseño propuesto

### 5.1 Paleta (decisión)

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg-base` | `#1E1826` | Fondo principal (violeta-oscuro, de la referencia) |
| `--bg-surface` | `#241D2E` / `#2A2235` | Cards y superficies |
| `--bg-deep` | `#120E1A` | Profundidad/overlays |
| `--neon-primary` | `#22D3EE` (cian) | **ÚNICO protagonista**: acciones, progreso, hover, focus |
| `--neon-secondary` | `#8B5CF6` (violeta) | Profundidad, gradientes, decorativo |
| `--text-primary` | `#F5F3FF` | Texto principal |
| `--text-secondary` | `#9CA3AF` | Texto secundario |
| `--success` | `#4ADE80` | Semántico: acierto, logro |
| `--warning` | `#FBBF24` | Semántico: aviso |
| `--danger` | `#F87171` | Semántico: error |
| Marca | `#D51933` / `#0033A5` | Solo identidad institucional (logo, footer, CTA final de contacto) |

**Regla dura:** los neones cian/violeta son los únicos decorativos. Verde/dorado/magenta solo semántica. Marca rojo/azul solo institucional. Esto evita el arcoíris-barato y conserva la identidad Uniempresarial.

### 5.2 Tipografía

- **Display:** Sora / Space Grotesk (ya en uso), extrabold, tracking-tight. H1 gigante con gradiente cian→violeta. Palabra en **itálica serif** (ej. "tu *clase*") como acento editorial (patrón Stripe).
- **Body:** Inter, 16-18px, gris claro `#9CA3AF` sobre oscuro.
- **Eyebrow labels:** small-caps, tracking-widest, cian, tamaño 12px — arriba de cada sección ("CAPA 01 · INTERESES").
- **Números grandes:** 01-04 en display gigante con color apagado (patrón numeración + figuras).

### 5.3 Layout

- **Grilla 8pt** en todo el sistema (padding, gaps, radii múltiplos de 8; radios ~12-16px).
- **Hero:** asimétrico (texto izq + visual centro-der) con el PRODUCTO real (el test corriendo) como protagonista — no stock.
- **Secciones con numeración de fase** ("FASE 01 — DESCUBRE" ... "FASE 04 — COMPARTE").
- **Bento grid** en resultados: card grande (arquetipo) + cards chicas (programas, modalidad, radar) con tags.
- **Bordes visibles 1px** (borde nítido cian/violeta al 15-20%) como señal de craft — sombras solo en momentos de elevación (hover de card).

### 5.4 Motion (sistema)

- **1 animación firma por pantalla** (restraint). La firma del wizard: el **salto de la barra de progreso** + burst de partículas al responder. La firma de resultados: el **ensamblaje del hexágono**.
- **Easing universal:** cubic-bezier(0.22, 1, 0.36, 1) (ease-out expo) para entradas; ease-in-out para estados. Nunca linear.
- **Idle motion:** glow respirando en el acento activo, partículas sutiles de fondo (starfield violeta).
- **prefers-reduced-motion** obligatorio (ya implementado).
- **Todo transform/opacity** (perf Android gama media).

### 5.5 Micro-interacciones (nivel componente)

| Componente | Interacción |
|------------|-------------|
| Option card | Tilt/hover lift + borde cian al hover; al seleccionar: pop + burst + check |
| Botón CTA | Press scale 0.97 + glow; gradiente cian→violeta en hover (NO en reposo) |
| Barra de progreso | Salto animado al avanzar + shimmer en milestone |
| Transición de capa | "Capa completada" con badge burst + chime + sparkle (1 por capa) |
| Share card | Botón con micro-pulse + confirmación "¡Listo para postear!" |
| Radar final | Hexágono que se ensambla (puntos aparecen en secuencia) |

### 5.6 Sistema de juego (mecánicas priorizadas)

Basado en las 15 mecánicas de la investigación, priorizadas por impacto/costo:

**Core loop (implementar primero):**
1. **Cold-open**: primera pregunta en <10s (ya casi: el disclaimer es la única barrera — acortarlo o hacerlo parte de la narrativa)
2. **Framing narrativo**: intro de 3s "Vas a descubrir tu clase vocacional" estilo calling card
3. **Answer juice**: selección con burst + easing + sonido corto (Web Audio)
4. **XP inmediata**: cada respuesta suma XP con pop-animation del contador
5. **Barra anticipatoria**: siempre visible, con hitos animados (ya tenemos GamifiedProgress — sumar shimmer/hitos)

**Pacing:**
6. **Capas = niveles**: 4 capas, cada una con momento de unlock (badge + chime + sparkle) — reemplaza la LayerTransition actual
7. **Breather beat**: 2s de respiro entre capas (ya existe la transición — pulirla)
8. **Dilemas reales**: reescribir preguntas como "no good choice" (ya el question bank está en tono casual — profundizar)

**Variedad:**
9. **Recompensa variable**: ~1 de cada 4 preguntas termina con una "career insight" oculta (card sorpresa)
10. **Badges de una sesión**: "Decisivo" (5 respuestas <15s), "Explorador" (perfil balanceado), "Especialista" (letra dominante)

**Payoff (resultados):**
11. **Persona reveal**: secuencia de unlock — countdown → hexágono se ensambla → arquetipo nombrado ("El Constructor")
12. **Share card**: carta con hexágono, fortalezas, y CTA "compará con un amigo" (ya existe la ResultShareCard — pulir a bento + tags)

### 5.7 Copy (voz)

- Narrativa de "scanner de identidad / clase vocacional" consistente en todo el test.
- Tono: cálido, directo, rioplatense-friendly pero neutro-profesional (público colombiano).
- Sin lenguaje de examen: nunca "correcto/incorrecto", siempre "esto te describe".

---

## 6. Mapeo a nuestro código actual

| Ya tenemos (reutilizar) | Cambiar |
|--------------------------|---------|
| Dark canvas + reduced-motion (`globals.css`) | Base `#050505` → `#1E1826`; acentos → cian/violeta |
| GamifiedProgress 25 segmentos | Acentos + shimmer + hitos animados |
| LayerTransition con motion | Upgrade a "capa completada" con badge + sparkle |
| AnswerStamp en QuestionCard | Sumar partículas + sonido (Web Audio) |
| ResultShareCard + radar SVG | Bento layout + tags + secuencia de ensamblaje |
| ConfettiTrigger | Mantener, 1 solo disparo |
| useReducedMotion/useScrollReveal | Mantener |
| LandingPage 3 secciones | Hero con producto real + numeración de fases + marquee |

**No tocar:** pipeline de scoring, store Zustand, Supabase.

---

## 7. Plan de implementación (fases sugeridas)

| Fase | Alcance | Estimado |
|------|---------|----------|
| **A** | Tokens de paleta + tipografía + layout base | 0.5 día |
| **B** | Wizard juice: particles, sonido, XP, capas-unlock | 1-2 días |
| **C** | Preguntas narrativas (dilemas) + insights variables | 1 día |
| **D** | Resultados bento + persona reveal + share card v2 | 1-2 días |
| **E** | Landing v2 (producto real, fases, marquee, scroll-story) | 1 día |

Total: ~5-6 días de trabajo. Cada fase mergeable independiente.

---

## 8. Fuentes

- Awwwards, Godly/recent.design, Brutalist Websites, Land-book, CSS Design Awards
- Linear, Stripe, Vercel, Framer, Apple (MacBook Pro), Lusion
- Game Developer: "3 Game Juice Techniques From Slime Road", "6 Mistakes That'll Drain the Juice", "How Onboarding Should be Applied to Tutorials", "Compulsion Loops & Dopamine", "The Walking Dead and the art of providing no good choice"
- Trophy.so: "Duolingo Gamification Strategy: A Full Case Study (2026)"
- Chelsea Mai: "Phantom Thief's Guide to the Metaverse" (Persona 5 Royal UI)
- PositivePsychology.com: flow theory (Csíkszentmihályi)
- Aesthetics Wiki: Cyberpunk
- Referencia visual del equipo (imagen Gemini: dark violeta #1E1826, cian/violeta/magenta)
