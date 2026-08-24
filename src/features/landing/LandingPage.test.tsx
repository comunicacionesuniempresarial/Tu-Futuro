import { render, screen, fireEvent } from "@testing-library/react";
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

  it("renders the focused hero experience", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    expect(screen.getAllByRole("region")).toHaveLength(1);
  });

  it("keeps the landing free of the archetype spoiler block", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    expect(screen.queryByText("El Constructor")).not.toBeInTheDocument();
    expect(screen.queryByText("El Investigador")).not.toBeInTheDocument();
  });

  it("renders no social proof counter or testimonial", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    expect(screen.queryByText("12.400+")).not.toBeInTheDocument();
    expect(screen.queryByText(/Sofía R/)).not.toBeInTheDocument();
    expect(screen.queryByText(/estudiantes ya descubrieron/)).not.toBeInTheDocument();
  });

  it("keeps the landing focused on the test", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    expect(screen.getByText("15 preguntas, una guía clara")).toBeInTheDocument();
    expect(screen.queryByText("Las 4 Capas del Poder")).not.toBeInTheDocument();
  });

  it("shows the CTA to start the test", () => {
    mockMatchMedia(false);

    render(<LandingPage />);

    const cta = screen.getAllByRole("link", { name: "Inicia el test" })[1];
    expect(cta).toHaveAttribute("href", "/test");
  });

  it("starts the narrative hidden and reveals sections as they enter the viewport", () => {
    mockMatchMedia(false);

    mockIntersectionObserver.mockImplementation(function (
      this: unknown,
      cb: IntersectionObserverCallback
    ) {
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
    expect(sections).toHaveLength(1);
    expect(sections[0]).toHaveAttribute("data-entrance", "animated");
  });

  it("fires onStart when the final CTA is activated", () => {
    mockMatchMedia(false);

    const onStart = vi.fn();
    render(<LandingPage onStart={onStart} />);

    fireEvent.click(screen.getAllByRole("link", { name: "Inicia el test" })[1]);

    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
