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

  it("links the account icon to the admissions panel", () => {
    render(<BrandHeader />);

    const accountLink = screen.getByRole("link", { name: "Panel de admisiones" });
    expect(accountLink).toHaveAttribute("href", "/admin/login");
    expect(screen.queryByText("settings")).not.toBeInTheDocument();
  });
});
