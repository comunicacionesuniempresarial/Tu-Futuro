export const SHARE_CARD_FILENAME = "tufuturo-resultado.png";
export const SHARE_CARD_JPG_FILENAME = "tufuturo-resultado.jpg";

export interface ShareCardData {
  archetype: {
    name: string;
    emoji: string;
  };
  topProgram?: string;
}

const escapeXml = (value: string): string =>
  value.replace(/[<>&"']/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  })[character] ?? character);

export function generateShareCardSVG({ archetype, topProgram }: ShareCardData): string {
  const name = escapeXml(archetype.name);
  const emoji = escapeXml(archetype.emoji);
  const program = topProgram ? `Tu mejor coincidencia: ${escapeXml(topProgram)}` : "Descubre tu futuro profesional";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" role="img" aria-label="Resultado vocacional de ${name}">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0033A5"/><stop offset=".55" stop-color="#182c72"/><stop offset="1" stop-color="#D51933"/></linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="18" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="1080" height="1350" fill="url(#background)"/>
  <circle cx="180" cy="170" r="280" fill="#fff" opacity=".08"/><circle cx="940" cy="1130" r="330" fill="#fff" opacity=".08"/>
  <rect x="54" y="54" width="972" height="1242" rx="52" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
  <text x="540" y="160" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="44" font-weight="800" letter-spacing="7">UNIEMPRESARIAL</text>
  <text x="540" y="225" text-anchor="middle" fill="#ffe16d" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="3">TU FUTURO DUAL</text>
  <circle cx="540" cy="560" r="210" fill="#fff" fill-opacity=".14" stroke="#ffe16d" stroke-width="7" filter="url(#glow)"/>
  <text x="540" y="620" text-anchor="middle" font-size="250">${emoji}</text>
  <text x="540" y="860" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="34" font-weight="700">MI ARQUETIPO VOCACIONAL ES</text>
  <text x="540" y="940" text-anchor="middle" fill="#ffe16d" font-family="Arial, sans-serif" font-size="66" font-weight="900">${name}</text>
  <text x="540" y="1050" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="31">${program}</text>
  <text x="540" y="1215" text-anchor="middle" fill="#fff" fill-opacity=".8" font-family="Arial, sans-serif" font-size="26">tufuturodual.uniempresarial.edu.co</text>
</svg>`;
}

async function svgToCanvas(svg: string): Promise<HTMLCanvasElement> {
  const objectUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("No se pudo preparar la carta"));
      image.src = objectUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D no está disponible");
    context.drawImage(image, 0, 0);
    return canvas;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function svgToImageBlob(svg: string, type: "image/png" | "image/jpeg"): Promise<Blob> {
  const canvas = await svgToCanvas(svg);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No se pudo exportar la carta")), type, 0.92);
  });
}
