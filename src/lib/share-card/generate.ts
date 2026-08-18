import type { RIASECProfile } from "@/lib/scoring/types";
import { renderRadarSVG } from "./radar-svg";

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
 * Composes the share card as a self-contained SVG string using flat brand
 * colors only. The RIASEC radar is embedded from renderRadarSVG.
 */
export function generateShareCardSVG(
  data: ShareCardData,
  size: ShareCardSize = { width: SHARE_CARD_WIDTH, height: SHARE_CARD_HEIGHT }
): string {
  const { width, height } = size;
  const scale = Math.min(width / SHARE_CARD_WIDTH, height / SHARE_CARD_HEIGHT);

  const radarSize = 460 * scale;
  const radarX = width * 0.62;
  const radarY = height / 2 - radarSize / 2;
  const radar = renderRadarSVG({
    profile: data.riasecProfile,
    width: radarSize,
    height: radarSize,
  });

  const brandY = 64 * scale;
  const emojiSize = 92 * scale;
  const emojiX = width * 0.11;
  const emojiY = height * 0.46;
  const nameY = emojiY + 96 * scale;

  const programsStartY = height * 0.72;
  const programRowHeight = 40 * scale;

  const programList = data.topPrograms
    .map(
      (program, index) =>
        `<text x="${width * 0.11}" y="${programsStartY + index * programRowHeight}" font-size="${28 * scale}" font-weight="600" fill="#f5f5f5" font-family="Inter, system-ui, sans-serif">▸ ${program.name}</text>`
    )
    .join("");

  const studentName = data.studentName
    ? `<text x="${width * 0.11}" y="${brandY + 40 * scale}" font-size="${20 * scale}" fill="#9ca3af" font-family="Inter, system-ui, sans-serif">Resultado de ${data.studentName}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Tu Futuro Dual — resultado vocacional">
  <rect width="${width}" height="${height}" fill="#050505" />
  <rect x="${24 * scale}" y="${24 * scale}" width="${width - 48 * scale}" height="${height - 48 * scale}" fill="none" stroke="#D51933" stroke-width="2" rx="${18 * scale}" />
  <text x="${width * 0.11}" y="${brandY}" font-size="${30 * scale}" font-weight="800" fill="#f5f5f5" font-family="Inter, system-ui, sans-serif">Tu Futuro Dual</text>
  ${studentName}
  <text x="${emojiX}" y="${emojiY}" font-size="${emojiSize}">${data.archetype.emoji}</text>
  <text x="${width * 0.11}" y="${nameY}" font-size="${46 * scale}" font-weight="700" fill="${data.archetype.color}" font-family="Inter, system-ui, sans-serif">${data.archetype.name}</text>
  <text x="${width * 0.11}" y="${nameY + 34 * scale}" font-size="${18 * scale}" fill="#9ca3af" font-family="Inter, system-ui, sans-serif">Tu arquetipo vocacional</text>
  <g transform="translate(${radarX}, ${radarY})">${radar}</g>
  <text x="${width * 0.11}" y="${programsStartY - 32 * scale}" font-size="${20 * scale}" font-weight="700" fill="#0033A5" font-family="Inter, system-ui, sans-serif">Carreras afines</text>
  ${programList}
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
