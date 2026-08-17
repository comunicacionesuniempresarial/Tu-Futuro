import { render, screen } from "@testing-library/react";
import ReducedMotionWrapper from "./ReducedMotionWrapper";

describe("ReducedMotionWrapper", () => {
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

  it("always renders its children, even when reduced motion is active", () => {
    mockMatchMedia(true);

    render(
      <ReducedMotionWrapper>
        <p>Contenido visible</p>
      </ReducedMotionWrapper>
    );

    expect(screen.getByText("Contenido visible")).toBeInTheDocument();
  });

  it("reports motion allowed when the user has no reduced-motion preference", () => {
    mockMatchMedia(false);

    const { container } = render(
      <ReducedMotionWrapper>
        <p>Hola</p>
      </ReducedMotionWrapper>
    );

    expect(container.firstElementChild).toHaveAttribute("data-reduced-motion", "false");
  });

  it("reports motion suppressed when the user prefers reduced motion", () => {
    mockMatchMedia(true);

    const { container } = render(
      <ReducedMotionWrapper>
        <p>Hola</p>
      </ReducedMotionWrapper>
    );

    expect(container.firstElementChild).toHaveAttribute("data-reduced-motion", "true");
  });

  it("renders as the requested element type", () => {
    mockMatchMedia(false);

    const { container } = render(
      <ReducedMotionWrapper as="section">
        <p>Hola</p>
      </ReducedMotionWrapper>
    );

    expect(container.firstElementChild?.tagName).toBe("SECTION");
  });
});