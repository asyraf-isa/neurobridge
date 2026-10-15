import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-3xl border-[1.5px] border-input bg-surface-container-lowest px-4 py-3 text-body-lg font-normal text-ink transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-slate focus-visible:border-tertiary focus-visible:ring-4 focus-visible:ring-tint-indigo disabled:cursor-not-allowed disabled:bg-fill disabled:opacity-50 aria-invalid:border-tertiary aria-invalid:ring-4 aria-invalid:ring-tint-indigo",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
