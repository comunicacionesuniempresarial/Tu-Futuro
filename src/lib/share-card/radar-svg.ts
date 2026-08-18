import type { RIASECProfile } from "@/lib/scoring/types";

/**
 * Pure SVG radar chart helpers for the RIASEC profile.
 * Used by both the results page (RadarChart) and the share card generator.
 */

export const RADAR_PADDING = 40;
export const RADAR_WIDTH = 400;
export const RADAR_HEIGHT = 400;

export const RADAR_DIMENSION_LABELS: Record<keyof RIASECProfile, string> = {
  R: "Realista",
  I: "Investigador",
  A: "Artístico",
  S: "Social",
  E: "Emprendedor",
  C: "Convencional",
};

/** RIASEC axis order, clockwise starting from the top (12 o'clock). */
export const RADAR_AXIS_ORDER: (keyof RIASECProfile)[] = [
  "R",
  "I",
  "A",
  "S",
  "E",
  "C",
];

export interface RadarPoint {
  x: number;
  y: number;
}

export interface RenderRadarSVGOptions {
  profile: RIASECProfile;
  /** Optional second profile drawn as a dashed overlay polygon. */
  programProfile?: RIASECProfile;
  width?: number;
  height?: number;
}

const clamp = (value: number): number =>
  Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

/**
 * Computes the 6 polygon points for a profile on a hexagon radar.
 * Axis order: R (top), I, A, S (bottom), E, C — clockwise.
 */
export function computeRadarPoints(
  profile: RIASECProfile,
  width = RADAR_WIDTH,
  height = RADAR_HEIGHT
): RadarPoint[] {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - RADAR_PADDING;

  return RADAR_AXIS_ORDER.map((dimension, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / RADAR_AXIS_ORDER.length;
    const value = clamp(profile[dimension]);
    return {
      x: cx + Math.cos(angle) * radius * value,
      y: cy + Math.sin(angle) * radius * value,
    };
  });
}

const toPointsString = (points: RadarPoint[]): string =>
  points
    .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(" ");

const gridLines = (
  cx: number,
  cy: number,
  radius: number
): { rings: string; spokes: string } => {
  const rings = [0.33, 0.66, 1]
    .map((fraction) => {
      const points = Array.from({ length: 7 }, (_, index) => {
        const angle =
          -Math.PI / 2 + ((index % 6) * 2 * Math.PI) / RADAR_AXIS_ORDER.length;
        return `${cx + Math.cos(angle) * radius * fraction},${
          cy + Math.sin(angle) * radius * fraction
        }`;
      });
      return `<polyline points="${points.join(" ")}" />`;
    })
    .join("");

  const spokes = RADAR_AXIS_ORDER.map((_, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / RADAR_AXIS_ORDER.length;
    return `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(angle) * radius).toFixed(1)}" y2="${(cy + Math.sin(angle) * radius).toFixed(1)}" />`;
  }).join("");

  return { rings, spokes };
};

const renderLabels = (
  cx: number,
  cy: number,
  radius: number
): string =>
  RADAR_AXIS_ORDER.map((dimension, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / RADAR_AXIS_ORDER.length;
    const x = cx + Math.cos(angle) * (radius + 22);
    const y = cy + Math.sin(angle) * (radius + 22);
    let anchor = "middle";
    if (Math.abs(Math.cos(angle)) > 0.3) {
      anchor = Math.cos(angle) > 0 ? "start" : "end";
    }
    return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle" class="radar-label">${RADAR_DIMENSION_LABELS[dimension]}</text>`;
  }).join("");

/**
 * Renders a standalone dark-themed radar SVG string for a RIASEC profile.
 * Flat brand colors only: neon primary fill + neon secondary dashed overlay.
 */
export function renderRadarSVG(options: RenderRadarSVGOptions): string {
  const { profile, programProfile, width = RADAR_WIDTH, height = RADAR_HEIGHT } =
    options;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - RADAR_PADDING;

  const studentPoints = computeRadarPoints(profile, width, height);
  const { rings, spokes } = gridLines(cx, cy, radius);

  const studentPolygon = `<polygon points="${toPointsString(studentPoints)}" fill="#D51933" fill-opacity="0.35" stroke="#D51933" stroke-width="2" />`;

  const programOverlay = programProfile
    ? `<polygon points="${toPointsString(
        computeRadarPoints(programProfile, width, height)
      )}" fill="none" stroke="#0033A5" stroke-width="2" stroke-dasharray="6 4" />`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Radar de perfil RIASEC">
  <g class="radar-grid" fill="none" stroke="#2a2a2a" stroke-width="1">${rings}</g>
  <g class="radar-spokes" fill="none" stroke="#2a2a2a" stroke-width="1">${spokes}</g>
  ${studentPolygon}
  ${programOverlay}
  <g class="radar-labels" fill="#f5f5f5" font-size="14">${renderLabels(cx, cy, radius)}</g>
</svg>`;
}
