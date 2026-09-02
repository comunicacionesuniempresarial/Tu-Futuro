import type { RIASECProfile } from "@/lib/scoring/types";

export const SHARE_CARD_WIDTH = 1200;
export const SHARE_CARD_HEIGHT = 630;
export const SHARE_CARD_FILENAME = "tufuturo-resultado.png";
export const SHARE_CARD_JPG_FILENAME = "tufuturo-resultado.jpg";

async function inlineSvgImages(svg: string): Promise<string> {
  if (typeof window === "undefined") return svg;
  const imagePaths = [...svg.matchAll(/href="(\/(?:archetypes|brand)\/[^\"]+)"/g)].map((match) => match[1]);
  let result = svg;
  for (const path of imagePaths) {
    const response = await fetch(new URL(path, window.location.origin));
    if (!response.ok) throw new Error("No se pudo cargar la ilustración de la carta");
    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("No se pudo preparar la ilustración"));
      reader.readAsDataURL(blob);
    });
    result = result.replaceAll(`href="${path}"`, `href="${dataUrl}"`);
  }
  return result;
}

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
  const isPortrait = height / width > 1.15;
  const frame = 28 * scale;
  const brandBandHeight = (isPortrait ? 170 : 124) * scale;
  const cardRatio = 617 / 768;
  const cardY = brandBandHeight + 12 * scale;
  const cardHeight = isPortrait
    ? Math.min(height * 0.72, (width * 0.94) / cardRatio)
    : Math.min(height - cardY - 4 * scale, (width - frame * 1.5) / cardRatio);
  const cardWidth = cardHeight * cardRatio;
  const cardX = (width - cardWidth) / 2;
  const studentName = data.studentName ? ` · ${data.studentName}` : "";
  const outerFrame = isPortrait
    ? ""
    : `<rect x="${frame}" y="${frame}" width="${width - frame * 2}" height="${height - frame * 2}" rx="${22 * scale}" fill="none" stroke="#e9c400" stroke-width="${2 * scale}" opacity=".8" />`;
  const cardGlow = isPortrait
    ? ""
    : `<rect x="${cardX - 12 * scale}" y="${cardY - 12 * scale}" width="${cardWidth + 24 * scale}" height="${cardHeight + 24 * scale}" rx="${28 * scale}" fill="none" stroke="#ffe16d" stroke-width="${4 * scale}" opacity=".85" filter="url(#card-glow)" />`;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Carta de arquetipo ${data.archetype.name}">
  <defs>
    <filter id="card-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${18 * scale}" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="share-light"><stop offset="0" stop-color="#e9c400" stop-opacity=".2"/><stop offset="1" stop-color="#12131d" stop-opacity="0"/></radialGradient>
  </defs>
  <title>Tu Futuro Dual — Carta de arquetipo ${data.archetype.name}</title>
  <rect width="${width}" height="${height}" fill="#0d0e17" />
  <circle cx="${width / 2}" cy="${height * 0.48}" r="${width * 0.55}" fill="url(#share-light)" />
  ${outerFrame}
  <rect x="${frame}" y="${frame}" width="${width - frame * 2}" height="${brandBandHeight}" rx="${12 * scale}" fill="#fff" />
  <image href="/brand/uniempresarial-logo.png" x="${width * 0.08}" y="${frame + 8 * scale}" width="${width * 0.84}" height="${brandBandHeight - 16 * scale}" preserveAspectRatio="xMidYMid meet" />
  ${isPortrait ? `<text x="${width / 2}" y="${height - 72 * scale}" text-anchor="middle" font-size="${18 * scale}" fill="#ffe16d" font-family="Inter, system-ui, sans-serif">Mi arquetipo: ${data.archetype.name}${studentName}</text>` : ""}
  ${cardGlow}
  <image href="/archetypes/${data.archetype.id}.webp" x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" preserveAspectRatio="xMidYMid meet" />
</svg>`;
}

/**
 * Renders an SVG string to PNG using the broadly supported DOM canvas path.
 * Safari/iOS does not reliably implement createImageBitmap for SVG blobs or
 * OffscreenCanvas, so the standard Image + HTMLCanvasElement flow is used.
 */
export async function svgToPngBlob(svg: string): Promise<Blob> {
  const resolvedSvg = await inlineSvgImages(svg);
  const svgBlob = new Blob([resolvedSvg], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(svgBlob);
  const width = Number(svg.match(/\bwidth="([\d.]+)/)?.[1] ?? SHARE_CARD_WIDTH);
  const height = Number(svg.match(/\bheight="([\d.]+)/)?.[1] ?? SHARE_CARD_HEIGHT);

  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("No se pudo cargar la carta para compartir"));
      image.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context is not available");
    context.drawImage(image, 0, 0, width, height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("No se pudo exportar la carta como PNG"));
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function svgToJpegBlob(svg: string): Promise<Blob> {
  const resolvedSvg = await inlineSvgImages(svg);
  const svgBlob = new Blob([resolvedSvg], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(svgBlob);
  const width = Number(svg.match(/\bwidth="([\d.]+)/)?.[1] ?? SHARE_CARD_WIDTH);
  const height = Number(svg.match(/\bheight="([\d.]+)/)?.[1] ?? SHARE_CARD_HEIGHT);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("No se pudo cargar la carta para descargar"));
      image.src = objectUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context is not available");
    context.fillStyle = "#0d0e17";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No se pudo exportar la carta como JPG")), "image/jpeg", 0.92);
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
