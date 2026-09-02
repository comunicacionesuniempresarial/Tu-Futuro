import { useCallback } from "react";
import {
  SHARE_CARD_FILENAME,
  SHARE_CARD_JPG_FILENAME,
  generateShareCardSVG,
  svgToJpegBlob,
  svgToPngBlob,
  type ShareCardData,
} from "@/lib/share-card/generate";
import type { ShareCardSize } from "@/lib/share-card/generate";

export interface ShareOptions {
  data: ShareCardData;
  size?: ShareCardSize;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
export interface DownloadOptions extends Omit<ShareOptions, "onSuccess" | "onError"> {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const toError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));

const downloadBlob = (blob: Blob): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = SHARE_CARD_FILENAME;
  anchor.click();
  URL.revokeObjectURL(url);
};

const downloadJpegBlob = (blob: Blob): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = SHARE_CARD_JPG_FILENAME;
  anchor.click();
  URL.revokeObjectURL(url);
};

export function useDownloadShareCard(): (options: DownloadOptions) => Promise<void> {
  return useCallback(async ({ data, size, onSuccess, onError }) => {
    try {
      downloadJpegBlob(await svgToJpegBlob(generateShareCardSVG(data, size)));
      onSuccess?.();
    } catch (error) { onError?.(toError(error)); }
  }, []);
}

const copyToClipboard = async (blob: Blob): Promise<void> => {
  const item = new ClipboardItem({ "image/png": blob });
  await navigator.clipboard.write([item]);
};

/**
 * Returns a callback that exports the share card as a PNG and hands it off
 * through the most capable channel available:
 *   1. Web Share API (navigator.share with files)
 *   2. Direct download (anchor with object URL)
 *   3. Clipboard (ClipboardItem)
 */
export function useShareCard(): (options: ShareOptions) => Promise<void> {
  return useCallback(async ({ data, size, onSuccess, onError }: ShareOptions) => {
    try {
      const svg = generateShareCardSVG(data, size);
      const pngBlob = await svgToPngBlob(svg);
      const file = new File([pngBlob], SHARE_CARD_FILENAME, {
        type: "image/png",
      });

      const canShare =
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShare) {
        await navigator.share({
          files: [file],
          title: "Mi resultado vocacional",
          text: "Descubrí mi arquetipo vocacional con Tu Futuro Dual",
        });
      } else if (
        typeof URL !== "undefined" &&
        typeof URL.createObjectURL === "function"
      ) {
        downloadBlob(pngBlob);
      } else {
        await copyToClipboard(pngBlob);
      }

      onSuccess?.();
    } catch (error) {
      onError?.(toError(error));
    }
  }, []);
}
