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

  it("uses the archetype artwork as the hero", () => {
    const svg = generateShareCardSVG(data);

    expect(svg).toContain('href="/archetypes/ingeniero.webp"');
    expect(svg).toContain("Carta de arquetipo Ingeniero");
  });

  it("keeps technical widgets out of the share image", () => {
    const svg = generateShareCardSVG(data);

    expect(svg).not.toContain("Radar de tus dimensiones");
    expect(svg).not.toContain("Carreras afines");
  });

  it("adds a luminous frame around the artwork", () => {
    const svg = generateShareCardSVG(data);

    expect(svg).toContain("card-glow");
    expect(svg).toContain("radialGradient");
  });

  it("includes the brand name", () => {
    const svg = generateShareCardSVG(data);

    expect(svg).toContain("Tu Futuro Dual");
  });

  it("keeps the brand frame and image export self-contained", () => {
    const svg = generateShareCardSVG(data);

    expect(svg).toContain("Tu Futuro Dual");
    expect(svg).toContain("preserveAspectRatio");
  });
});

describe("svgToPngBlob", () => {
  const drawImage = vi.fn();
  const toBlob = vi.fn((callback: BlobCallback) => callback(
    new Blob(["png-bytes"], { type: "image/png" })
  ));

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a PNG blob through the Safari-compatible DOM canvas path", async () => {
    class FakeImage {
      decoding = "async";
      set src(_value: string) { queueMicrotask(() => this.onload?.()); }
      onload?: () => void;
      onerror?: () => void;
    }
    vi.stubGlobal("Image", FakeImage);
    vi.stubGlobal("URL", { createObjectURL: vi.fn(() => "blob:card"), revokeObjectURL: vi.fn() });
    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      if (tagName === "canvas") {
        return { width: 0, height: 0, getContext: () => ({ drawImage }), toBlob } as unknown as HTMLElement;
      }
      return document.createElementNS("http://www.w3.org/1999/xhtml", tagName);
    });

    const blob = await svgToPngBlob("<svg xmlns='http://www.w3.org/2000/svg'/>");

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/png");
    expect(drawImage).toHaveBeenCalled();
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), "image/png");
  });

  it("rejects when the canvas 2D context is unavailable", async () => {
    class FakeImage {
      set src(_value: string) { queueMicrotask(() => this.onload?.()); }
      onload?: () => void;
    }
    vi.stubGlobal("Image", FakeImage);
    vi.stubGlobal("URL", { createObjectURL: vi.fn(() => "blob:card"), revokeObjectURL: vi.fn() });
    vi.spyOn(document, "createElement").mockReturnValue({ getContext: () => null } as unknown as HTMLElement);

    await expect(svgToPngBlob("<svg/>" )).rejects.toThrow(/2D/i);
  });
});

describe("SHARE_CARD_FILENAME", () => {
  it("is a descriptive PNG filename", () => {
    expect(SHARE_CARD_FILENAME).toMatch(/\.png$/);
    expect(SHARE_CARD_FILENAME).toContain("tufuturo");
  });
});
