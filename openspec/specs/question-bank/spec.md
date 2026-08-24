# Especificación vigente del banco de preguntas

## Propósito

El test actual tiene 15 preguntas distribuidas en 3 capas. Cada respuesta
se transforma en señales de intereses RIASEC, aptitudes o valores/estilo de
vida. La cuarta capa de modalidad fue eliminada y no forma parte del test.

## Estructura actual

| Capa | Nombre | Preguntas | Cantidad | Resultado |
|---|---|---|---:|---|
| 1 | Intereses | Q1–Q5 | 5 | Perfil RIASEC |
| 2 | Aptitudes | Q13–Q17 | 5 | Vector de aptitudes |
| 3 | Valores y estilo de vida | Q18–Q22 | 5 | Vector de valores |

Las preguntas se muestran en ese orden y el wizard no permite saltar entre
capas. Cada capa tiene una transición visual y cinco segmentos de progreso.

## Reglas de integridad

- Cada pregunta tiene un identificador único.
- `options`, `images` y los vectores de pesos deben tener la misma cantidad
  de opciones cuando están presentes.
- Los índices de `single-choice` y `binary` son base cero.
- Las respuestas `likert-5` usan valores del 1 al 5.
- Las respuestas ausentes o fuera de rango se ignoran y no aportan puntuación.
- La modalidad puede conservarse como dato histórico del lead, pero no se
  mide como una capa ni participa como dimensión de este banco.

## Scoring

- La capa 1 acumula pesos por dimensión RIASEC y normaliza cada dimensión con
  el máximo posible de las preguntas respondidas.
- La capa 2 acumula `[lógica, planificación, creatividad, comunicación]`.
- La capa 3 acumula `[autonomía, riesgo, flexibilidad, ayuda a otros]`.
- El motor combina RIASEC, aptitudes y valores para ordenar los programas.
- El arquetipo se determina comparando el perfil RIASEC con los ocho perfiles
  de arquetipo.

## Fuente de verdad

La implementación vigente está en:

- `src/lib/questions/question-bank.ts`
- `src/lib/scoring/pipeline.ts`
- `src/lib/scoring/riasec.ts`
- `src/lib/scoring/archetypes.ts`

Las especificaciones antiguas de 25 preguntas y 4 capas se conservan solo en
el historial de cambios y no describen el producto actual.
