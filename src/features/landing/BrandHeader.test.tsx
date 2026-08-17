import { render, screen } from "@testing-library/react";
import BrandHeader from "./BrandHeader";

describe("BrandHeader", () => {
  it("renders a persistent header landmark with the brand logo", () => {
    render(<BrandHeader />);

    const header = screen.getByRole("banner");
    expect(header).toHaveAttribute("data-persistent", "true");

    const logo = screen.getByAltText("Uniempresarial");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo/logo-header.png");
  });

  it("offers navigation to the test", () => {
    render(<BrandHeader />);

    const testLink = screen.getByRole("link", { name: "Test vocacional" });
    expect(testLink).toHaveAttribute("href", "/test");
  });

  it("keeps the brand social links", () => {
    render(<BrandHeader />);

    const instagram = screen.getByRole("link", { name: "Instagram" });
    expect(instagram).toHaveAttribute("href", "https://www.instagram.com/uniempresarial/");
  });
});