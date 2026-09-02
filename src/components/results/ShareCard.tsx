"use client";

import { useState } from "react";
import {
  generateShareCardSVG,
  SHARE_CARD_FILENAME,
  SHARE_CARD_JPG_FILENAME,
  svgToImageBlob,
  type ShareCardData,
} from "@/lib/share-card";

interface ShareCardProps {
  data: ShareCardData;
}

type Status = "idle" | "preparing" | "done" | "error";
const LOGO_PATH = "/brand/uniempresarial-logo.png";

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export default function ShareCard({ data }: ShareCardProps) {
  const [status, setStatus] = useState<Status>("idle");

  const createImage = async (type: "image/png" | "image/jpeg") => {
    const logoResponse = await fetch(LOGO_PATH);
    if (!logoResponse.ok) throw new Error("No se pudo cargar el logo institucional");
    const logoBlob = await logoResponse.blob();
    const logoDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("No se pudo preparar el logo institucional"));
      reader.readAsDataURL(logoBlob);
    });
    return svgToImageBlob(generateShareCardSVG(data, logoDataUrl), type);
  };

  const handleShare = () => {
    setStatus("preparing");
    void (async () => {
      try {
        const blob = await createImage("image/png");
        const file = new File([blob], SHARE_CARD_FILENAME, { type: "image/png" });
        const canShare = navigator.canShare?.({ files: [file] }) && typeof navigator.share === "function";
        if (canShare) {
          await navigator.share({
            files: [file],
            title: "Mi resultado vocacional",
            text: "Descubrí mi arquetipo vocacional con Tu Futuro Dual",
          });
        } else {
          downloadBlob(blob, SHARE_CARD_FILENAME);
        }
        setStatus("done");
      } catch {
        setStatus("error");
      }
    })();
  };

  const handleDownload = () => {
    setStatus("preparing");
    void createImage("image/jpeg")
      .then((blob) => {
        downloadBlob(blob, SHARE_CARD_JPG_FILENAME);
        setStatus("done");
      })
      .catch(() => setStatus("error"));
  };

  return (
    <section className="rounded-3xl overflow-hidden border border-[#0033A5]/20 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-[#0033A5] via-[#182c72] to-[#D51933] px-6 py-6 text-center text-white">
        <div className="mx-auto inline-flex rounded-xl bg-white px-4 py-2 shadow-[0_0_20px_rgba(255,255,255,0.75),0_0_34px_rgba(255,225,109,0.55)]">
          <img src={LOGO_PATH} alt="Uniempresarial" className="h-12 w-auto object-contain" />
        </div>
        <p className="mt-1 text-xs font-bold tracking-[0.12em] text-[#ffe16d]">TU FUTURO DUAL</p>
        <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#ffe16d] bg-white/15 text-5xl shadow-lg">
          {data.archetype.emoji}
        </div>
        <p className="mt-5 text-sm font-bold">Mi arquetipo vocacional es</p>
        <h2 className="mt-1 text-3xl font-black text-[#ffe16d]">{data.archetype.name}</h2>
        {data.topProgram && <p className="mt-4 text-sm text-white/85">Tu mejor coincidencia: {data.topProgram}</p>}
      </div>
      <div className="flex flex-col items-stretch justify-center gap-3 p-5 sm:flex-row">
        <button type="button" onClick={handleShare} disabled={status === "preparing"} className="rounded-xl bg-[#0033A5] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#00277f] disabled:cursor-wait disabled:opacity-60">
          {status === "preparing" ? "Preparando…" : "Compartir"}
        </button>
        <button type="button" onClick={handleDownload} disabled={status === "preparing"} className="rounded-xl border border-[#0033A5]/30 px-6 py-3 text-sm font-bold text-[#0033A5] transition hover:border-[#0033A5] disabled:cursor-wait disabled:opacity-60">
          Descargar JPG
        </button>
      </div>
      {status === "done" && <p role="status" className="pb-4 text-center text-xs font-medium text-[#0033A5]">¡Carta lista!</p>}
      {status === "error" && <p role="alert" className="pb-4 text-center text-xs font-medium text-[#D51933]">No pudimos preparar la carta. Intenta de nuevo.</p>}
    </section>
  );
}
