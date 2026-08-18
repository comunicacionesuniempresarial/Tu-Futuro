import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ModalityCard } from "./ModalityCard";
import { modality } from "./fixtures";

describe("ModalityCard", () => {
  it("renders the modality recommendation label", () => {
    render(<ModalityCard modality={modality} />);

    expect(screen.getByText(/presencial/i)).toBeInTheDocument();
  });

  it("uses the dark theme", () => {
    const { container } = render(<ModalityCard modality={modality} />);

    expect(container.firstElementChild).toHaveAttribute("data-theme", "dark");
  });

  it("marks the confidence badge with a neon accent", () => {
    render(<ModalityCard modality={modality} />);

    expect(screen.getByText(/confianza alta/i)).toHaveAttribute(
      "data-accent",
      "neon"
    );
  });

  it("shows the explanation", () => {
    render(<ModalityCard modality={modality} />);

    expect(screen.getByText(modality.explanation)).toBeInTheDocument();
  });

  it("renders the virtual recommendation when provided", () => {
    render(
      <ModalityCard
        modality={{
          recommendation: "virtual",
          confidence: "medium",
          explanation: "Explicación alternativa en línea.",
        }}
      />
    );

    expect(screen.getByText("Virtual")).toBeInTheDocument();
    expect(screen.getByText(/confianza media/i)).toBeInTheDocument();
  });
});