import { fireEvent, render, screen } from "@testing-library/react";
import LayerTransition from "./LayerTransition";

describe("LayerTransition", () => {
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

  it("renders Studgard's motivational dialogue and primary action", () => {
    mockMatchMedia(false);
    render(<LayerTransition layer={2} onContinue={vi.fn()} />);

    expect(screen.getByText("Studgard en línea")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "¡Te estás luciendo!" })).toBeInTheDocument();
    expect(screen.getByText(/Ahora vamos a descubrir todo lo que puedes lograr/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "¡Estoy listo!" })).toBeInTheDocument();
  });

  it("fires onContinue when the user is ready", () => {
    mockMatchMedia(false);
    const onContinue = vi.fn();
    render(<LayerTransition layer={1} onContinue={onContinue} />);

    fireEvent.click(screen.getByRole("button", { name: "¡Estoy listo!" }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("marks the transition animated when motion is allowed", () => {
    mockMatchMedia(false);
    const { container } = render(<LayerTransition layer={1} onContinue={vi.fn()} />);
    expect(container.querySelector("[data-layer-transition]")).toHaveAttribute("data-motion", "animated");
  });

  it("updates Studgard's dialogue when the layer changes", async () => {
    mockMatchMedia(false);
    const { rerender } = render(<LayerTransition layer={2} onContinue={vi.fn()} />);
    rerender(<LayerTransition layer={3} onContinue={vi.fn()} />);

    expect(await screen.findByRole("heading", { name: "¡Lo tienes al alcance!" })).toBeInTheDocument();
  });
});
