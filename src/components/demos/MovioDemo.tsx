"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Check, LoaderCircle } from "lucide-react";
import { useLocale } from "next-intl";
import type { AppLocale } from "@/i18n/routing";

/* ---------- Copy ---------- */

type Copy = {
  tabs: string[];
  next: string;
  back: string;
  run: string;
  checksFirst: string;
  publish: string;
  publishing: string;
  ready: string;
  spec: string[];
  plan: string[];
  tasks: string[];
  pr: string;
  checks: string[];
  review: string;
  ota: string[];
  resultTitle: string;
  result: string[];
  resultCta: string;
  app: {
    online: string;
    waiting: string;
    available: string;
    distance: string;
    eta: string;
    fee: string;
    surge: string;
    accept: string;
    decline: string;
    expired: string;
    declined: string;
    toPickup: string;
    pickedUp: string;
    toCustomer: string;
    arrived: string;
    finish: string;
    proofTitle: string;
    takePhoto: string;
    photoTaken: string;
    code: string;
    codeHint: (code: string) => string;
    needPhoto: string;
    wrongCode: string;
    done: string;
    withProof: string;
    withoutProof: string;
    nextOffer: string;
    updated: (version: string) => string;
    events: string;
    seconds: string;
  };
};

const copy: Record<AppLocale, Copy> = {
  en: {
    tabs: ["spec.md", "plan.md", "tasks.md", "PR #128", "OTA"],
    next: "Next step",
    back: "Back",
    run: "Run checks",
    checksFirst: "Run the PR checks first.",
    publish: "Publish update",
    publishing: "Publishing…",
    ready: "Ready to merge",
    spec: [
      "# Proof of delivery with photo and code",
      "",
      "## Acceptance scenarios",
      "1. Given an order on its way, when the courier reaches",
      "   the customer, then the app asks for a photo and the code.",
      "2. Given a wrong code, when the courier submits,",
      "   then the delivery stays open.",
      "3. Given a marketplace order that already requires the",
      "   partner's code (iFood, 99Food), then that code wins.",
      "4. Given the courier is far from the drop-off, when they",
      "   try to finish, then the API refuses with 409.",
    ],
    plan: [
      "# Plan",
      "",
      "- App: proof screen (camera + code), offline upload queue",
      "- API: POST /deliveryman/deliveries/:id/proof",
      "- Rule: the partner's code takes precedence",
      "- Rule: required proximity radius, 409 when too far",
      "- Tests: E2E for the happy path, wrong code, too far",
    ],
    tasks: [
      "T1 Proof screen with camera and code",
      "T2 POST /deliveries/:id/proof validating the code",
      "T3 Partner code precedence (iFood, 99Food)",
      "T4 Proximity check, 409 when too far",
      "T5 E2E: happy path, wrong code, too far",
    ],
    pr: "#128 feat(deliveries): proof of delivery with photo and code",
    checks: ["lint", "typecheck", "build", "e2e"],
    review: "human review",
    ota: [
      "$ eas update --channel production",
      "✓ Bundle exported",
      "✓ Update 1.3.15 published",
      "→ Couriers get it on their next launch",
    ],
    resultTitle: "Result",
    result: [
      "A spec with 4 acceptance scenarios",
      "A plan and 5 tasks for the agents",
      "PR #128 with 5 green checks",
      "Version 1.3.15 on couriers' phones, no store release",
    ],
    resultCta: "Now finish a delivery in the app: it asks for proof.",
    app: {
      online: "Online",
      waiting: "Waiting for offers…",
      available: "Delivery available",
      distance: "Distance",
      eta: "Est. time",
      fee: "Fee",
      surge: "Dynamic pricing",
      accept: "Accept",
      decline: "Decline",
      expired: "Offer expired. It went to the next courier.",
      declined: "Declined. Waiting for the next one.",
      toPickup: "Head to the restaurant",
      pickedUp: "Picked up the order",
      toCustomer: "On the way to the customer",
      arrived: "Arrived at the customer",
      finish: "Finish delivery",
      proofTitle: "Proof of delivery",
      takePhoto: "Take a photo",
      photoTaken: "Photo taken",
      code: "Customer code",
      codeHint: (code) => `Demo: the customer's code is ${code}`,
      needPhoto: "Take a photo of the delivery first.",
      wrongCode: "Wrong code. The delivery stays open.",
      done: "Delivered",
      withProof: "Proof recorded: photo and code.",
      withoutProof: "No proof of delivery in this version.",
      nextOffer: "Next offer",
      updated: (v) => `Updated to ${v}: proof of delivery`,
      events: "Events",
      seconds: "seconds left",
    },
  },
  pt: {
    tabs: ["spec.md", "plan.md", "tasks.md", "PR #128", "OTA"],
    next: "Próximo passo",
    back: "Voltar",
    run: "Rodar checagens",
    checksFirst: "Rode as checagens do PR primeiro.",
    publish: "Publicar atualização",
    publishing: "Publicando…",
    ready: "Pronto para o merge",
    spec: [
      "# Prova de entrega com foto e código",
      "",
      "## Cenários de aceite",
      "1. Dado um pedido a caminho, quando o entregador chega",
      "   ao cliente, então o app pede uma foto e o código.",
      "2. Dado um código errado, quando o entregador envia,",
      "   então a entrega continua aberta.",
      "3. Dado um pedido de marketplace que já exige o código",
      "   do parceiro (iFood, 99Food), então prevalece esse código.",
      "4. Dado que o entregador está longe do ponto, quando",
      "   tenta finalizar, então a API recusa com 409.",
    ],
    plan: [
      "# Plano",
      "",
      "- App: tela de prova (câmera + código), fila de upload offline",
      "- API: POST /deliveryman/deliveries/:id/proof",
      "- Regra: o código do parceiro tem precedência",
      "- Regra: raio de proximidade obrigatório, 409 se longe",
      "- Testes: E2E do caminho feliz, código errado e longe do ponto",
    ],
    tasks: [
      "T1 Tela de prova com câmera e código",
      "T2 POST /deliveries/:id/proof validando o código",
      "T3 Precedência do código do parceiro (iFood, 99Food)",
      "T4 Checagem de proximidade, 409 se longe",
      "T5 E2E: caminho feliz, código errado, longe do ponto",
    ],
    pr: "#128 feat(entregas): prova de entrega com foto e código",
    checks: ["lint", "typecheck", "build", "e2e"],
    review: "revisão humana",
    ota: [
      "$ eas update --channel production",
      "✓ Bundle exportado",
      "✓ Atualização 1.3.15 publicada",
      "→ Entregadores recebem na próxima abertura do app",
    ],
    resultTitle: "Resultado",
    result: [
      "Uma spec com 4 cenários de aceite",
      "Um plano e 5 tarefas para os agentes",
      "PR #128 com 5 checagens verdes",
      "Versão 1.3.15 no celular dos entregadores, sem passar pela loja",
    ],
    resultCta: "Agora finalize uma entrega no app: ele pede a prova.",
    app: {
      online: "Online",
      waiting: "Aguardando ofertas…",
      available: "Entrega disponível",
      distance: "Distância",
      eta: "Tempo est.",
      fee: "Valor",
      surge: "Ajuste dinâmico",
      accept: "Aceitar",
      decline: "Recusar",
      expired: "Oferta expirou. Foi para o próximo entregador.",
      declined: "Recusada. Aguardando a próxima.",
      toPickup: "Siga para o restaurante",
      pickedUp: "Coletei o pedido",
      toCustomer: "A caminho do cliente",
      arrived: "Cheguei no cliente",
      finish: "Finalizar entrega",
      proofTitle: "Prova de entrega",
      takePhoto: "Tirar foto",
      photoTaken: "Foto registrada",
      code: "Código do cliente",
      codeHint: (code) => `Demo: o código do cliente é ${code}`,
      needPhoto: "Tire a foto da entrega primeiro.",
      wrongCode: "Código incorreto. A entrega continua aberta.",
      done: "Entregue",
      withProof: "Prova registrada: foto e código.",
      withoutProof: "Sem prova de entrega nesta versão.",
      nextOffer: "Próxima oferta",
      updated: (v) => `Atualizado para ${v}: prova de entrega`,
      events: "Eventos",
      seconds: "segundos restantes",
    },
  },
};

/* ---------- App data ---------- */

const RESTAURANTS = ["Burger Station", "Sushi Kaze", "Cantina da Vila", "Pizza 1989", "Açaí Point", "Pastel do Porto"];
const NEIGHBORHOODS = ["Gonzaga", "Boqueirão", "Ponta da Praia", "Vila Mathias", "Aparecida", "Embaré"];
const WINDOW = 15;

type Offer = { id: number; restaurant: string; neighborhood: string; km: number; minutes: number; fee: number; surge: number; code: string };
type Phase = "waiting" | "offer" | "expired" | "declined" | "toPickup" | "toCustomer" | "proof" | "done";

function makeOffer(id: number): Offer {
  return {
    id,
    restaurant: RESTAURANTS[id % RESTAURANTS.length],
    neighborhood: NEIGHBORHOODS[(id * 5) % NEIGHBORHOODS.length],
    km: 1.4 + ((id * 13) % 38) / 10,
    minutes: 8 + ((id * 7) % 14),
    fee: 7 + ((id * 5) % 6),
    surge: id % 2 === 0 ? 2 : 0,
    code: String(1000 + ((id * 3769) % 9000)),
  };
}

/**
 * The spec-driven flow (left) shipping a feature to the courier app (right).
 * Before the OTA update the app finishes deliveries without proof; after it,
 * it asks for a photo and the customer's code.
 */
export function MovioDemo() {
  const locale = useLocale() as AppLocale;
  const c = copy[locale];
  const a = c.app;
  const tag = locale === "pt" ? "pt-BR" : "en-US";

  /* --- SDD side --- */
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<boolean[]>(() => c.tasks.map(() => false));
  const [checks, setChecks] = useState(0);
  const [running, setRunning] = useState(false);
  const [otaLines, setOtaLines] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const allChecks = [...c.checks, c.review];
  const checksPassed = checks >= allChecks.length;
  const shipped = otaLines >= c.ota.length;

  /* --- App side --- */
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("waiting");
  const [offer, setOffer] = useState<Offer | null>(null);
  const [remaining, setRemaining] = useState(WINDOW);
  const [photo, setPhoto] = useState(false);
  const [code, setCode] = useState("");
  const [proofError, setProofError] = useState("");
  const [lastWithProof, setLastWithProof] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [banner, setBanner] = useState(false);
  const startedAt = useRef(0);
  const nextId = useRef(1041);

  const log = useCallback((line: string) => setEvents((current) => [...current.slice(-4), line]), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // PR checks run one after another.
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (checks >= allChecks.length) setRunning(false);
      else setChecks((n) => n + 1);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [running, checks, allChecks.length]);

  // OTA output prints line by line; the last line ships the feature.
  useEffect(() => {
    if (!publishing) return;
    const timer = window.setTimeout(() => {
      if (otaLines >= c.ota.length) {
        setPublishing(false);
        return;
      }
      setOtaLines((n) => n + 1);
      if (otaLines + 1 === c.ota.length) {
        setBanner(true);
        log("← ota.update 1.3.15");
      }
    }, 550);
    return () => window.clearTimeout(timer);
  }, [publishing, otaLines, c.ota.length, log]);

  // Waiting: the "socket" pushes a new offer.
  useEffect(() => {
    if (!visible || phase !== "waiting") return;
    const timer = window.setTimeout(() => {
      const id = nextId.current++;
      setOffer(makeOffer(id));
      setRemaining(WINDOW);
      startedAt.current = performance.now();
      setPhase("offer");
      log(`← offer.created #${id}`);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [visible, phase, log]);

  // Offer countdown.
  useEffect(() => {
    if (phase !== "offer" || !offer) return;
    const timer = window.setInterval(() => {
      const left = WINDOW - (performance.now() - startedAt.current) / 1000;
      if (left <= 0) {
        setPhase("expired");
        log(`← offer.expired #${offer.id}`);
      } else {
        setRemaining(left);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [phase, offer, log]);

  // Expired or declined: back to waiting.
  useEffect(() => {
    if (phase !== "expired" && phase !== "declined") return;
    const timer = window.setTimeout(() => setPhase("waiting"), 1500);
    return () => window.clearTimeout(timer);
  }, [phase]);

  function accept() {
    if (!offer) return;
    log(`→ offer.accept #${offer.id}`);
    log(`← offer.assigned #${offer.id}`);
    setPhase("toPickup");
  }

  function decline() {
    if (!offer) return;
    log(`→ offer.decline #${offer.id}`);
    setPhase("declined");
  }

  function arrive() {
    if (!offer) return;
    log("→ status at_customer");
    if (shipped) {
      setPhoto(false);
      setCode("");
      setProofError("");
      setPhase("proof");
    } else {
      log("→ status delivered");
      setLastWithProof(false);
      setPhase("done");
    }
  }

  function submitProof() {
    if (!offer) return;
    if (!photo) {
      setProofError(a.needPhoto);
      return;
    }
    if (code !== offer.code) {
      log("→ POST /proof  ← 422 invalid_code");
      setProofError(a.wrongCode);
      return;
    }
    log("→ POST /proof  ← 200 delivered");
    setLastWithProof(true);
    setPhase("done");
  }

  const money = (n: number) => n.toLocaleString(tag, { style: "currency", currency: "BRL" });
  const km = (n: number) => `${n.toLocaleString(tag, { maximumFractionDigits: 1 })} km`;

  return (
    <div
      ref={rootRef}
      data-testid="movio-demo"
      className="grid overflow-hidden rounded-xl border border-line bg-bg-raised lg:grid-cols-[minmax(0,1fr)_19rem]"
    >
      {/* ---------- Spec-driven flow ---------- */}
      <div className="terminal flex min-w-0 flex-col font-mono text-[0.78rem] leading-relaxed sm:text-[0.82rem]">
        <div role="tablist" className="flex overflow-x-auto border-b border-line bg-bg-raised">
          {c.tabs.map((name, i) => (
            <button
              key={name}
              role="tab"
              type="button"
              aria-selected={i === step}
              onClick={() => setStep(i)}
              className={`shrink-0 border-r border-line px-3.5 py-2 text-xs transition-colors ${
                i === step ? "bg-bg text-text" : "text-muted hover:text-text"
              }`}
            >
              <span className="mr-1.5 text-accent-text">{i + 1}</span>
              {name}
            </button>
          ))}
        </div>

        <div role="tabpanel" className="min-h-[19rem] flex-1 px-4 py-4 sm:px-5" data-testid="sdd-panel">
          {step === 0 && <Lines lines={c.spec} />}
          {step === 1 && <Lines lines={c.plan} />}
          {step === 2 && (
            <ul className="space-y-1.5">
              {c.tasks.map((task, i) => (
                <li key={task}>
                  <label className="flex cursor-pointer items-start gap-2">
                    <input
                      type="checkbox"
                      checked={done[i]}
                      onChange={() => setDone((current) => current.map((v, j) => (j === i ? !v : v)))}
                      className="mt-1 accent-[var(--accent)]"
                    />
                    <span className={done[i] ? "text-muted line-through" : ""}>{task}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          {step === 3 && (
            <div>
              <p className="font-bold">{c.pr}</p>
              <ul className="mt-4 space-y-1.5" data-testid="pr-checks">
                {allChecks.map((name, i) => {
                  const passed = i < checks;
                  const active = running && i === checks;
                  return (
                    <li key={name} className="flex items-center gap-2">
                      {passed ? (
                        <Check aria-hidden="true" className="size-4 text-accent-text" />
                      ) : active ? (
                        <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-muted motion-reduce:animate-none" />
                      ) : (
                        <span aria-hidden="true" className="grid size-4 place-items-center text-muted">○</span>
                      )}
                      <span className={passed ? "text-text" : "text-muted"}>{name}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 min-h-[1.6em] font-bold text-accent-text" aria-live="polite">
                {checksPassed ? c.ready : ""}
              </p>
            </div>
          )}
          {step === 4 && (
            <div data-testid="ota-panel">
              {otaLines === 0 && !publishing ? (
                <p className="text-muted">{checksPassed ? "$ eas update --channel production" : c.checksFirst}</p>
              ) : (
                <pre className="whitespace-pre-wrap">
                  {c.ota.slice(0, otaLines).map((line) => (
                    <span key={line} className={`block ${line.startsWith("✓") ? "text-accent-text" : ""}`}>
                      {line}
                    </span>
                  ))}
                </pre>
              )}
              {shipped && (
                <section className="mt-5 rounded-lg border border-accent/50 bg-bg-raised p-4 font-sans" data-testid="sdd-result">
                  <h4 className="font-bold text-accent-text">{c.resultTitle}</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    {c.result.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-text" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm font-semibold">{c.resultCta}</p>
                </section>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 font-sans sm:px-5">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm font-semibold text-muted transition-colors hover:text-text disabled:opacity-40"
          >
            {c.back}
          </button>
          {step < 3 && (
            <button type="button" onClick={() => setStep((s) => s + 1)} className="rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-on-accent">
              {c.next}
            </button>
          )}
          {step === 3 &&
            (checksPassed ? (
              <button type="button" onClick={() => setStep(4)} className="rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-on-accent">
                {c.next}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setRunning(true)}
                disabled={running}
                className="rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-on-accent disabled:opacity-60"
              >
                {c.run}
              </button>
            ))}
          {step === 4 && !shipped && (
            <button
              type="button"
              onClick={() => setPublishing(true)}
              disabled={!checksPassed || publishing}
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-on-accent disabled:opacity-40"
            >
              {publishing ? c.publishing : c.publish}
            </button>
          )}
        </div>
      </div>

      {/* ---------- Courier app ---------- */}
      <div className="border-t border-line p-4 lg:border-l lg:border-t-0">
        <div className="mx-auto w-full max-w-[17rem] rounded-[2.2rem] border-4 border-line bg-bg p-3 shadow-[0_20px_50px_-25px_rgb(0_0_0/0.6)]">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-line" />
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="font-bold">
              Movio <span className="font-mono font-normal text-muted" data-testid="app-version">v{shipped ? "1.3.15" : "1.3.14"}</span>
            </span>
            <span className="flex items-center gap-1.5 text-accent-text">
              <span className="size-2 rounded-full bg-accent" />
              {a.online}
            </span>
          </div>
          {banner && (
            <button
              type="button"
              onClick={() => setBanner(false)}
              className="mt-2 w-full rounded-lg bg-accent/15 px-2.5 py-1.5 text-left text-[0.7rem] font-semibold text-accent-text"
            >
              {a.updated("1.3.15")}
            </button>
          )}

          <div className="mt-3 flex min-h-[21rem] flex-col justify-center rounded-2xl border border-line bg-bg-raised p-4 text-sm" data-testid="app-screen">
            {phase === "waiting" && <p className="text-center text-muted">{a.waiting}</p>}
            {(phase === "expired" || phase === "declined") && (
              <p className="text-center text-muted">{phase === "expired" ? a.expired : a.declined}</p>
            )}

            {phase === "offer" && offer && (
              <div data-testid="offer-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.7rem] text-muted">#{offer.id}</p>
                    <p className="font-bold">{a.available}</p>
                  </div>
                  <Countdown progress={remaining / WINDOW} seconds={Math.ceil(remaining)} label={a.seconds} />
                </div>
                <p className="mt-3 text-lg font-bold leading-tight">{offer.restaurant}</p>
                <dl className="mt-3 space-y-1">
                  <Row label={a.distance} value={km(offer.km)} />
                  <Row label={a.eta} value={`${offer.minutes} min`} />
                  <Row label={a.fee} value={money(offer.fee + offer.surge)} strong />
                </dl>
                {offer.surge > 0 && (
                  <p className="mt-2 rounded-md bg-accent/15 px-2 py-1 text-xs font-semibold text-accent-text">
                    {a.surge} +{money(offer.surge)}
                  </p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={decline} className="rounded-full border border-line py-2 font-semibold text-muted transition-colors hover:text-text">
                    {a.decline}
                  </button>
                  <button type="button" onClick={accept} className="rounded-full bg-accent py-2 font-bold text-on-accent">
                    {a.accept}
                  </button>
                </div>
              </div>
            )}

            {(phase === "toPickup" || phase === "toCustomer") && offer && (
              <div>
                <ol className="space-y-2">
                  <RouteStep active={phase === "toPickup"} done={phase === "toCustomer"} title={offer.restaurant} subtitle={a.toPickup} />
                  <RouteStep active={phase === "toCustomer"} done={false} title={offer.neighborhood} subtitle={a.toCustomer} />
                </ol>
                <button
                  type="button"
                  onClick={() => {
                    if (phase === "toPickup") {
                      log("→ status picked_up");
                      setPhase("toCustomer");
                    } else {
                      arrive();
                    }
                  }}
                  className="mt-6 w-full rounded-full bg-accent py-2 font-bold text-on-accent"
                >
                  {phase === "toPickup" ? a.pickedUp : a.arrived}
                </button>
              </div>
            )}

            {phase === "proof" && offer && (
              <div data-testid="proof-screen">
                <p className="font-bold">{a.proofTitle}</p>
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(true);
                    setProofError("");
                  }}
                  className={`mt-3 grid h-20 w-full place-items-center rounded-lg border-2 border-dashed text-xs transition-colors ${
                    photo ? "border-accent bg-accent/10 text-accent-text" : "border-line text-muted hover:border-accent"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {photo ? <Check aria-hidden="true" className="size-4" /> : <Camera aria-hidden="true" className="size-4" />}
                    {photo ? a.photoTaken : a.takePhoto}
                  </span>
                </button>
                <label className="mt-3 block text-xs text-muted">
                  {a.code}
                  <input
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
                      setProofError("");
                    }}
                    inputMode="numeric"
                    placeholder="0000"
                    className="mt-1 block w-full rounded-md border border-line bg-bg px-3 py-1.5 text-center font-mono text-lg tracking-[0.5em] text-text"
                  />
                </label>
                <p className="mt-1 font-mono text-[0.68rem] text-muted">{a.codeHint(offer.code)}</p>
                <p className="mt-2 min-h-[2.5em] text-xs font-semibold text-text" aria-live="polite" data-testid="proof-error">
                  {proofError}
                </p>
                <button type="button" onClick={submitProof} className="w-full rounded-full bg-accent py-2 font-bold text-on-accent">
                  {a.finish}
                </button>
              </div>
            )}

            {phase === "done" && (
              <div className="text-center" data-testid="delivery-done">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent/15 text-accent-text">
                  <Check aria-hidden="true" className="size-6" />
                </span>
                <p className="mt-3 text-lg font-bold">{a.done}</p>
                <p className="mt-1 text-xs text-muted">{lastWithProof ? a.withProof : a.withoutProof}</p>
                <button type="button" onClick={() => setPhase("waiting")} className="mt-5 rounded-full border border-line px-4 py-1.5 font-semibold">
                  {a.nextOffer}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="terminal mx-auto mt-4 max-w-[17rem] rounded-lg border border-line p-3 font-mono text-[0.68rem] leading-relaxed">
          <p className="text-muted">{a.events}</p>
          <ol className="mt-1.5 min-h-[5.5rem] space-y-0.5" data-testid="app-log">
            {events.map((line, i) => (
              <li key={`${line}-${i}`} className={`truncate ${line.startsWith("→") ? "text-accent-text" : "text-text"}`}>
                {line}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "font-bold" : undefined}>{value}</dd>
    </div>
  );
}

function RouteStep({ active, done, title, subtitle }: { active: boolean; done: boolean; title: string; subtitle: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-1 grid size-4 shrink-0 place-items-center rounded-full border-2 ${
          done ? "border-accent bg-accent" : active ? "border-accent" : "border-line"
        }`}
      >
        {done && <Check aria-hidden="true" className="size-2.5 text-on-accent" />}
      </span>
      <span>
        <span className={`block font-bold ${active || done ? "" : "text-muted"}`}>{title}</span>
        <span className="block text-xs text-muted">{subtitle}</span>
      </span>
    </li>
  );
}

function Lines({ lines }: { lines: string[] }) {
  return (
    <pre className="whitespace-pre-wrap font-mono">
      {lines.map((line, i) => (
        <span key={i} className={line.startsWith("#") ? "block font-bold text-accent-text" : "block"}>
          {line || " "}
        </span>
      ))}
    </pre>
  );
}

function Countdown({ progress, seconds, label }: { progress: number; seconds: number; label: string }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  return (
    <span className="relative grid size-11 shrink-0 place-items-center" aria-label={`${seconds} ${label}`}>
      <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="20" cy="20" r={radius} fill="none" strokeWidth="3" className="stroke-line" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className="stroke-accent"
        />
      </svg>
      <span className="font-mono text-xs font-bold tabular-nums">{seconds}</span>
    </span>
  );
}
