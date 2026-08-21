import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ShareCard } from "./ShareCard";
import type { ShareCardData } from "@/lib/share-card/generate";

const { svgToPngBlobMock } = vi.hoisted(() => ({
  svgToPngBlobMock: vi.fn().mockImplementation(() =>
    Promise.resolve(new Blob(["png"], { type: "image/png" }))
  ),
}));

const data: ShareCardData = {
  archetype: { id: "ingeniero", name: "Ingeniero", emoji: "âš™ï¸", color: "#22D3EE" },
  riasecProfile: { R: 0.8, I: 0.6, A: 0.3, S: 0.2, E: 0.4, C: 0.5 },
  topPrograms: [{ id: "ing-software", name: "IngenierÃ­a de Software" }],
};

vi.mock("@/lib/share-card/generate", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/share-card/generate")>();
  return { ...actual, svgToPngBlob: svgToPngBlobMock };
});

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
  defineGlobal(URL, "createObjectURL", undefined);
  defineGlobal(URL, "revokeObjectURL", undefined);
  defineGlobal(HTMLAnchorElement.prototype, "click", undefined);
});

describe("ShareCard", () => {
  it("renders the generated SVG preview with the archetype and share button", () => {
    render(<ShareCard data={data} />);

    expect(screen.getByText("âš™ï¸")).toBeInTheDocument();
    expect(screen.getByText("Ingeniero")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /invocar a otros/i })
    ).toBeInTheDocument();
  });

  it("tags the root container with the selected layout", () => {
    const { rerender } = render(<ShareCard data={data} />);
    expect(document.querySelector("[data-layout]")).toHaveAttribute(
      "data-layout",
      "default"
    );

    rerender(<ShareCard data={data} layout="stories" />);
    expect(document.querySelector("[data-layout]")).toHaveAttribute(
      "data-layout",
      "stories"
    );

    rerender(<ShareCard data={data} layout="feed" />);
    expect(document.querySelector("[data-layout]")).toHaveAttribute(
      "data-layout",
      "feed"
    );
  });

  it("shares the PNG through the Web Share API when clicking the button", async () => {
    const { shareMock, canShareMock } = setupNavigator();
    render(<ShareCard data={data} />);

    fireEvent.click(
      screen.getByRole("button", { name: /invocar a otros/i })
    );

    await waitFor(() => expect(shareMock).toHaveBeenCalledTimes(1));
    expect(canShareMock).toHaveBeenCalledWith({ files: expect.any(Array) });
    const shareArg = shareMock.mock.calls[0][0] as { files: File[] };
    expect(shareArg.files[0].name).toBe("tufuturo-resultado.png");
    expect(shareArg.files[0].type).toBe("image/png");
    expect(svgToPngBlobMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to downloading the PNG when Web Share is unavailable", async () => {
    setupNavigator({ share: false });
    const createObjectURL = vi.fn().mockReturnValue("blob:mock");
    const click = vi.fn();
    defineGlobal(URL, "createObjectURL", createObjectURL);
    defineGlobal(HTMLAnchorElement.prototype, "click", click);

    render(<ShareCard data={data} />);
    fireEvent.click(
      screen.getByRole("button", { name: /invocar a otros/i })
    );

    await waitFor(() => expect(click).toHaveBeenCalledTimes(1));
    expect(createObjectURL).toHaveBeenCalledOnce();
  });
});
