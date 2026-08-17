import { renderHook, act } from "@testing-library/react";
import { useScrollReveal } from "./useScrollReveal";

describe("useScrollReveal", () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockIntersectionObserver: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockObserve = vi.fn();
    mockUnobserve = vi.fn();
    mockDisconnect = vi.fn();

    // Vitest 4: `vi.fn()` no es un constructor — usamos una función constructible
    // real que delega en mocks observables para las aserciones.
    mockIntersectionObserver = vi.fn(
      function (
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
      }
    );

    global.IntersectionObserver =
      mockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("returns ref and false initially", () => {
    const { result } = renderHook(() => useScrollReveal({ threshold: 0.1 }));
    expect(result.current[0]).toBeDefined(); // ref
    expect(result.current[1]).toBe(false); // isVisible
  });

  it("sets isVisible to true when element intersects", () => {
    let callback: IntersectionObserverCallback;

    mockIntersectionObserver.mockImplementation(
      function (this: unknown, cb: IntersectionObserverCallback) {
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
      }
    );

    const { result } = renderHook(() => useScrollReveal({ threshold: 0.1 }));

    const mockElement = document.createElement("div");
    act(() => {
      result.current[0](mockElement); // set ref
    });

    expect(mockObserve).toHaveBeenCalledWith(mockElement);

    act(() => {
      callback?.(
        [
          {
            isIntersecting: true,
            target: mockElement,
            intersectionRatio: 0.5,
          } as unknown as IntersectionObserverEntry,
        ],
        mockIntersectionObserver.mock.results[0].value
      );
    });

    expect(result.current[1]).toBe(true);
  });

  it("does not set isVisible when element does not intersect", () => {
    let callback: IntersectionObserverCallback;

    mockIntersectionObserver.mockImplementation(
      function (this: unknown, cb: IntersectionObserverCallback) {
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
      }
    );

    const { result } = renderHook(() => useScrollReveal({ threshold: 0.1 }));

    const mockElement = document.createElement("div");
    act(() => {
      result.current[0](mockElement);
    });

    act(() => {
      callback?.(
        [
          {
            isIntersecting: false,
            target: mockElement,
            intersectionRatio: 0,
          } as unknown as IntersectionObserverEntry,
        ],
        mockIntersectionObserver.mock.results[0].value
      );
    });

    expect(result.current[1]).toBe(false);
  });

  it("disconnects observer on unmount", () => {
    const { result, unmount } = renderHook(() => useScrollReveal({ threshold: 0.1 }));

    const mockElement = document.createElement("div");
    act(() => {
      result.current[0](mockElement);
    });

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("unobserves previous element when ref changes", () => {
    let callback: IntersectionObserverCallback;

    mockIntersectionObserver.mockImplementation(
      function (this: unknown, cb: IntersectionObserverCallback) {
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
      }
    );

    const { result } = renderHook(() => useScrollReveal({ threshold: 0.1 }));

    const mockElement1 = document.createElement("div");
    const mockElement2 = document.createElement("div");

    act(() => {
      result.current[0](mockElement1);
    });

    act(() => {
      result.current[0](mockElement2);
    });

    expect(mockUnobserve).toHaveBeenCalledWith(mockElement1);
    expect(mockObserve).toHaveBeenCalledWith(mockElement2);
  });
});