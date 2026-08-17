import { render, screen, act } from "@testing-library/react";
import AnimatedCard from "./AnimatedCard";

describe("AnimatedCard", () => {
  const originalMatchMedia = window.matchMedia;

  let mockObserve: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockIntersectionObserver: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockObserve = vi.fn();
    mockUnobserve = vi.fn();
    mockDisconnect = vi.fn();

    mockIntersectionObserver = vi.fn(function (
      this: unknown,
      callback: IntersectionObserverCallback
    ) {
      (this as Record<string, unknown>).callback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
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

  it("renders its children content", () => {
    mockMatchMedia(false);

    render(<AnimatedCard>Título de la tarjeta</AnimatedCard>);

    expect(screen.getByText("Título de la tarjeta")).toBeInTheDocument();
  });

  it("starts hidden and reveals when the element intersects", () => {
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
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
        takeRecords: vi.fn(),
        thresholds: [0.1],
        root: null,
        rootMargin: "",
      };
    });

    const { container } = render(<AnimatedCard>Contenido</AnimatedCard>);

    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveAttribute("data-revealed", "false");
    expect(mockObserve).toHaveBeenCalledWith(card);

    act(() => {
      callback!(
        [{ isIntersecting: true, target: card, intersectionRatio: 0.5 } as unknown as IntersectionObserverEntry],
        mockIntersectionObserver.mock.results[0].value
      );
    });

    expect(card).toHaveAttribute("data-revealed", "true");
  });

  it("stays hidden when the element never intersects", () => {
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
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
        takeRecords: vi.fn(),
        thresholds: [0.1],
        root: null,
        rootMargin: "",
      };
    });

    const { container } = render(<AnimatedCard>Contenido</AnimatedCard>);

    const card = container.firstElementChild as HTMLElement;
    act(() => {
      callback!(
        [{ isIntersecting: false, target: card, intersectionRatio: 0 } as unknown as IntersectionObserverEntry],
        mockIntersectionObserver.mock.results[0].value
      );
    });

    expect(card).toHaveAttribute("data-revealed", "false");
  });

  it("reveals immediately when the user prefers reduced motion", () => {
    mockMatchMedia(true);

    const { container } = render(<AnimatedCard>Contenido</AnimatedCard>);

    expect(container.firstElementChild).toHaveAttribute("data-revealed", "true");
  });
});