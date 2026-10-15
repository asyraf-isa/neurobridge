import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-2xl border-[1.5px] border-input bg-surface-container-lowest px-4 py-1 text-body-lg font-normal text-ink transition-[border-color,box-shadow] duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-slate focus-visible:border-tertiary focus-visible:ring-4 focus-visible:ring-tint-indigo disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-fill disabled:opacity-50 aria-invalid:border-tertiary aria-invalid:ring-4 aria-invalid:ring-tint-indigo",
        className
      )}
      {...props}
    />
  )
}

export { Input }
