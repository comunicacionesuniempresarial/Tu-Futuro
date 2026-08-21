/**
 * Question Bank — 15 questions across 3 layers.
 *
 * Layer 1 (Q1-Q5): RIASEC Interests — 5 questions, single-choice with 5 options.
 * Layer 2 (Q13-Q17): Aptitudes — 5 behavioral scenario questions, single-choice with 4 options.
 * Layer 3 (Q18-Q22): Values & Lifestyle — mix of single-choice, likert-5, and binary questions.
 *
 * All text is in neutral Latin American Spanish, casual tone for a young audience (15-18).
 */

import type { Question } from "../scoring/types";

// ── Layer 1: RIASEC Interests (Q1-Q5) ──
//
// Each option's riasecWeights array maps to the 5 options (index 0-4).
// For each option, the object maps each RIASEC dimension to a weight.
// Weights for a given dimension across all 5 options sum to 1.0.

const layer1Questions: Question[] = [
  // ── Q1: Realistic (Doers) ──
  {
    id: "Q1",
    layer: 1,
    dimension: "R",
    type: "single-choice",
    text: "Si tuvieras toda una tarde libre, ¿qué te mantendría más entretenido?",
    options: [
      "Arreglar algo que se rompió y dejarlo funcionando",
      "Proponer un plan épico y que todos se suban",
      "Charlar con un amigo y ayudarlo con un problema",
      "Inventar algo que a nadie se le hubiera ocurrido",
      "Ponerme a investigar un tema hasta entenderlo por completo",
    ],
    images: [
      "/images/cards/forge.webp",
      "/images/cards/storm.webp",
      "/images/cards/swamp.webp",
      "/images/cards/forest.webp",
      "/images/cards/potions.webp",
    ],
    riasecWeights: [
      { R: 0.5, I: 0.2, A: 0.0, S: 0.0, E: 0.2, C: 0.1 },
      { R: 0.05, I: 0.10, A: 0.15, S: 0.20, E: 0.45, C: 0.05 },
      { R: 0.0, I: 0.1, A: 0.2, S: 0.6, E: 0.1, C: 0.0 },
      { R: 0.1, I: 0.0, A: 0.7, S: 0.1, E: 0.1, C: 0.0 },
      { R: 0.1, I: 0.5, A: 0.0, S: 0.0, E: 0.0, C: 0.4 },
    ],
  },

  // ── Q2: Realistic (Doers) ──
  {
    id: "Q2",
    layer: 1,
    dimension: "R",
    type: "single-choice",
    text: "Organizan una feria en tu barrio y te toca ayudar. ¿Qué elegirías?",
    options: [
      "Montar los puestos y asegurarme de que todo funcione",
      "Recibir a todos para que se sientan bienvenidos",
      "Conseguir los mejores precios con los vendedores",
      "Decorar el espacio y que quede increíble",
      "Controlar el presupuesto y que nada se pase del límite",
    ],
    images: [
      "/images/cards/forge.webp",
      "/images/cards/swamp.webp",
      "/images/cards/storm.webp",
      "/images/cards/forest.webp",
      "/images/cards/potions.webp",
    ],
    riasecWeights: [
      { R: 0.4, I: 0.3, A: 0.0, S: 0.0, E: 0.2, C: 0.1 },
      { R: 0.0, I: 0.0, A: 0.1, S: 0.4, E: 0.4, C: 0.1 },
      { R: 0.0, I: 0.05, A: 0.10, S: 0.30, E: 0.45, C: 0.10 },
      { R: 0.1, I: 0.0, A: 0.5, S: 0.1, E: 0.2, C: 0.1 },
      { R: 0.1, I: 0.2, A: 0.0, S: 0.0, E: 0.1, C: 0.6 },
    ],
  },

  // ── Q3: Investigative (Thinkers) ──
  {
    id: "Q3",
    layer: 1,
    dimension: "I",
    type: "single-choice",
    text: "¿Qué tipo de video te atrapa y no lo sueltas hasta el final?",
    options: [
      "Un misterio que nadie ha logrado resolver",
      "Alguien que transformó una idea loca en algo viral",
      "Un grupo que se une para lograr lo imposible",
      "Un emprendedor que partió de cero y convenció a todos",
      "Alguien que dedica su vida a apoyar a otros",
    ],
    images: [
      "/images/cards/potions.webp",
      "/images/cards/forest.webp",
      "/images/cards/swamp.webp",
      "/images/cards/storm.webp",
      "/images/cards/swamp.webp",
    ],
    riasecWeights: [
      { R: 0.2, I: 0.6, A: 0.0, S: 0.0, E: 0.1, C: 0.1 },
      { R: 0.0, I: 0.1, A: 0.7, S: 0.0, E: 0.1, C: 0.1 },
      { R: 0.0, I: 0.0, A: 0.0, S: 0.7, E: 0.2, C: 0.1 },
      { R: 0.0, I: 0.05, A: 0.20, S: 0.10, E: 0.55, C: 0.10 },
      { R: 0.0, I: 0.1, A: 0.1, S: 0.7, E: 0.0, C: 0.1 },
    ],
  },

  // ── Q4: Investigative (Thinkers) ──
  {
    id: "Q4",
    layer: 1,
    dimension: "I",
    type: "single-choice",
    text: "Te toca un proyecto grupal en el colegio. ¿En qué rol te sientes en tu zona?",
    options: [
      "El que arma la maqueta y la deja perfecta",
      "El que investiga el porqué de las cosas con datos",
      "El que diseña todo para que se vea único",
      "El que ayuda a los que van perdidos hasta que entiendan",
      "El que motiva al grupo para que la presentación sea brutal",
    ],
    images: [
      "/images/cards/forge.webp",
      "/images/cards/potions.webp",
      "/images/cards/forest.webp",
      "/images/cards/swamp.webp",
      "/images/cards/storm.webp",
    ],
    riasecWeights: [
      { R: 0.7, I: 0.1, A: 0.0, S: 0.0, E: 0.1, C: 0.1 },
      { R: 0.1, I: 0.7, A: 0.0, S: 0.0, E: 0.0, C: 0.2 },
      { R: 0.0, I: 0.0, A: 0.8, S: 0.1, E: 0.0, C: 0.1 },
      { R: 0.0, I: 0.0, A: 0.1, S: 0.8, E: 0.0, C: 0.1 },
      { R: 0.0, I: 0.05, A: 0.10, S: 0.25, E: 0.55, C: 0.05 },
    ],
  },

  // ── Q5: Artistic (Creators) ──
  {
    id: "Q5",
    layer: 1,
    dimension: "A",
    type: "single-choice",
    text: "¿Dónde podrías perderte por horas sin mirar el celular?",
    options: [
      "En un taller armando y desarmando cosas con las manos",
      "En un espacio sin reglas donde dar rienda suelta a mis ideas",
      "En un estudio lleno de colores y materiales para crear",
      "En un lugar donde me escuchen y pueda orientar a otros",
      "En una reunión donde mi propuesta termine siendo la elegida",
    ],
    images: [
      "/images/cards/forge.webp",
      "/images/cards/forest.webp",
      "/images/cards/forest.webp",
      "/images/cards/swamp.webp",
      "/images/cards/storm.webp",
    ],
    riasecWeights: [
      { R: 0.7, I: 0.1, A: 0.0, S: 0.1, E: 0.0, C: 0.1 },
      { R: 0.0, I: 0.1, A: 0.5, S: 0.0, E: 0.3, C: 0.1 },
      { R: 0.0, I: 0.0, A: 0.8, S: 0.1, E: 0.1, C: 0.0 },
      { R: 0.0, I: 0.0, A: 0.1, S: 0.7, E: 0.1, C: 0.1 },
      { R: 0.0, I: 0.05, A: 0.20, S: 0.15, E: 0.50, C: 0.10 },
    ],
  },
];

// ── Layer 2: Aptitudes (Q13-Q17) ──
//
// Behavioral scenario questions. Each has 4 options whose `aptitudeWeights`
// map to aptitude vector slots: [logical, planning, creative, social].
// Each option carries its own per-slot weights (typically summing to 1),
// so a question can signal multiple aptitudes — no single dimension slot.

const layer2Questions: Question[] = [
  {
    id: "Q13",
    layer: 2,
    dimension: "aptitude-logical",
    type: "single-choice",
    text: "Si te preguntan qué tipo de reto te pone más pilas, ¿cuál eliges?",
    options: [
      "Resolver un problema con números o lógica",
      "Analizar un texto y sacar conclusiones",
      "Diseñar algo nuevo desde la nada",
      "Trabajar con un equipo para lograr un objetivo",
    ],
    images: [
      "/images/cards/potions.webp",
      "/images/cards/potions.webp",
      "/images/cards/forest.webp",
      "/images/cards/swamp.webp",
    ],
    aptitudeWeights: [
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
  },
  {
    id: "Q14",
    layer: 2,
    dimension: "aptitude-planning",
    type: "single-choice",
    text: "Te invitan a un viaje con los amigos. ¿Qué haces primero?",
    options: [
      "Armó una lista con todo lo que hay que llevar y hacer",
      "Busco información del destino a fondo",
      "Empiezo a imaginar las fotos y los planes sobre la marcha",
      "Armo el grupo y reparto quién se encarga de qué",
    ],
    images: [
      "/images/cards/storm.webp",
      "/images/cards/potions.webp",
      "/images/cards/forest.webp",
      "/images/cards/swamp.webp",
    ],
    aptitudeWeights: [
      [0, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0.6, 0, 0.4],
    ],
  },
  {
    id: "Q15",
    layer: 2,
    dimension: "aptitude-learning",
    type: "single-choice",
    text: "Si tuvieras que aprender a montar moto, ¿cómo lo harías?",
    options: [
      "Practicando una y otra vez hasta dominarla",
      "Leyendo el manual y viendo tutoriales antes de tocarla",
      "Saltando a la moto y a ver qué pasa",
      "Que un amigo me enseñe paso a paso",
    ],
    images: [
      "/images/cards/forge.webp",
      "/images/cards/potions.webp",
      "/images/cards/potions.webp",
      "/images/cards/swamp.webp",
    ],
    aptitudeWeights: [
      [0.7, 0.3, 0, 0],
      [1, 0, 0, 0],
      [0.2, 0.8, 0, 0],
      [0, 0, 0, 1],
    ],
  },
  {
    id: "Q16",
    layer: 2,
    dimension: "aptitude-pressure",
    type: "single-choice",
    text: "¿En qué situación te sientes más capaz de rendir al máximo?",
    options: [
      "Cuando hay fecha límite y no hay vuelta atrás",
      "Cuando tengo que analizar opciones y decidir rápido",
      "Cuando tengo que inventar una solución en el acto",
      "Cuando el equipo depende de que coordinemos todo",
    ],
    images: [
      "/images/cards/storm.webp",
      "/images/cards/potions.webp",
      "/images/cards/forest.webp",
      "/images/cards/swamp.webp",
    ],
    aptitudeWeights: [
      [0, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
  },
  {
    id: "Q17",
    layer: 2,
    dimension: "aptitude-focus",
    type: "single-choice",
    text: "¿Qué tipo de tarea te engancha y no la sueltas hasta terminarla?",
    options: [
      "Las que siguen un patrón y puedo ir cumpliendo",
      "Las que me obligan a pensar profundo",
      "Las que requieren pura imaginación",
      "Las donde trabajo codo a codo con otros",
    ],
    images: [
      "/images/cards/storm.webp",
      "/images/cards/potions.webp",
      "/images/cards/forest.webp",
      "/images/cards/swamp.webp",
    ],
    aptitudeWeights: [
      [0, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
  },
];

// ── Layer 3: Values & Lifestyle (Q18-Q22) ──
//
// Mix of single-choice (3) and likert-5 (2) questions.

const layer3Questions: Question[] = [
  {
    id: "Q18",
    layer: 3,
    dimension: "autonomy",
    type: "likert-5",
    text: "Imagina tu trabajo soñado: ¿cuánta libertad necesitas para decidir cómo haces las cosas?",
    options: [
      "Que alguien me diga exactamente qué hacer",
      "Poca — prefiero que me guíen al inicio",
      "Algo de libertad, pero con reglas claras",
      "Bastante — que confíen en cómo organizo mis tiempos",
      "Total — yo decido cómo, cuándo y con quién",
    ],
    images: [
      "/images/cards/forge.webp",
      "/images/cards/potions.webp",
      "/images/cards/swamp.webp",
      "/images/cards/forest.webp",
      "/images/cards/storm.webp",
    ],
  },
  {
    id: "Q19",
    layer: 3,
    dimension: "work-style",
    type: "single-choice",
    text: "¿Cómo te imaginas trabajando en tu futuro empleo?",
    options: [
      "Solo, con mi ritmo y sin distracciones",
      "En un grupo pequeño donde nos complementamos",
      "Liderando un equipo y tomando las decisiones",
      "Con clientes o usuarios directamente, cara a cara",
    ],
    images: [
      "/images/cards/potions.webp",
      "/images/cards/swamp.webp",
      "/images/cards/storm.webp",
      "/images/cards/forest.webp",
    ],
  },
  {
    id: "Q20",
    layer: 3,
    dimension: "risk-tolerance",
    type: "likert-5",
    text: "Cuando te enfrentas a una decisión importante, ¿qué tan seguido vas por la opción arriesgada?",
    options: [
      "Casi nunca — prefiero lo seguro",
      "Raramente — solo si no hay otra",
      "A veces — depende de lo que arriesgue",
      "Seguido — me gustan los retos",
      "Siempre — lo seguro es aburrido",
    ],
    images: [
      "/images/cards/forge.webp",
      "/images/cards/potions.webp",
      "/images/cards/swamp.webp",
      "/images/cards/forest.webp",
      "/images/cards/storm.webp",
    ],
  },
  {
    id: "Q21",
    layer: 3,
    dimension: "schedule",
    type: "binary",
    text: "¿Qué te combina más para estudiar o trabajar?",
    options: ["Un horario fijo que siempre es el mismo", "Poder organizar mi tiempo a mi manera"],
    images: [
      "/images/cards/forge.webp",
      "/images/cards/storm.webp",
    ],
  },
  {
    id: "Q22",
    layer: 3,
    dimension: "orientation",
    type: "single-choice",
    text: "Si pudieras elegir, ¿qué buscarías más en un trabajo?",
    options: [
      "Que me den estabilidad y no tenga que preocuparme",
      "Que me dejen crear y experimentar sin límites",
      "Que me reconozcan y tenga influencia",
      "Que me permita ayudar a otros directamente",
      "Que nunca deje de enseñarme algo nuevo",
    ],
    images: [
      "/images/cards/forge.webp",
      "/images/cards/forest.webp",
      "/images/cards/storm.webp",
      "/images/cards/swamp.webp",
      "/images/cards/potions.webp",
    ],
  },
];

// ── Combined Question Bank ──

export const QUESTION_BANK: Question[] = [
  ...layer1Questions,
  ...layer2Questions,
  ...layer3Questions,
];
