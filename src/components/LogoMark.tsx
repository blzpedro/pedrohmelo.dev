/**
 * A company logo as a single-colour silhouette: a CSS mask over the current text
 * colour, so every brand reads the same way. Falls back to a monogram.
 */
export function LogoMark({
  logo,
  monogram,
  className = "",
  active = false,
}: {
  logo?: string;
  monogram: string;
  className?: string;
  active?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      data-testid="company-mark"
      className={`grid shrink-0 place-items-center rounded-lg border bg-bg-raised transition-colors duration-300 ${
        active ? "border-accent/70" : "border-line"
      } ${className}`}
    >
      {logo ? (
        <span
          className="block size-[74%] bg-text"
          style={{
            maskImage: `url(${logo})`,
            WebkitMaskImage: `url(${logo})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      ) : (
        <span className="font-bold tracking-tight text-text">{monogram}</span>
      )}
    </span>
  );
}
