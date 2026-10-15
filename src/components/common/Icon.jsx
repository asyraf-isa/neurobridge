import { cn } from "@/lib/utils";

/**
 * Material Symbols Rounded icon.
 *
 * The ligature name is rendered inside a span styled by the `.icon` class
 * defined in `src/index.css`. We deliberately do NOT use Google's
 * `.material-symbols-rounded` class: that stylesheet ships *unlayered*, so its
 * `font-size: 24px; display: inline-block; line-height: 1` would beat our
 * layered Tailwind utilities and every icon would ignore `text-[20px]` etc.
 *
 * `fill` switches to the filled glyph — DESIGN.md uses filled icons for status
 * and emphasis, outlined ones for navigation and utilities.
 */
function Icon({ name, fill = false, className, ...props }) {
  return (
    <span className={cn("icon select-none", fill && "icon-fill", className)} aria-hidden="true" {...props}>
      {name}
    </span>
  );
}

export default Icon;
