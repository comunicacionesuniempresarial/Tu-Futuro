/**
 * DIRECTION regression tests for the Layer 2 aptitude vector.
 *
 * Each option in Q13-Q17 carries its own aptitude slot weights
 * ([logical, planning, creative, social]); the chosen option's weights are
 * accumulated element-wise. These tests pin the DIRECTION of the vector so
 * an inverted/broken encoding (e.g. ordinal answer / (options - 1) into the
 * question's dimension slot) can never silently come back.
 *
 * Only Layer 2 answers are used — computeAptitudeVector is pure over them.
 */

import { describe, it, expect } from "vitest";
import { runScoringPipeline } from "../scoring/pipeline";

const ANALYTICAL = { Q13: 0, Q14: 1, Q15: 1, Q16: 1, Q17: 1 };
const SOCIAL = { Q13: 0, Q14: 1, Q15: 0, Q16: 0, Q17: 0 };
const CREATIVE = { Q13: 1, Q14: 0 };
const PLANNING = { Q13: 0, Q14: 2, Q15: 0, Q16: 2 };
const ANALYTICAL_PROFILE = { Q13: 0, Q14: 0, Q15: 1, Q16: 1, Q17: 1 };
const SOCIAL_PROFILE = { Q13: 0, Q14: 1, Q15: 0, Q16: 0, Q17: 0 };

describe("aptitude vector — direction regression", () => {
  it("analytical picks score logical highest", () => {
    const { aptitudeVec: vec } = runScoringPipeline(ANALYTICAL);
    expect(vec[0]).toBe(1.0);
    expect(vec[0]).toBeGreaterThan(vec[1]);
    expect(vec[0]).toBeGreaterThan(vec[2]);
    expect(vec[0]).toBeGreaterThan(vec[3]);
  });

  it("social picks score social highest", () => {
    const { aptitudeVec: vec } = runScoringPipeline(SOCIAL);
    expect(vec[3]).toBe(1.0);
    expect(vec[3]).toBeGreaterThan(vec[0]);
  });

  it("creative picks score creative highest", () => {
    const { aptitudeVec: vec } = runScoringPipeline(CREATIVE);
    expect(vec[2]).toBe(1.0);
    expect(vec[2]).toBeGreaterThan(vec[0]);
    expect(vec[2]).toBeGreaterThan(vec[3]);
  });

  it("planning picks score planning highest", () => {
    const { aptitudeVec: vec } = runScoringPipeline(PLANNING);
    expect(vec[1]).toBe(1.0);
    expect(vec[1]).toBeGreaterThan(vec[0]);
  });

  it("analytical profile outscores social profile on logical", () => {
    const analytical = runScoringPipeline(ANALYTICAL_PROFILE);
    const social = runScoringPipeline(SOCIAL_PROFILE);
    expect(analytical.aptitudeVec[0]).toBeGreaterThan(social.aptitudeVec[0]);
    expect(social.aptitudeVec[3]).toBeGreaterThan(analytical.aptitudeVec[3]);
  });
});
