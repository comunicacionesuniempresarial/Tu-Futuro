import { render, screen, fireEvent } from "@testing-library/react";
import { MotionGlobalConfig } from "motion/react";
import DelegateTestWizard from "./TestWizard";
import FeatureTestWizard from "@/features/wizard/TestWizard";
import { useTestStore } from "@/stores/test-store";
import { QUESTION_BANK } from "@/lib/questions/question-bank";

describe("components/test/TestWizard (delegate)", () => {
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
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("delegates to the feature wizard component", () => {
    expect(DelegateTestWizard).toBe(FeatureTestWizard);
  });

  it("preserves the wizard flow through the delegate", () => {
    render(<DelegateTestWizard />);

    expect(
      screen.getByRole("heading", { name: /Descargo de Responsabilidad/ })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Entendido, empezar/ }));

    expect(
      screen.getByText(QUESTION_BANK[0].text)
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "1"
    );
  });
});