import { render } from "@testing-library/react";
import GamifiedProgress, {
  getLayerForSegment,
  isLayerFinalStep,
  LAYER_SEGMENTS,
} from "./GamifiedProgress";

describe("GamifiedProgress — pure helpers", () => {
  it("maps question positions to their layer groups (12/5/5/3)", () => {
    expect(LAYER_SEGMENTS).toEqual([12, 5, 5, 3]);
    expect(getLayerForSegment(1)).toBe(1);
    expect(getLayerForSegment(12)).toBe(1);
    expect(getLayerForSegment(13)).toBe(2);
    expect(getLayerForSegment(17)).toBe(2);
    expect(getLayerForSegment(18)).toBe(3);
    expect(getLayerForSegment(22)).toBe(3);
    expect(getLayerForSegment(23)).toBe(4);
    expect(getLayerForSegment(25)).toBe(4);
  });

  it("recognizes layer-final steps (12, 17, 22, 25) only", () => {
    expect(isLayerFinalStep(12)).toBe(true);
    expect(isLayerFinalStep(17)).toBe(true);
    expect(isLayerFinalStep(22)).toBe(true);
    expect(isLayerFinalStep(25)).toBe(true);
    expect(isLayerFinalStep(5)).toBe(false);
    expect(isLayerFinalStep(13)).toBe(false);
  });
});

describe("GamifiedProgress", () => {
  const originalMatchMedia = window.matchMedia;

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  function mockMatchMedia(matches: boolean) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  function segment(container: HTMLElement, step: number) {
    return container.querySelector(`[data-step="${step}"]`);
  }

  it("renders 25 segments grouped by layer (12/5/5/3)", () => {
    mockMatchMedia(false);

    const { container } = render(
      <GamifiedProgress currentStep={0} totalSteps={25} currentLayer={1} />
    );

    expect(container.querySelectorAll("[data-step]")).toHaveLength(25);
    expect(container.querySelectorAll('[data-layer="1"]')).toHaveLength(12);
    expect(container.querySelectorAll('[data-layer="2"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-layer="3"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-layer="4"]')).toHaveLength(3);
  });

  it("fills exactly the answered segments (5 of 25)", () => {
    mockMatchMedia(false);

    const { container } = render(
      <GamifiedProgress currentStep={5} totalSteps={25} currentLayer={1} />
    );

    expect(container.querySelectorAll('[data-filled="true"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-filled="false"]')).toHaveLength(20);
  });

  it("fills 12 of 25 at the layer-1 boundary", () => {
    mockMatchMedia(false);

    const { container } = render(
      <GamifiedProgress currentStep={12} totalSteps={25} currentLayer={1} />
    );

    expect(container.querySelectorAll('[data-filled="true"]')).toHaveLength(12);
    expect(segment(container, 13)).toHaveAttribute("data-filled", "false");
  });

  it("marks the current segment active with neon glow", () => {
    mockMatchMedia(false);

    const { container } = render(
      <GamifiedProgress currentStep={7} totalSteps={25} currentLayer={1} />
    );

    expect(segment(container, 7)).toHaveAttribute("data-active", "true");
    expect(segment(container, 7)).toHaveAttribute("data-glow", "true");
    expect(segment(container, 8)).toHaveAttribute("data-active", "false");
    expect(segment(container, 8)).toHaveAttribute("data-glow", "false");
  });

  it("pulses and reports layer completion at step 12", () => {
    mockMatchMedia(false);

    const onSegmentComplete = vi.fn();
    const { container } = render(
      <GamifiedProgress
        currentStep={12}
        totalSteps={25}
        currentLayer={2}
        onSegmentComplete={onSegmentComplete}
      />
    );

    expect(onSegmentComplete).toHaveBeenCalledWith(12);
    expect(segment(container, 12)).toHaveAttribute("data-pulse", "true");
  });

  it("clears the pulse when advancing past the layer boundary", () => {
    mockMatchMedia(false);

    const onSegmentComplete = vi.fn();
    const { container, rerender } = render(
      <GamifiedProgress
        currentStep={12}
        totalSteps={25}
        currentLayer={2}
        onSegmentComplete={onSegmentComplete}
      />
    );
    expect(segment(container, 12)).toHaveAttribute("data-pulse", "true");

    rerender(
      <GamifiedProgress
        currentStep={13}
        totalSteps={25}
        currentLayer={2}
        onSegmentComplete={onSegmentComplete}
      />
    );

    expect(container.querySelector('[data-pulse="true"]')).toBeNull();
    expect(onSegmentComplete).toHaveBeenCalledTimes(1);
  });

  it("pulses again at step 17 without re-firing step 12", () => {
    mockMatchMedia(false);

    const onSegmentComplete = vi.fn();
    const { container, rerender } = render(
      <GamifiedProgress
        currentStep={12}
        totalSteps={25}
        currentLayer={1}
        onSegmentComplete={onSegmentComplete}
      />
    );

    rerender(
      <GamifiedProgress
        currentStep={17}
        totalSteps={25}
        currentLayer={2}
        onSegmentComplete={onSegmentComplete}
      />
    );

    expect(onSegmentComplete).toHaveBeenCalledWith(17);
    expect(onSegmentComplete).toHaveBeenCalledTimes(2);
    expect(segment(container, 17)).toHaveAttribute("data-pulse", "true");
  });

  it("suppresses the pulse animation under reduced motion but keeps state", () => {
    mockMatchMedia(true);

    const onSegmentComplete = vi.fn();
    const { container } = render(
      <GamifiedProgress
        currentStep={12}
        totalSteps={25}
        currentLayer={1}
        onSegmentComplete={onSegmentComplete}
      />
    );

    expect(container.querySelector("[data-motion]")).toHaveAttribute(
      "data-motion",
      "static"
    );
    expect(onSegmentComplete).toHaveBeenCalledWith(12);
    expect(segment(container, 12)).toHaveAttribute("data-pulse", "false");
    expect(segment(container, 12)).toHaveAttribute("data-filled", "true");
  });
});