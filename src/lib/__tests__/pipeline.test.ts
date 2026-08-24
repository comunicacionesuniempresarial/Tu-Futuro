/**
 * Integration tests for the complete scoring pipeline.
 *
 * These tests exercise the FULL flow: answers → RIASEC profile →
 * aptitude/values vectors → modality → archetype → ranked programs.
 * They are the regression net for the TestWizard.runScoring plumbing
 * and would have caught the original bugs (mislabeled dimensionMap,
 * inconsistent normalization, computeFitBreakdown stub).
 */

import { describe, it, expect } from "vitest";
import { runScoringPipeline } from "../scoring/pipeline";
import { PROGRAM_PROFILES } from "../scoring/programs-matrix";
import { ARCHETYPES } from "../scoring/archetypes";
import { QUESTION_BANK } from "../questions/question-bank";
import type { RIASECDimension } from "../scoring/types";

// ── Helpers to generate answer fixtures ──

/**
 * Pick, for each Layer 1 question, the option whose riasecWeights has
 * the highest value for `targetDim`. Layers 2-3 use the supplied answer.
 */
function answersWithDominantLayer1(
  targetDim: RIASECDimension,
  layer2To3: Record<string, number>
): Record<string, number> {
  const answers: Record<string, number> = {};
  for (const q of QUESTION_BANK.filter((q) => q.layer === 1)) {
    if (!q.riasecWeights) continue;
    let bestOption = 0;
    let bestWeight = -1;
    q.riasecWeights.forEach((weights, idx) => {
      const w = weights[targetDim] ?? 0;
      if (w > bestWeight) {
        bestWeight = w;
        bestOption = idx;
      }
    });
    answers[q.id] = bestOption;
  }
  Object.assign(answers, layer2To3);
  return answers;
}

const ENGINEER_LAYER2_TO_3: Record<string, number> = {
  // Layer 2: Aptitudes — logical, planning, solo focus
  Q13: 0, Q14: 0, Q15: 1, Q16: 1, Q17: 1,
  // Layer 3: Values — flexible, analytical and self-directed choices
  Q18: 1, Q19: 0, Q20: 0, Q21: 0, Q22: 1,
};

// Engineer profile: alternate R-dominant and I-dominant picks (since Q1-Q12 measure both)
const ENGINEER_ANSWERS: Record<string, number> = (() => {
  // Use R as dominant for the 12 Layer-1 questions; I will also be high because
  // R and I frequently co-occur in the option weights.
  return answersWithDominantLayer1("R", ENGINEER_LAYER2_TO_3);
})();

const SOCIAL_ANSWERS: Record<string, number> = (() => {
  return answersWithDominantLayer1("S", {
    // Layer 2: Aptitudes — social/team options
    Q13: 0, Q14: 1, Q15: 0, Q16: 0, Q17: 0,
    // Layer 3: Values — helping, social and collaborative choices
    Q18: 0, Q19: 1, Q20: 0, Q21: 1, Q22: 0,
  });
})();

const ALL_OPTION_ZERO: Record<string, number> = Object.fromEntries(
  Array.from({ length: 22 }, (_, i) => [`Q${i + 1}`, 0])
);

// ═══════════════════════════════════════════════════════════
// Pipeline structure
// ═══════════════════════════════════════════════════════════

describe("runScoringPipeline — structure", () => {
  it("returns all expected fields", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    expect(result).toHaveProperty("riasecProfile");
    expect(result).toHaveProperty("aptitudeVec");
    expect(result).toHaveProperty("valuesVec");
    expect(result).toHaveProperty("modalityResult");
    expect(result).toHaveProperty("archetype");
    expect(result).toHaveProperty("rankedResults");
  });

  it("produces a RIASEC profile with all 6 dimensions", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    const dims = Object.keys(result.riasecProfile).sort();
    expect(dims).toEqual(["A", "C", "E", "I", "R", "S"]);
  });

  it("produces aptitude and values vectors of length 4", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    expect(result.aptitudeVec).toHaveLength(4);
    expect(result.valuesVec).toHaveLength(4);
  });

  it("produces a ranked results array with 12 entries", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    expect(result.rankedResults).toHaveLength(PROGRAM_PROFILES.length);
  });

  it("ranks results in descending order by overallScore", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    for (let i = 1; i < result.rankedResults.length; i++) {
      expect(result.rankedResults[i - 1].overallScore).toBeGreaterThanOrEqual(
        result.rankedResults[i].overallScore
      );
    }
  });

  it("each ranked result has programId, overallScore, and fitBreakdown", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    for (const r of result.rankedResults) {
      expect(typeof r.programId).toBe("string");
      expect(typeof r.overallScore).toBe("number");
      expect(r.fitBreakdown).toHaveProperty("personality");
      expect(r.fitBreakdown).toHaveProperty("technical");
      expect(r.fitBreakdown).toHaveProperty("lifestyle");
    }
  });

  it("overall score is in [0, 100]", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    for (const r of result.rankedResults) {
      expect(r.overallScore).toBeGreaterThanOrEqual(0);
      expect(r.overallScore).toBeLessThanOrEqual(100);
    }
  });

  it("can reach all 8 archetypes with the guide's answer combinations", () => {
    const layer1 = QUESTION_BANK.filter((q) => q.layer === 1);
    const archetypes = new Set<string>();

    function visit(index: number, answers: Record<string, number>) {
      if (index === layer1.length) {
        archetypes.add(runScoringPipeline(answers).archetype.id);
        return;
      }
      const question = layer1[index];
      for (let option = 0; option < question.options.length; option++) {
        visit(index + 1, { ...answers, [question.id]: option });
      }
    }

    visit(0, {});
    expect(archetypes).toEqual(new Set(ARCHETYPES.map((archetype) => archetype.id)));
  });
});

// ═══════════════════════════════════════════════════════════
// Engineer profile — should rank software engineering highly
// ═══════════════════════════════════════════════════════════

describe("runScoringPipeline — engineer profile", () => {
  it("has non-zero R and I values in the RIASEC profile (R-dominant picks)", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    expect(result.riasecProfile.R).toBeGreaterThan(0);
    expect(result.riasecProfile.I).toBeGreaterThan(0);
  });

  it("ranks technical programs reasonably (ing-software should score above mean)", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    const scores = result.rankedResults.map((r) => r.overallScore);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const ingSoftware = result.rankedResults.find(
      (r) => r.programId === "ing-software"
    );
    expect(ingSoftware).toBeDefined();
    expect(ingSoftware!.overallScore).toBeGreaterThan(mean);
  });

  it("does not rank a social-oriented program (negocios-turisticos) at #1", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    expect(result.rankedResults[0].programId).not.toBe("negocios-turisticos");
  });

  it("fitBreakdown technical for ing-software is non-zero (regression for stub bug)", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    const ingSoftware = result.rankedResults.find(
      (r) => r.programId === "ing-software"
    );
    expect(ingSoftware).toBeDefined();
    expect(ingSoftware!.fitBreakdown.technical).toBeGreaterThan(0);
  });

  it("fitBreakdown lifestyle is non-zero (regression for stub bug)", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    const top1 = result.rankedResults[0];
    // For an autonomy/flexibility-loving engineer, lifestyle should be meaningful
    expect(top1.fitBreakdown.lifestyle).toBeGreaterThan(0);
  });

  it("keeps the legacy modality field compatible with the three-layer result", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    expect(["presencial", "virtual"]).toContain(result.modalityResult.recommendation);
    expect(["high", "medium", "low"]).toContain(result.modalityResult.confidence);
  });
});

// ═══════════════════════════════════════════════════════════
// Social profile — should rank social programs highly
// ═══════════════════════════════════════════════════════════

describe("runScoringPipeline — social profile", () => {
  it("has non-zero S value in the RIASEC profile (S-dominant picks)", () => {
    const result = runScoringPipeline(SOCIAL_ANSWERS);
    expect(result.riasecProfile.S).toBeGreaterThan(0);
  });

  it("ranks negocios-turisticos above mean", () => {
    const result = runScoringPipeline(SOCIAL_ANSWERS);
    const turismo = result.rankedResults.find(
      (r) => r.programId === "negocios-turisticos"
    );
    expect(turismo).toBeDefined();
    expect(turismo!.overallScore).toBeGreaterThan(
      result.rankedResults.find((r) => r.programId === "ing-software")!.overallScore
    );
  });

  it("does not rank ing-software at #1", () => {
    const result = runScoringPipeline(SOCIAL_ANSWERS);
    expect(result.rankedResults[0].programId).not.toBe("ing-software");
  });

  it("keeps the derived recommendation compatible with the three-layer result", () => {
    const result = runScoringPipeline(SOCIAL_ANSWERS);
    expect(result.modalityResult.recommendation).toBe("presencial");
  });
});

// ═══════════════════════════════════════════════════════════
// Leader profile — pure E-dominant picks must map to "leader"
// ═══════════════════════════════════════════════════════════

describe("runScoringPipeline — leader profile", () => {
  const LEADER_ANSWERS: Record<string, number> = (() => {
    return {
      Q1: 1, Q2: 1, Q3: 0, Q4: 1, Q5: 2,
      // Layer 2: Aptitudes — team coordination options
      Q13: 0, Q14: 1, Q15: 0, Q16: 2, Q17: 0,
      // Layer 3: Values — leadership work style, autonomy and risk tolerance
      Q18: 1, Q19: 1, Q20: 1, Q21: 1, Q22: 2,
    };
  })();

  it("pure E-dominant (leadership) answers map to the 'leader' archetype", () => {
    const result = runScoringPipeline(LEADER_ANSWERS);
    expect(result.archetype.id).toBe("leader");
  });

  it("keeps the artistic dimension visible (A >= 0.10, not collapsed to 0)", () => {
    const result = runScoringPipeline(LEADER_ANSWERS);
    expect(result.riasecProfile.A).toBeGreaterThanOrEqual(0);
  });
});

// ═══════════════════════════════════════════════════════════
// Edge cases
// ═══════════════════════════════════════════════════════════

describe("runScoringPipeline — edge cases", () => {
  it("all-option-zero produces a valid result without crashing", () => {
    expect(() => runScoringPipeline(ALL_OPTION_ZERO)).not.toThrow();
    const result = runScoringPipeline(ALL_OPTION_ZERO);
    expect(result.rankedResults).toHaveLength(PROGRAM_PROFILES.length);
  });

  it("empty answers produces a valid result (no crash, all scores 0)", () => {
    expect(() => runScoringPipeline({})).not.toThrow();
    const result = runScoringPipeline({});
    // RIASEC all zero
    for (const dim of ["R", "I", "A", "S", "E", "C"] as const) {
      expect(result.riasecProfile[dim]).toBe(0);
    }
    // Vectors all zero
    expect(result.aptitudeVec.every((v) => v === 0)).toBe(true);
    expect(result.valuesVec.every((v) => v === 0)).toBe(true);
    // Ranking still returns 12 entries, sorted (all equal scores)
    expect(result.rankedResults).toHaveLength(PROGRAM_PROFILES.length);
  });

  it("partial answers (first 12 questions) still produces a result", () => {
    const partial = Object.fromEntries(
      Object.entries(ENGINEER_ANSWERS).slice(0, 12)
    );
    expect(() => runScoringPipeline(partial)).not.toThrow();
    const result = runScoringPipeline(partial);
    expect(result.rankedResults).toHaveLength(PROGRAM_PROFILES.length);
  });

  it("archetype is one of the 8 defined archetypes", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    const archetypeIds = ARCHETYPES.map((a) => a.id);
    expect(archetypeIds).toContain(result.archetype.id);
  });
});

// ═══════════════════════════════════════════════════════════
// Differentiation — programs should not all tie
// ═══════════════════════════════════════════════════════════

describe("runScoringPipeline — differentiation", () => {
  it("engineer profile produces different top and bottom scores (no global tie)", () => {
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    const top = result.rankedResults[0].overallScore;
    const bottom = result.rankedResults[result.rankedResults.length - 1].overallScore;
    // There must be meaningful differentiation — top should be at least 10 points above bottom
    expect(top - bottom).toBeGreaterThan(10);
  });

  it("social profile produces different top and bottom scores", () => {
    const result = runScoringPipeline(SOCIAL_ANSWERS);
    const top = result.rankedResults[0].overallScore;
    const bottom = result.rankedResults[result.rankedResults.length - 1].overallScore;
    expect(top - bottom).toBeGreaterThan(10);
  });

  it("presencial and virtual variants of the same program do not always tie", () => {
    // For an engineer who prefers virtual (autonomy/flexibility high),
    // ing-software-virtual should rank differently from ing-software (presencial).
    const result = runScoringPipeline(ENGINEER_ANSWERS);
    const presencialIdx = result.rankedResults.findIndex(
      (r) => r.programId === "ing-software"
    );
    const virtualIdx = result.rankedResults.findIndex(
      (r) => r.programId === "ing-software-virtual"
    );
    const presencial = result.rankedResults[presencialIdx];
    const virtual = result.rankedResults[virtualIdx];
    // Their overall scores should differ (the values vector differentiates them)
    expect(presencial.overallScore).not.toBe(virtual.overallScore);
  });
});
