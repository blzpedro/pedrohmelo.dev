"use client";

import { Fragment, useEffect, useState, type ComponentType } from "react";
import { Check, ChevronRight, CircleHelp, Database, FileSpreadsheet, Monitor, Server, X } from "lucide-react";
import { useLocale } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { TechIcon } from "../TechIcon";

/* ---------- Copy ---------- */

type Copy = {
  file: string;
  run: string;
  running: string;
  importLane: string;
  shopLane: string;
  traces: string;
  logs: string;
  idle: string;
  ok: (rows: number, what: string) => string;
  failed: (row: number, field: string) => string;
  yes: string;
  no: string;
  files: Record<FileId, string>;
  nodes: Record<NodeId, [string, string]>;
};

const copy: Record<AppLocale, Copy> = {
  en: {
    file: "File",
    run: "Import",
    running: "Importing…",
    importLane: "Import",
    shopLane: "Shop",
    traces: "X-Ray and CloudWatch log every step of the import, validation and mapping",
    logs: "Logs",
    idle: "Pick a file and import it.",
    ok: (rows, what) => `${rows} ${what} imported and on screen in the shop.`,
    failed: (row, field) => `Row ${row} has an empty "${field}". Nothing was written; fix the file and import again.`,
    yes: "yes",
    no: "no",
    files: { products: "products", filters: "filters", dealers: "dealers" },
    nodes: {
      importer: ["CSV Importer", "platform"],
      akamai: ["Akamai", "DNS"],
      s3: ["Amazon S3", "stores the CSV"],
      lambda: ["AWS Lambda", "validates every field"],
      decision: ["Valid?", ""],
      secrets: ["Secrets Manager", "API keys"],
      server: ["Server", "HTTP requests"],
      commercetools: ["commercetools", "products, filters, dealers"],
      db: ["Database", ""],
      ssr: ["Next.js SSR", "shop"],
      readLambda: ["AWS Lambda", "catalog"],
      readServer: ["Server", ""],
      readCommercetools: ["commercetools", ""],
      readDb: ["Database", ""],
      csr: ["Next.js CSR", "what the customer sees"],
    },
  },
  pt: {
    file: "Arquivo",
    run: "Importar",
    running: "Importando…",
    importLane: "Importação",
    shopLane: "Loja",
    traces: "X-Ray e CloudWatch registram cada etapa da importação, validação e mapeamento",
    logs: "Logs",
    idle: "Escolha um arquivo e importe.",
    ok: (rows, what) => `${rows} ${what} importados e já na tela da loja.`,
    failed: (row, field) => `A linha ${row} está com "${field}" vazio. Nada foi gravado; corrija o arquivo e importe de novo.`,
    yes: "sim",
    no: "não",
    files: { products: "produtos", filters: "filtros", dealers: "concessionárias" },
    nodes: {
      importer: ["CSV Importer", "plataforma"],
      akamai: ["Akamai", "DNS"],
      s3: ["Amazon S3", "guarda o CSV"],
      lambda: ["AWS Lambda", "valida cada campo"],
      decision: ["Validado?", ""],
      secrets: ["Secrets Manager", "chaves da API"],
      server: ["Servidor", "requisições HTTP"],
      commercetools: ["commercetools", "produtos, filtros, concessionárias"],
      db: ["Banco", ""],
      ssr: ["Next.js SSR", "loja"],
      readLambda: ["AWS Lambda", "catálogo"],
      readServer: ["Servidor", ""],
      readCommercetools: ["commercetools", ""],
      readDb: ["Banco", ""],
      csr: ["Next.js CSR", "o que o cliente vê"],
    },
  },
};

/* ---------- Pipeline ---------- */

type FileId = "products" | "filters" | "dealers";
type NodeId =
  | "importer" | "akamai" | "s3" | "lambda" | "decision" | "secrets" | "server" | "commercetools" | "db"
  | "ssr" | "readLambda" | "readServer" | "readCommercetools" | "readDb" | "csr";

/** Made-up files; one of them has a missing field on purpose. */
const FILES: { id: FileId; name: string; rows: number; error?: { row: number; field: string } }[] = [
  { id: "products", name: "motorrad-gear.csv", rows: 12 },
  { id: "filters", name: "gear-filters.csv", rows: 8, error: { row: 5, field: "category" } },
  { id: "dealers", name: "dealers-pt.csv", rows: 24 },
];

const IMPORT: NodeId[] = ["importer", "akamai", "s3", "lambda", "decision", "secrets", "server", "commercetools", "db"];
const READ: NodeId[] = ["ssr", "readLambda", "readServer", "readCommercetools", "readDb", "csr"];
const ALL = [...IMPORT, ...READ];

type Icon = { tech: string } | { glyph: ComponentType<{ className?: string; "aria-hidden"?: boolean }> };
const ICONS: Record<NodeId, Icon> = {
  importer: { glyph: FileSpreadsheet },
  akamai: { tech: "Akamai" },
  s3: { tech: "Amazon S3" },
  lambda: { tech: "AWS Lambda" },
  decision: { glyph: CircleHelp },
  secrets: { tech: "Secrets Manager" },
  server: { glyph: Server },
  commercetools: { tech: "commercetools" },
  db: { glyph: Database },
  ssr: { tech: "Next.js" },
  readLambda: { tech: "AWS Lambda" },
  readServer: { glyph: Server },
  readCommercetools: { tech: "commercetools" },
  readDb: { glyph: Database },
  csr: { glyph: Monitor },
};

/** The log line each step writes, as CloudWatch would show it. */
function logFor(node: NodeId, file: (typeof FILES)[number], what: string): string {
  const lines: Record<NodeId, string> = {
    importer: `importer   upload ${file.name}`,
    akamai: `akamai     resolve imports endpoint`,
    s3: `s3         PutObject imports/${file.name} (${file.rows} rows)`,
    lambda: `lambda     validating ${file.rows} rows`,
    decision: file.error ? `lambda     ✗ row ${file.error.row}: "${file.error.field}" is empty, stopped` : `lambda     ✓ every field valid`,
    secrets: `secrets    GetSecretValue commercetools/api`,
    server: `server     POST /import/${file.id} (${file.rows})`,
    commercetools: `ct         ${file.rows} ${what} upserted`,
    db: `db         committed`,
    ssr: `next       GET /shop (SSR)`,
    readLambda: `lambda     catalog handler`,
    readServer: `server     GET /${file.id}`,
    readCommercetools: `ct         query ${file.id}`,
    readDb: `db         read ${file.rows} rows`,
    csr: `next       hydrated, ${file.rows} items on screen`,
  };
  return lines[node];
}

export function ImportPipeline() {
  const locale = useLocale() as AppLocale;
  const c = copy[locale];
  const [fileId, setFileId] = useState<FileId>("products");
  const [step, setStep] = useState(-1); // index into ALL; -1 = not started
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const file = FILES.find((f) => f.id === fileId)!;
  const decisionIndex = IMPORT.indexOf("decision");
  const failed = Boolean(file.error) && step >= decisionIndex;
  const finished = !running && step >= 0;

  // Walk the pipeline one node at a time; stop at the decision if the file is invalid.
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      const next = step + 1;
      const node = ALL[next];
      const elapsed = ((next + 1) * 0.42).toFixed(2);
      setLogs((current) => [...current, `+${elapsed}s  ${logFor(node, file, c.files[file.id])}`]);
      setStep(next);
      const stop = (node === "decision" && file.error) || next === ALL.length - 1;
      if (stop) setRunning(false);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [running, step, file, c.files]);

  function start() {
    setLogs([]);
    setStep(-1);
    setRunning(true);
  }

  function statusOf(node: NodeId): "idle" | "active" | "done" | "failed" {
    const index = ALL.indexOf(node);
    if (failed && node === "decision") return "failed";
    if (index < step || (index === step && !running)) return "done";
    if (index === step) return "active";
    return "idle";
  }

  return (
    <div data-testid="import-pipeline" className="overflow-hidden rounded-xl border border-line bg-bg-raised">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div role="radiogroup" aria-label={c.file} className="flex flex-wrap gap-1.5">
          {FILES.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={f.id === fileId}
              disabled={running}
              onClick={() => {
                setFileId(f.id);
                setStep(-1);
                setLogs([]);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
                f.id === fileId ? "border-text bg-text font-bold text-bg" : "border-line text-muted hover:text-text"
              }`}
            >
              <FileSpreadsheet aria-hidden="true" className="size-3.5" />
              {f.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={start}
          disabled={running}
          className="rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-on-accent disabled:opacity-60"
        >
          {running ? c.running : c.run}
        </button>
      </div>

      {/* Lanes */}
      <div className="space-y-5 px-4 py-5">
        <Lane title={c.importLane} nodes={IMPORT} c={c} statusOf={statusOf} failed={failed} />
        <p className="flex items-center gap-3 font-mono text-[0.7rem] text-muted">
          <span aria-hidden="true" className="h-px flex-1 border-t border-dashed border-rail" />
          <span className="inline-flex items-center gap-1.5">
            <TechIcon name="X-Ray" className="size-3.5 text-accent-text" />
            <TechIcon name="CloudWatch" className="size-3.5 text-accent-text" />
            {c.traces}
          </span>
          <span aria-hidden="true" className="h-px flex-1 border-t border-dashed border-rail" />
        </p>
        <Lane title={c.shopLane} nodes={READ} c={c} statusOf={statusOf} failed={failed} />
      </div>

      <p className="border-t border-line px-4 py-3 text-sm" aria-live="polite" data-testid="import-status">
        {!finished ? (
          <span className="text-muted">{running ? c.running : c.idle}</span>
        ) : failed ? (
          <span className="inline-flex items-start gap-2 font-semibold">
            <X aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {c.failed(file.error!.row, file.error!.field)}
          </span>
        ) : (
          <span className="inline-flex items-start gap-2 font-semibold text-accent-text">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {c.ok(file.rows, c.files[file.id])}
          </span>
        )}
      </p>

      <div className="terminal border-t border-line px-4 py-3 font-mono text-[0.7rem] leading-relaxed sm:text-xs">
        <p className="text-muted">{c.logs}</p>
        <ol className="mt-2 min-h-[7.5rem] space-y-0.5" data-testid="import-log">
          {logs.slice(-8).map((line, i) => (
            <li key={`${line}-${i}`} className={`whitespace-pre-wrap ${line.includes("✗") ? "font-bold text-text" : ""}`}>
              {line}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Lane({
  title,
  nodes,
  c,
  statusOf,
  failed,
}: {
  title: string;
  nodes: NodeId[];
  c: Copy;
  statusOf: (node: NodeId) => "idle" | "active" | "done" | "failed";
  failed: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-xs text-muted">{title}</p>
      <ol className="mt-2 flex flex-wrap items-center gap-y-2">
        {nodes.map((node, i) => {
          const status = statusOf(node);
          const [label, sub] = c.nodes[node];
          const icon = ICONS[node];
          const isDecision = node === "decision";
          const answer = isDecision && status !== "idle" && status !== "active" ? (failed ? c.no : c.yes) : sub;
          return (
            <Fragment key={node}>
              {i > 0 && <ChevronRight aria-hidden="true" className={`mx-0.5 size-4 shrink-0 ${status === "idle" ? "text-rail" : "text-accent"}`} />}
              <li
                data-node={node}
                data-status={status}
                className={`flex min-w-[6.5rem] items-center gap-2 border px-2.5 py-1.5 transition-colors duration-300 ${
                  isDecision ? "rounded-full border-dashed" : "rounded-lg"
                } ${
                  status === "failed"
                    ? "border-text bg-text/10"
                    : status === "active"
                      ? "border-accent bg-accent/20"
                      : status === "done"
                        ? "border-accent/60 bg-bg"
                        : "border-line bg-bg opacity-70"
                }`}
              >
                <span className={status === "idle" ? "text-muted" : "text-accent-text"}>
                  {"tech" in icon ? (
                    <TechIcon name={icon.tech} className="size-4" />
                  ) : (
                    <icon.glyph aria-hidden className="size-4" />
                  )}
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block text-xs font-semibold">{label}</span>
                  {answer && <span className="block font-mono text-[0.65rem] text-muted">{answer}</span>}
                </span>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
