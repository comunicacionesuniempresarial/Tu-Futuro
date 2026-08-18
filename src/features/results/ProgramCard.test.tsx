import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgramCard } from "./ProgramCard";
import { program, results } from "./fixtures";

const result = results[0];

describe("ProgramCard", () => {
  it("renders the program name, rank and overall score", () => {
    render(<ProgramCard program={program} result={result} rank={1} />);

    expect(screen.getByText(program.name)).toBeInTheDocument();
    expect(screen.getByText(/^1$/)).toBeInTheDocument();
    expect(screen.getByText("92%")).toBeInTheDocument();
  });

  it("uses the dark theme with a neon score accent", () => {
    const { container } = render(
      <ProgramCard program={program} result={result} rank={1} />
    );

    expect(container.firstElementChild).toHaveAttribute("data-theme", "dark");
    expect(screen.getByText("92%")).toHaveAttribute("data-accent", "neon");
  });

  it("shows the fit breakdown when expanded", () => {
    render(
      <ProgramCard program={program} result={result} rank={1} isExpanded />
    );

    expect(screen.getByText(/personalidad/i)).toBeInTheDocument();
    expect(screen.getByText(/aptitud técnica/i)).toBeInTheDocument();
    expect(screen.getByText(/estilo de vida/i)).toBeInTheDocument();
  });

  it("shows the modality recommendation badge when provided", () => {
    render(
      <ProgramCard
        program={program}
        result={result}
        rank={1}
        modalityRecommendation="presencial"
      />
    );

    expect(screen.getByText(/recomendado: presencial/i)).toBeInTheDocument();
  });
});