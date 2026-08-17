"use client";

import { createElement, type ElementType, type ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface ReducedMotionWrapperProps {
  children: ReactNode;
  className?: string;
  /** Element to render as the wrapper. Defaults to a div. */
  as?: ElementType;
}

/**
 * Wraps children in an element that reports whether motion is allowed.
 * Content is ALWAYS rendered (no layout shift under reduced motion);
 * only the motion state is suppressed. The wrapper exposes the motion
 * state via `data-reduced-motion` so animation can be gated in CSS.
 */
export default function ReducedMotionWrapper({
  children,
  className = "",
  as = "div",
}: ReducedMotionWrapperProps) {
  const reducedMotion = useReducedMotion();

  return createElement(
    as,
    {
      className: `${reducedMotion ? "reduce-motion " : ""}${className}`,
      "data-reduced-motion": reducedMotion ? "true" : "false",
    },
    children
  );
}