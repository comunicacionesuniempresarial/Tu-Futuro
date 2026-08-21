"use client";

import Link from "next/link";
import { useCallback, useState, type ReactNode, type MouseEvent, type PointerEvent } from "react";

interface NeonButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

/**
 * Neon CTA button with a transform-only press micro-animation.
 * Renders a next/link anchor when `href` is provided, a button otherwise.
 * The pressed state is exposed via `data-pressed` so the scale-down
 * feedback is pure CSS (transform-only, `will-change` hint).
 */
export default function NeonButton({
  children,
  href,
  onClick,
  className = "",
  type = "button",
}: NeonButtonProps) {
  const [pressed, setPressed] = useState(false);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    // Only the primary button triggers the press micro-animation.
    if (event.button !== 0 && event.pointerType === "mouse") return;
    setPressed(true);
  }, []);

  const releasePressed = useCallback(() => setPressed(false), []);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (href && event.defaultPrevented) return;
      onClick?.();
    },
    [href, onClick]
  );

  const sharedClasses = `inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-bold text-[var(--color-deep)] transition-transform duration-150 will-change-transform data-[pressed=true]:scale-[0.97] bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] shadow-[0_0_24px_color-mix(in_srgb,var(--color-neon-primary)_35%,transparent)] hover:shadow-[0_0_32px_color-mix(in_srgb,var(--color-neon-primary)_55%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-neon-primary)] ${className}`;

  const dataProps = {
    "data-pressed": pressed,
  };

  if (href) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={releasePressed}
        onPointerLeave={releasePressed}
        onPointerCancel={releasePressed}
        className={sharedClasses}
        {...dataProps}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={releasePressed}
      onPointerLeave={releasePressed}
      onPointerCancel={releasePressed}
      className={sharedClasses}
      {...dataProps}
    >
      {children}
    </button>
  );
}