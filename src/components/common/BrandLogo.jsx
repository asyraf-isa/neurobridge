import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * NeuroBridge mark.
 *
 * - `variant="dot"` (sidebar): indigo tile with a light-indigo dot.
 * - `variant="bridge"` (sign-in): larger tile with the gradient infinity bridge.
 */
function BrandLogo({ variant = "dot", className }) {
  const gradientId = useId();

  if (variant === "bridge") {
    return (
      <span
        role="img"
        aria-label="NeuroBridge logo"
        className={cn("grid size-[3.375rem] shrink-0 place-items-center rounded-[1.125rem] bg-primary", className)}
      >
        <svg width="38" height="20" viewBox="0 0 38 20" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="38" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="var(--color-tint-indigo)" />
              <stop offset=".5" stopColor="var(--color-tertiary-soft)" />
              <stop offset="1" stopColor="var(--color-mood-high)" />
            </linearGradient>
          </defs>
          <path
            d="M19 10C15.5 4.5 12.5 2.5 9.5 2.5C5.4 2.5 2.5 5.8 2.5 10C2.5 14.2 5.4 17.5 9.5 17.5C12.5 17.5 15.5 15.5 19 10C22.5 4.5 25.5 2.5 28.5 2.5C32.6 2.5 35.5 5.8 35.5 10C35.5 14.2 32.6 17.5 28.5 17.5C25.5 17.5 22.5 15.5 19 10Z"
            stroke={`url(#${gradientId})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span aria-hidden="true" className={cn("grid size-[1.875rem] shrink-0 place-items-center rounded-[0.625rem] bg-primary", className)}>
      <span className="size-3 rounded-full bg-tint-indigo" />
    </span>
  );
}

export default BrandLogo;
