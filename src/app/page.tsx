"use client";

import LandingPage from "@/features/landing/LandingPage";
import { useTestStore } from "@/stores/test-store";

export default function HomePage() {
  const handleStart = () => {
    // Clear any stale test state before starting a fresh attempt.
    useTestStore.getState().resetTest();
  };

  return <LandingPage onStart={handleStart} />;
}