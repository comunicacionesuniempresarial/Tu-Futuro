import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GapAnalysis } from "./GapAnalysis";
import { profile, topProgramIds } from "./fixtures";

describe("GapAnalysis", () => {
  it("renders a gap row for each top program", () => {
    render(<GapAnalysis riasecProfile={profile} topProgramIds={topProgramIds} />);

    expect(screen.getByText("Ingeniería de Software")).toBeInTheDocument();
    expect(screen.getByText("Administración de Empresas")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();
  });

  it("uses the dark theme", () => {
    const { container } = render(
      <GapAnalysis riasecProfile={profile} topProgramIds={topProgramIds} />
    );

    expect(container.firstElementChild).toHaveAttribute("data-theme", "dark");
  });

  it("exposes the computed gap per program via a neon data attribute", () => {
    render(<GapAnalysis riasecProfile={profile} topProgramIds={topProgramIds} />);

    const gaps = document.querySelectorAll("[data-gap]");
    expect(gaps).toHaveLength(3);
    for (const gap of gaps) {
      expect(Number(gap.getAttribute("data-gap"))).toBeGreaterThanOrEqual(0);
      expect(gap).toHaveAttribute("data-accent", "neon");
    }
  });
});