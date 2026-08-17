import { render, screen, fireEvent } from "@testing-library/react";
import NeonButton from "./NeonButton";

describe("NeonButton", () => {
  it("renders a button with the given accessible name when no href is provided", () => {
    render(<NeonButton>Comenzar</NeonButton>);

    expect(screen.getByRole("button", { name: "Comenzar" })).toBeInTheDocument();
  });

  it("renders an anchor pointing to href when href is provided", () => {
    render(<NeonButton href="/test">Empezar el test</NeonButton>);

    const link = screen.getByRole("link", { name: "Empezar el test" });
    expect(link).toHaveAttribute("href", "/test");
  });

  it("fires onClick when clicked", () => {
    const onClick = vi.fn();
    render(<NeonButton onClick={onClick}>Empezar</NeonButton>);

    fireEvent.click(screen.getByRole("button", { name: "Empezar" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("marks itself pressed on pointer down and releases on pointer up (press micro-animation)", () => {
    render(<NeonButton>Empezar</NeonButton>);

    const button = screen.getByRole("button", { name: "Empezar" });
    expect(button).toHaveAttribute("data-pressed", "false");

    fireEvent.pointerDown(button);
    expect(button).toHaveAttribute("data-pressed", "true");

    fireEvent.pointerUp(button);
    expect(button).toHaveAttribute("data-pressed", "false");
  });

  it("releases the pressed state when the pointer leaves the button", () => {
    render(<NeonButton>Empezar</NeonButton>);

    const button = screen.getByRole("button", { name: "Empezar" });
    fireEvent.pointerDown(button);
    expect(button).toHaveAttribute("data-pressed", "true");

    fireEvent.pointerLeave(button);
    expect(button).toHaveAttribute("data-pressed", "false");
  });
});