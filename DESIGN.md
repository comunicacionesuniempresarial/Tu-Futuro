---
name: Tu Futuro Dual
description: Test vocacional gamificado de Uniempresarial — Identity Scanner
colors:
  bg: "#1E1826"
  surface: "#241D2E"
  surface-elevated: "#2A2235"
  deep: "#120E1A"
  border: "#2D2540"
  border-subtle: "#231C33"
  text-primary: "#F5F3FF"
  text-secondary: "#9CA3AF"
  text-muted: "#6B7280"
  neon-primary: "#22D3EE"
  neon-secondary: "#8B5CF6"
  success: "#4ADE80"
  warning: "#FBBF24"
  danger: "#F87171"
  brand-red: "#D51933"
  brand-blue: "#0033A5"
typography:
  heading:
    fontFamily: "Sora, Space Grotesk, sans-serif"
    fontWeight: 800
  body:
    fontFamily: "Inter, Sora, sans-serif"
    fontWeight: 400
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  "2xl": "32px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  neon-button:
    backgroundColor: "linear-gradient(135deg, {colors.neon-primary}, {colors.neon-secondary})"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "14px 28px"
  question-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "20px"
  animated-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: Tu Futuro Dual

## Overview

**Creative North Star: "The Identity Scanner"**

TuFuturoDual se siente como un scanner de identidad gamificado: cada respuesta del estudiante revela una capa más de quién es, con feedback visual inmediato que mantiene la energía alta. La interfaz oscurecida con neón vibrante crea una atmósfera de arcade futurista donde descubrir tu carrera se siente como desbloquear un personaje en un RPG. No es un examen — es un viaje de autodescubrimiento con juicio cero.

El sistema es **playful & futuristic**: colores que brillan sobre oscuridad profunda, animaciones que reaccionan al toque del usuario, y transiciones que hacen sentir progreso real. Lo que NO es: institucional, serio, estático, o aburrido. Cada pixel comunica que esto va a ser divertido.

**Key Characteristics:**
- Dark-first canvas con acentos neón que crean contraste dramático
- Gamificación visual: barra de progreso estilo HP, sparkles de feedback, transiciones de capa
- Mobile-first con interacciones optimizadas para una mano
- Animaciones transform/opacity que respetan `prefers-reduced-motion`
- Glass effects y neon borders como firma visual distintiva

---

## Product Context

### Qué es

Test vocacional gamificado de Uniempresarial (Fundación Universitaria Empresarial de la Cámara de Comercio de Bogotá). A partir de 15 preguntas en 3 capas, revela qué carrera del Modelo Dual se alinea con quién es el estudiante.

### Público

Estudiantes de colegio (16-18 años) en etapa de orientación vocacional. No son usuarios técnicos: buscan algo claro, rápido y que se sienta divertido.

### Flujo principal

```
Landing → Test (15 preguntas, 3 capas) → Lead Form → Resultados
                                                         ├── Arquetipo
                                                         ├── Radar RIASEC
                                                         ├── Top 3 carreras
                                                         ├── Ranking completo
                                                         ├── Modalidad recomendada
                                                         └── Share Card
```

### Principios del Producto

1. El test es un **viaje de autodescubrimiento**, no un examen — nunca "correcto/incorrecto"
2. La **diversión** (juice, gamificación) es la interfaz, no un adorno
3. Cada pantalla **acerca al momento de convertir**: completar el test y dejar el lead
4. **Mobile-first**: un estudiante con celular y una mano debe avanzar sin fricción
5. El resultado es el **shareable**: la carta final debe ser algo que el estudiante quiera postear

### Modos

| Modo | URL | Descripción |
|------|-----|-------------|
| Test real | `/test` | Leads guardados con `es_prueba=false` |
| Modo prueba | `/test?prueba=1` | Leads guardados con `es_prueba=true`, filtrados del panel admin |

---

## Colors

La paleta combina oscuridad profunda con dos acentos neón que crean jerarquía visual clara: cian para acciones, violeta para profundidad.

### Primary (Accent)
- **Neon Cyan** (#22D3EE): El protagonista. Acciones principales, progreso, hover states, focus rings, sparkles de feedback. Se usa en el 10-15% de la pantalla — su rareza es la punto.
- **Neon Violet** (#8B5CF6): Profundidad y gradientes. Acompañante del cian en el brand gradient, underline decorativo, y acentos secundarios.

### Background
- **Deep Violet-Black** (#1E1826): Base del canvas. Oscuro pero no negro puro — tiene un tono violeta sutil que da calidez.
- **Surface** (#241D2E): Cards, paneles, contenedores principales.
- **Surface Elevated** (#2A2235): Hover states, elementos elevados, modales.
- **Deep** (#120E1A): Overlays, modales, profundidad máxima.

### Text
- **Text Primary** (#F5F3FF): Casi blanco con tinte violeta — el color de texto principal.
- **Text Secondary** (#9CA3AF): Descripciones, metadata, texto de apoyo.
- **Text Muted** (#6B7280): Labels menores, timestamps, texto deshabilitado.

### Borders
- **Border** (#2D2540): Bordes principales de cards y inputs.
- **Border Subtle** (#231C33): Bordes sutiles, separadores.

### Semantic
- **Success** (#4ADE80): Aciertos, logros, progreso completado.
- **Warning** (#FBBF24): Avisos, estados intermedios.
- **Danger** (#F87171): Errores, validación fallida.

### Brand
- **Brand Red** (#D51933): Logo Uniempresarial, footer, CTA final de contacto. Solo elementos institucionales.
- **Brand Blue** (#0033A5): Logo Uniempresarial, elementos institucionales.

### Named Rules
**The Neon Restraint Rule.** El cian (#22D3EE) es el ÚNICO protagonista decorativo. Se usa en ≤15% de cualquier pantalla. Su rareza es lo que lo hace poderoso — si todo brilla, nada brilla.

---

## Typography

**Display Font:** Sora (with Space Grotesk fallback)
**Body Font:** Inter (with Sora fallback)

**Character:** Sora transmite tecnología y confianza; Inter asegura legibilidad en pantallas pequeñas. La combinación es futurista pero accesible — no se siente como un-formulario-corporativo.

### Hierarchy
- **Display** (800 weight, clamp(3rem, 8vw, 6rem), 0.95 line-height): Hero headlines. Solo en la landing y pantalla de resultados. Tamaño agresivo que grita confianza.
- **Headline** (800 weight, 2.5rem, tight): Títulos de sección, nombres de arquetipo.
- **Title** (700 weight, 1.5rem, tight): Títulos de cards, preguntas del test.
- **Body** (400 weight, 1rem-1.125rem, relaxed): Descripciones, explicaciones, texto de apoyo. Max-width ~65ch.
- **Label** (700 weight, 0.75rem, 0.05em tracking, uppercase): Badges, chips, metadata. Siempre uppercase para contraste con el peso del display.

### Named Rules
**The Bold Headline Rule.** Todos los títulos usan weight 700-800. Nunca usar font-weight bajo en titulares — la personalidad del scanner se construye con peso visual.

---

## Layout

Mobile-first con un container max-width de 7xl (1280px). El layout principal usa CSS Grid con gaps de 24px. En mobile, todo es columna única con padding de 16px. En desktop, la landing usa un grid asimétrico (1.15fr / 0.85fr) para dar peso al headline y comprimir la demo del test.

El test (wizard) es una columna centrada con max-width de 440px — optimizado para una mano en móvil. Los resultados usan un bento grid de 3 columnas que colapsa a 1 en mobile.

**Spacing Rhythm:** Base de 8px. Components usan padding de 16-24px, gaps de 12-24px. El Hero usa padding vertical de 56-80px para crear respiración.

### Breakpoints

| Name | Value | Usage |
|------|-------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |

---

## Elevation & Depth

El sistema usa **soft shadows** con tonos neón para crear profundidad sin ser agresivo. Las sombras no son negras — son extensiones de los acentos de marca que refuerzan la identidad visual.

### Shadow Vocabulary
- **Neon Glow Primary** (`0 0 20px rgba(34,211,238,0.4), 0 0 40px rgba(34,211,238,0.2), inset 0 0 20px rgba(34,211,238,0.1)`): Elementos activos, hover states, focus rings. Da la sensación de que el elemento está "encendido".
- **Neon Glow Secondary** (`0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2)`): Elementos decorativos, gradient backgrounds.
- **Card Shadow** (`0 8px 40px rgba(232,121,249,0.14)`): Cards elevadas, paneles de resultado. Sutil pero perceptible.
- **Glass Effect** (`backdrop-filter: blur(12px), background: rgba(18,14,26,0.8)`): Overlays, headers persistentes, modales.

### Named Rules
**The Glowing Active Rule.** Los elementos interactivos brillan solo cuando están activos o en hover. En estado flat, son planos. El brillo es feedback, no decoración.

---

## Motion & Animation

### Easing

| Name | Value | Usage |
|------|-------|-------|
| ease-standard | `cubic-bezier(0.4, 0, 0.2, 1)` | Default state transitions |
| ease-spring | `cubic-bezier(0.22, 1, 0.36, 1)` | Pop-in, reveal animations |
| ease-bounce | `cubic-bezier(0.22, 1, 0.36, 1)` | Gamification feedback |

### Duration

| Name | Value | Usage |
|------|-------|-------|
| duration-fast | 150ms | Micro-interactions (button press, scale) |
| duration-normal | 300ms | State changes (hover, focus, selection) |
| duration-slow | 600ms | Entrance reveals, page transitions |

### Animation Principles
- **Transform/opacity only**: Todas las animaciones usan solo `transform` y `opacity` para respetar `prefers-reduced-motion`
- **Will-change optimization**: Elementos animados declaran `will-change: transform`
- **Reduced motion**: Cuando `prefers-reduced-motion: reduce`, las animaciones se saltan inmediatamente

### Key Animations

| Animation | Trigger | Behavior |
|-----------|---------|----------|
| Sparkle burst | Question selected | 8 particles burst from center, scale 0→1→0 |
| Segment pulse | Layer complete | Scale 0→1.9→1 on the active segment |
| Card reveal | IntersectionObserver | opacity 0→1, translateY 30px→0 |
| Card hover lift | Mouse enter | translateY(-4px) |
| Button press | data-pressed | scale 0.97 |
| Neon glow | Hover/active | Box-shadow intensity increases |
| Confetti | Results shown | Canvas confetti burst |
| Layer transition | Between layers | Full-screen overlay with animation |

---

## Shapes

Form language redondeada y consistente: todo usa border-radius entre 8px y 32px. No hay esquinas cuadradas en componentes interactivos — la suavidad comunica accesibilidad y calidez. Los neon borders usan el truco de padding-box con gradient para crear bordes de 1px que brillan.

### Corner Strategy
- **Buttons:** 12px radius (rounded-lg en Tailwind)
- **Cards:** 16-24px radius (rounded-xl a rounded-2xl)
- **Inputs:** 12px radius
- **Chips/Badges:** 9999px radius (pill shape)
- **Large Panels:** 24-32px radius (rounded-2xl a rounded-3xl)

### Neon Border
El componente `.neon-border` usa un gradiente de 135° de cian a violeta como borde, aplicado via `padding-box` + `border-box` trick. Crea un borde de 1px que parece brillar sin usar box-shadow.

---

## Components

### NeonButton
- **Shape:** 12px radius, padding 14px 28px
- **Primary:** Brand gradient (cian→violeta) con neon glow shadow
- **Hover:** Glow se intensifica (32px blur), scale 1.02
- **Active:** Scale 0.97 (feedback táctil via data-pressed)
- **Focus:** 2px outline cian con 2px offset

### QuestionCard
- **Shape:** 16-24px radius, padding 16-20px
- **Idle:** Surface bg, 1px border, backdrop-blur-md
- **Selected:** Neon border (gradient cian→violeta), neon glow, surface-elevated bg
- **Feedback:** AnswerStamp con pop-in animation + sparkle burst de 8 partículas

### AnimatedCard
- **Shape:** 16px radius, padding 24px
- **Entrance:** IntersectionObserver reveal (opacity 0→1, translateY 30px→0)
- **Hover:** translateY(-4px) — lift sutil
- **Reduced Motion:** Reveal inmediato, sin animación

### GamifiedProgress
- **Style:** 15 segmentos agrupados por capa (5/5/5)
- **Filled:** Brand gradient (cian→violeta)
- **Active:** Neon glow + scale 1.6 en eje Y
- **Layer Complete:** Segment pulse animation (scale 0→1.9→1)

### LeadForm
- **Inputs:** Surface bg, 1px border, 12px radius, focus: cian border + ring
- **Submit:** Brand gradient, full width, scale feedback en hover/active
- **Success:** Pop-in animation con sparkle icon

### ArchetypeCard
- **Shape:** 24px radius, border white/10, bg principal
- **Icon:** 96×96 rounded-2xl con brand gradient, emoji centrado
- **Affinity Badge:** Pill shape, cian border 40%, bg cian 10%

### LayerTransition
- **Shape:** Full-screen overlay con deep bg
- **Content:** Layer name + description, centered
- **Animation:** Fade in + scale, auto-dismiss after 2s or on tap
- **Behavior:** `dismissedTransitions` Set prevents re-showing on back-navigation

### ShareCard
- **Shape:** Card with radar SVG, archetype info, top 3 programs
- **Radar:** 6-axis RIASEC chart with program overlay
- **Actions:** Download as image, share to social
- **Format:** SVG rendered to canvas for export

### ModalityCard
- **Shape:** Card with recommendation + confidence badge
- **Content:** "Presencial" or "Virtual" with explanation
- **Confidence:** Color-coded badge (green=high, amber=medium, red=low)

### BackgroundCarousel
- **Style:** Full-bleed video/image carousel behind hero
- **Content:** Campus photos/videos from Uniempresarial
- **Behavior:** Auto-play with fallback to static images

---

## Scoring System

### Question Bank — 15 Preguntas en 3 Capas

#### Capa 1: Intereses RIASEC (Q1-Q5)
5 preguntas. Single-choice con 5 opciones. Cada opción tiene pesos RIASEC por dimensión.

| Dimensión | Significado | Preguntas |
|-----------|-------------|-----------|
| R (Realistic) | Hacedores — manos, herramientas | Q1 |
| I (Investigative) | Pensadores — analizar, descubrir | Q2 |
| A (Artistic) | Creadores — imaginación, expresión | Q3 |
| S (Social) | Ayudantes — empatía, acompañar | Q4 |
| E (Enterprising) | Persuasores — liderar, influir | Q5 |

**Mecánica:** Pesos raw → normalización por max posible → perfil RIASEC [0,1].

#### Capa 2: Aptitudes (Q6-Q10)
5 preguntas de escenarios conductuales. Single-choice con 4 opciones.

**Slots:** `[logical, planning, creative, social]`

#### Capa 3: Valores & Estilo de Vida (Q11-Q15)
Mezcla de formatos: likert-5, single-choice, binary.

**Slots:** `[autonomy, risk-tolerance, flexibility, helping]`

### Archetype System — 8 Arquetipos

| Arquetipo | Emoji | Pair RIASEC | Descripción |
|-----------|-------|-------------|-------------|
| El Constructor | ⚙️ | R+I | Optimiza todo lo que toca |
| El Investigador | 🔬 | I+R | Curiosidad sin límites |
| El Creador | 🎨 | A+S | Transforma ideas en experiencias |
| El Conector | 🤝 | S+E | Entiende a las personas como nadie |
| El Estratega | ♟️ | E+C | Planifica con precisión |
| El Analista | 📊 | I+C | Los datos cuentan historias |
| El Visionario | 🚀 | E+A | Conecta creatividad con negocio |
| El Líder | 👑 | E+S | Inspira y lleva equipos a resultados |

**Algoritmo:** Dominante+secundaria → mapping table → cosine fallback (con near-tie guard ε=0.05).

### Modality System — Derived Signal

1. **Señal derivada** (Q11-Q15 + RIASEC): Correlación estilo de vida ↔ modalidad
   - Q11 (autonomy): High → virtual, Low → presencial
   - Q12 (work-style): Solo→virtual, Team/Leaders/Clients→presencial
   - Q13 (risk-tolerance): High→virtual, Low→presencial
   - Q14 (schedule): Flexibility→virtual, Fixed→presencial
   - Q15 (orientation): Learning/Creativity→virtual, Security→presencial
   - RIASEC: High I → virtual, High S → presencial

**Confianza:** alta (ambas coinciden), media (una decisiva), baja (conflicto o sin evidencia).

### Program Catalog — 7 Carreras, 12 Programas

| # | Carrera | Presencial | Virtual |
|---|---------|------------|---------|
| 1 | Ingeniería de Software | ✅ | ✅ |
| 2 | Negocios Turísticos y Hoteleros | ✅ | ✅ |
| 3 | Administración de Empresas | ✅ | ✅ |
| 4 | Negocios Internacionales | ✅ | ❌ |
| 5 | Finanzas y Comercio Exterior | ✅ | ❌ |
| 6 | Ingeniería Industrial | ✅ | ✅ |
| 7 | Marketing | ✅ | ✅ |

Cada programa tiene perfiles de requerimiento: RIASEC (6 dims), aptitudes (4 slots), valores (4 slots).

---

## Admin Design

### Authentication
- NextAuth v5 beta, credentials provider, JWT session
- Brute-force protection
- Lista de emails/passwords en variables de entorno

### Dashboard
- Métricas: total leads, leads nuevos, por estado, por arquetipo, por modalidad
- Recharts para visualización

### Lead Management
- Tabla con filtros (estado, arquetipo, modalidad, prueba)
- Paginación
- Detalle de lead: perfil completo, RIASEC, arquetipo, top 3, ranking
- Workflow: nuevo → contactado → en_proceso → admitido/descartado
- Notas por lead (max 2000 chars)
- Export Excel decorado con identidad de marca

---

## Do's and Don'ts

### Do:
- **Do** use el brand gradient (cian→violeta) solo para elementos de acción primaria y progreso.
- **Do** respeta `prefers-reduced-motion` en toda animación — transform/opacity only.
- **Do** usa neon glow como feedback de estado, no como decoración permanente.
- **Do** mantiene el contraste de texto alto (casi blanco sobre oscuro).
- **Do** usa el glass effect para overlays y headers persistentes.

### Don't:
- **Don't** uses sombras negras — usa tonos neón para sombras que refuerzan la marca.
- **Don't** pongas neon glow en más del 15% de la pantalla simultáneamente.
- **Don't** uses font-weight bajo en titulares — mantén el peso bold/extrabold.
- **Don't** inventes tokens que no existen en el CSS — usa los tokens CSS custom properties del sistema.
- **Don't** uses colores brand (rojo/azul) para elementos interactivos — solo logo, footer, CTA institucional.

---

## Accessibility

- `prefers-reduced-motion` respetado en todo el proyecto (animaciones transform/opacity)
- Lenguaje claro, sin jerga — público joven, no técnico
- Focus rings visibles en todos los elementos interactivos (2px outline cian)
- ARIA labels en componentes clave (progressbar, navigation)
- Contraste de texto alto (casi blanco sobre oscuro)
