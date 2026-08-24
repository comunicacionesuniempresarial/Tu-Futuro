import type { RIASECProfile } from "@/lib/scoring/types";

export const SHARE_CARD_WIDTH = 1200;
export const SHARE_CARD_HEIGHT = 630;
export const SHARE_CARD_FILENAME = "tufuturo-resultado.png";

export interface ShareCardData {
  archetype: {
    id: string;
    name: string;
    emoji: string;
    color: string;
  };
  riasecProfile: RIASECProfile;
  topPrograms: { id: string; name: string }[];
  studentName?: string;
}

export interface ShareCardSize {
  width: number;
  height: number;
}

/**
 * Composes a share-ready visual where the archetype artwork is the hero.
 * The source artwork already contains the archetype name and description, so
 * the exported card stays legible instead of shrinking several unrelated
 * widgets into one image.
 */
export function generateShareCardSVG(
  data: ShareCardData,
  size: ShareCardSize = { width: SHARE_CARD_WIDTH, height: SHARE_CARD_HEIGHT }
): string {
  const { width, height } = size;
  const scale = Math.min(width / SHARE_CARD_WIDTH, height / SHARE_CARD_HEIGHT);
  const frame = 28 * scale;
  const cardRatio = 617 / 768;
  const cardHeight = Math.min(height * 0.82, (width - frame * 1.5) / cardRatio);
  const cardWidth = cardHeight * cardRatio;
  const cardX = (width - cardWidth) / 2;
  const cardY = Math.max(82 * scale, (height - cardHeight) / 2);
  const studentName = data.studentName ? ` · ${data.studentName}` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Carta de arquetipo ${data.archetype.name}">
  <defs>
    <filter id="card-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${18 * scale}" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="share-light"><stop offset="0" stop-color="#e9c400" stop-opacity=".2"/><stop offset="1" stop-color="#12131d" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#0d0e17" />
  <circle cx="${width / 2}" cy="${height * 0.48}" r="${width * 0.55}" fill="url(#share-light)" />
  <rect x="${frame}" y="${frame}" width="${width - frame * 2}" height="${height - frame * 2}" rx="${22 * scale}" fill="none" stroke="#e9c400" stroke-width="${2 * scale}" opacity=".8" />
  <text x="${width / 2}" y="${50 * scale}" text-anchor="middle" font-size="${24 * scale}" font-weight="800" fill="#f5f5f5" font-family="Inter, system-ui, sans-serif">Tu Futuro Dual</text>
  <text x="${width / 2}" y="${height - 32 * scale}" text-anchor="middle" font-size="${15 * scale}" fill="#ffe16d" font-family="Inter, system-ui, sans-serif">Mi arquetipo: ${data.archetype.name}${studentName}</text>
  <rect x="${cardX - 14 * scale}" y="${cardY - 14 * scale}" width="${cardWidth + 28 * scale}" height="${cardHeight + 28 * scale}" rx="${30 * scale}" fill="none" stroke="#ffe16d" stroke-width="${4 * scale}" opacity=".95" filter="url(#card-glow)" />
  <rect x="${cardX - 5 * scale}" y="${cardY - 5 * scale}" width="${cardWidth + 10 * scale}" height="${cardHeight + 10 * scale}" rx="${24 * scale}" fill="none" stroke="#22D3EE" stroke-width="${1.5 * scale}" opacity=".55" />
  <image href="/archetypes/${data.archetype.id}.webp" x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" preserveAspectRatio="xMidYMid meet" />
</svg>`;
}

/**
 * Renders an SVG string to a PNG Blob via ImageBitmap + OffscreenCanvas.
 */
export async function svgToPngBlob(svg: string): Promise<Blob> {
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const bitmap = await createImageBitmap(svgBlob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context is not available");
  }
  context.drawImage(bitmap, 0, 0);
  return canvas.convertToBlob({ type: "image/png" });
}
