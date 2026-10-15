import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// Pill buttons per DESIGN.md: 999px radius, 700 weight, 40–50px hit targets.
// `dark` (ink) is the spec's default "do it" button; `default` is indigo.
// Both hover to the primary-hover indigo.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent bg-clip-padding font-bold whitespace-nowrap transition-colors duration-200 outline-none select-none focus-visible:ring-4 focus-visible:ring-tint-indigo disabled:pointer-events-none disabled:opacity-40 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary hover:bg-primary-hover",
        dark: "bg-ink text-on-primary hover:bg-primary-hover",
        soft: "bg-fill text-ink hover:bg-divider aria-expanded:bg-divider",
        outline:
          "border-[1.5px] border-divider bg-surface-container-lowest text-ink hover:border-tertiary-soft hover:bg-surface-container-lowest aria-expanded:border-tertiary",
        secondary: "bg-secondary text-on-secondary hover:bg-teal-ink",
        ghost: "text-ink hover:bg-fill aria-expanded:bg-fill",
        destructive: "bg-urgent text-on-primary hover:bg-urgent-ink focus-visible:ring-urgent-container",
        link: "rounded-md px-0 text-primary hover:text-primary-hover",
      },
      size: {
        default:
          "h-11 gap-2 px-5 text-body-md font-bold has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-8 gap-1 px-3 text-label-sm [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-1.5 px-3.5 text-label-md font-bold [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 text-body-lg font-bold has-data-[icon=inline-start]:pl-4",
        xl: "h-[3.375rem] gap-2 px-7 text-[1.125rem] font-bold",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
