"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { LogoMark } from "../LogoMark";
import { TechIcon } from "../TechIcon";
import type { CommitEntry, GraphRow } from "./types";

/* Graph geometry. Vertical positions are in `em`, so they follow the terminal's line height. */
const LANE_X = [7, 21] as const; // px
const NODE_Y = "0.78em"; // middle of the first line
const MERGE_H = "1.6em";

/**
 * A terminal window (think Ghostty) with its own scrollback: `git log --graph`
 * of the career, and a prompt on the last line that "checks out" the role in view.
 */
export function GitLog({ entries }: { entries: CommitEntry[] }) {
  const t = useTranslations("Experience");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const items = Array.from(scroller.querySelectorAll<HTMLElement>("[data-index]"));
    let frame = 0;

    // One source of truth, read from layout on every scroll: the role whose first line has
    // passed a quarter of the way down the scrollback is checked out. At the very bottom the
    // last role wins, since it is too short to ever reach that line.
    const update = () => {
      frame = 0;
      const atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 8;
      if (atEnd) {
        setActive(items.length - 1);
        return;
      }
      const line = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.25;
      let index = 0;
      items.forEach((item, i) => {
        if (item.getBoundingClientRect().top <= line) index = i;
      });
      setActive(index);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    scroller.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const command = `git checkout ${entries[active].checkout}`;
  const cwd = `~/${t("dir")}`;

  return (
    <div
      data-testid="terminal"
      className="terminal mt-10 flex h-[min(76svh,50rem)] flex-col overflow-hidden rounded-xl border border-line font-mono text-[0.75rem] leading-[1.55] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)] sm:mt-14 sm:text-[0.84rem]"
    >
      {/* Title bar */}
      <div aria-hidden="true" className="relative flex h-9 shrink-0 items-center border-b border-line/60 bg-bg-raised px-3.5">
        <span className="flex gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="absolute inset-x-24 truncate text-center text-xs text-muted">
          {cwd} — zsh
        </span>
      </div>

      {/* Scrollback. `relative` keeps absolutely positioned children (sr-only text) clipped
          inside it; without it they would stretch the page below the footer. */}
      <div
        ref={scrollRef}
        role="region"
        aria-label={t("window")}
        tabIndex={0}
        className="terminal-scroll relative min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-3 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:px-5"
      >
        <p aria-hidden="true">
          <Prompt cwd={cwd} />
          git log --graph
        </p>

        <ol className="mt-[1.55em]">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              data-index={i}
              data-company={entry.id}
              data-active={i === active || undefined}
              className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-2 sm:gap-x-3"
            >
              <Graph row={entry.graph} index={i} active={active} />
              <Commit
                entry={entry}
                isActive={i === active}
                stackLabel={t("stack")}
                sideLabel={t("sideProject")}
                scopeLabel={t("scope")}
              />
            </li>
          ))}
        </ol>
      </div>

      {/* Live prompt on the last line */}
      <div
        data-testid="git-prompt"
        aria-hidden="true"
        className="flex shrink-0 items-center justify-between gap-4 border-t border-line/60 px-3 py-2 sm:px-5"
      >
        <p className="min-w-0 truncate">
          <Prompt cwd={cwd} />
          <span key={command} className="typed" style={{ "--chars": command.length } as CSSProperties}>
            {command}
          </span>
          <span className="ml-px inline-block h-[1.15em] w-[0.62em] translate-y-[0.2em] bg-accent" />
        </p>
        <span className="shrink-0 tabular-nums text-muted">
          {active + 1}/{entries.length}
        </span>
      </div>
    </div>
  );
}

/** Starship-style prompt: bold path, then the ❯ character. */
function Prompt({ cwd }: { cwd: string }) {
  return (
    <>
      <span className="font-bold text-accent-text">{cwd}</span>
      <span className="text-accent"> ❯ </span>
    </>
  );
}

function Line({
  x,
  top,
  bottom,
  height,
  lit,
}: {
  x: number;
  top: string | number;
  bottom?: string | number;
  height?: string;
  lit: boolean;
}) {
  return (
    <span
      className={`absolute w-[1.5px] -translate-x-1/2 transition-colors duration-500 ${lit ? "bg-accent" : "bg-rail"}`}
      style={{ left: x, top, bottom, height }}
    />
  );
}

function Graph({ row, index, active }: { row: GraphRow; index: number; active: number }) {
  const [main, branch] = LANE_X;
  const passed = index < active;
  const reached = index <= active;
  const isActive = index === active;

  return (
    <div aria-hidden="true" className="relative">
      {row.lane === 0 ? (
        <>
          {row.main !== "fromNode" && <Line x={main} top={0} height={NODE_Y} lit={reached} />}
          {row.main !== "toNode" && <Line x={main} top={NODE_Y} bottom={0} lit={passed} />}
        </>
      ) : (
        <Line x={main} top={0} bottom={0} lit={passed} />
      )}

      {row.branchMergesBelow && (
        <>
          <Line x={branch} top={NODE_Y} bottom={MERGE_H} lit={passed} />
          <svg
            viewBox="0 0 28 24"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-[28px] overflow-visible"
            style={{ height: MERGE_H }}
          >
            <path
              d={`M${branch} 0 C${branch} 14 ${main} 10 ${main} 24`}
              fill="none"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className={`transition-colors duration-500 ${passed ? "stroke-accent" : "stroke-rail"}`}
            />
          </svg>
        </>
      )}

      {/* ● reached, ○ not yet */}
      <span
        className={`absolute size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] transition-all duration-300 ${
          reached ? "border-accent bg-accent" : "border-rail bg-bg"
        } ${isActive ? "shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_25%,transparent)]" : ""}`}
        style={{ left: LANE_X[row.lane], top: NODE_Y }}
      />
    </div>
  );
}

function Commit({
  entry,
  isActive,
  stackLabel,
  sideLabel,
  scopeLabel,
}: {
  entry: CommitEntry;
  isActive: boolean;
  stackLabel: string;
  sideLabel: string;
  scopeLabel: string;
}) {
  return (
    <article
      className={`min-w-0 pb-[3.1em] transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-50"}`}
    >
      {/* commit 9d7a9cb (HEAD -> main) */}
      <p>
        <span className="text-accent-text">commit {entry.sha}</span>{" "}
        <span className="text-muted">(</span>
        {entry.refs.map((ref, i) => (
          <span key={ref.name}>
            {i > 0 && <span className="text-muted">, </span>}
            <span
              className={
                ref.kind === "head"
                  ? "font-bold text-accent"
                  : ref.kind === "branch"
                    ? "font-bold text-accent-text"
                    : "text-muted"
              }
            >
              {ref.name}
            </span>
          </span>
        ))}
        <span className="text-muted">)</span>
      </p>
      <p className="text-muted">Date:&nbsp;&nbsp;&nbsp;{entry.period}</p>

      {/* Message body, indented like git does. */}
      <div className="mt-[1.55em] pl-[2ch] sm:pl-[4ch]">
        {/* fastfetch-style header: company mark beside the name. */}
        <div className="flex items-center gap-[1.5ch] sm:gap-[2ch]">
          <LogoMark
            logo={entry.logo}
            monogram={entry.monogram}
            active={isActive}
            className="size-[3.6em] sm:size-[4.65em]"
          />
          <div className="min-w-0">
            <h3 className="font-bold text-text">
              {entry.company}
              {entry.sideProject && <span className="font-normal text-muted"> [{sideLabel}]</span>}
            </h3>
            <p className="text-muted">
              {entry.role}, {entry.location}
            </p>
          </div>
        </div>

        <p className="mt-[1.55em] max-w-[76ch]">{entry.summary}</p>
        <ul className="max-w-[76ch] text-muted">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="relative pl-[2ch]">
              <span aria-hidden="true" className="absolute left-0 text-accent">
                -
              </span>
              {highlight}
            </li>
          ))}
        </ul>

        {entry.metrics.length > 0 && (
          <dl className="mt-[1.55em]">
            {entry.metrics.map((metric) => (
              <div key={metric.label} className="flex flex-wrap gap-x-[2ch]">
                <dt className="order-2 text-muted">{metric.label}</dt>
                <dd className="order-1 font-bold text-text">
                  <span aria-hidden="true" className="text-accent">+ </span>
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* Git trailers, with Nerd Font–style icons. */}
        {entry.scope && (
          <p className="mt-[1.55em]" data-testid="scope">
            <span className="text-muted">{scopeLabel}: </span>
            <Globe
              aria-hidden="true"
              strokeWidth={1.75}
              className="mr-[0.5ch] inline size-[1.05em] -translate-y-px text-accent-text"
            />
            <span className="font-bold text-text">{entry.scope}</span>
          </p>
        )}
        <p className={entry.scope ? undefined : "mt-[1.55em]"}>
          <span className="text-muted">{stackLabel}: </span>
          <span className="sr-only">{entry.stack.join(", ")}</span>
          <span aria-hidden="true">
            {entry.stack.map((tech, i) => (
              <span key={tech} className="inline-flex items-center whitespace-nowrap">
                <TechIcon name={tech} className="mr-[0.5ch] size-[1.05em] text-accent-text" />
                {tech}
                {i < entry.stack.length - 1 && <span className="mr-[1ch] text-muted">,</span>}
              </span>
            ))}
          </span>
        </p>
      </div>
    </article>
  );
}

