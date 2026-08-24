import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RadarChart } from "./RadarChart";
import { profile, programProfile } from "./fixtures";

const LABELS = [
  "Realista",
  "Investigador",
  "Artístico",
  "Social",
  "Emprendedor",
  "Convencional",
];

describe("RadarChart", () => {
  it("renders a custom SVG radar with the 6 Spanish axis labels", () => {
    const { container } = render(<RadarChart profile={profile} />);

    const svg = container.querySelector("[data-radar='true']");
    expect(svg).toBeInTheDocument();
    for (const label of LABELS) {
      expect(container.textContent).toContain(label);
    }
  });

  it("draws a single student polygon without a program overlay", () => {
    const { container } = render(<RadarChart profile={profile} />);

    expect(container.querySelectorAll("polygon")).toHaveLength(1);
  });

  it("adds a dashed program overlay polygon when a program profile is provided", () => {
    const { container } = render(
      <RadarChart profile={profile} programProfile={programProfile} />
    );

    const polygons = container.querySelectorAll("polygon");
    expect(polygons).toHaveLength(2);
    expect(polygons[1]).toHaveAttribute("stroke-dasharray");
    expect(polygons[1]).toHaveAttribute("stroke", "#E879F9");
  });

  it("uses the dark theme container", () => {
    const { container } = render(<RadarChart profile={profile} />);

    expect(container.firstElementChild).toHaveAttribute("data-theme", "dark");
  });
});
