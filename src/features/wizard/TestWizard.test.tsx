import { render, screen, fireEvent } from "@testing-library/react";
import { MotionGlobalConfig } from "motion/react";
import TestWizard from "./TestWizard";
import { useTestStore } from "@/stores/test-store";
import { QUESTION_BANK } from "@/lib/questions/question-bank";

const { mockRunScoring } = vi.hoisted(() => ({
  mockRunScoring: vi.fn(),
}));

vi.mock("@/lib/scoring/pipeline", () => ({
  runScoringPipeline: mockRunScoring,
}));

const pipelineResult = {
  riasecProfile: { R: 0.2, I: 0.2, A: 0.2, S: 0.2, E: 0.2, C: 0.2 },
  modalityResult: {
    recommendation: "presencial" as const,
    confidence: "medium" as const,
    explanation: "mock",
  },
  archetype: {
    id: "realizador",
    name: "Realizador",
    emoji: "🚀",
    description: "",
    whyDualModel: "",
    riasecProfile: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
  },
  aptitudeVec: [0.25, 0.25, 0.25, 0.25],
  valuesVec: [0.25, 0.25, 0.25, 0.25],
  rankedResults: [],
};

describe("TestWizard (features/wizard)", () => {
  const originalMatchMedia = window.matchMedia;

  beforeAll(() => {
    // Resolve all Framer Motion animations instantly so sequential
    // question transitions (mode="wait") don't exceed the test budget.
    MotionGlobalConfig.skipAnimations = true;
    vi.stubGlobal(
      "Audio",
      class {
        loop = false;
        volume = 1;
        play = vi.fn().mockResolvedValue(undefined);
        pause = vi.fn();
      }
    );
    vi.stubGlobal("alert", vi.fn());
    vi.stubGlobal("confirm", vi.fn(() => false));
  });

  beforeEach(() => {
    window.matchMedia = originalMatchMedia;
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
    useTestStore.getState().resetTest();
    mockRunScoring.mockReset();
    mockRunScoring.mockReturnValue(pipelineResult);
    sessionStorage.clear();
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
    vi.unstubAllGlobals();
  });

  function progressBar() {
    return screen.getByRole("progressbar");
  }

  /** Click the first option of the current question and advance. */
  function answerCurrent() {
    const firstOption = document.querySelector("[data-option]") as HTMLElement;
    fireEvent.click(firstOption);
  }

  function clickNext() {
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
  }

  it("shows the disclaimer first with the gamified progress at zero", () => {
    render(<TestWizard />);

    expect(
      screen.getByRole("heading", { name: /Descargo de Responsabilidad/ })
    ).toBeInTheDocument();
    expect(progressBar()).toHaveAttribute("aria-valuenow", "0");
    expect(mockRunScoring).not.toHaveBeenCalled();
  });

  it("starts the test and shows Q1 with progress updated", () => {
    render(<TestWizard />);

    fireEvent.click(screen.getByRole("button", { name: /Entendido, empezar/ }));

    expect(
      screen.getByText("Una tarde libre y sin planes, ¿qué te atrapa más?")
    ).toBeInTheDocument();
    expect(progressBar()).toHaveAttribute("aria-valuenow", "1");
    expect(mockRunScoring).not.toHaveBeenCalled();
  });

  it("transitions Q1 → Q2 and updates progress without scoring", async () => {
    render(<TestWizard />);
    fireEvent.click(screen.getByRole("button", { name: /Entendido, empezar/ }));

    answerCurrent();
    clickNext();

    expect(
      await screen.findByText("En una feria del barrio, ¿qué papel te gusta más?")
    ).toBeInTheDocument();
    expect(progressBar()).toHaveAttribute("aria-valuenow", "2");
    expect(mockRunScoring).not.toHaveBeenCalled();
  });

  it("does not advance when the current question is unanswered", () => {
    render(<TestWizard />);
    fireEvent.click(screen.getByRole("button", { name: /Entendido, empezar/ }));

    const next = screen.getByRole("button", { name: "Siguiente" });
    expect(next).toBeDisabled();

    fireEvent.click(next);
    expect(
      screen.getByText("Una tarde libre y sin planes, ¿qué te atrapa más?")
    ).toBeInTheDocument();
  });

  it("goes back to Q1 with a reverse transition", async () => {
    render(<TestWizard />);
    fireEvent.click(screen.getByRole("button", { name: /Entendido, empezar/ }));

    answerCurrent();
    clickNext();
    await screen.findByText("En una feria del barrio, ¿qué papel te gusta más?");

    fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

    expect(
      await screen.findByText("Una tarde libre y sin planes, ¿qué te atrapa más?")
    ).toBeInTheDocument();
    expect(progressBar()).toHaveAttribute("aria-valuenow", "1");
  });

  it("shows the layer transition between layers 1 and 2, then continues", async () => {
    render(<TestWizard />);
    fireEvent.click(screen.getByRole("button", { name: /Entendido, empezar/ }));

    // Answer Q1..Q12 to complete layer 1.
    for (let i = 0; i < 12; i += 1) {
      await screen.findByText(QUESTION_BANK[i].text);
      answerCurrent();
      clickNext();
    }

    // Land on step 13 → layer 2 transition screen.
    expect(
      await screen.findByRole("heading", { name: "Aptitudes" })
    ).toBeInTheDocument();
    expect(screen.getByText("Capa 2 de 4")).toBeInTheDocument();
    expect(mockRunScoring).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

    expect(
      await screen.findByText(
        "En un examen, ¿con cuál tipo de pregunta te sientes más seguro?"
      )
    ).toBeInTheDocument();
    expect(progressBar()).toHaveAttribute("aria-valuenow", "13");
    expect(mockRunScoring).not.toHaveBeenCalled();
  }, 20000);

  it("runs the scoring pipeline exactly once on the final step and persists results", async () => {
    render(<TestWizard />);
    fireEvent.click(screen.getByRole("button", { name: /Entendido, empezar/ }));

    // Answer Q1..Q24 with Siguiente, dismissing the layer
    // transition screens that appear after Q12, Q17 and Q22.
    for (let i = 0; i < 24; i += 1) {
      await screen.findByText(QUESTION_BANK[i].text);
      answerCurrent();
      clickNext();
      if (i === 11 || i === 16 || i === 21) {
        await screen.findByRole("button", { name: "Continuar" });
        fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
      }
    }

    // Land on Q25 → answer and click Finalizar.
    expect(
      await screen.findByText(
        "Cuando tienes que aprender algo nuevo, ¿en qué ambiente rindes mejor?"
      )
    ).toBeInTheDocument();
    answerCurrent();

    fireEvent.click(screen.getByRole("button", { name: "Finalizar" }));

    expect(mockRunScoring).toHaveBeenCalledTimes(1);
    const persisted = sessionStorage.getItem("tufuturo-results");
    expect(persisted).not.toBeNull();
    expect(JSON.parse(persisted!)).toMatchObject({
      riasecProfile: pipelineResult.riasecProfile,
      archetype: { id: "realizador" },
    });
  }, 20000);

  it("keeps progress and question flow under reduced motion", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<TestWizard />);
    fireEvent.click(screen.getByRole("button", { name: /Entendido, empezar/ }));

    expect(
      screen.getByText("Una tarde libre y sin planes, ¿qué te atrapa más?")
    ).toBeInTheDocument();
    expect(progressBar()).toHaveAttribute("aria-valuenow", "1");

    const progress = container.querySelector('[role="progressbar"]');
    expect(progress).toHaveAttribute("data-motion", "static");
  });
});