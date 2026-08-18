import { render, fireEvent } from "@testing-library/react";
import QuestionCard from "./QuestionCard";
import type { Question } from "@/lib/scoring/types";

const singleChoiceQuestion: Question = {
  id: "Q1",
  layer: 1,
  dimension: "R",
  type: "single-choice",
  text: "¿Qué te atrapa más?",
  options: ["Opción A", "Opción B", "Opción C"],
};

const likertQuestion: Question = {
  id: "Q14",
  layer: 2,
  dimension: "aptitude-logical",
  type: "likert-5",
  text: "¿Qué tan de acuerdo estás?",
  options: [
    "Muy en desacuerdo",
    "En desacuerdo",
    "Neutral",
    "De acuerdo",
    "Muy de acuerdo",
  ],
};

const binaryQuestion: Question = {
  id: "Q23",
  layer: 4,
  dimension: "modality",
  type: "binary",
  text: "¿Preferís estudiar presencial?",
  options: ["Sí", "No"],
};

describe("QuestionCard", () => {
  const originalMatchMedia = window.matchMedia;

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  function mockMatchMedia(matches: boolean) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  it("renders the question text and all options for single-choice", () => {
    mockMatchMedia(false);

    const { container } = render(
      <QuestionCard
        question={singleChoiceQuestion}
        value={undefined}
        onChange={vi.fn()}
      />
    );

    expect(container.textContent).toContain("¿Qué te atrapa más?");
    expect(container.querySelectorAll("[data-option]")).toHaveLength(3);
  });

  it("reports the selected option and shows the AnswerStamp without reload", () => {
    mockMatchMedia(false);

    const onChange = vi.fn();
    const { container, rerender } = render(
      <QuestionCard
        question={singleChoiceQuestion}
        value={undefined}
        onChange={onChange}
      />
    );

    fireEvent.click(container.querySelector('[data-option="1"]')!);
    expect(onChange).toHaveBeenCalledWith(1);

    // Store update re-renders the controlled card with the new value.
    rerender(
      <QuestionCard
        question={singleChoiceQuestion}
        value={1}
        onChange={onChange}
      />
    );

    expect(container.querySelector('[data-option="1"]')).toHaveAttribute(
      "data-selected",
      "true"
    );
    expect(container.querySelector('[data-option="1"]')).toHaveAttribute(
      "data-ring",
      "true"
    );
    expect(
      container.querySelector('[data-option="1"] [data-stamp]')
    ).toHaveAttribute("data-stamp", "animated");

    // Unselected options carry neither the ring nor the stamp.
    expect(container.querySelector('[data-option="0"]')).toHaveAttribute(
      "data-selected",
      "false"
    );
    expect(container.querySelector('[data-option="0"]')).toHaveAttribute(
      "data-ring",
      "false"
    );
    expect(container.querySelector('[data-option="0"] [data-stamp]')).toBeNull();
    expect(container.querySelectorAll("[data-stamp]")).toHaveLength(1);
  });

  it("shows the stamp on the value selected by state (no click needed)", () => {
    mockMatchMedia(false);

    const { container } = render(
      <QuestionCard
        question={singleChoiceQuestion}
        value={2}
        onChange={vi.fn()}
      />
    );

    expect(container.querySelector('[data-option="2"]')).toHaveAttribute(
      "data-selected",
      "true"
    );
    expect(
      container.querySelector('[data-option="2"] [data-stamp]')
    ).not.toBeNull();
  });

  it("maps likert options to 1-based values", () => {
    mockMatchMedia(false);

    const onChange = vi.fn();
    const { container, rerender } = render(
      <QuestionCard question={likertQuestion} value={undefined} onChange={onChange} />
    );

    fireEvent.click(container.querySelector('[data-option="2"]')!);

    expect(onChange).toHaveBeenCalledWith(3);

    rerender(
      <QuestionCard question={likertQuestion} value={3} onChange={onChange} />
    );

    expect(container.querySelector('[data-option="2"]')).toHaveAttribute(
      "data-selected",
      "true"
    );
  });

  it("maps binary options to index values", () => {
    mockMatchMedia(false);

    const onChange = vi.fn();
    const { container, rerender } = render(
      <QuestionCard question={binaryQuestion} value={undefined} onChange={onChange} />
    );

    fireEvent.click(container.querySelector('[data-option="1"]')!);

    expect(onChange).toHaveBeenCalledWith(1);

    rerender(
      <QuestionCard question={binaryQuestion} value={1} onChange={onChange} />
    );

    expect(container.querySelector('[data-option="1"]')).toHaveAttribute(
      "data-selected",
      "true"
    );
  });

  it("suppresses spring/glow under reduced motion but keeps selection state", () => {
    mockMatchMedia(true);

    const onChange = vi.fn();
    const { container, rerender } = render(
      <QuestionCard
        question={singleChoiceQuestion}
        value={undefined}
        onChange={onChange}
      />
    );

    fireEvent.click(container.querySelector('[data-option="0"]')!);
    expect(onChange).toHaveBeenCalledWith(0);

    rerender(
      <QuestionCard
        question={singleChoiceQuestion}
        value={0}
        onChange={onChange}
      />
    );

    expect(container.querySelector('[data-option="0"]')).toHaveAttribute(
      "data-selected",
      "true"
    );
    expect(
      container.querySelector('[data-option="0"] [data-stamp]')
    ).toHaveAttribute("data-stamp", "static");
    expect(container.querySelector('[data-stamp="animated"]')).toBeNull();
  });
});