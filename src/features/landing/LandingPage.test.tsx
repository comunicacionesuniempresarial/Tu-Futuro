import { render, screen, fireEvent, act, within } from "@testing-library/react";
import LandingPage from "./LandingPage";

describe("LandingPage", () => {
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
        thresholds: [0.12],
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

  it("renders exactly 3 section landmarks (Hero, Como funciona, Archetypes + CTA)", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    expect(screen.getAllByRole("region")).toHaveLength(3);
  });

  it("shows each key stat exactly once across the page", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    expect(screen.getAllByText("25")).toHaveLength(1);
    expect(screen.getAllByText("4")).toHaveLength(1);
    expect(screen.getAllByText("8")).toHaveLength(1);
    expect(screen.getAllByText("12")).toHaveLength(1);
  });

  it("absorbs former features and programs content into Como funciona", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    const comoFunciona = screen.getByRole("region", { name: /No es solo un test/ });
    expect(within(comoFunciona).getByText("Radar RIASEC")).toBeInTheDocument();
    expect(within(comoFunciona).getByText("Ingeniería de Software")).toBeInTheDocument();
  });

  it("shows the archetype showcase and a final CTA to start the test", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    expect(screen.getByText("El Constructor")).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: "Comenzar ahora" });
    expect(cta).toHaveAttribute("href", "/test");
  });

  it("starts the narrative hidden and reveals sections as they enter the viewport", () => {
    mockMatchMedia(false);

    let callbacks: IntersectionObserverCallback[] = [];
    mockIntersectionObserver.mockImplementation(function (
      this: unknown,
      cb: IntersectionObserverCallback
    ) {
      callbacks.push(cb);
      (this as Record<string, unknown>).callback = cb;
      return {
        observe: mockObserve,
        unobserve: vi.fn(),
        disconnect: mockDisconnect,
        takeRecords: vi.fn(),
        thresholds: [0.12],
        root: null,
        rootMargin: "",
      };
    });

    const { container } = render(<LandingPage />);

    const sections = container.querySelectorAll("section");
    expect(sections).toHaveLength(3);
    expect(sections[0]).toHaveAttribute("data-entrance", "animated");
    expect(sections[1]).toHaveAttribute("data-revealed", "false");
    expect(sections[2]).toHaveAttribute("data-revealed", "false");

    act(() => {
      callbacks.forEach((callback, index) => {
        callback(
          [
            {
              isIntersecting: true,
              target: sections[index + 1],
              intersectionRatio: 0.5,
            } as unknown as IntersectionObserverEntry,
          ],
          mockIntersectionObserver.mock.results[index].value
        );
      });
    });

    expect(sections[1]).toHaveAttribute("data-revealed", "true");
    expect(sections[2]).toHaveAttribute("data-revealed", "true");
  });

  it("fires onStart when the final CTA is activated", () => {
    mockMatchMedia(false);

    const onStart = vi.fn();
    render(<LandingPage onStart={onStart} />);

    fireEvent.click(screen.getByRole("link", { name: "Comenzar ahora" }));

    expect(onStart).toHaveBeenCalledTimes(1);
  });
});