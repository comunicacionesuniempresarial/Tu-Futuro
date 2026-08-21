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

  it("shows the archetype showcase, each exactly once", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    expect(screen.getAllByText("El Constructor")).toHaveLength(1);
    expect(screen.getAllByText("El Investigador")).toHaveLength(1);
    expect(screen.getAllByText("El Creador")).toHaveLength(1);
    expect(screen.getAllByText("El Conector")).toHaveLength(1);
  });

  it("renders no social proof counter or testimonial", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    expect(screen.queryByText("12.400+")).not.toBeInTheDocument();
    expect(screen.queryByText(/Sofía R/)).not.toBeInTheDocument();
    expect(screen.queryByText(/estudiantes ya descubrieron/)).not.toBeInTheDocument();
  });

  it("shows the value proposition in Las 4 Capas del Poder", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    const paraQueEs = screen.getByRole("region", { name: /Las 4 Capas del Poder/ });
    expect(within(paraQueEs).getByText(/test vocacional gamificado/)).toBeInTheDocument();
    expect(within(paraQueEs).getByText(/Modelo Dual de Uniempresarial/)).toBeInTheDocument();
  });

  it("shows the archetype showcase and the CTA to start the test", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    expect(screen.getByText("El Constructor")).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /Comenzar el Duelo/ });
    expect(cta).toHaveAttribute("href", "/test");
  });

  it("starts the narrative hidden and reveals sections as they enter the viewport", () => {
    mockMatchMedia(false);

    const callbacks: IntersectionObserverCallback[] = [];
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

    fireEvent.click(screen.getByRole("link", { name: /Comenzar el Duelo/ }));

    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
