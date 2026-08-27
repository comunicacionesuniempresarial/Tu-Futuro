"use client";

import { useState, useEffect } from "react";

/**
 * Returns true when viewport width < 640px (Tailwind sm breakpoint).
 * Updates on resize with a 150ms debounce to avoid thrashing.
 *
 * IMPORTANT: During SSR, returns false (desktop default).
 * The hook only activates after mount, so there is one paint with
 * the desktop layout before potentially switching to mobile.
 * This is intentional — it avoids hydration mismatch.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");

    // Set initial value
    setIsMobile(mql.matches);

    let timer: ReturnType<typeof setTimeout>;
    const handler = (e: MediaQueryListEvent) => {
      clearTimeout(timer);
      timer = setTimeout(() => setIsMobile(e.matches), 150);
    };

    mql.addEventListener("change", handler);
    return () => {
      clearTimeout(timer);
      mql.removeEventListener("change", handler);
    };
  }, []);

  return isMobile;
}
