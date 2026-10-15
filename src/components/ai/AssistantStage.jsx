import { cn } from "@/lib/utils";

/**
 * Full-bleed stage for an AI Assistant page (design: "AI Assistant.dc.html"):
 * soft indigo/teal glows, a centred hero ("NEUROBRIDGE · AI ASSISTANT" +
 * question) that shrinks once a chat starts, and a 900px column. It cancels
 * the portal's main padding so the glows reach the edges.
 */
function AssistantStage({ title, active, calm, children }) {
  return (
    <div
      className={cn(
        "relative -mx-margin-desktop -mt-8 -mb-24 flex min-h-dvh flex-col justify-center gap-7 overflow-hidden px-margin-desktop pt-7 pb-12",
        "max-lg:-mx-margin-tablet max-lg:px-margin-tablet max-sm:-mx-margin max-sm:-mt-6 max-sm:min-h-[calc(100dvh-4rem)] max-sm:px-margin",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-45 -left-40 size-155 rounded-full bg-radial from-tint-indigo to-transparent to-70% transition-opacity duration-400",
          calm && "opacity-35",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-45 -bottom-55 size-160 rounded-full bg-radial from-tint-teal to-transparent to-70% transition-opacity duration-400",
          calm && "opacity-35",
        )}
      />

      <div
        className={cn(
          "relative z-10 flex origin-top flex-col items-center gap-3.5 text-center transition-[margin,transform] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]",
          active ? "mt-0 scale-90" : "mt-10",
        )}
      >
        <span className="pl-[0.32em] text-body-lg font-extrabold tracking-[0.32em]">NEUROBRIDGE · AI ASSISTANT</span>
        <h1 className="m-0 text-[1.875rem] leading-[1.2] font-semibold tracking-[0.02em] text-slate max-sm:text-[1.5rem]">{title}</h1>
      </div>

      <section className="relative z-20 mx-auto flex w-full max-w-225 flex-col gap-[1.375rem]">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-10 left-1/2 h-75 w-130 -translate-x-1/2 rounded-full bg-radial from-tertiary-soft/45 to-transparent to-70% max-sm:w-full",
            calm && "opacity-0",
          )}
        />
        {children}
      </section>
    </div>
  );
}

export default AssistantStage;
