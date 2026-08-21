# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Estudiantes de colegio (16-18 años) en etapa de orientación vocacional. Llegan a la landing desde el colegio, redes o buscadores, en busca de descubrir qué carrera se alinea con su perfil. No son usuarios técnicos: buscan algo claro, rápido y que se sienta divertido, no como un examen.

## Product Purpose

TuFuturoDual es un test vocacional gamificado de Uniempresarial que revela qué carrera se alinea con quién es el estudiante. A partir de 15 preguntas organizadas en 3 capas (intereses, aptitudes, valores), devuelve un perfil RIASEC, un arquetipo, las carreras del Modelo Dual más afines y una modalidad recomendada (presencial/virtual).

Éxito = el estudiante completa el test y deja sus datos (lead), permitiendo que el equipo de admisiones de Uniempresarial lo contacte con orientación personalizada.

## Positioning

Gamificado y "divertido": se siente como descubrir tu clase de personaje en un RPG (scanner de identidad), no como llenar un formulario. El test empodera al estudiante como protagonista que descubre su futuro, y lo conecta con las carreras reales del Modelo Dual de Uniempresarial.

## Operating Context

- Web, mobile-first (estudiantes usan mayormente el celular, a veces una mano, en movimiento o con interrupciones).
- Flujo principal: landing → test (3 capas / 15 preguntas) → lead form → resultados (arquetipo, radar, ranking, share card).
- Admin interno para el equipo de admisiones: dashboard con métricas, CRUD de leads, auth.
- Fondo del test usa videos/fotos reales de campus.
- Despliegue en Vercel; build de producción = `tsc --noEmit && next build` (los tests corren vía `test:ci`, separados del build). Node >=20.9.0.

## Capabilities and Constraints

- Test de 15 preguntas, 3 capas, scoring RIASEC puro (no tocar lógica de scoring).
- El resultado vive actualmente en sessionStorage (se pierde al cerrar pestaña — limitación conocida).
- Leads se persisten en Supabase con dedupe por email.
- Dark-first, paleta cian (#22D3EE) + violeta (#8B5CF6) sobre base violeta-negro (#1E1826). No hay restricción de identidad de marca (decisión del cliente).
- Tecnología: Next.js 16.3, React 19.2, Tailwind v4, Zustand, Supabase, vitest, next-auth (admin), recharts (dashboard), motion (animaciones).
- 271 tests existentes, TypeScript strict.

## Brand Commitments

- Nombre: "Tu Futuro Dual" / Uniempresarial.
- Objetivo: ultra dinámico y divertido (pedido explícito del cliente; no es un producto institucional/serio).

## Evidence on Hand

- Copy real en src/features/landing/LandingPage.tsx, question-bank.ts (15 preguntas en español colombiano, tono casual).
- Programas del Modelo Dual en src/lib/programs.ts.
- Arquetipos en src/lib/scoring/archetypes.ts.
- Admin funcional (dashboard, leads).
- No hay testimonios ni casos de estudio reales — no fabricar.

## Product Principles

1. El test es un viaje de autodescubrimiento, no un examen: nunca "correcto/incorrecto", siempre "esto te describe".
2. La diversión (juice, gamificación) es la interfaz, no un adorno.
3. Cada pantalla acerca al momento de convertir: completar el test y dejar el lead.
4. Mobile-first: un estudiante con celular y una mano debe poder avanzar sin fricción.
5. El resultado es el shareable: la carta final debe ser algo que el estudiante quiera postear.

## Accessibility & Inclusion

- prefers-reduced-motion respetado en todo el proyecto (animaciones transform/opacity).
- Público joven, no técnico: lenguaje claro, sin jerga.
