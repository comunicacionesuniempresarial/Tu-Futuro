/**
 * Question Bank integrity tests.
 *
 * Validates that the QUESTION_BANK (after GUIDE_COPY overlay) is structurally
 * sound: option counts match weight arrays, every Layer 3 question has
 * valuesWeights, weights are non-negative, and the scoring pipeline produces
 * deterministic, differentiated results with the actual production questions.
 */

import { describe, it, expect } from "vitest";
import { QUESTION_BANK } from "../questions/question-bank";
import { runScoringPipeline } from "../scoring/pipeline";
import { PROGRAM_PROFILES } from "../scoring/programs-matrix";
import { ARCHETYPES } from "../scoring/archetypes";
import type { RIASECDimension, RIASECProfile } from "../scoring/types";

// ═══════════════════════════════════════════════════════════
// Structural integrity
// ═══════════════════════════════════════════════════════════

describe("QUESTION_BANK — structural integrity", () => {
  it("contains 15 questions total (5 per layer)", () => {
    const layer1 = QUESTION_BANK.filter((q) => q.layer === 1);
    const layer2 = QUESTION_BANK.filter((q) => q.layer === 2);
    const layer3 = QUESTION_BANK.filter((q) => q.layer === 3);
    expect(layer1).toHaveLength(5);
    expect(layer2).toHaveLength(5);
    expect(layer3).toHaveLength(5);
    expect(QUESTION_BANK).toHaveLength(15);
  });

  it("every question has a unique ID", () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every question has non-empty text", () => {
    for (const q of QUESTION_BANK) {
      expect(q.text.length).toBeGreaterThan(0);
    }
  });

  it("every question has non-empty options array", () => {
    for (const q of QUESTION_BANK) {
      expect(q.options.length).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// Layer 1: RIASEC weights
// ═══════════════════════════════════════════════════════════

describe("QUESTION_BANK — Layer 1 RIASEC weights", () => {
  const layer1 = QUESTION_BANK.filter((q) => q.layer === 1);

  it("every Layer 1 question has riasecWeights", () => {
    for (const q of layer1) {
      expect(q.riasecWeights).toBeDefined();
      expect(Array.isArray(q.riasecWeights)).toBe(true);
    }
  });

  it("riasecWeights length matches options length for every Layer 1 question", () => {
    for (const q of layer1) {
      expect(q.riasecWeights!.length).toBe(q.options.length);
    }
  });

  it("every riasecWeights entry has all 6 RIASEC dimensions", () => {
    const dims: RIASECDimension[] = ["R", "I", "A", "S", "E", "C"];
    for (const q of layer1) {
      for (const weights of q.riasecWeights!) {
        for (const dim of dims) {
          expect(typeof weights[dim]).toBe("number");
          expect(weights[dim]).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it("no riasecWeights entry has all-zero dimensions (dead option)", () => {
    for (const q of layer1) {
      for (let i = 0; i < q.riasecWeights!.length; i++) {
        const weights = q.riasecWeights![i];
        const sum = Object.values(weights).reduce((a, b) => a + b, 0);
        expect(sum).toBeGreaterThan(0);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════
// Layer 2: Aptitude weights
// ═══════════════════════════════════════════════════════════

describe("QUESTION_BANK — Layer 2 aptitude weights", () => {
  const layer2 = QUESTION_BANK.filter((q) => q.layer === 2);

  it("every Layer 2 question has aptitudeWeights", () => {
    for (const q of layer2) {
      expect(q.aptitudeWeights).toBeDefined();
      expect(Array.isArray(q.aptitudeWeights)).toBe(true);
    }
  });

  it("aptitudeWeights length matches options length for every Layer 2 question", () => {
    for (const q of layer2) {
      expect(q.aptitudeWeights!.length).toBe(q.options.length);
    }
  });

  it("every aptitudeWeights entry has exactly 4 slots [logical, planning, creative, social]", () => {
    for (const q of layer2) {
      for (const weights of q.aptitudeWeights!) {
        expect(weights).toHaveLength(4);
        for (const w of weights) {
          expect(typeof w).toBe("number");
          expect(w).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it("no aptitudeWeights entry is all-zero (dead option)", () => {
    for (const q of layer2) {
      for (let i = 0; i < q.aptitudeWeights!.length; i++) {
        const weights = q.aptitudeWeights![i];
        const sum = weights.reduce((a, b) => a + b, 0);
        expect(sum).toBeGreaterThan(0);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════
// Layer 3: Values weights
// ═══════════════════════════════════════════════════════════

describe("QUESTION_BANK — Layer 3 values weights", () => {
  const layer3 = QUESTION_BANK.filter((q) => q.layer === 3);

  it("every Layer 3 question has valuesWeights", () => {
    for (const q of layer3) {
      expect(q.valuesWeights).toBeDefined();
      expect(Array.isArray(q.valuesWeights)).toBe(true);
    }
  });

  it("valuesWeights length matches options length for every Layer 3 question", () => {
    for (const q of layer3) {
      expect(q.valuesWeights!.length).toBe(q.options.length);
    }
  });

  it("every valuesWeights entry has exactly 4 slots [autonomy, risk-tolerance, flexibility, helping]", () => {
    for (const q of layer3) {
      for (const weights of q.valuesWeights!) {
        expect(weights).toHaveLength(4);
        for (const w of weights) {
          expect(typeof w).toBe("number");
          expect(w).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it("no valuesWeights entry is all-zero (dead option)", () => {
    for (const q of layer3) {
      for (let i = 0; i < q.valuesWeights!.length; i++) {
        const weights = q.valuesWeights![i];
        const sum = weights.reduce((a, b) => a + b, 0);
        expect(sum).toBeGreaterThan(0);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════
// Scoring with GUIDE questions — determinism
// ═══════════════════════════════════════════════════════════

describe("scoring pipeline — determinism with GUIDE questions", () => {
  /** Pick the option with the highest weight for a target RIASEC dimension. */
  function pickBestForDim(
    targetDim: RIASECDimension,
    layer2answers: Record<string, number>,
    layer3answers: Record<string, number>
  ): Record<string, number> {
    const answers: Record<string, number> = {};
    for (const q of QUESTION_BANK.filter((q) => q.layer === 1)) {
      if (!q.riasecWeights) continue;
      let bestIdx = 0;
      let bestW = -1;
      q.riasecWeights.forEach((w, idx) => {
        if ((w[targetDim] ?? 0) > bestW) {
          bestW = w[targetDim] ?? 0;
          bestIdx = idx;
        }
      });
      answers[q.id] = bestIdx;
    }
    Object.assign(answers, layer2answers, layer3answers);
    return answers;
  }

  // GUIDE Layer 2 answers for an analytical profile
  const ANALYTICAL_L2: Record<string, number> = {
    Q13: 0, // "guía clara" → planning [0,1,0,0]
    Q14: 2, // "lista, horarios" → planning [0,1,0,0]
    Q15: 1, // "leer manual" → logical [1,0,0,0]
    Q16: 1, // "datos o pautas" → logical [1,0,0,0]
    Q17: 1, // "avanzar a mi ritmo" → logical [1,0,0,0]
  };

  // GUIDE Layer 3 answers for an analytical profile
  const ANALYTICAL_L3: Record<string, number> = {
    Q18: 2, // "organizar archivos" → valuesWeights
    Q19: 1, // "escribir ensayo" → valuesWeights
    Q20: 0, // "clasificar todo" → valuesWeights
    Q21: 0, // "entender la lógica" → valuesWeights
    Q22: 2, // "encuesta con premios" → valuesWeights
  };

  const ENGINEER_ANSWERS = pickBestForDim("R", ANALYTICAL_L2, ANALYTICAL_L3);

  const SOCIAL_L2: Record<string, number> = {
    Q13: 0, // "guía clara" → planning
    Q14: 1, // "animar gente" → social [0,0.5,0,0.5]
    Q15: 0, // "practicar" → logical+planning [0.7,0.3,0,0]
    Q16: 0, // "escuchar y buscar acuerdo" → social [0,0,0,1]
    Q17: 0, // "enseñar" → social [0,0,0,1]
  };

  const SOCIAL_L3: Record<string, number> = {
    Q18: 2, // "organizar archivos"
    Q19: 0, // "armar maqueta"
    Q20: 1, // "separar herramientas"
    Q21: 0, // "entender la lógica"
    Q22: 0, // "salida o fiesta"
  };

  const SOCIAL_ANSWERS = pickBestForDim("S", SOCIAL_L2, SOCIAL_L3);

  it("same inputs always produce the same output", () => {
    const r1 = runScoringPipeline(ENGINEER_ANSWERS);
    const r2 = runScoringPipeline(ENGINEER_ANSWERS);
    expect(r1.riasecProfile).toEqual(r2.riasecProfile);
    expect(r1.aptitudeVec).toEqual(r2.aptitudeVec);
    expect(r1.valuesVec).toEqual(r2.valuesVec);
    expect(r1.archetype.id).toBe(r2.archetype.id);
    expect(r1.modalityResult.recommendation).toBe(r2.modalityResult.recommendation);
    for (let i = 0; i < r1.rankedResults.length; i++) {
      expect(r1.rankedResults[i].programId).toBe(r2.rankedResults[i].programId);
      expect(r1.rankedResults[i].overallScore).toBeCloseTo(
        r2.rankedResults[i].overallScore,
        6
      );
    }
  });

  it("RIASEC profile has all 6 dimensions in [0, 1]", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    const dims: RIASECDimension[] = ["R", "I", "A", "S", "E", "C"];
    for (const dim of dims) {
      expect(result.riasecProfile[dim]).toBeGreaterThanOrEqual(0);
      expect(result.riasecProfile[dim]).toBeLessThanOrEqual(1);
    }
  });

  it("aptitude vector is length 4 with values in [0, 1]", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    expect(result.aptitudeVec).toHaveLength(4);
    for (const v of result.aptitudeVec) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("values vector is length 4 with values in [0, 1]", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    expect(result.valuesVec).toHaveLength(4);
    for (const v of result.valuesVec) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("archetype is one of the 8 defined archetypes", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    expect(ARCHETYPES.map((a) => a.id)).toContain(result.archetype.id);
  });

  it("rankedResults has 12 entries sorted descending", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    expect(result.rankedResults).toHaveLength(PROGRAM_PROFILES.length);
    for (let i = 1; i < result.rankedResults.length; i++) {
      expect(result.rankedResults[i - 1].overallScore).toBeGreaterThanOrEqual(
        result.rankedResults[i].overallScore
      );
    }
  });

  it("all overall scores are in [0, 100]", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    for (const r of result.rankedResults) {
      expect(r.overallScore).toBeGreaterThanOrEqual(0);
      expect(r.overallScore).toBeLessThanOrEqual(100);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// Scoring with GUIDE questions — differentiation
// ═══════════════════════════════════════════════════════════

describe("scoring pipeline — differentiation with GUIDE questions", () => {
  function pickBestForDim(
    targetDim: RIASECDimension,
    layer2answers: Record<string, number>,
    layer3answers: Record<string, number>
  ): Record<string, number> {
    const answers: Record<string, number> = {};
    for (const q of QUESTION_BANK.filter((q) => q.layer === 1)) {
      if (!q.riasecWeights) continue;
      let bestIdx = 0;
      let bestW = -1;
      q.riasecWeights.forEach((w, idx) => {
        if ((w[targetDim] ?? 0) > bestW) {
          bestW = w[targetDim] ?? 0;
          bestIdx = idx;
        }
      });
      answers[q.id] = bestIdx;
    }
    Object.assign(answers, layer2answers, layer3answers);
    return answers;
  }

  const ANALYTICAL_L2: Record<string, number> = {
    Q13: 0, Q14: 2, Q15: 1, Q16: 1, Q17: 1,
  };
  const ANALYTICAL_L3: Record<string, number> = {
    Q18: 2, Q19: 1, Q20: 0, Q21: 0, Q22: 2,
  };

  const SOCIAL_L2: Record<string, number> = {
    Q13: 0, Q14: 1, Q15: 0, Q16: 0, Q17: 0,
  };
  const SOCIAL_L3: Record<string, number> = {
    Q18: 2, Q19: 0, Q20: 1, Q21: 0, Q22: 0,
  };

  const engineerAnswers = pickBestForDim("R", ANALYTICAL_L2, ANALYTICAL_L3);
  const socialAnswers = pickBestForDim("S", SOCIAL_L2, SOCIAL_L3);

  it("engineer and social profiles produce different RIASEC profiles", () => {
    const eng = runScoringPipeline(engineerAnswers);
    const soc = runScoringPipeline(socialAnswers);
    // At least one dimension must differ
    const differs = ["R", "I", "A", "S", "E", "C"].some(
      (d) => eng.riasecProfile[d as RIASECDimension] !== soc.riasecProfile[d as RIASECDimension]
    );
    expect(differs).toBe(true);
  });

  it("engineer profile produces meaningful spread (top - bottom > 5 points)", () => {
    const result = runScoringPipeline(engineerAnswers);
    const top = result.rankedResults[0].overallScore;
    const bottom = result.rankedResults[result.rankedResults.length - 1].overallScore;
    expect(top - bottom).toBeGreaterThan(5);
  });

  it("social profile produces meaningful spread", () => {
    const result = runScoringPipeline(socialAnswers);
    const top = result.rankedResults[0].overallScore;
    const bottom = result.rankedResults[result.rankedResults.length - 1].overallScore;
    expect(top - bottom).toBeGreaterThan(5);
  });

  it("modality result is valid for both profiles", () => {
    const eng = runScoringPipeline(engineerAnswers);
    const soc = runScoringPipeline(socialAnswers);
    expect(["presencial", "virtual"]).toContain(eng.modalityResult.recommendation);
    expect(["presencial", "virtual"]).toContain(soc.modalityResult.recommendation);
    expect(["high", "medium", "low"]).toContain(eng.modalityResult.confidence);
    expect(["high", "medium", "low"]).toContain(soc.modalityResult.confidence);
  });
});

// ═══════════════════════════════════════════════════════════
// Edge cases with GUIDE questions
// ═══════════════════════════════════════════════════════════

describe("scoring pipeline — edge cases with GUIDE questions", () => {
  it("empty answers produces valid result without crash", () => {
    expect(() => runScoringPipeline({})).not.toThrow();
    const result = runScoringPipeline({});
    expect(result.rankedResults).toHaveLength(PROGRAM_PROFILES.length);
    // All scores should be 0
    for (const r of result.rankedResults) {
      expect(r.overallScore).toBe(0);
    }
  });

  it("single Layer 1 answer produces a non-zero RIASEC profile", () => {
    // Answer only Q1 with option 0 (C:1 in GUIDE)
    const result = runScoringPipeline({ Q1: 0 });
    const total = Object.values(result.riasecProfile).reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThan(0);
  });

  it("single Layer 2 answer produces a non-zero aptitude vector", () => {
    // Answer only Q13 with option 0 (planning [0,1,0,0] in GUIDE)
    const result = runScoringPipeline({ Q13: 0 });
    const total = result.aptitudeVec.reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThan(0);
  });

  it("single Layer 3 answer produces a non-zero values vector", () => {
    // Answer only Q18 with option 0 (valuesWeights [0.8,0.1,0.1,0] in GUIDE)
    const result = runScoringPipeline({ Q18: 0 });
    const total = result.valuesVec.reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThan(0);
  });
});
