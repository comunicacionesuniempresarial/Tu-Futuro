# Propuesta v6 — TuFuturoDual: Tu Arquetipo Vocacional

**Fecha:** 2026-08-19
**Estado:** Propuesta de concepto visual (mockup animado)
**Autor:** Gentle AI + Tomás

---

## 1. El problema que resolvemos

El test vocacional TuFuturoDual revela tu arquetipo profesional — quién sos, cómo pensás, qué te mueve. Pero la experiencia actual de resultados es una página estática con un emoji, un nombre y dos frases. No hay momento de descubrimiento, no hay emoción, no hay "wow".

Los mockups v3-v5 exploraron una estética TCG (Trading Card Game) que al usuario le gustó **la dirección**, pero el contenido estaba enfocado en mecánicas de juego (ATQ/DEF, "Fusión", "Monstruo · Efecto"). El usuario pidió: **"más pulido, no tan enfocado a JUEGO, habla sobre los arquetipos"**.

**Propuesta v6:** Conservar la mecánica de revelación premium (pack → vuelo → vórtice → flash → carta), pero re-enfocar el CONTENIDO en identidad: quién sos, qué te hace único, qué caminos se abren.

---

## 2. Los 8 arquetipos — datos reales del código

El código actual (`src/lib/scoring/archetypes.ts`) define 8 arquetipos:

| # | ID | Nombre | Emoji | Descripción | Perfil RIASEC |
|---|-----|--------|-------|-------------|---------------|
| 1 | `realizador` | El Constructor | ⚙️ | Optimizas todo lo que tocas. Procesos, recursos, tiempo — encuentras la forma más inteligente de hacer las cosas. | R.9 I.7 |
| 2 | `investigador` | El Investigador | 🔬 | Tu curiosidad no tiene límites. Analizas, experimentas y descubres patrones que otros pasan por alto. | R.7 I.9 |
| 3 | `creador` | El Creador | 🎨 | Transformas ideas en experiencias. Tu creatividad es tu lenguaje natural y tu mayor ventaja. | A.9 S.6 |
| 4 | `connecting` | El Conector | 🤝 | Entiendes a las personas como nadie. Empatía, comunicación y habilidades sociales son tu superpoder. | S.9 E.7 |
| 5 | `estratega` | El Estratega | ♟️ | Planificas, organizas y ejecutas con precisión. Ves el panorama completo donde otros ven caos. | E.7 C.9 |
| 6 | `analista` | El Analista | 📊 | Los datos cuentan historias para ti. Metódico, preciso y orientado a la excelencia. | I.8 C.9 |
| 7 | `visionario` | El Visionario | 🚀 | Conectas creatividad con negocio. Ves oportunidades donde otros ven problemas. | E.9 A.7 |
| 8 | `leader` | El Líder | 👑 | Inspiras, motivas y llevas equipos a resultados extraordinarios. Tu energía es contagiosa. | E.9 S.7 |

**Dato crítico:** NO existen elementos, colores, taglines, talentos ni stats en el modelo de datos. Todo eso era invención de los mockups. El modelo de datos solo tiene: id, name, emoji, description, whyDualModel, riasecProfile.

---

## 3. Qué proponemos enriquecer

### 3.1 Nuevo campo: `identity` (por arquetipo)

```typescript
interface ArchetypeIdentity {
  tagline: string;      // Una línea que captura la esencia
  talents: string[];    // 3-4 fortalezas naturales
  element: string;      // Elemento visual (referencia, no funcional)
  color: string;        // Color identitario (hex)
  symbol: string;       // Símbolo SVG inline (no emoji)
  programs: string[];   // IDs de programas compatibles
}
```

### 3.2 Los 8 arquetipos enriquecidos

#### El Constructor ⚙️
- **Tagline:** "Donde otros ven problemas, vos ves sistemas por optimizar."
- **Talents:** Eficiencia · Sistemas · Precisión · Resolución
- **Elemento:** Engranaje
- **Color:** #6366F1 (índigo)
- **Programas:** Ingeniería de Software, Ingeniería Industrial, Administración de Empresas

#### El Investigador 🔬
- **Tagline:** "Tu mente no descansa hasta entender cómo funciona todo."
- **Talents:** Análisis · Curiosidad · Patrones · Profundidad
- **Elemento:** Lupa
- **Color:** #8B5CF6 (violeta)
- **Programas:** Ingeniería de Software, Ingeniería Industrial

#### El Creador 🎨
- **Tagline:** "Convertís lo que imaginás en lo que otros sienten."
- **Talents:** Creatividad · Expresión · Innovación · Sensibilidad
- **Elemento:** Pincel
- **Color:** #EC4899 (rosa)
- **Programas:** Marketing, Negocios Turísticos y Hoteleros

#### El Conector 🤝
- **Tagline:** "Las personas te eligen porque las hacés sentir importantes."
- **Talents:** Empatía · Comunicación · Liderazgo · Escucha
- **Elemento:** Personas
- **Color:** #F59E0B (ámbar)
- **Programas:** Administración de Empresas, Negocios Internacionales, Marketing

#### El Estratega ♟️
- **Tagline:** "Ves tres pasos adelante donde otros ven una sola jugada."
- **Talents:** Planificación · Organización · Visión sistémica · Decisión
- **Elemento:** Diana
- **Color:** #10B981 (esmeralda)
- **Programas:** Administración de Empresas, Finanzas y Comercio Exterior, Negocios Internacionales

#### El Analista 📊
- **Tagline:** "Los datos no mienten. Vos sabés leerlos."
- **Talents:** Precisión · Metodología · Datos · Rigor
- **Elemento:** Gráfico
- **Color:** #3B82F6 (azul)
- **Programas:** Finanzas y Comercio Exterior, Ingeniería Industrial, Ingeniería de Software

#### El Visionario 🚀
- **Tagline:** "Donde otros ven límites, vos ves la puerta que nadie abrió."
- **Talents:** Innovación · Visión · Emprendimiento · Intuición
- **Elemento:** Cohete
- **Color:** #F97316 (naranja)
- **Programas:** Marketing, Negocios Internacionales, Administración de Empresas

#### El Líder 👑
- **Tagline:** "No necesitás permiso para inspirar. Lo hacés naturalmente."
- **Talents:** Influencia · Motivación · Decisiones · Presencia
- **Elemento:** Corona
- **Color:** #EAB308 (dorado)
- **Programas:** Administración de Empresas, Negocios Internacionales, Marketing

---

## 4. La experiencia de revelación

### 4.1 La mecánica (se conserva de v5)

1. **El Portal** — Un pack/sobre premium se muestra en el centro de la pantalla. Glow sutil. "Hacé click para descubrir tu arquetipo."
2. **La Transformación** — El pack se abre con burst. 25 cartas salen volando (representan tus 25 respuestas). Se dispersan y luego convergen al centro.
3. **La Fusión** — Vórtice de energía con 3 anillos concéntricos. Core titilando los 6 colores del espectro RIASEC. Partículas orbitales. "Tus respuestas se están revelando..."
4. **El Destello** — Flash radial blanco. Limpieza visual.
5. **La Revelación** — Tu arquetipo emerge: 300×470px, esquinas doradas, shine sweep, nombre Cinzel, emoji/símbolo como arte, tagline como flavor text, 4 estrellas, barra de stats.
6. **El Conocimiento** — Stats cuentan: dimensiones RIASEC dominantes. Compatible con: [programas]. "Tu camino se abre."

### 4.2 El lenguaje (cambia TODO)

| v5 (juego) | v6 (identidad) |
|-------------|----------------|
| "TUFUTURO DUAL 25 CARTAS" | "TU ARQUETIPO VOCACIONAL" |
| "Fusión" (en el vórtice) | "Tus respuestas se están revelando..." |
| "Acto 2 — Las 25 cartas" | "Transformando tus respuestas" |
| "Acto 3 — La fusión" | "Descubriendo tu esencia" |
| "Acto 5 — El Forjador" | "Tu arquetipo: El Constructor" |
| "ATQ 92" / "DEF 78" | "Dimensiones dominantes" |
| "Monstruo · Efecto" | "Arquetipo · Constructor" |
| "Forja — Fusiona 2 cartas..." | copy real del arquetipo |
| "El tipo de carta más poderosa" | "Tu perfil vocacional" |

### 4.3 La carta final — contenido

```
┌─────────────────────────────┐
│  ╔═══════════════════════╗  │
│  ║    EL CONSTRUCTOR     ║  │  ← Nombre en Cinzel
│  ║         ⚙️            ║  │  ← Símbolo SVG (no emoji)
│  ║                       ║  │
│  ║  [Arte SVG: engranaje ║  │  ← Arte inline SVG
│  ║   + circuitos + chisp]║  │
│  ║                       ║  │
│  ║  "Donde otros ven     ║  │  ← Tagline (flavor)
│  ║   problemas, vos ves  ║  │
│  ║   sistemas por        ║  │
│  ║   optimizar."         ║  │
│  ╚═══════════════════════╝  │
│                             │
│  ★ ★ ★ ★  Dimensión: R.9   │  ← Estrellas + dimensión
│                             │
│  Tus dimensiones:           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━  │  ← Barras de RIASEC
│  Realista    ██████████ 90  │
│  Investigador ████████   70 │
│  Convencional ██████     50 │
│                             │
│  Compatible con:            │
│  ▸ Ing. de Software         │  ← Programas
│  ▸ Ing. Industrial          │
│  ▸ Administración           │
└─────────────────────────────┘
```

---

## 5. Dirección visual refinada

### 5.1 Paleta (de design-direction.md, ya definida)

- **Base:** #1E1826 (violeta-oscuro) — no #050505
- **Acento primario:** #22D3EE (cian) — acciones, progreso, hover
- **Acento secundario:** #8B5CF6 (violeta) — profundidad, gradientes
- **Marca:** #D51933 / #0033A5 — solo institucional (logo, footer)
- **Textos:** #F5F3FF (primario), #9CA3AF (secundario)

### 5.2 Cada arquetipo = su color

El color del arquetipo se usa en:
- Borde de la carta revelada
- Glow alrededor del emoji/símbolo
- Barra de dimensión dominante
- Borde del share card

### 5.3 Tipografía

- **Display:** Sora (ya en uso), extrabold, tracking-tight
- **Accent:** Serif itálica para palabras clave ("tu *clase* vocacional")
- **Eyebrow:** small-caps, tracking-widest, cian
- **Body:** Inter/Sora, 16-18px

### 5.4 Motivos visuales

- Bordes 1px (craft, no sombra)
- Glass en overlays (backdrop-blur)
- Partículas sutiles de fondo (starfield violeta)
- Glow respirando en acentos activos
- Grilla 8pt

---

## 6. Cambios en el modelo de datos (requeridos)

### 6.1 Nuevo: `ArchetypeIdentity`

```typescript
// En src/lib/scoring/archetypes.ts o un nuevo archivo identity.ts
export const ARCHETYPE_IDENTITIES: Record<string, ArchetypeIdentity> = {
  realizador: {
    tagline: "Donde otros ven problemas, vos ves sistemas por optimizar.",
    talents: ["Eficiencia", "Sistemas", "Precisión", "Resolución"],
    element: "engranaje",
    color: "#6366F1",
    symbol: "⚙️",
    programs: ["software", "industrial", "admin"],
  },
  // ... los 8
};
```

### 6.2 Share card v2

- Usar `archetype.color` en vez de `#D51933` hardcodeado
- Incluir `studentName` (campo existe pero nunca se pasa)
- Agregar tagline y talents
- Radar RIASEC con color del arquetipo

### 6.3 Results page enriquecida

- ArchetypeCard con color, tagline, talents, programas
- RadarChart con color del arquetipo
- Nueva sección: "Tus fortalezas" (talents)
- Nueva sección: "Tus caminos" (programas con match %)

---

## 7. Gap: 8 arquetipos vs 6 elementos

Los mockups TCG v3-v5 usaban 6 elementos (TIERRA/AGUA/FUEGO/LUZ/VIENTO/OSCURIDAD) con colores propios. El código tiene 8 arquetipos sin elementos.

**Propuesta:** eliminar los 6 elementos del concepto. Cada arquetipo tiene SU color. No necesitamos un sistema de "elementos" — los arquetipos YA son la taxonomía. El v6 muestra 8 cartas posibles (una por arquetipo), no 6.

---

## 8. Próximos pasos

1. **Mockup v6 animado** — builder script que genera HTML con los 8 arquetipos reales, copy de identidad, paleta correcta
2. **Feedback del usuario** — presentar URL, iterar sobre actos/timing/estética
3. **Decidir si SDD** — una vez aprobado el concepto, planificar implementación con SDD (model changes, share card v2, results page v2)

---

## 9. Archivos referenciados

- `src/lib/scoring/archetypes.ts` — 8 arquetipos actuales (id, name, emoji, description, whyDualModel, riasecProfile)
- `src/features/results/ArchetypeCard.tsx` — cómo se muestra hoy
- `src/lib/share-card/generate.ts` — share card actual (hardcodeado #D51933)
- `docs/design-direction.md` — dirección visual (violeta-oscuro + cian, RPG, Persona 5)
- `docs/build-anim-v5.js` — reveal v5 (base para v6)
- `docs/propuesta-tcg-v5-animacion.html` — mockup v5 actual
