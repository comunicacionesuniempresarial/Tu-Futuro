/**
 * Question Bank — 25 questions across 4 layers.
 *
 * Layer 1 (Q1-Q12): RIASEC Interests — 12 questions, 2 per dimension,
 *   single-choice with 5 options. Each option has per-dimension RIASEC weights.
 *
 * Layer 2 (Q13-Q17): Aptitudes — 5 behavioral scenario questions,
 *   single-choice with 4 options.
 *
 * Layer 3 (Q18-Q22): Values & Lifestyle — mix of single-choice, likert-5,
 *   and binary questions.
 *
 * Layer 4 (Q23-Q25): Modality — presencial vs. virtual preference signal.
 *
 * All text is in Colombian Spanish, casual tone for a young audience.
 */

import type { Question } from "../scoring/types";

// ── Layer 1: RIASEC Interests (Q1-Q12) ──
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
    text: "Una tarde libre y sin planes, ¿qué te atrapa más?",
    options: [
      "Meterle mano a algo y dejarlo mejor de lo que estaba",
      "Proponer un plan y lograr que todos se animen",
      "Ponerte al día con alguien y terminar dándole un consejo útil",
      "Inventar algo que a nadie más se le ocurriría",
      "Perderte en un tema que te da curiosidad hasta entenderlo a fondo",
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
    text: "En una feria del barrio, ¿qué papel te gusta más?",
    options: [
      "Montar tú mismo lo que se necesita y probar que todo funcione",
      "Atender a cada persona para que la pase increíble",
      "Negociar con los vendedores y locales para conseguir el mejor trato",
      "Dejar la ambientación espectacular",
      "Llevar el orden de las cuentas, las fechas y los pendientes",
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
    text: "Si te quedas viendo un video largo, ¿qué historia te mantiene pegado?",
    options: [
      "Un misterio que nadie ha podido explicar",
      "Cómo alguien convirtió una idea rara en algo que todo el mundo aplaude",
      "Un equipo que se une para lograr lo que parecía imposible",
      "La historia de alguien que arrancó desde cero y terminó convenciendo a todos",
      "Alguien que se la pasa ayudando a otros a salir adelante",
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
    text: "En un proyecto del colegio, ¿cuál es tu papel favorito?",
    options: [
      "El que arma la maqueta y la deja funcionando perfecta",
      "El que averigua por qué pasan las cosas y lo demuestra",
      "El que se encarga de que todo se vea llamativo y diferente",
      "El que acompaña a los que van perdidos hasta que entiendan",
      "El que motiva a todos para ganar la presentación",
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
    text: "¿Dónde podrías pasarte horas sin darte cuenta del tiempo?",
    options: [
      "Un taller donde puedas armar y desarmar cosas con tus manos",
      "Un espacio sin reglas donde proponer tus propias ideas",
      "Un lugar lleno de materiales y colores para crear cosas únicas",
      "Un sitio lleno de gente a la que puedes escuchar y ayudar",
      "Una reunión donde se deciden cosas importantes y tu idea gana",
    ],
    riasecWeights: [
      { R: 0.7, I: 0.1, A: 0.0, S: 0.1, E: 0.0, C: 0.1 },
      { R: 0.0, I: 0.1, A: 0.5, S: 0.0, E: 0.3, C: 0.1 },
      { R: 0.0, I: 0.0, A: 0.8, S: 0.1, E: 0.1, C: 0.0 },
      { R: 0.0, I: 0.0, A: 0.1, S: 0.7, E: 0.1, C: 0.1 },
      { R: 0.0, I: 0.05, A: 0.20, S: 0.15, E: 0.50, C: 0.10 },
    ],
  },

  // ── Q6: Artistic (Creators) ──
  {
    id: "Q6",
    layer: 1,
    dimension: "A",
    type: "single-choice",
    text: "Si pudieras volverte increíble en una habilidad, ¿cuál elegirías?",
    options: [
      "Manejar cualquier herramienta o aparato como si hubieras nacido con él",
      "Partir el problema más enredado en pedazos fáciles de entender",
      "Convertir cualquier idea en algo visual que deje a todos sorprendidos",
      "Que la gente sienta que por fin alguien la entiende y la apoya",
      "Lograr acuerdos donde todos los lados queden contentos",
    ],
    riasecWeights: [
      { R: 0.6, I: 0.1, A: 0.1, S: 0.0, E: 0.1, C: 0.1 },
      { R: 0.1, I: 0.7, A: 0.0, S: 0.0, E: 0.0, C: 0.2 },
      { R: 0.0, I: 0.0, A: 0.8, S: 0.1, E: 0.1, C: 0.0 },
      { R: 0.0, I: 0.0, A: 0.1, S: 0.7, E: 0.1, C: 0.1 },
      { R: 0.0, I: 0.05, A: 0.15, S: 0.35, E: 0.40, C: 0.05 },
    ],
  },

  // ── Q7: Social (Helpers) ──
  {
    id: "Q7",
    layer: 1,
    dimension: "S",
    type: "single-choice",
    text: "Entre tus amigos, ¿cuál eres sin pensarlo?",
    options: [
      "El que se pone las pilas y resuelve lo que haga falta",
      "El que investiga primero cómo resolver el problema",
      "El que llega con la idea más loca",
      "El que nota cuando alguien está decaído y lo levanta",
      "El que mueve a todos hacia la meta",
    ],
    riasecWeights: [
      { R: 0.7, I: 0.1, A: 0.0, S: 0.0, E: 0.1, C: 0.1 },
      { R: 0.1, I: 0.7, A: 0.0, S: 0.0, E: 0.0, C: 0.2 },
      { R: 0.0, I: 0.0, A: 0.7, S: 0.1, E: 0.1, C: 0.1 },
      { R: 0.0, I: 0.0, A: 0.1, S: 0.7, E: 0.1, C: 0.1 },
      { R: 0.0, I: 0.0, A: 0.0, S: 0.5, E: 0.45, C: 0.05 },
    ],
  },

  // ── Q8: Social (Helpers) ──
  {
    id: "Q8",
    layer: 1,
    dimension: "S",
    type: "single-choice",
    text: "¿Qué momento te deja más satisfecho al final del día?",
    options: [
      "Ver funcionando algo que hiciste tú mismo",
      "El momento en que por fin entiendes algo que nadie te sabía explicar",
      "Crear algo y ver cómo otros se emocionan al mirarlo",
      'Que alguien te diga "gracias, me ayudaste muchísimo"',
      "Alcanzar una meta que todos decían que no se podía",
    ],
    riasecWeights: [
      { R: 0.6, I: 0.1, A: 0.1, S: 0.0, E: 0.1, C: 0.1 },
      { R: 0.1, I: 0.7, A: 0.0, S: 0.0, E: 0.0, C: 0.2 },
      { R: 0.0, I: 0.0, A: 0.7, S: 0.2, E: 0.1, C: 0.0 },
      { R: 0.0, I: 0.0, A: 0.1, S: 0.8, E: 0.0, C: 0.1 },
      { R: 0.0, I: 0.05, A: 0.10, S: 0.25, E: 0.55, C: 0.05 },
    ],
  },

  // ── Q9: Enterprising (Persuaders) ──
  {
    id: "Q9",
    layer: 1,
    dimension: "E",
    type: "single-choice",
    text: "¿Qué problema te dan más ganas de meterte a resolver?",
    options: [
      "Algo que se dañó y hay que hacer que vuelva a funcionar",
      "Un enigma que nadie ha podido resolver",
      "Algo que se ve común y sabes que puedes volverlo increíble",
      "Un problema entre personas que necesitan volver a entenderse",
      "Un reto grande donde se necesita estrategia para ganar",
    ],
    riasecWeights: [
      { R: 0.6, I: 0.1, A: 0.1, S: 0.0, E: 0.1, C: 0.1 },
      { R: 0.1, I: 0.7, A: 0.0, S: 0.0, E: 0.0, C: 0.2 },
      { R: 0.0, I: 0.0, A: 0.7, S: 0.1, E: 0.1, C: 0.1 },
      { R: 0.0, I: 0.0, A: 0.1, S: 0.7, E: 0.1, C: 0.1 },
      { R: 0.0, I: 0.20, A: 0.10, S: 0.15, E: 0.60, C: 0.10 },
    ],
  },

  // ── Q10: Enterprising (Persuaders) ──
  {
    id: "Q10",
    layer: 1,
    dimension: "E",
    type: "single-choice",
    text: "Si te regalaran un año libre para hacer lo que quieras, ¿qué te gustaría haber logrado?",
    options: [
      "Algo que hiciste tú mismo y que la gente de verdad usa",
      "Un descubrimiento que nadie había hecho antes",
      "Una obra tuya que la gente no pueda olvidar",
      "Que muchas personas hayan salido adelante gracias a ti",
      "Algo que empezó contigo y creció hasta mover a mucha gente",
    ],
    riasecWeights: [
      { R: 0.5, I: 0.1, A: 0.1, S: 0.0, E: 0.2, C: 0.1 },
      { R: 0.1, I: 0.7, A: 0.0, S: 0.0, E: 0.0, C: 0.2 },
      { R: 0.0, I: 0.0, A: 0.8, S: 0.1, E: 0.1, C: 0.0 },
      { R: 0.0, I: 0.0, A: 0.1, S: 0.8, E: 0.0, C: 0.1 },
      { R: 0.0, I: 0.05, A: 0.10, S: 0.25, E: 0.55, C: 0.05 },
    ],
  },

  // ── Q11: Conventional (Organizers) ──
  {
    id: "Q11",
    layer: 1,
    dimension: "C",
    type: "single-choice",
    text: "Si este fin de semana pudieras hacer un curso corto, ¿cuál eliges?",
    options: [
      "Uno donde armes algo y descubras por qué funciona",
      "Uno de experimentos para ver cómo se comportan las cosas",
      "Uno donde hagas cosas visuales y dejes volar la imaginación",
      "Uno donde aprendas a conectar mejor con las personas",
      "Uno donde organices un plan completo: pasos, tiempos y cuentas",
    ],
    riasecWeights: [
      { R: 0.5, I: 0.3, A: 0.0, S: 0.0, E: 0.1, C: 0.1 },
      { R: 0.1, I: 0.7, A: 0.0, S: 0.1, E: 0.0, C: 0.1 },
      { R: 0.0, I: 0.0, A: 0.8, S: 0.1, E: 0.1, C: 0.0 },
      { R: 0.0, I: 0.0, A: 0.1, S: 0.7, E: 0.1, C: 0.1 },
      { R: 0.0, I: 0.1, A: 0.0, S: 0.45, E: 0.4, C: 0.05 },
    ],
  },

  // ── Q12: Conventional (Organizers) ──
  {
    id: "Q12",
    layer: 1,
    dimension: "C",
    type: "single-choice",
    text: "Si tuvieras que elegir un superpoder, ¿cuál sería?",
    options: [
      "Arreglar lo que sea, por muy dañado que esté",
      "Resolver cualquier misterio con solo pensar",
      "Crear algo tan único que todos se queden mirándolo",
      "Hacer que quien hable contigo se sienta mucho mejor",
      "Convencer a quien sea de lo que propongas",
    ],
    riasecWeights: [
      { R: 0.7, I: 0.1, A: 0.0, S: 0.1, E: 0.0, C: 0.1 },
      { R: 0.1, I: 0.7, A: 0.0, S: 0.0, E: 0.0, C: 0.2 },
      { R: 0.0, I: 0.0, A: 0.8, S: 0.1, E: 0.1, C: 0.0 },
      { R: 0.0, I: 0.0, A: 0.1, S: 0.8, E: 0.0, C: 0.1 },
      { R: 0.0, I: 0.05, A: 0.10, S: 0.25, E: 0.55, C: 0.05 },
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
    text: "En un examen, ¿con cuál tipo de pregunta te sientes más seguro?",
    options: [
      "Las de números y fórmulas",
      "Las de leer y entender un texto largo",
      "La de crear algo propio",
      "Las de trabajar en grupo",
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
    text: "Si tienes un viaje de curso por delante, ¿qué haces primero?",
    options: [
      "Hago un plan detallado paso a paso",
      "Investigo todo lo posible antes",
      "Empiezo a crear algo y ajusto después",
      "Reúno a todos y reparto lo que toca",
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
    text: "¿Cómo aprendes algo nuevo más rápido?",
    options: [
      "Practicando hasta que me sale",
      "Leyendo y investigando a fondo",
      "Buscando, leyendo y averiguando por mi cuenta",
      "Explicándolo a otros",
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
    text: "¿En qué situación rindes mejor bajo presión?",
    options: [
      "Cuando hay una fecha límite y toca entregar",
      "Cuando tengo que analizar y decidir",
      "Cuando tengo que improvisar algo en el momento",
      "Cuando tengo que coordinarme con otros",
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
    text: "¿En qué tipo de tarea te concentras más?",
    options: [
      "Las repetitivas y de rutina",
      "Las que exigen pensar a fondo",
      "Las que piden mucha imaginación",
      "Las de hablar y trabajar con otras personas",
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
    text: "Piensa en tu trabajo ideal: ¿cuánta libertad necesitas para decidir cómo organizar tus tareas y horarios?",
    options: [
      "Ninguna, prefiero que otro decida por mí",
      "Poca",
      "Moderada",
      "Mucha",
      "Total: quiero decidirlo todo",
    ],
  },
  {
    id: "Q19",
    layer: 3,
    dimension: "work-style",
    type: "single-choice",
    text: "¿Cómo prefieres trabajar?",
    options: [
      "Solo y concentrado",
      "En equipo pequeño",
      "Liderando un grupo",
      "Con clientes directamente",
    ],
  },
  {
    id: "Q20",
    layer: 3,
    dimension: "risk-tolerance",
    type: "likert-5",
    text: "En tu vida, ¿qué tan seguido eliges la opción arriesgada en vez de la segura?",
    options: [
      "Nunca",
      "Casi nunca",
      "A veces",
      "Casi siempre",
      "Siempre",
    ],
  },
  {
    id: "Q21",
    layer: 3,
    dimension: "schedule",
    type: "binary",
    text: "¿Prefieres un horario fijo o flexibilidad para organizar tu tiempo?",
    options: ["Horario fijo y predecible", "Flexibilidad total"],
  },
  {
    id: "Q22",
    layer: 3,
    dimension: "orientation",
    type: "single-choice",
    text: "¿Qué es más importante para ti en un trabajo?",
    options: [
      "Seguridad y estabilidad",
      "Creatividad y libertad",
      "Tener poder y que me respeten",
      "Ayudar a otros",
      "Seguir aprendiendo cosas nuevas",
    ],
  },
];

// ── Layer 4: Modality (Q23-Q25) ──
//
// Indirect preference signals for presencial vs. virtual recommendation.
// Deliberately avoids asking "¿presencial o virtual?" directly: the questions
// probe autonomy, environment and social interaction, which are the
// underlying drivers of modality fit. Option indices preserve the scoring
// semantics: 0 → presencial, 1 → virtual, 2 → neutral.

const layer4Questions: Question[] = [
  {
    id: "Q23",
    layer: 4,
    dimension: "modality",
    type: "single-choice",
    text: "Imagina tu semana de estudio ideal: ¿cómo la pasarías?",
    options: [
      "Llena de actividad: clases, proyectos en equipo y gente alrededor todo el día",
      "Tranquila y a mi ritmo: avanzo con mis tiempos, conectado desde donde esté",
      "Mezclada: unos días con clases y compañeros, otros días por mi cuenta",
    ],
  },
  {
    id: "Q24",
    layer: 4,
    dimension: "modality-discipline",
    type: "likert-5",
    text: "Cuando estudias por tu cuenta, sin que nadie te esté recordando las fechas, ¿qué tan bien logras mantenerte al día?",
    options: [
      "Muy mal: me pierdo entre tantas cosas",
      "Mal: se me escapan varias",
      "Regular",
      "Bien: cumplo con lo importante",
      "Muy bien: soy súper organizado/a",
    ],
  },
  {
    id: "Q25",
    layer: 4,
    dimension: "modality-access",
    type: "binary",
    text: "Cuando tienes que aprender algo nuevo, ¿en qué ambiente rindes mejor?",
    options: [
      "Solo/a, en mi espacio y a mi propio ritmo",
      "Con un grupo, resolviendo las dudas al momento",
    ],
  },
];

// ── Combined Question Bank ──

export const QUESTION_BANK: Question[] = [
  ...layer1Questions,
  ...layer2Questions,
  ...layer3Questions,
  ...layer4Questions,
];

// ── Accessors ──

/** Get a single question by its ID. */
export function getQuestionById(id: string): Question | undefined {
  return QUESTION_BANK.find((q) => q.id === id);
}