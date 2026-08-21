import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useShareCard } from "./useShareCard";
import type { ShareCardData } from "@/lib/share-card/generate";

const { pngBlob, svgToPngBlobMock } = vi.hoisted(() => {
  const pngBlob = new Blob(["png"], { type: "image/png" });
  return { pngBlob, svgToPngBlobMock: vi.fn().mockResolvedValue(pngBlob) };
});

const data: ShareCardData = {
  archetype: { id: "ingeniero", name: "Ingeniero", emoji: "⚙️", color: "#22D3EE" },
  riasecProfile: { R: 0.8, I: 0.6, A: 0.3, S: 0.2, E: 0.4, C: 0.5 },
  topPrograms: [{ id: "ing-software", name: "Ingeniería de Software" }],
};

vi.mock("@/lib/share-card/generate", () => ({
  generateShareCardSVG: () => "<svg/>",
  svgToPngBlob: svgToPngBlobMock,
  SHARE_CARD_FILENAME: "tufuturo-resultado.png",
}));

/** Replaces window.navigator with a copy exposing share/canShare when enabled. */
const setupNavigator = ({ share = true, canShare = true } = {}) => {
  const shareMock = vi.fn().mockResolvedValue(undefined);
  const canShareMock = vi.fn().mockReturnValue(true);
  const navigatorMock: Record<string, unknown> = { ...window.navigator };
  if (share) navigatorMock.share = shareMock;
  if (canShare) navigatorMock.canShare = canShareMock;
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

const runShare = async (onError?: (error: Error) => void) => {
  const { result } = renderHook(() => useShareCard());
  await act(async () => {
    await result.current({
      data,
      onSuccess: () => undefined,
      onError: onError ?? (() => undefined),
    });
  });
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  // jsdom's URL extends Node's URL, whose static createObjectURL is a real
  // (non-configurable) function. Shadow it back to undefined instead of
  // deleting, otherwise the Node implementation resurfaces between tests.
  defineGlobal(URL, "createObjectURL", undefined);
  defineGlobal(URL, "revokeObjectURL", undefined);
  defineGlobal(HTMLAnchorElement.prototype, "click", undefined);
});

describe("useShareCard", () => {
  it("shares the PNG via the Web Share API when available", async () => {
    const { shareMock, canShareMock } = setupNavigator();
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useShareCard());
    await act(async () => {
      await result.current({ data, onSuccess });
    });

    expect(canShareMock).toHaveBeenCalledWith({ files: expect.any(Array) });
    expect(shareMock).toHaveBeenCalledTimes(1);
    const shareArg = shareMock.mock.calls[0][0] as { files: File[] };
    expect(shareArg.files[0]).toBeInstanceOf(File);
    expect(shareArg.files[0].name).toBe("tufuturo-resultado.png");
    expect(shareArg.files[0].type).toBe("image/png");
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it("falls back to downloading the PNG when Web Share is unavailable", async () => {
    setupNavigator({ share: false, canShare: false });
    const createObjectURL = vi.fn().mockReturnValue("blob:mock");
    const revokeObjectURL = vi.fn();
    const click = vi.fn();
    defineGlobal(URL, "createObjectURL", createObjectURL);
    defineGlobal(URL, "revokeObjectURL", revokeObjectURL);
    defineGlobal(HTMLAnchorElement.prototype, "click", click);

    const onError = vi.fn();
    await runShare(onError);

    expect(onError).not.toHaveBeenCalled();
    expect(createObjectURL).toHaveBeenCalledWith(pngBlob);
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock");
  });

  it("falls back to the clipboard when neither share nor download works", async () => {
    setupNavigator({ share: false, canShare: false });
    const write = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("ClipboardItem", class ClipboardItemMock {});
    defineGlobal(navigator, "clipboard", { write });

    const onError = vi.fn();
    await runShare(onError);

    expect(onError).not.toHaveBeenCalled();
    expect(write).toHaveBeenCalledOnce();
  });

  it("reports failures through onError", async () => {
    const { shareMock } = setupNavigator();
    shareMock.mockRejectedValueOnce(new Error("share failed"));
    const onError = vi.fn();

    const { result } = renderHook(() => useShareCard());
    await act(async () => {
      await result.current({ data, onError });
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0].message).toBe("share failed");
  });
});