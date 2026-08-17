import { render, screen, act } from "@testing-library/react";
import NarrativeSection from "./NarrativeSection";

describe("NarrativeSection", () => {
  const originalMatchMedia = window.matchMedia;

  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockIntersectionObserver: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    mockIntersectionObserver = vi.fn(function (
      this: unknown,
      callback: IntersectionObserverCallback
    ) {
      (this as Record<string, unknown>).callback = callback;
      return {
        observe: mockObserve,
        unobserve: vi.fn(),
        disconnect: mockDisconnect,
        takeRecords: vi.fn(),
        thresholds: [0.1],
        root: null,
        rootMargin: "",
      };
    });

    global.IntersectionObserver =
      mockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
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

  it("renders eyebrow, title and children", () => {
    mockMatchMedia(false);

    render(
      <NarrativeSection id="como-funciona" eyebrow="Cómo funciona" title="Tu mapa de futuro">
        <p>Contenido de la sección</p>
      </NarrativeSection>
    );

    expect(screen.getByText("Cómo funciona")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Tu mapa de futuro" })
    ).toBeInTheDocument();
    expect(screen.getByText("Contenido de la sección")).toBeInTheDocument();
  });

  it("reveals the section when it enters the viewport", () => {
    mockMatchMedia(false);

    let callback: IntersectionObserverCallback;
    mockIntersectionObserver.mockImplementation(function (
      this: unknown,
      cb: IntersectionObserverCallback
    ) {
      callback = cb;
      (this as Record<string, unknown>).callback = cb;
      return {
        observe: mockObserve,
        unobserve: vi.fn(),
        disconnect: mockDisconnect,
        takeRecords: vi.fn(),
        thresholds: [0.1],
        root: null,
        rootMargin: "",
      };
    });

    const { container } = render(
      <NarrativeSection id="como-funciona" eyebrow="Cómo funciona" title="Título">
        <p>Contenido</p>
      </NarrativeSection>
    );

    const section = container.querySelector("section") as HTMLElement;
    expect(section).toHaveAttribute("data-revealed", "false");

    act(() => {
      callback!(
        [{ isIntersecting: true, target: section, intersectionRatio: 0.5 } as unknown as IntersectionObserverEntry],
        mockIntersectionObserver.mock.results[0].value
      );
    });

    expect(section).toHaveAttribute("data-revealed", "true");
  });

  it("reveals immediately when the user prefers reduced motion", () => {
    mockMatchMedia(true);

    const { container } = render(
      <NarrativeSection id="como-funciona" eyebrow="Cómo funciona" title="Título">
        <p>Contenido</p>
      </NarrativeSection>
    );

    expect(container.querySelector("section")).toHaveAttribute("data-revealed", "true");
  });
});