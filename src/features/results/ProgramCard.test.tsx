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

  it("renders the program image when provided", () => {
    const programWithImage = { ...program, image: "/images/programs/software.webp" };
    render(
      <ProgramCard program={programWithImage} result={result} rank={1} />
    );

    const img = screen.getByRole("img", { name: programWithImage.name });
    expect(img).toHaveAttribute("src", "/images/programs/software.webp");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("does not render an image when image is not provided", () => {
    const programNoImage = { ...program, image: undefined };
    const { container } = render(
      <ProgramCard program={programNoImage} result={result} rank={1} />
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});