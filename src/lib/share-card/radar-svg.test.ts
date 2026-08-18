import { describe, it, expect } from "vitest";
import {
  RADAR_DIMENSION_LABELS,
  RADAR_PADDING,
  computeRadarPoints,
  renderRadarSVG,
} from "./radar-svg";
import type { RIASECProfile } from "@/lib/scoring/types";

const sampleProfile: RIASECProfile = {
  R: 0.8,
  I: 0.6,
  A: 0.3,
  S: 0.2,
  E: 0.4,
  C: 0.5,
};

const programProfile: RIASECProfile = {
  R: 0.9,
  I: 0.8,
  A: 0.2,
  S: 0.1,
  E: 0.3,
  C: 0.4,
};

describe("RADAR_DIMENSION_LABELS", () => {
  it("maps the 6 RIASEC dimensions to Spanish axis labels", () => {
    expect(RADAR_DIMENSION_LABELS).toEqual({
      R: "Realista",
      I: "Investigador",
      A: "Artístico",
      S: "Social",
      E: "Emprendedor",
      C: "Convencional",
    });
  });
});

describe("computeRadarPoints", () => {
  const W = 400;
  const H = 400;
  const cx = W / 2;
  const cy = H / 2;
  const radius = Math.min(W, H) / 2 - RADAR_PADDING;

  it("returns 6 points with R at the top and clockwise order", () => {
    const points = computeRadarPoints(
      { R: 1, I: 1, A: 1, S: 1, E: 1, C: 1 },
      W,
      H
    );

    expect(points).toHaveLength(6);
    // R (index 0) sits at the top of the hexagon.
    expect(points[0].x).toBeCloseTo(cx, 1);
    expect(points[0].y).toBeCloseTo(cy - radius, 1);
    // I (index 1) sits upper-right (30° clockwise from top).
    expect(points[1].x).toBeCloseTo(cx + radius * Math.cos(Math.PI / 6), 1);
    expect(points[1].y).toBeCloseTo(cy - radius * Math.sin(Math.PI / 6), 1);
    // S (index 3) sits at the bottom.
    expect(points[3].x).toBeCloseTo(cx, 1);
    expect(points[3].y).toBeCloseTo(cy + radius, 1);
  });

  it("scales each point by the profile value (full = rim, zero = center)", () => {
    const full = computeRadarPoints(
      { R: 1, I: 1, A: 1, S: 1, E: 1, C: 1 },
      W,
      H
    );
    const half = computeRadarPoints(
      { R: 0.5, I: 0.5, A: 0.5, S: 0.5, E: 0.5, C: 0.5 },
      W,
      H
    );

    expect(full[0].y).toBeCloseTo(cy - radius, 1);
    expect(half[0].y).toBeCloseTo(cy - radius / 2, 1);
  });

  it("produces different polygons for different profiles", () => {
    const a = computeRadarPoints(
      { R: 1, I: 0, A: 0, S: 0, E: 0, C: 0 },
      W,
      H
    );
    const b = computeRadarPoints(
      { R: 0.25, I: 0, A: 0, S: 0, E: 0, C: 0 },
      W,
      H
    );

    expect(a[0].y).toBeCloseTo(cy - radius, 1);
    expect(b[0].y).toBeCloseTo(cy - radius / 4, 1);
  });
});

describe("renderRadarSVG", () => {
  it("renders an SVG with the 6 Spanish axis labels", () => {
    const svg = renderRadarSVG({ profile: sampleProfile });

    expect(svg).toContain("<svg");
    expect(svg).toContain("Realista");
    expect(svg).toContain("Investigador");
    expect(svg).toContain("Artístico");
    expect(svg).toContain("Social");
    expect(svg).toContain("Emprendedor");
    expect(svg).toContain("Convencional");
  });

  it("draws a filled student polygon using the brand neon primary", () => {
    const svg = renderRadarSVG({ profile: sampleProfile });

    expect(svg).toContain("<polygon");
    expect(svg).toContain('fill="#D51933"');
  });

  it("adds a dashed program overlay polygon when a program profile is provided", () => {
    const svg = renderRadarSVG({
      profile: sampleProfile,
      programProfile,
    });

    const polygons = svg.match(/<polygon/g);
    expect(polygons).toHaveLength(2);
    expect(svg).toContain("stroke-dasharray");
    expect(svg).toContain('stroke="#0033A5"');
  });

  it("keeps the student profile visible under the overlay", () => {
    const svg = renderRadarSVG({
      profile: sampleProfile,
      programProfile,
    });

    // Two polygons: student fill + program overlay.
    expect(svg.match(/<polygon/g)).toHaveLength(2);
    expect(svg).toContain("fill-opacity");
  });

  it("matches the snapshot for a sample profile", () => {
    expect(renderRadarSVG({ profile: sampleProfile })).toMatchSnapshot();
  });
});
