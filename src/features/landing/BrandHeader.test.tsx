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

    const testLink = screen.getByRole("link", { name: /El Duelo/ });
    expect(testLink).toHaveAttribute("href", "/test");
  });

  it("renders action buttons with Material Symbols icons", () => {
    render(<BrandHeader />);

    const accountButton = screen.getByRole("button", { name: "account_circle" });
    expect(accountButton).toBeInTheDocument();

    const settingsButton = screen.getByRole("button", { name: "settings" });
    expect(settingsButton).toBeInTheDocument();
  });
});