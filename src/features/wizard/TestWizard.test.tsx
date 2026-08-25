import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
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

  /** Click the first option of the current question. */
  function answerCurrent() {
    const firstOption = document.querySelector("[data-option]") as HTMLElement;
    fireEvent.click(firstOption);
  }

  /**
   * Answer the current question and wait for auto-advance (~300ms real time).
   * Captures the step BEFORE clicking, then waits for the store step to increment.
   */
  async function answerAndAdvance() {
    const stepBefore = useTestStore.getState().step;
    answerCurrent();
    // Wait for the store to advance to the next step
    await waitFor(() => {
      expect(useTestStore.getState().step).toBe(stepBefore + 1);
    }, { timeout: 3000 });
  }

  function startTest() {
    fireEvent.click(screen.getByRole("button", { name: /Entendido, empezar/ }));
    fireEvent.click(screen.getByRole("button", { name: "¡Estoy listo!" }));
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

    startTest();

    expect(
      screen.getByText(QUESTION_BANK[0].text)
    ).toBeInTheDocument();
    expect(progressBar()).toHaveAttribute("aria-valuenow", "1");
    expect(mockRunScoring).not.toHaveBeenCalled();
  });

  it("transitions Q1 → Q2 and updates progress without scoring", async () => {
    render(<TestWizard />);
    startTest();

    await answerAndAdvance();

    expect(
      screen.getByText(QUESTION_BANK[1].text)
    ).toBeInTheDocument();
    expect(progressBar()).toHaveAttribute("aria-valuenow", "2");
    expect(mockRunScoring).not.toHaveBeenCalled();
  });

  it("does not advance when the current question is unanswered", () => {
    render(<TestWizard />);
    startTest();

    // No auto-advance indicator shown when unanswered
    expect(screen.queryByText("Avanzando…")).not.toBeInTheDocument();
    expect(
      screen.getByText(QUESTION_BANK[0].text)
    ).toBeInTheDocument();
  });

  it("goes back to Q1 with a reverse transition", async () => {
    render(<TestWizard />);
    startTest();

    await answerAndAdvance();
    expect(
      screen.getByText(QUESTION_BANK[1].text)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Anterior" }));

    await waitFor(() => {
      expect(
        screen.getByText(QUESTION_BANK[0].text)
      ).toBeInTheDocument();
    });
    expect(progressBar()).toHaveAttribute("aria-valuenow", "1");
  });

  it("shows the layer transition between layers 1 and 2, then continues", async () => {
    render(<TestWizard />);
    startTest();

    // Answer Q1..Q5 to complete layer 1.
    for (let i = 0; i < 5; i += 1) {
      await screen.findByText(QUESTION_BANK[i].text);
      await answerAndAdvance();
    }

    // Land on step 6 → layer 2 transition screen.
    expect(
      await screen.findByRole("heading", { name: "¡Te estás luciendo!" })
    ).toBeInTheDocument();
    expect(mockRunScoring).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "¡Estoy listo!" }));

    expect(
      await screen.findByText(QUESTION_BANK[5].text)
    ).toBeInTheDocument();
    expect(progressBar()).toHaveAttribute("aria-valuenow", "6");
    expect(mockRunScoring).not.toHaveBeenCalled();
  }, 30000);

  it("runs the scoring pipeline exactly once on the final step and persists results", async () => {
    render(<TestWizard />);
    startTest();

    // Answer Q1..Q14 with auto-advance, dismissing the layer
    // transition screens that appear after Q5 and Q10.
    for (let i = 0; i < 14; i += 1) {
      await screen.findByText(QUESTION_BANK[i].text);
      await answerAndAdvance();
      if (i === 4 || i === 9) {
        await screen.findByRole("button", { name: "¡Estoy listo!" });
        fireEvent.click(screen.getByRole("button", { name: "¡Estoy listo!" }));
      }
    }

    // Land on Q15 → answer and advance automatically after the feedback.
    expect(
      await screen.findByText(QUESTION_BANK[14].text)
    ).toBeInTheDocument();
    answerCurrent();

    await waitFor(() => expect(mockRunScoring).toHaveBeenCalledTimes(1));
    const persisted = sessionStorage.getItem("tufuturo-results");
    expect(persisted).not.toBeNull();
    expect(JSON.parse(persisted!)).toMatchObject({
      riasecProfile: pipelineResult.riasecProfile,
      archetype: { id: "realizador" },
    });
  }, 30000);

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
    startTest();

    expect(
      screen.getByText(QUESTION_BANK[0].text)
    ).toBeInTheDocument();
    expect(progressBar()).toHaveAttribute("aria-valuenow", "1");

    const progress = container.querySelector('[role="progressbar"]');
    expect(progress).toHaveAttribute("data-motion", "static");
  });

  // ── Auto-advance behavior (uses fake timers for precise timing control) ──

  it("auto-advances to the next question ~300ms after selecting an answer", async () => {
    render(<TestWizard />);
    startTest();

    const stepBefore = useTestStore.getState().step;

    // Select an answer — should NOT advance immediately
    answerCurrent();
    expect(
      screen.getByText(QUESTION_BANK[0].text)
    ).toBeInTheDocument();
    expect(useTestStore.getState().step).toBe(stepBefore);

    // Wait for auto-advance to fire
    await waitFor(() => {
      expect(useTestStore.getState().step).toBe(stepBefore + 1);
    }, { timeout: 2000 });

    expect(
      screen.getByText(QUESTION_BANK[1].text)
    ).toBeInTheDocument();
    expect(progressBar()).toHaveAttribute("aria-valuenow", "2");
  });

  it("cancels auto-advance when user selects a different answer", async () => {
    render(<TestWizard />);
    startTest();

    const stepBefore = useTestStore.getState().step;

    // Select option 0
    const options = document.querySelectorAll("[data-option]");
    fireEvent.click(options[0]);

    // Wait 150ms (partway through the auto-advance timer) then switch to option 1
    await act(async () => {
      await new Promise((r) => setTimeout(r, 150));
    });
    fireEvent.click(options[1]);

    // Wait enough time that the first timer would have fired (450ms total from first click)
    // but the second timer hasn't yet (only 300ms from second click)
    await act(async () => {
      await new Promise((r) => setTimeout(r, 200));
    });

    // Still on Q1 — the first timer was cancelled by the second selection
    expect(useTestStore.getState().step).toBe(stepBefore);
    expect(
      screen.getByText(QUESTION_BANK[0].text)
    ).toBeInTheDocument();

    // Wait for the second timer (300ms from second selection) to fire
    await waitFor(() => {
      expect(useTestStore.getState().step).toBe(stepBefore + 1);
    }, { timeout: 2000 });

    expect(
      screen.getByText(QUESTION_BANK[1].text)
    ).toBeInTheDocument();
  });
});
