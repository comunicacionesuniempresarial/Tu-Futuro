import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfettiTrigger } from "./ConfettiTrigger";

const { confettiMock } = vi.hoisted(() => ({
  confettiMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("canvas-confetti", () => ({ default: confettiMock }));

const stubMatchMedia = (matches: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches, addEventListener: vi.fn() })
  );
};

afterEach(() => {
  vi.unstubAllGlobals();
  confettiMock.mockClear();
});

describe("ConfettiTrigger", () => {
  it("fires confetti exactly once on mount", () => {
    stubMatchMedia(false);

    const { rerender } = render(<ConfettiTrigger />);
    rerender(<ConfettiTrigger />);

    expect(confettiMock).toHaveBeenCalledTimes(1);
    expect(confettiMock).toHaveBeenCalledWith(
      expect.objectContaining({ particleCount: expect.any(Number) })
    );
  });

  it("does not fire confetti under prefers-reduced-motion", () => {
    stubMatchMedia(true);

    render(<ConfettiTrigger />);

    expect(confettiMock).not.toHaveBeenCalled();
  });
});