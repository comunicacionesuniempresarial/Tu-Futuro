import { afterEach, describe, expect, it, vi } from "vitest";
import {
  SHARE_CARD_FILENAME,
  SHARE_CARD_HEIGHT,
  SHARE_CARD_WIDTH,
  generateShareCardSVG,
  svgToPngBlob,
  type ShareCardData,
} from "./generate";

const data: ShareCardData = {
  archetype: {
    id: "ingeniero",
    name: "Ingeniero",
    emoji: "⚙️",
    color: "#22D3EE",
  },
  riasecProfile: {
    R: 0.8,
    I: 0.6,
    A: 0.3,
    S: 0.2,
    E: 0.4,
    C: 0.5,
  },
  topPrograms: [
    { id: "ing-software", name: "Ingeniería de Software" },
    { id: "admin-empresas", name: "Administración de Empresas" },
    { id: "marketing", name: "Marketing Digital" },
  ],
};

describe("generateShareCardSVG", () => {
  it("renders a 1200x630 SVG by default", () => {
    const svg = generateShareCardSVG(data);

    expect(svg).toContain("<svg");
    expect(svg).toContain(`viewBox="0 0 ${SHARE_CARD_WIDTH} ${SHARE_CARD_HEIGHT}"`);
  });

  it("honors a custom size for stories/feed layouts", () => {
    const svg = generateShareCardSVG(data, { width: 1080, height: 1920 });

    expect(svg).toContain('viewBox="0 0 1080 1920"');
  });

  it("shows the archetype emoji and name", () => {
    const svg = generateShareCardSVG(data);

    expect(svg).toContain("⚙️");
    expect(svg).toContain("Ingeniero");
  });

  it("embeds the RIASEC radar chart", () => {
    const svg = generateShareCardSVG(data);

    expect(svg).toContain("Radar de perfil RIASEC");
    expect(svg).toContain('fill="#22D3EE"');
  });

  it("lists the top 3 programs", () => {
    const svg = generateShareCardSVG(data);

    expect(svg).toContain("Ingeniería de Software");
    expect(svg).toContain("Administración de Empresas");
    expect(svg).toContain("Marketing Digital");
  });

  it("includes the brand name", () => {
    const svg = generateShareCardSVG(data);

    expect(svg).toContain("Tu Futuro Dual");
  });

  it("uses flat brand colors only (no gradients, filters or blur)", () => {
    const svg = generateShareCardSVG(data);

    expect(svg).not.toContain("linearGradient");
    expect(svg).not.toContain("radialGradient");
    expect(svg).not.toContain("<filter");
    expect(svg).not.toContain("blur");
    expect(svg).not.toContain("backdrop-filter");
  });
});

describe("svgToPngBlob", () => {
  const fakeBitmap = { width: SHARE_CARD_WIDTH, height: SHARE_CARD_HEIGHT };
  const drawImage = vi.fn();
  const convertToBlob = vi.fn().mockResolvedValue(
    new Blob(["png-bytes"], { type: "image/png" })
  );

  class FakeOffscreenCanvas {
    width = SHARE_CARD_WIDTH;
    height = SHARE_CARD_HEIGHT;
    getContext() {
      return { drawImage };
    }
    convertToBlob = convertToBlob;
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a PNG blob by drawing the SVG bitmap on an offscreen canvas", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn().mockResolvedValue(fakeBitmap)
    );
    vi.stubGlobal("OffscreenCanvas", FakeOffscreenCanvas);

    const blob = await svgToPngBlob("<svg xmlns='http://www.w3.org/2000/svg'/>");

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/png");
    expect(createImageBitmap).toHaveBeenCalledOnce();
    expect(drawImage).toHaveBeenCalledWith(fakeBitmap, 0, 0);
    expect(convertToBlob).toHaveBeenCalledWith({ type: "image/png" });
  });

  it("rejects when the canvas 2D context is unavailable", async () => {
    vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(fakeBitmap));
    class NoContextCanvas {
      getContext() {
        return null;
      }
    }
    vi.stubGlobal("OffscreenCanvas", NoContextCanvas);

    await expect(svgToPngBlob("<svg/>")).rejects.toThrow(/2D/i);
  });
});

describe("SHARE_CARD_FILENAME", () => {
  it("is a descriptive PNG filename", () => {
    expect(SHARE_CARD_FILENAME).toMatch(/\.png$/);
    expect(SHARE_CARD_FILENAME).toContain("tufuturo");
  });
});