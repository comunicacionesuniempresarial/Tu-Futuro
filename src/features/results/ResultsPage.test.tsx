import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ResultsPage, type ResultsData } from "./ResultsPage";
import { archetype, profile, results } from "./fixtures";

const { confettiMock, svgToPngBlobMock } = vi.hoisted(() => ({
  confettiMock: vi.fn().mockResolvedValue(undefined),
  svgToPngBlobMock: vi.fn().mockImplementation(() =>
    Promise.resolve(new Blob(["png"], { type: "image/png" }))
  ),
}));

vi.mock("canvas-confetti", () => ({ default: confettiMock }));
vi.mock("@/lib/share-card/generate", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/share-card/generate")>();
  return { ...actual, svgToPngBlob: svgToPngBlobMock };
});

const resultsData: ResultsData = {
  riasecProfile: profile,
  archetype,
  aptitudeVec: [0.7, 0.6, 0.5, 0.8],
  valuesVec: [0.6, 0.7, 0.5, 0.4],
  rankedResults: results,
  answers: { Q1: 4, Q2: 3, Q3: 5 },
};

/** Loads the fixture the same way the resultados page does. */
const renderWithStoredResults = () => {
  sessionStorage.setItem("tufuturo-results", JSON.stringify(resultsData));
  const stored = JSON.parse(
    sessionStorage.getItem("tufuturo-results") ?? "null"
  ) as ResultsData;
  return render(<ResultsPage data={stored} />);
};

const stubMatchMedia = (matches: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })
  );
};

const setupNavigator = ({ share = true } = {}) => {
  const shareMock = vi.fn().mockResolvedValue(undefined);
  const canShareMock = vi.fn().mockReturnValue(true);
  const navigatorMock: Record<string, unknown> = { ...window.navigator };
  if (share) {
    navigatorMock.share = shareMock;
    navigatorMock.canShare = canShareMock;
  }
  vi.stubGlobal("navigator", navigatorMock);
  return { shareMock, canShareMock };
};

const defineGlobal = (target: object, key: string, value: unknown) => {
  Object.defineProperty(target, key, {
    value,
    configurable: true,
    writable: true,
  });
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  confettiMock.mockClear();
  sessionStorage.clear();
  defineGlobal(URL, "createObjectURL", undefined);
  defineGlobal(URL, "revokeObjectURL", undefined);
  defineGlobal(HTMLAnchorElement.prototype, "click", undefined);
});

describe("ResultsPage", () => {
  it("reveals the result with confetti exactly once and a share button", async () => {
    stubMatchMedia(false);
    renderWithStoredResults();

    expect(screen.getAllByText(archetype.emoji).length).toBeGreaterThan(0);
    expect(screen.getByText("Tu Destino Revelado")).toBeInTheDocument();
    await waitFor(() => expect(confettiMock).toHaveBeenCalledTimes(1));
    expect(
      screen.getByRole("button", { name: /invocar a otros/i })
    ).toBeInTheDocument();
  });

  it("suppresses confetti under prefers-reduced-motion", () => {
    stubMatchMedia(true);
    renderWithStoredResults();

    expect(confettiMock).not.toHaveBeenCalled();
  });

  it("switches the share card layout via the control", () => {
    stubMatchMedia(false);
    renderWithStoredResults();

    expect(document.querySelector("[data-layout]")).toHaveAttribute(
      "data-layout",
      "default"
    );

    fireEvent.click(screen.getByRole("button", { name: /historias/i }));
    expect(document.querySelector("[data-layout]")).toHaveAttribute(
      "data-layout",
      "stories"
    );

    fireEvent.click(screen.getByRole("button", { name: /feed/i }));
    expect(document.querySelector("[data-layout]")).toHaveAttribute(
      "data-layout",
      "feed"
    );
  });

  it("shows the program requirement overlay on the radar when a top program is selected", () => {
    stubMatchMedia(false);
    renderWithStoredResults();

    const radar = document.querySelector("[data-radar='true']");
    expect(radar?.querySelectorAll("polygon")).toHaveLength(1);

    fireEvent.click(
      screen.getByRole("button", { name: /ingeniería de software/i })
    );

    const polygons = radar?.querySelectorAll("polygon");
    expect(polygons).toHaveLength(2);
    expect(polygons?.[1]).toHaveAttribute("stroke-dasharray");
    expect(polygons?.[1]).toHaveAttribute("stroke", "#E879F9");
  });

  it("shares the card via the Web Share API", async () => {
    stubMatchMedia(false);
    const { shareMock } = setupNavigator();
    renderWithStoredResults();

    fireEvent.click(
      screen.getByRole("button", { name: /invocar a otros/i })
    );

    await waitFor(() => expect(shareMock).toHaveBeenCalledTimes(1));
    expect(svgToPngBlobMock).toHaveBeenCalledTimes(1);
  });
});