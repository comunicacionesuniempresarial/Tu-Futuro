import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArchetypeCard, type TopDimension } from "./ArchetypeCard";
import { archetype } from "./fixtures";

const relatedArchetypes = [
  { archetype: { ...archetype, id: "investigador", name: "Investigador" }, similarity: 0.85 },
  { archetype: { ...archetype, id: "creador", name: "Creador" }, similarity: 0.72 },
];

const topDimensions: TopDimension[] = [
  { dim: "R", label: "Realista", value: 0.8 },
  { dim: "I", label: "Investigador", value: 0.6 },
  { dim: "A", label: "Artístico", value: 0.3 },
];

describe("ArchetypeCard", () => {
  it("renders the archetype emoji and name", () => {
    render(<ArchetypeCard archetype={archetype} />);

    expect(screen.getByText(archetype.emoji)).toBeInTheDocument();
    expect(screen.getByText(archetype.name)).toBeInTheDocument();
  });

  it("uses the dark theme", () => {
    const { container } = render(<ArchetypeCard archetype={archetype} />);

    expect(container.firstElementChild).toHaveAttribute("data-theme", "dark");
  });

  it("shows the affinity badge with a neon accent", () => {
    render(<ArchetypeCard archetype={archetype} affinity={87} />);

    expect(screen.getByText(/87% de afinidad/)).toHaveAttribute(
      "data-accent",
      "neon"
    );
  });

  it("lists related archetypes with their similarity", () => {
    render(
      <ArchetypeCard
        archetype={archetype}
        relatedArchetypes={relatedArchetypes}
      />
    );

    expect(screen.getByText("Investigador")).toBeInTheDocument();
    expect(screen.getByText("Creador")).toBeInTheDocument();
    expect(screen.getAllByText(/85%/)).toHaveLength(1);
    expect(screen.getAllByText(/72%/)).toHaveLength(1);
  });

  it("shows the top dimensions when provided", () => {
    render(<ArchetypeCard archetype={archetype} topDimensions={topDimensions} />);

    expect(screen.getByText("Realista")).toBeInTheDocument();
    expect(screen.getByText("Investigador")).toBeInTheDocument();
    expect(screen.getByText("Artístico")).toBeInTheDocument();
  });
});