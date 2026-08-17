"use client";

import { useEffect, useRef, useState, type RefCallback } from "react";

interface UseScrollRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollReveal<T extends Element = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
): [RefCallback<T>, boolean] {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggered = useRef(false);

  const createObserver = () => {
    if (observerRef.current) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            hasTriggered.current = true;
            observerRef.current?.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );
  };

  const setRef: RefCallback<T> = (node) => {
    if (observerRef.current && elementRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }
    elementRef.current = node;
    if (node) {
      createObserver();
      observerRef.current!.observe(node);
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (element && !observerRef.current) {
      createObserver();
      observerRef.current!.observe(element);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [setRef, isVisible];
}