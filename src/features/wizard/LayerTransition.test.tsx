import { render, screen, fireEvent } from "@testing-library/react";
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

  it("renders the layer panel with name, description and continue button", () => {
    mockMatchMedia(false);

    render(<LayerTransition layer={2} onContinue={vi.fn()} />);

    expect(screen.getByText("Capa 2 de 3")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Aptitudes" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ufff, vas muy bien. Ahora descubre lo que se te da especialmente bien.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continuar" })
    ).toBeInTheDocument();
  });

  it("fires onContinue when the user continues", () => {
    mockMatchMedia(false);

    const onContinue = vi.fn();
    render(<LayerTransition layer={1} onContinue={onContinue} />);

    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("marks the transition animated when motion is allowed", () => {
    mockMatchMedia(false);

    const { container } = render(
      <LayerTransition layer={1} onContinue={vi.fn()} />
    );

    expect(container.querySelector("[data-layer-transition]")).toHaveAttribute(
      "data-motion",
      "animated"
    );
  });

  it("switches to the next layer panel on layer change", async () => {
    mockMatchMedia(false);

    const { rerender } = render(
      <LayerTransition layer={2} onContinue={vi.fn()} />
    );

    rerender(<LayerTransition layer={3} onContinue={vi.fn()} />);

    expect(
      await screen.findByRole("heading", { name: "Valores y Estilo de Vida" })
    ).toBeInTheDocument();
  });

  });
