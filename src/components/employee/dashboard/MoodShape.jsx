import { useId } from "react";
import { moodBlob, moodShapeColors } from "@/lib/mood.js";

/**
 * The check-in's mood shape (DESIGN.md → Quick check-in): a soft blob, spiky
 * when unpleasant and flower-like when pleasant, with a radial fill, sheen,
 * highlight, ground shadow and a simple face whose mouth curves with mood.
 */
function MoodShape({ value, touched, unsure, calm, label }) {
  const id = useId();
  const u = unsure ? 0 : (value - 50) / 50;
  const colors = moodShapeColors(value, { calm, touched, unsure });
  const path = moodBlob(u);
  const mouth = unsure ? "M88 116 q6 -5 12 0 t12 0" : `M88 114 Q100 ${(114 + 12 * u).toFixed(1)} 112 114`;

  return (
    <div className="relative mx-auto grid size-55 shrink-0 place-items-center">
      <div
        aria-hidden="true"
        className="absolute -inset-2.5 rounded-full transition-[background] duration-200"
        style={{ background: `radial-gradient(circle, ${colors.halo} 0%, transparent 66%)` }}
      />
      <svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label={label} className="relative overflow-visible">
        <defs>
          <radialGradient id={`${id}fill`} cx="36%" cy="28%" r="80%">
            <stop offset="0" stopColor={colors.light} />
            <stop offset="0.45" stopColor={colors.color} />
            <stop offset="1" stopColor={colors.deep} />
          </radialGradient>
          <linearGradient id={`${id}sheen`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="1" stopColor={colors.deep} stopOpacity="0.35" />
          </linearGradient>
          <clipPath id={`${id}clip`}>
            <path d={path} />
          </clipPath>
          <filter id={`${id}soft`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <ellipse cx="100" cy="172" rx="46" ry="9" fill={colors.deep} opacity="0.22" filter={`url(#${id}soft)`} />
        <path d={path} fill={`url(#${id}fill)`} />
        <g clipPath={`url(#${id}clip)`}>
          <path d={path} fill={`url(#${id}sheen)`} />
          <ellipse cx="80" cy="66" rx="26" ry="16" fill="#FFFFFF" opacity="0.6" filter={`url(#${id}soft)`} />
        </g>
        <circle cx="86" cy="92" r="4.5" className="fill-ink" />
        <circle cx="114" cy="92" r="4.5" className="fill-ink" />
        <path d={mouth} fill="none" strokeWidth="4" strokeLinecap="round" className="stroke-ink" />
      </svg>
    </div>
  );
}

export default MoodShape;
