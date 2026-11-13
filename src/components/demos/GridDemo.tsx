"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useLocale } from "next-intl";
import type { AppLocale } from "@/i18n/routing";

const copy = {
  en: {
    window: "Cost control",
    sheet: "Plant A, sample data",
    item: "Item",
    rows: ["Steel sheet", "ABS resin", "Copper", "Packaging", "Freight"],
    unit: "US$ / t",
    pending: (n: number) => (n === 0 ? "No pending changes" : n === 1 ? "1 pending change" : `${n} pending changes`),
    save: "Save batch",
    saving: "Saving…",
    saved: (n: number) => `Saved ${n} ${n === 1 ? "change" : "changes"} in one request`,
    hint: "Click a cell and type. Arrow keys and Enter move between cells.",
    compare: "Screen load and batch save",
    legacy: "Legacy tool",
    now: "New app",
  },
  pt: {
    window: "Controle de custos",
    sheet: "Fábrica A, dados de exemplo",
    item: "Item",
    rows: ["Chapa de aço", "Resina ABS", "Cobre", "Embalagem", "Frete"],
    unit: "US$ / t",
    pending: (n: number) => (n === 0 ? "Nenhuma alteração pendente" : n === 1 ? "1 alteração pendente" : `${n} alterações pendentes`),
    save: "Salvar lote",
    saving: "Salvando…",
    saved: (n: number) => `${n} ${n === 1 ? "alteração salva" : "alterações salvas"} numa requisição só`,
    hint: "Clique numa célula e digite. Setas e Enter movem entre as células.",
    compare: "Carregar e salvar em lote",
    legacy: "Ferramenta legada",
    now: "App novo",
  },
} satisfies Record<AppLocale, unknown>;

const BASE = [
  [612.4, 618.9, 621.3, 619.7],
  [1480.2, 1492.6, 1475.1, 1501.8],
  [8420.5, 8511.2, 8603.9, 8577.4],
  [212.3, 214.1, 213.8, 215.6],
  [96.4, 98.2, 97.5, 99.1],
];

export function GridDemo() {
  const locale = useLocale() as AppLocale;
  const c = copy[locale];
  const tag = locale === "pt" ? "pt-BR" : "en-US";
  const format = (n: number) =>
    n.toLocaleString(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const months = Array.from({ length: 4 }, (_, i) =>
    new Intl.DateTimeFormat(tag, { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2026, i, 1))),
  );

  const [saved, setSaved] = useState(() => BASE.map((row) => row.map(format)));
  const [values, setValues] = useState(saved);
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "saved"; count: number }>({
    kind: "idle",
    count: 0,
  });
  const cells = useRef<(HTMLInputElement | null)[][]>([]);

  const dirty = values.flatMap((row, r) => row.map((value, col) => value !== saved[r][col])).filter(Boolean).length;

  function edit(r: number, col: number, value: string) {
    setValues((current) => current.map((row, i) => (i === r ? row.map((v, j) => (j === col ? value : v)) : row)));
    if (status.kind === "saved") setStatus({ kind: "idle", count: 0 });
  }

  function move(r: number, col: number) {
    const target = cells.current[r]?.[col];
    if (target) {
      target.focus();
      target.select();
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>, r: number, col: number) {
    const input = event.currentTarget;
    const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
    const atEnd = input.selectionStart === input.value.length;
    if (event.key === "ArrowDown" || event.key === "Enter") {
      event.preventDefault();
      move(Math.min(r + 1, BASE.length - 1), col);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(Math.max(r - 1, 0), col);
    } else if (event.key === "ArrowRight" && atEnd) {
      event.preventDefault();
      move(r, Math.min(col + 1, 3));
    } else if (event.key === "ArrowLeft" && atStart) {
      event.preventDefault();
      move(r, Math.max(col - 1, 0));
    }
  }

  function saveBatch() {
    const count = dirty;
    setStatus({ kind: "saving", count });
    window.setTimeout(() => {
      setSaved(values);
      setStatus({ kind: "saved", count });
    }, 900);
  }

  return (
    <div data-testid="grid-demo" className="overflow-hidden rounded-xl border border-line bg-bg-raised">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <p className="text-sm font-bold">{c.window}</p>
        <p className="truncate font-mono text-xs text-muted">{c.sheet}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm tabular-nums">
          <thead>
            <tr className="text-left font-mono text-xs text-muted">
              <th className="border-b border-line px-4 py-2 font-normal">
                {c.item} <span className="text-muted/70">({c.unit})</span>
              </th>
              {months.map((month) => (
                <th key={month} className="border-b border-l border-line px-3 py-2 text-right font-normal">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((name, r) => (
              <tr key={name}>
                <th scope="row" className="border-b border-line px-4 py-1.5 text-left font-semibold">
                  {name}
                </th>
                {values[r].map((value, col) => {
                  const changed = value !== saved[r][col];
                  return (
                    <td key={col} className="border-b border-l border-line p-0">
                      <input
                        ref={(el) => {
                          cells.current[r] ??= [];
                          cells.current[r][col] = el;
                        }}
                        value={value}
                        inputMode="decimal"
                        aria-label={`${name}, ${months[col]}`}
                        onChange={(e) => edit(r, col, e.target.value)}
                        onKeyDown={(e) => onKeyDown(e, r, col)}
                        onFocus={(e) => e.currentTarget.select()}
                        className={`w-full bg-transparent px-3 py-1.5 text-right outline-none transition-colors focus:bg-accent/15 focus:ring-2 focus:ring-inset focus:ring-accent ${
                          changed ? "bg-accent/20 font-semibold text-accent-text" : ""
                        }`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm text-muted" aria-live="polite" data-testid="grid-status">
          {status.kind === "saving"
            ? c.saving
            : status.kind === "saved"
              ? c.saved(status.count)
              : c.pending(dirty)}
        </p>
        <button
          type="button"
          onClick={saveBatch}
          disabled={dirty === 0 || status.kind === "saving"}
          className="rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-on-accent transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status.kind === "saving" ? c.saving : c.save}
        </button>
      </div>

      <div className="border-t border-line px-4 py-4">
        <p className="text-xs text-muted">{c.hint}</p>
        <p className="mt-4 font-mono text-xs text-muted">{c.compare}</p>
        <dl className="mt-2 space-y-2 text-sm">
          <div className="grid grid-cols-[7.5rem_1fr] items-center gap-3 sm:grid-cols-[9rem_1fr]">
            <dt className="text-muted">{c.legacy}</dt>
            <dd className="flex items-center gap-2">
              <span className="h-2 w-full rounded-full bg-rail" />
              <span className="shrink-0 font-mono text-xs">30–45s</span>
            </dd>
          </div>
          <div className="grid grid-cols-[7.5rem_1fr] items-center gap-3 sm:grid-cols-[9rem_1fr]">
            <dt className="font-semibold">{c.now}</dt>
            <dd className="flex items-center gap-2">
              <span className="h-2 w-[11%] rounded-full bg-accent" />
              <span className="shrink-0 font-mono text-xs font-bold">3–5s</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
