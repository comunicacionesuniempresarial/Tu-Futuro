import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RankingFull } from "./RankingFull";
import { results } from "./fixtures";

describe("RankingFull", () => {
  it("renders every ranked program with its score", () => {
    render(<RankingFull results={results} />);

    expect(screen.getByText("Ingeniería de Software")).toBeInTheDocument();
    expect(screen.getByText("Administración de Empresas")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();
    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("78%")).toBeInTheDocument();
    expect(screen.getByText("71%")).toBeInTheDocument();
  });

  it("uses the dark theme with neon score accents", () => {
    const { container } = render(<RankingFull results={results} />);

    expect(container.firstElementChild).toHaveAttribute("data-theme", "dark");
    expect(screen.getAllByText(/^\d+%$/)).toHaveLength(3);
    for (const score of screen.getAllByText(/^\d+%$/)) {
      expect(score).toHaveAttribute("data-accent", "neon");
    }
  });

  it("shows the modality recommendation badge when provided", () => {
    render(
      <RankingFull results={results} modalityRecommendation="virtual" />
    );

    expect(screen.getByText(/modalidad recomendada: virtual/i)).toBeInTheDocument();
  });
});