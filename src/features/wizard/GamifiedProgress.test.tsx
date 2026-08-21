import { render } from "@testing-library/react";
import GamifiedProgress, {
  getLayerForSegment,
  isLayerFinalStep,
  LAYER_SEGMENTS,
} from "./GamifiedProgress";

describe("GamifiedProgress — pure helpers", () => {
  it("maps question positions to their layer groups (5/5/5)", () => {
    expect(LAYER_SEGMENTS).toEqual([5, 5, 5]);
    expect(getLayerForSegment(1)).toBe(1);
    expect(getLayerForSegment(5)).toBe(1);
    expect(getLayerForSegment(6)).toBe(2);
    expect(getLayerForSegment(10)).toBe(2);
    expect(getLayerForSegment(11)).toBe(3);
    expect(getLayerForSegment(15)).toBe(3);
  });

  it("recognizes layer-final steps (5, 10, 15) only", () => {
    expect(isLayerFinalStep(5)).toBe(true);
    expect(isLayerFinalStep(10)).toBe(true);
    expect(isLayerFinalStep(15)).toBe(true);
    expect(isLayerFinalStep(1)).toBe(false);
    expect(isLayerFinalStep(6)).toBe(false);
    expect(isLayerFinalStep(11)).toBe(false);
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

  it("renders 15 segments grouped by layer (5/5/5)", () => {
    mockMatchMedia(false);

    const { container } = render(
      <GamifiedProgress currentStep={0} totalSteps={15} currentLayer={1} />
    );

    expect(container.querySelectorAll("[data-step]")).toHaveLength(15);
    expect(container.querySelectorAll('[data-layer="1"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-layer="2"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-layer="3"]')).toHaveLength(5);
  });

  it("fills exactly the answered segments (5 of 15)", () => {
    mockMatchMedia(false);

    const { container } = render(
      <GamifiedProgress currentStep={5} totalSteps={15} currentLayer={1} />
    );

    expect(container.querySelectorAll('[data-filled="true"]')).toHaveLength(5);
    expect(container.querySelectorAll('[data-filled="false"]')).toHaveLength(10);
  });

  it("fills 5 of 15 at the layer-1 boundary", () => {
    mockMatchMedia(false);

    const { container } = render(
      <GamifiedProgress currentStep={5} totalSteps={15} currentLayer={1} />
    );

    expect(container.querySelectorAll('[data-filled="true"]')).toHaveLength(5);
    expect(segment(container, 6)).toHaveAttribute("data-filled", "false");
  });

  it("marks the current segment active with neon glow", () => {
    mockMatchMedia(false);

    const { container } = render(
      <GamifiedProgress currentStep={7} totalSteps={15} currentLayer={2} />
    );

    expect(segment(container, 7)).toHaveAttribute("data-active", "true");
    expect(segment(container, 7)).toHaveAttribute("data-glow", "true");
    expect(segment(container, 8)).toHaveAttribute("data-active", "false");
    expect(segment(container, 8)).toHaveAttribute("data-glow", "false");
  });

  it("pulses and reports layer completion at step 5", () => {
    mockMatchMedia(false);

    const onSegmentComplete = vi.fn();
    const { container } = render(
      <GamifiedProgress
        currentStep={5}
        totalSteps={15}
        currentLayer={1}
        onSegmentComplete={onSegmentComplete}
      />
    );

    expect(onSegmentComplete).toHaveBeenCalledWith(5);
    expect(segment(container, 5)).toHaveAttribute("data-pulse", "true");
  });

  it("clears the pulse when advancing past the layer boundary", () => {
    mockMatchMedia(false);

    const onSegmentComplete = vi.fn();
    const { container, rerender } = render(
      <GamifiedProgress
        currentStep={5}
        totalSteps={15}
        currentLayer={1}
        onSegmentComplete={onSegmentComplete}
      />
    );
    expect(segment(container, 5)).toHaveAttribute("data-pulse", "true");

    rerender(
      <GamifiedProgress
        currentStep={6}
        totalSteps={15}
        currentLayer={2}
        onSegmentComplete={onSegmentComplete}
      />
    );

    expect(container.querySelector('[data-pulse="true"]')).toBeNull();
    expect(onSegmentComplete).toHaveBeenCalledTimes(1);
  });

  it("pulses again at step 10 without re-firing step 5", () => {
    mockMatchMedia(false);

    const onSegmentComplete = vi.fn();
    const { container, rerender } = render(
      <GamifiedProgress
        currentStep={5}
        totalSteps={15}
        currentLayer={1}
        onSegmentComplete={onSegmentComplete}
      />
    );

    rerender(
      <GamifiedProgress
        currentStep={10}
        totalSteps={15}
        currentLayer={2}
        onSegmentComplete={onSegmentComplete}
      />
    );

    expect(onSegmentComplete).toHaveBeenCalledWith(10);
    expect(onSegmentComplete).toHaveBeenCalledTimes(2);
    expect(segment(container, 10)).toHaveAttribute("data-pulse", "true");
  });

  it("suppresses the pulse animation under reduced motion but keeps state", () => {
    mockMatchMedia(true);

    const onSegmentComplete = vi.fn();
    const { container } = render(
      <GamifiedProgress
        currentStep={5}
        totalSteps={15}
        currentLayer={1}
        onSegmentComplete={onSegmentComplete}
      />
    );

    expect(container.querySelector("[data-motion]")).toHaveAttribute(
      "data-motion",
      "static"
    );
    expect(onSegmentComplete).toHaveBeenCalledWith(5);
    expect(segment(container, 5)).toHaveAttribute("data-pulse", "false");
    expect(segment(container, 5)).toHaveAttribute("data-filled", "true");
  });
});
