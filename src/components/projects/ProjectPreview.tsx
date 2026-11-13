import type { DemoKind } from "@/content";

/**
 * Small static sketches of each demo for the project cards. Decorative only:
 * the real, interactive version lives on the case study page.
 */
export function ProjectPreview({ kind, large = false }: { kind: DemoKind; large?: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 grid place-items-center overflow-hidden p-5 sm:p-7">
      <div className={`grid w-full place-items-center ${large ? "sm:scale-[1.2] lg:scale-[1.3]" : ""}`}>
        {kind === "grid" && <GridSketch />}
        {kind === "shop" && <ShopSketch />}
        {kind === "movio" && <MovioSketch />}
      </div>
    </div>
  );
}

function GridSketch() {
  const changed = new Set(["1-2", "2-1", "2-2", "3-3"]);
  return (
    <div className="w-full max-w-[22rem] overflow-hidden rounded-lg border border-line bg-bg-raised">
      <div className="h-6 border-b border-line bg-bg" />
      {Array.from({ length: 5 }, (_, r) => (
        <div key={r} className="grid grid-cols-[1.6fr_repeat(4,1fr)] border-b border-line last:border-b-0">
          <span className="m-2 h-2 w-3/4 rounded-full bg-muted/40" />
          {Array.from({ length: 4 }, (_, c) => (
            <span
              key={c}
              className={`h-6 border-l border-line ${changed.has(`${r}-${c}`) ? "bg-accent/35" : ""}`}
            />
          ))}
        </div>
      ))}
      <div className="flex justify-end border-t border-line p-2">
        <span className="h-4 w-16 rounded-full bg-accent" />
      </div>
    </div>
  );
}

function ShopSketch() {
  const brands = ["BMW", "MINI", "Motorrad"];
  return (
    <div className="w-full max-w-[26rem] overflow-hidden rounded-lg border border-line bg-bg-raised">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <div className="flex gap-1.5">
          {brands.map((b, i) => (
            <span
              key={b}
              className={`rounded-full border px-2 py-0.5 text-[0.6rem] font-bold ${
                i === 2 ? "border-text bg-text text-bg" : "border-line text-muted"
              }`}
            >
              {b}
            </span>
          ))}
        </div>
        <span className="relative size-5 rounded-full border border-line">
          <span className="absolute -right-1 -top-1 grid size-3.5 place-items-center rounded-full bg-accent text-[0.5rem] font-bold text-on-accent">
            2
          </span>
        </span>
      </div>
      <div className="grid grid-cols-[1fr_6.5rem]">
        <div className="grid grid-cols-3 gap-1.5 p-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded border border-line bg-bg p-1.5">
              <span className="block h-1 w-6 rounded-full bg-muted/40" />
              <span className="mt-1.5 block h-1.5 w-full rounded-full bg-text/60" />
              <span className="mt-3 block h-2 w-8 rounded-full bg-text/80" />
              <span className="mt-1.5 block h-2.5 w-full bg-accent" />
            </div>
          ))}
        </div>
        <div className="space-y-1.5 border-l border-line bg-bg/60 p-2.5">
          <span className="block h-1.5 w-10 rounded-full bg-text/70" />
          <span className="block h-1 w-full rounded-full bg-muted/40" />
          <span className="block h-1 w-4/5 rounded-full bg-muted/40" />
          <span className="block h-1.5 w-12 rounded-full bg-text/80" />
          <span className="mt-2 block h-2.5 w-full bg-accent" />
        </div>
      </div>
      <div className="terminal space-y-0.5 border-t border-line px-3 py-1.5 font-mono text-[0.55rem]">
        <p><span className="text-accent-text">POST</span> /cart/items <span className="text-muted">λ cart 201</span></p>
        <p><span className="text-accent-text">POST</span> /orders <span className="text-muted">λ checkout 201</span></p>
      </div>
    </div>
  );
}

function MovioSketch() {
  return (
    <div className="flex w-full max-w-[24rem] items-center gap-3">
      <div className="terminal min-w-0 flex-1 overflow-hidden rounded-lg border border-line font-mono text-[0.55rem]">
        <div className="flex border-b border-line bg-bg-raised">
          {["spec.md", "PR", "OTA"].map((tab, i) => (
            <span key={tab} className={`border-r border-line px-1.5 py-1 ${i === 2 ? "bg-bg text-text" : "text-muted"}`}>
              {tab}
            </span>
          ))}
        </div>
        <div className="space-y-0.5 p-2">
          {["lint", "typecheck", "build", "e2e", "review"].map((check) => (
            <p key={check} className="flex items-center gap-1">
              <span className="text-accent-text">✓</span>
              <span>{check}</span>
            </p>
          ))}
          <p className="pt-1 text-accent-text">✓ 1.3.15</p>
        </div>
      </div>
      <div className="h-[11.5rem] w-[6.5rem] shrink-0 rounded-[1.2rem] border-[3px] border-line bg-bg p-1.5">
        <div className="mx-auto mb-1.5 h-1 w-6 rounded-full bg-line" />
        <div className="rounded-lg border border-line bg-bg-raised p-1.5">
          <div className="flex items-start justify-between">
            <span className="mt-1 h-1 w-8 rounded-full bg-muted/50" />
            <svg viewBox="0 0 40 40" className="size-5 -rotate-90">
              <circle cx="20" cy="20" r="15" fill="none" strokeWidth="5" className="stroke-line" />
              <circle cx="20" cy="20" r="15" fill="none" strokeWidth="5" strokeLinecap="round" strokeDasharray="94" strokeDashoffset="30" className="stroke-accent" />
            </svg>
          </div>
          <span className="mt-1.5 block h-1.5 w-12 rounded-full bg-text/70" />
          <span className="mt-1.5 block h-1 w-full rounded-full bg-muted/30" />
          <span className="mt-1 block h-1 w-4/5 rounded-full bg-muted/30" />
          <div className="mt-2 grid h-6 place-items-center rounded border border-dashed border-accent/70">
            <span className="h-1 w-6 rounded-full bg-accent/70" />
          </div>
          <span className="mt-2 block h-3 rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
