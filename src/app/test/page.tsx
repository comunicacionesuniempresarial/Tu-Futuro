"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TestWizard from "@/components/test/TestWizard";
import LeadFormStep from "@/components/lead/LeadFormStep";
import { Footer } from "@/components/shared/Footer";

function TestPageContent() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const esPrueba = searchParams.get("prueba") === "1";

  if (step === "form") {
    return (
      <>
        <LeadFormStep esPrueba={esPrueba} />
        <Footer />
      </>
    );
  }

  return <TestWizard esPrueba={esPrueba} />;
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg)]" />}>
      <TestPageContent />
    </Suspense>
  );
}
