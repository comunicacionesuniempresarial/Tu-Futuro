import { render, screen } from "@testing-library/react";
import BrandHeader from "./BrandHeader";

describe("BrandHeader", () => {
  it("renders a persistent header landmark with the brand wordmark", () => {
    render(<BrandHeader />);

    const header = screen.getByRole("banner");
    expect(header).toHaveAttribute("data-persistent", "true");

    const wordmark = screen.getByRole("link", { name: /TuFuturoDual/ });
    expect(wordmark).toBeInTheDocument();
    expect(wordmark).toHaveAttribute("href", "/");
  });

  it("offers navigation to the test", () => {
    render(<BrandHeader />);

    const testLink = screen.getByRole("link", { name: /Inicia el test/ });
    expect(testLink).toHaveAttribute("href", "/test");
  });

  it("does not expose the admissions panel in the public header", () => {
    render(<BrandHeader />);

    expect(screen.queryByRole("link", { name: "Panel de admisiones" })).not.toBeInTheDocument();
    expect(screen.queryByText("settings")).not.toBeInTheDocument();
  });
});
