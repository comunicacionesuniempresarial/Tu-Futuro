import { render, screen, fireEvent } from "@testing-library/react";
import Hero from "./Hero";

describe("Hero", () => {
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

  it("renders the bold headline", () => {
    mockMatchMedia(false);

    render(<Hero />);

    expect(
      screen.getByRole("heading", { level: 1, name: /destino dual/i })
    ).toBeInTheDocument();
  });

  it("shows the value propositions inline, each exactly once", () => {
    mockMatchMedia(false);

    render(<Hero />);

    expect(screen.getAllByText("Las 4 Capas del Poder")).toHaveLength(1);
    expect(screen.getAllByText("Radar RIASEC")).toHaveLength(1);
    expect(screen.getAllByText("Tu Arquetipo Mítico")).toHaveLength(1);
  });

  it("renders the CTA linking to the test", () => {
    mockMatchMedia(false);

    render(<Hero />);

    const cta = screen.getByRole("link", { name: /Comenzar el Duelo/ });
    expect(cta).toHaveAttribute("href", "/test");
  });

  it("fires onStart when the CTA is activated", () => {
    mockMatchMedia(false);

    const onStart = vi.fn();
    render(<Hero onStart={onStart} />);

    fireEvent.click(screen.getByRole("link", { name: /Comenzar el Duelo/ }));

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("animates the entrance when motion is allowed", () => {
    mockMatchMedia(false);

    const { container } = render(<Hero />);

    expect(container.querySelector("[data-entrance]")).toHaveAttribute("data-entrance", "animated");
  });

  it("renders the entrance static when the user prefers reduced motion", () => {
    mockMatchMedia(true);

    const { container } = render(<Hero />);

    expect(container.querySelector("[data-entrance]")).toHaveAttribute("data-entrance", "static");
  });
});