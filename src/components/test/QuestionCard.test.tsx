import { render, fireEvent } from "@testing-library/react";
import DelegateQuestionCard from "./QuestionCard";
import FeatureQuestionCard from "@/features/wizard/QuestionCard";
import type { Question } from "@/lib/scoring/types";

const question: Question = {
  id: "Q1",
  layer: 1,
  dimension: "R",
  type: "single-choice",
  text: "¿Qué te atrapa más?",
  options: ["Opción A", "Opción B"],
};

describe("components/test/QuestionCard (delegate)", () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("delegates to the feature question card component", () => {
    expect(DelegateQuestionCard).toBe(FeatureQuestionCard);
  });

  it("preserves answer handling through the delegate", () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <DelegateQuestionCard question={question} value={undefined} onChange={onChange} />
    );

    fireEvent.click(container.querySelector('[data-option="1"]')!);

    expect(onChange).toHaveBeenCalledWith(1);

    rerender(
      <DelegateQuestionCard question={question} value={1} onChange={onChange} />
    );

    expect(container.querySelector('[data-option="1"]')).toHaveAttribute(
      "data-selected",
      "true"
    );
  });
});