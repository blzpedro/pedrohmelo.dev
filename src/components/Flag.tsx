import type { AppLocale } from "@/i18n/routing";

/** Round flags, drawn inline so they look the same on every OS (emoji flags don't on Windows). */
export function Flag({ locale, className }: { locale: AppLocale; className?: string }) {
  return locale === "pt" ? <Brazil className={className} /> : <UnitedStates className={className} />;
}

function Brazil({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <clipPath id="flag-br-clip">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#flag-br-clip)">
        <rect width="24" height="24" fill="#009b3a" />
        <path d="M12 4.2 21.4 12 12 19.8 2.6 12Z" fill="#fedf00" />
        <circle cx="12" cy="12" r="4.7" fill="#002776" />
        <path d="M7.5 11.1c2.9-.9 6.3-.4 8.9 1.6" fill="none" stroke="#fff" strokeWidth="1" />
      </g>
    </svg>
  );
}

function UnitedStates({ className }: { className?: string }) {
  const stripe = 24 / 13;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <clipPath id="flag-us-clip">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#flag-us-clip)">
        <rect width="24" height="24" fill="#fff" />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} y={i * 2 * stripe} width="24" height={stripe} fill="#b22234" />
        ))}
        <rect width="11.5" height={stripe * 7} fill="#3c3b6e" />
        {[2.2, 5.2, 8.2].flatMap((x) =>
          [2.4, 6.4, 10.4].map((y) => <circle key={`${x}-${y}`} cx={x + (y === 6.4 ? 1.2 : 0)} cy={y} r="0.75" fill="#fff" />),
        )}
      </g>
    </svg>
  );
}
