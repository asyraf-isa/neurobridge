import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The custom type-scale utilities declared in `src/index.css` (`@theme`).
 *
 * tailwind-merge cannot read the CSS theme, so on its own it classifies
 * `text-headline-lg` as a text *colour* — the same group as `text-on-primary`.
 * It then deletes one of them, which silently drops a colour (white button text
 * went black) or a font size (table heads rendered 14px instead of 12px).
 * Registering the scale as `font-size` makes the two unambiguous.
 */
const TYPE_SCALE = [
  "display-lg",
  "display-lg-mobile",
  "headline-lg",
  "headline-md",
  "headline-sm",
  "title-md",
  "body-lg",
  "body-md",
  "body-sm",
  "label-lg",
  "label-md",
  "label-sm",
  "eyebrow",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: TYPE_SCALE }],
    },
  },
});

/**
 * Merge conditional class names and resolve conflicting Tailwind utilities.
 * Standard shadcn/ui helper — every component imports it from `@/lib/utils`.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

