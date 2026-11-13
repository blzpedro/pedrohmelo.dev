"use client";

import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Check, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { languageTag, type AppLocale } from "@/i18n/routing";

/* ---------- Copy (site language) ---------- */

const copy = {
  en: {
    brand: "Brand",
    market: "Market",
    shopOf: (brand: string) => `${brand} shop`,
    inclVat: "Prices include VAT",
    exclTax: "Prices before sales tax",
    add: "Add to cart",
    cart: "Cart",
    empty: "Your cart is empty. Add a service, a part or some gear.",
    subtotal: "Subtotal",
    vat: (rate: number) => `VAT ${rate}% included`,
    salesTax: "Sales tax at checkout",
    total: "Total",
    checkout: "Check out",
    placing: "Placing order…",
    placed: (id: string) => `Order ${id} placed.`,
    nextSlot: "Next slot",
    remove: "Remove",
    increase: "Add one",
    decrease: "Remove one",
    size: "Size",
    sizeOf: (size: string) => `Size ${size}`,
    api: "API calls, served by simulated Lambdas",
    vehicle: "Your vehicle",
    vinLabel: "VIN",
    vinPlaceholder: "17-character VIN",
    find: "Find vehicle",
    finding: "Looking up…",
    samples: "Sample VINs",
    invalid: "A VIN has 17 characters and never uses I, O or Q.",
    notFound: "That VIN isn't in the demo data. Try one of the samples.",
    clear: "Clear vehicle",
    addVehicle: "Add vehicle by VIN",
    change: "Change",
    modalTitle: "Find your vehicle",
    modalIntro: "The VIN is on the registration document: 17 letters and numbers.",
    confirm: "Use this vehicle",
    another: "Try another VIN",
    close: "Close",
    modelLabel: "Model",
    yearLabel: "Year",
    photo: "Photo",
    noVehicle: "Enter a VIN to see which parts fit.",
    fits: (model: string) => `Fits your ${model}`,
    noFit: (model: string) => `Doesn't fit your ${model}`,
    needVin: "Enter a VIN to check fit",
    priceNote: "Crossed-out price: the lowest price in the 30 days before the discount.",
    kinds: { service: "Service", part: "Part", accessory: "Accessory", garment: "Gear" },
    genders: { men: "Men", women: "Women", unisex: "Unisex" },
    categories: { gear: "Gear and garment", parts: "Parts and service" },
  },
  pt: {
    brand: "Marca",
    market: "Mercado",
    shopOf: (brand: string) => `Loja ${brand}`,
    inclVat: "Preços com IVA incluído",
    exclTax: "Preços sem sales tax",
    add: "Adicionar ao carrinho",
    cart: "Carrinho",
    empty: "Seu carrinho está vazio. Adicione um serviço, uma peça ou um equipamento.",
    subtotal: "Subtotal",
    vat: (rate: number) => `IVA de ${rate}% incluído`,
    salesTax: "Sales tax no checkout",
    total: "Total",
    checkout: "Finalizar compra",
    placing: "Fechando o pedido…",
    placed: (id: string) => `Pedido ${id} realizado.`,
    nextSlot: "Próxima vaga",
    remove: "Remover",
    increase: "Mais um",
    decrease: "Menos um",
    size: "Tamanho",
    sizeOf: (size: string) => `Tamanho ${size}`,
    api: "Chamadas à API, atendidas por Lambdas simuladas",
    vehicle: "Seu veículo",
    vinLabel: "VIN",
    vinPlaceholder: "VIN de 17 caracteres",
    find: "Identificar",
    finding: "Buscando…",
    samples: "VINs de exemplo",
    invalid: "Um VIN tem 17 caracteres e nunca usa I, O ou Q.",
    notFound: "Esse VIN não está nos dados da demo. Use um dos exemplos.",
    clear: "Limpar veículo",
    addVehicle: "Adicionar veículo pelo VIN",
    change: "Trocar",
    modalTitle: "Identifique seu veículo",
    modalIntro: "O VIN está no documento do veículo: 17 letras e números.",
    confirm: "Usar este veículo",
    another: "Informar outro VIN",
    close: "Fechar",
    modelLabel: "Modelo",
    yearLabel: "Ano",
    photo: "Foto",
    noVehicle: "Informe o VIN para ver quais peças servem.",
    fits: (model: string) => `Serve na sua ${model}`,
    noFit: (model: string) => `Não serve na sua ${model}`,
    needVin: "Informe o VIN para checar",
    priceNote: "Preço riscado: o menor preço nos 30 dias antes do desconto.",
    kinds: { service: "Serviço", part: "Peça", accessory: "Acessório", garment: "Equipamento" },
    genders: { men: "Masculino", women: "Feminino", unisex: "Unissex" },
    categories: { gear: "Equipamento e vestuário", parts: "Peças e serviços" },
  },
} satisfies Record<AppLocale, unknown>;

/* ---------- Catalog: one platform, three brands ---------- */

type BrandId = "bmw" | "mini" | "motorrad";
type Kind = "service" | "part" | "accessory" | "garment";
type CategoryId = "gear" | "parts";

type Product = {
  sku: string;
  kind: Kind;
  price: number;
  /** Price before a sale, shown crossed out. */
  was?: number;
  name: Record<AppLocale, string>;
  gender?: "men" | "women" | "unisex";
  sizes?: string[];
  /** Vehicle models this fits. Absent: fits any vehicle. */
  fits?: string[];
};

type Brand = {
  id: BrandId;
  name: string;
  logo: string;
  orderPrefix: string;
  /** Design tokens; the components never branch on the brand. */
  theme: { accent: string; onAccent: string; radius: string; transform: CSSProperties["textTransform"]; tracking: string };
  categories: { id: CategoryId; products: Product[] }[];
};

const BRANDS: Brand[] = [
  {
    id: "bmw",
    name: "BMW",
    logo: "/logos/bmw.svg",
    orderPrefix: "BMW",
    theme: { accent: "#1c69d4", onAccent: "#ffffff", radius: "0.3rem", transform: "none", tracking: "0" },
    categories: [
      {
        id: "parts",
        products: [
          { sku: "bmw-insp", kind: "service", price: 289, name: { en: "Inspection with oil change", pt: "Inspeção com troca de óleo" } },
          { sku: "bmw-brake", kind: "part", price: 189, fits: ["g20"], name: { en: "Front brake pads", pt: "Pastilhas de freio dianteiras" } },
          { sku: "bmw-filter", kind: "part", price: 59, fits: ["g01"], name: { en: "Cabin air filter", pt: "Filtro de ar da cabine" } },
        ],
      },
    ],
  },
  {
    id: "mini",
    name: "MINI",
    logo: "/logos/mini.svg",
    orderPrefix: "MINI",
    theme: { accent: "#e6eefa", onAccent: "#09131f", radius: "9999px", transform: "none", tracking: "0" },
    categories: [
      {
        id: "parts",
        products: [
          { sku: "mini-svc", kind: "service", price: 259, name: { en: "MINI service package", pt: "Pacote de serviços MINI" } },
          { sku: "mini-wipers", kind: "part", price: 49, fits: ["f56"], name: { en: "Wiper blade set", pt: "Jogo de palhetas" } },
          { sku: "mini-caps", kind: "accessory", price: 159, fits: ["f56"], name: { en: "Union Jack mirror caps", pt: "Capas de retrovisor Union Jack" } },
        ],
      },
    ],
  },
  {
    id: "motorrad",
    name: "BMW Motorrad",
    logo: "/logos/bmw.svg",
    orderPrefix: "BMW-MRD",
    theme: { accent: "#5b9dff", onAccent: "#09131f", radius: "0", transform: "uppercase", tracking: "0.06em" },
    categories: [
      {
        id: "gear",
        products: [
          { sku: "mrd-jacket", kind: "garment", price: 705.6, was: 1176, gender: "men", sizes: ["S", "M", "L", "XL"], name: { en: "Rally jacket, waterproof", pt: "Jaqueta rally impermeável" } },
          { sku: "mrd-gloves", kind: "garment", price: 179, gender: "unisex", sizes: ["S", "M", "L", "XL"], name: { en: "Adventure gloves", pt: "Luvas adventure" } },
          { sku: "mrd-tee", kind: "garment", price: 23.4, was: 39, gender: "women", sizes: ["XS", "S", "M", "L"], name: { en: "Logo T-shirt", pt: "Camiseta com logo" } },
        ],
      },
      {
        id: "parts",
        products: [
          { sku: "mrd-svc", kind: "service", price: 219, name: { en: "Annual motorcycle service", pt: "Revisão anual da moto" } },
          { sku: "mrd-chain", kind: "part", price: 249, fits: ["k67"], name: { en: "Chain and sprocket kit", pt: "Kit de relação" } },
          { sku: "mrd-seat", kind: "accessory", price: 389, fits: ["k50"], name: { en: "Comfort seat", pt: "Banco conforto" } },
        ],
      },
    ],
  },
];

/* ---------- Vehicles: made-up VINs with real-world structure ---------- */

type Photo = { src: string; artist: string; license: string; page: string };
type Vehicle = { vin: string; brand: BrandId; model: string; modelId: string; year: number; photo: Photo };

/** WMI (first 3 characters): WBA = BMW cars, WMW = MINI, WB1 = BMW Motorrad. */
/** Photos from Wikimedia Commons under free licenses, credited where they are shown. */
const VEHICLES: Vehicle[] = [
  {
    vin: "WB10J5300PZ551234",
    brand: "motorrad",
    model: "R 1250 GS",
    modelId: "k50",
    year: 2023,
    photo: { src: "/vehicles/k50.jpg", artist: "Cjp24", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:BMW_R_1250_GS_(1).jpg" },
  },
  {
    vin: "WB10E6909RZ886543",
    brand: "motorrad",
    model: "S 1000 RR",
    modelId: "k67",
    year: 2024,
    photo: { src: "/vehicles/k67.jpg", artist: "Stefan Krause", license: "CC BY-SA 3.0", page: "https://commons.wikimedia.org/wiki/File:BMW_S1000_RR_Studio.JPG" },
  },
  {
    vin: "WBA5R1C05PFJ81234",
    brand: "bmw",
    model: "320i",
    modelId: "g20",
    year: 2023,
    photo: { src: "/vehicles/g20.jpg", artist: "Damian B Oh", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:BMW_G20_320i_Black_Sapphire_Metallic_(1).jpg" },
  },
  {
    vin: "WMW53DH08R2T76543",
    brand: "mini",
    model: "Cooper S",
    modelId: "f56",
    year: 2024,
    photo: { src: "/vehicles/f56.jpg", artist: "Damian B Oh", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:MINI_F56_Hatch_Cooper_S_Chili_Red_(1).jpg" },
  },
];

const VIN_FORMAT = /^[A-HJ-NPR-Z0-9]{17}$/;

/* ---------- Markets: currency, tax and formats ---------- */

type Market = { region: string; locale: string; currency: string; rate: number; step: number; vat: number | null; omnibus: boolean };

const MARKETS: Market[] = [
  { region: "DE", locale: "de-DE", currency: "EUR", rate: 1, step: 0.01, vat: 19, omnibus: true },
  { region: "PT", locale: "pt-PT", currency: "EUR", rate: 1, step: 0.01, vat: 23, omnibus: true },
  { region: "GB", locale: "en-GB", currency: "GBP", rate: 0.86, step: 0.01, vat: 20, omnibus: false },
  { region: "US", locale: "en-US", currency: "USD", rate: 1.08, step: 0.01, vat: null, omnibus: false },
  { region: "JP", locale: "ja-JP", currency: "JPY", rate: 162, step: 100, vat: 10, omnibus: false },
];

/** Fixed, so server and browser render the same date. */
const SLOT = new Date(Date.UTC(2026, 11, 3, 9, 30));

type Line = { key: string; sku: string; size?: string; qty: number };
type Call = { method: string; path: string; fn: string; status: number; ms: number };

export function ShopDemo() {
  const locale = useLocale() as AppLocale;
  const c = copy[locale];
  const regionName = new Intl.DisplayNames([languageTag[locale]], { type: "region" });

  const [brandId, setBrandId] = useState<BrandId>("motorrad");
  const [categoryId, setCategoryId] = useState<CategoryId>("gear");
  const [region, setRegion] = useState("DE");
  const [carts, setCarts] = useState<Record<BrandId, Line[]>>({ bmw: [], mini: [], motorrad: [] });
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [vin, setVin] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  // The vehicle found in the dialog, shown with its picture before it is confirmed.
  const [candidate, setCandidate] = useState<Vehicle | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [vinState, setVinState] = useState<"idle" | "finding" | "invalid" | "notFound">("idle");
  const [calls, setCalls] = useState<Call[]>([]);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<string | null>(null);
  // Drives made-up but varied latencies and order numbers without Math.random in render code.
  const seq = useRef(0);

  const brand = BRANDS.find((b) => b.id === brandId)!;
  const category = brand.categories.find((cat) => cat.id === categoryId) ?? brand.categories[0];
  const market = MARKETS.find((m) => m.region === region)!;
  const cart = carts[brandId];
  const allProducts = brand.categories.flatMap((cat) => cat.products);

  const priceOf = (base: number) => Math.round((base * market.rate) / market.step) * market.step;
  const money = (n: number) => new Intl.NumberFormat(market.locale, { style: "currency", currency: market.currency }).format(n);
  const slot = new Intl.DateTimeFormat(market.locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(SLOT);

  const lines = cart.map((line) => ({ ...line, product: allProducts.find((p) => p.sku === line.sku)! }));
  const count = cart.reduce((n, line) => n + line.qty, 0);
  const total = lines.reduce((sum, line) => sum + priceOf(line.product.price) * line.qty, 0);
  const vatAmount = market.vat ? total - total / (1 + market.vat / 100) : 0;
  const showPriceNote = market.omnibus && category.products.some((p) => p.was);

  function call(method: string, path: string, fn: string, status = 200) {
    seq.current += 1;
    const ms = 38 + ((seq.current * 53 + path.length * 17) % 110);
    setCalls((current) => [...current.slice(-4), { method, path, fn, status, ms }]);
  }

  function catalogQuery(id: BrandId, m: Market, v: Vehicle | null) {
    return `/catalog?brand=${id}&market=${m.locale}${v ? `&model=${v.modelId}` : ""}`;
  }

  function chooseBrand(id: BrandId) {
    setBrandId(id);
    setCategoryId(BRANDS.find((b) => b.id === id)!.categories[0].id);
    setOrder(null);
    call("GET", catalogQuery(id, market, vehicle), "catalog");
  }

  function chooseMarket(next: string) {
    const m = MARKETS.find((x) => x.region === next)!;
    setRegion(next);
    call("GET", catalogQuery(brandId, m, vehicle), "catalog");
  }

  function findVehicle(event?: FormEvent, sample?: string) {
    event?.preventDefault();
    const value = (sample ?? vin).trim().toUpperCase();
    if (sample) setVin(sample);
    if (!VIN_FORMAT.test(value)) {
      setVinState("invalid");
      call("GET", `/vehicles/${value || "…"}`, "vin-decoder", 422);
      return;
    }
    setVinState("finding");
    window.setTimeout(() => {
      const found = VEHICLES.find((v) => v.vin === value) ?? null;
      if (!found) {
        setVinState("notFound");
        call("GET", `/vehicles/${value}`, "vin-decoder", 404);
        return;
      }
      call("GET", `/vehicles/${value}`, "vin-decoder");
      call("GET", found.photo.src, "media");
      setCandidate(found);
      setVinState("idle");
    }, 450);
  }

  function openDialog() {
    setCandidate(null);
    setVin("");
    setVinState("idle");
    dialogRef.current?.showModal();
  }

  function confirmVehicle() {
    if (!candidate) return;
    setVehicle(candidate);
    setBrandId(candidate.brand);
    setCategoryId("parts");
    setOrder(null);
    call("GET", catalogQuery(candidate.brand, market, candidate), "catalog");
    dialogRef.current?.close();
  }

  function clearVehicle() {
    setVehicle(null);
    setCandidate(null);
    setVin("");
    setVinState("idle");
  }

  function updateCart(update: (current: Line[]) => Line[]) {
    setCarts((current) => ({ ...current, [brandId]: update(current[brandId]) }));
    setOrder(null);
  }

  function add(product: Product) {
    const size = product.sizes ? (sizes[product.sku] ?? product.sizes[1]) : undefined;
    const key = size ? `${product.sku}:${size}` : product.sku;
    const exists = cart.some((l) => l.key === key);
    updateCart((ls) =>
      exists ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { key, sku: product.sku, size, qty: 1 }],
    );
    call(exists ? "PATCH" : "POST", exists ? `/cart/items/${key}` : "/cart/items", "cart", exists ? 200 : 201);
  }

  function changeQty(key: string, delta: number) {
    const line = cart.find((l) => l.key === key)!;
    if (line.qty + delta <= 0) return remove(key);
    updateCart((ls) => ls.map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l)));
    call("PATCH", `/cart/items/${key}`, "cart");
  }

  function remove(key: string) {
    updateCart((ls) => ls.filter((l) => l.key !== key));
    call("DELETE", `/cart/items/${key}`, "cart", 204);
  }

  function checkout() {
    setPlacing(true);
    window.setTimeout(() => {
      seq.current += 1;
      const id = `${brand.orderPrefix}-${10000 + ((seq.current * 7919) % 89999)}`;
      call("POST", "/orders", "checkout", 201);
      setCarts((current) => ({ ...current, [brandId]: [] }));
      setOrder(id);
      setPlacing(false);
    }, 700);
  }

  /** Whether a product can go in the cart, and what to say about fit. */
  function fitOf(product: Product): { ok: boolean; note?: string; good?: boolean } {
    if (!product.fits) return { ok: true };
    if (!vehicle) return { ok: false, note: c.needVin };
    return product.fits.includes(vehicle.modelId)
      ? { ok: true, note: c.fits(vehicle.model), good: true }
      : { ok: false, note: c.noFit(vehicle.model) };
  }

  const theme = {
    "--brand": brand.theme.accent,
    "--brand-on": brand.theme.onAccent,
    "--brand-radius": brand.theme.radius,
  } as CSSProperties;
  const buttonText: CSSProperties = { textTransform: brand.theme.transform, letterSpacing: brand.theme.tracking };

  return (
    <div data-testid="shop-demo" data-brand={brandId} style={theme} className="overflow-hidden rounded-xl border border-line bg-bg-raised">
      {/* Brand, market and cart */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div role="group" aria-label={c.brand} className="flex flex-wrap gap-1.5">
          {BRANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={b.id === brandId}
              onClick={() => chooseBrand(b.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                b.id === brandId ? "border-text bg-text font-bold text-bg" : "border-line text-muted hover:text-text"
              }`}
            >
              <Mask src={b.logo} className="size-4 bg-current" />
              {b.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">{c.market}</span>
            <select
              value={region}
              onChange={(e) => chooseMarket(e.target.value)}
              className="rounded-md border border-line bg-bg px-2 py-1.5 text-sm text-text"
            >
              {MARKETS.map((m) => (
                <option key={m.region} value={m.region}>
                  {regionName.of(m.region)} ({m.currency})
                </option>
              ))}
            </select>
          </label>
          <span className="relative grid size-9 place-items-center rounded-full border border-line" aria-label={`${c.cart}: ${count}`}>
            <ShoppingCart aria-hidden="true" className="size-4" />
            {count > 0 && (
              <span
                data-testid="cart-badge"
                className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[var(--brand)] px-1 text-[0.7rem] font-bold text-[var(--brand-on)]"
              >
                {count}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Vehicle: a bar in the shop, a dialog to find it by VIN */}
      <div className="border-b border-line bg-bg/50 px-4 py-3" data-testid="vehicle-selector">
        {vehicle ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="text-muted">{c.vehicle}</span>
              <Image
                src={vehicle.photo.src}
                alt=""
                width={64}
                height={48}
                className="h-9 w-12 rounded object-cover"
              />
              <span className="font-bold" data-testid="vehicle-name">
                {BRANDS.find((b) => b.id === vehicle.brand)!.name} {vehicle.model}, {vehicle.year}
              </span>
              <span className="font-mono text-xs text-muted">{vehicle.vin}</span>
            </p>
            <span className="flex items-center gap-4">
              <button type="button" onClick={openDialog} className="text-sm font-semibold underline decoration-line underline-offset-4 hover:decoration-accent">
                {c.change}
              </button>
              <button
                type="button"
                onClick={clearVehicle}
                className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-text"
              >
                <X aria-hidden="true" className="size-4" />
                {c.clear}
              </button>
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">{c.noVehicle}</p>
            <button
              type="button"
              onClick={openDialog}
              className="rounded-md border border-line px-3 py-1.5 text-sm font-semibold transition-colors hover:border-accent"
            >
              {c.addVehicle}
            </button>
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="vin-dialog-title"
        data-testid="vin-dialog"
        onClose={() => setVinState("idle")}
        className="m-auto w-[min(30rem,calc(100vw-2rem))] rounded-xl border border-line bg-bg-raised p-0 text-text backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <h4 id="vin-dialog-title" className="font-bold">
            {c.modalTitle}
          </h4>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={c.close}
            className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:text-text"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        {candidate ? (
          <div className="p-5" data-testid="vehicle-preview">
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-bg">
                <Image
                  src={candidate.photo.src}
                  alt={`${BRANDS.find((b) => b.id === candidate.brand)!.name} ${candidate.model}`}
                  fill
                  sizes="(min-width: 640px) 28rem, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-1.5 text-right font-mono text-[0.65rem] text-muted">
                {c.photo}: {candidate.photo.artist},{" "}
                <a href={candidate.photo.page} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2 hover:text-text">
                  {candidate.photo.license}
                </a>
                , Wikimedia Commons
              </figcaption>
            </figure>
            <p className="mt-4 flex items-center gap-2 text-lg font-black tracking-tight">
              <Mask src={BRANDS.find((b) => b.id === candidate.brand)!.logo} className="size-5 bg-text" />
              {BRANDS.find((b) => b.id === candidate.brand)!.name} {candidate.model}
            </p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
              <dt className="text-muted">{c.yearLabel}</dt>
              <dd>{candidate.year}</dd>
              <dt className="text-muted">{c.vinLabel}</dt>
              <dd className="font-mono">{candidate.vin}</dd>
            </dl>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setCandidate(null);
                  setVin("");
                }}
                className="text-sm font-semibold text-muted transition-colors hover:text-text"
              >
                {c.another}
              </button>
              <button
                type="button"
                onClick={confirmVehicle}
                style={buttonText}
                className="rounded-[var(--brand-radius)] bg-[var(--brand)] px-4 py-2 text-sm font-bold text-[var(--brand-on)]"
              >
                {c.confirm}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => findVehicle(e)} className="p-5">
            <p className="text-sm text-muted">{c.modalIntro}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <input
                id="vin"
                value={vin}
                onChange={(e) => {
                  setVin(e.target.value.toUpperCase());
                  if (vinState !== "finding") setVinState("idle");
                }}
                maxLength={17}
                spellCheck={false}
                autoComplete="off"
                aria-label={c.vinLabel}
                aria-invalid={vinState === "invalid" || vinState === "notFound"}
                aria-describedby="vin-help"
                placeholder={c.vinPlaceholder}
                className="min-w-0 flex-1 rounded-md border border-line bg-bg px-3 py-2 font-mono text-sm uppercase tracking-wide text-text placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/70"
              />
              <button
                type="submit"
                disabled={vinState === "finding"}
                className="rounded-md bg-accent px-4 py-2 text-sm font-bold text-on-accent disabled:opacity-60"
              >
                {vinState === "finding" ? c.finding : c.find}
              </button>
            </div>
            <p id="vin-help" className="mt-2 min-h-[1.25rem] text-xs" aria-live="polite" data-testid="vin-status">
              {vinState === "invalid" ? c.invalid : vinState === "notFound" ? c.notFound : ""}
            </p>
            <p className="mt-3 text-xs text-muted">{c.samples}</p>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {VEHICLES.map((v) => (
                <li key={v.vin}>
                  <button
                    type="button"
                    onClick={() => findVehicle(undefined, v.vin)}
                    className="flex w-full flex-col items-start rounded-lg border border-line bg-bg px-3 py-2 text-left transition-colors hover:border-accent"
                  >
                    <span className="text-sm font-semibold">{v.model}</span>
                    <span className="font-mono text-[0.68rem] text-muted">{v.vin}</span>
                  </button>
                </li>
              ))}
            </ul>
          </form>
        )}
      </dialog>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Catalog */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-lg font-black tracking-tight" style={buttonText}>
              <Mask src={brand.logo} className="size-6 bg-text" />
              {c.shopOf(brand.name)}
            </p>
            <span className="text-xs text-muted">{market.vat ? c.inclVat : c.exclTax}</span>
          </div>

          {brand.categories.length > 1 && (
            <div role="group" aria-label={c.shopOf(brand.name)} className="mt-3 flex gap-4 border-b border-line text-sm">
              {brand.categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={cat.id === category.id}
                  onClick={() => {
                    setCategoryId(cat.id);
                    call("GET", `${catalogQuery(brandId, market, vehicle)}&category=${cat.id}`, "catalog");
                  }}
                  className={`-mb-px border-b-2 pb-2 transition-colors ${
                    cat.id === category.id ? "border-[var(--brand)] font-bold text-text" : "border-transparent text-muted hover:text-text"
                  }`}
                  style={buttonText}
                >
                  {c.categories[cat.id]}
                </button>
              ))}
            </div>
          )}

          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {category.products.map((product) => {
              const fit = fitOf(product);
              const discount = product.was ? Math.round((1 - product.price / product.was) * 100) : 0;
              return (
                <li key={product.sku} className="flex flex-col rounded-lg border border-line bg-bg p-3" data-sku={product.sku}>
                  <div className="flex items-center justify-between gap-2 font-mono text-[0.68rem] text-muted">
                    <span style={product.gender ? buttonText : undefined}>
                      {product.gender ? c.genders[product.gender] : c.kinds[product.kind]}
                    </span>
                    {discount > 0 && (
                      <span className="rounded bg-[var(--brand)] px-1 font-bold text-[var(--brand-on)]">-{discount}%</span>
                    )}
                  </div>
                  <span className="mt-1 font-semibold leading-snug" style={product.kind === "garment" ? buttonText : undefined}>
                    {product.name[locale]}
                  </span>
                  {product.kind === "service" && (
                    <span className="mt-1 text-xs text-muted">
                      {c.nextSlot}: <span lang={market.locale}>{slot}</span>
                    </span>
                  )}
                  {fit.note && (
                    <span className={`mt-1 inline-flex items-center gap-1 text-xs ${fit.good ? "text-accent-text" : "text-muted"}`} data-testid="fit-note">
                      {fit.good && <Check aria-hidden="true" className="size-3.5" />}
                      {fit.note}
                    </span>
                  )}
                  <p className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-3">
                    <span className="text-lg font-black tabular-nums" data-testid="product-price">
                      {money(priceOf(product.price))}
                    </span>
                    {product.was && <s className="text-xs tabular-nums text-muted">{money(priceOf(product.was))}</s>}
                  </p>
                  {product.sizes && (
                    <label className="mt-2 flex items-center gap-2 text-xs text-muted">
                      {c.size}
                      <select
                        value={sizes[product.sku] ?? product.sizes[1]}
                        onChange={(e) => setSizes((s) => ({ ...s, [product.sku]: e.target.value }))}
                        className="flex-1 rounded border border-line bg-bg-raised px-1.5 py-1 text-sm text-text"
                      >
                        {product.sizes.map((size) => (
                          <option key={size}>{size}</option>
                        ))}
                      </select>
                    </label>
                  )}
                  <button
                    type="button"
                    onClick={() => add(product)}
                    disabled={!fit.ok}
                    style={buttonText}
                    className="mt-2 rounded-[var(--brand-radius)] bg-[var(--brand)] px-3 py-1.5 text-sm font-bold text-[var(--brand-on)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {c.add}
                  </button>
                </li>
              );
            })}
          </ul>
          {showPriceNote && <p className="mt-3 text-xs text-muted">{c.priceNote}</p>}
        </div>

        {/* Cart */}
        <section aria-label={c.cart} data-testid="cart" className="border-t border-line bg-bg/60 p-4 sm:p-5 lg:border-l lg:border-t-0">
          <h4 className="font-bold">
            {c.cart} <span className="text-muted">({count})</span>
          </h4>
          {lines.length === 0 ? (
            <p className="mt-3 text-sm text-muted" aria-live="polite" data-testid="cart-message">
              {order ? c.placed(order) : c.empty}
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {lines.map(({ key, qty, size, product }) => (
                <li key={key} className="text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="leading-snug">
                      <span className="font-semibold">{product.name[locale]}</span>
                      {size && <span className="block text-xs text-muted">{c.sizeOf(size)}</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(key)}
                      aria-label={`${c.remove}: ${product.name[locale]}`}
                      className="text-muted transition-colors hover:text-text"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full border border-line">
                      <button type="button" onClick={() => changeQty(key, -1)} aria-label={`${c.decrease}: ${product.name[locale]}`} className="grid size-7 place-items-center text-muted hover:text-text">
                        <Minus aria-hidden="true" className="size-3.5" />
                      </button>
                      <span className="w-6 text-center tabular-nums" data-testid="line-qty">
                        {qty}
                      </span>
                      <button type="button" onClick={() => changeQty(key, 1)} aria-label={`${c.increase}: ${product.name[locale]}`} className="grid size-7 place-items-center text-muted hover:text-text">
                        <Plus aria-hidden="true" className="size-3.5" />
                      </button>
                    </span>
                    <span className="tabular-nums">{money(priceOf(product.price) * qty)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <dl className="mt-5 space-y-1 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">{c.subtotal}</dt>
              <dd className="tabular-nums">{money(total)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">{market.vat ? c.vat(market.vat) : c.salesTax}</dt>
              <dd className="tabular-nums text-muted">{market.vat ? money(vatAmount) : "–"}</dd>
            </div>
            <div className="flex justify-between pt-1 text-base font-black">
              <dt>{c.total}</dt>
              <dd className="tabular-nums" data-testid="cart-total">
                {money(total)}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={checkout}
            disabled={lines.length === 0 || placing}
            style={buttonText}
            className="mt-4 w-full rounded-[var(--brand-radius)] bg-[var(--brand)] py-2 text-sm font-bold text-[var(--brand-on)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {placing ? c.placing : c.checkout}
          </button>
        </section>
      </div>

      {/* Simulated back end */}
      <div className="terminal border-t border-line px-4 py-3 font-mono text-xs leading-relaxed">
        <p className="text-muted">{c.api}</p>
        <ol className="mt-2 min-h-[6.5rem] space-y-0.5" data-testid="api-log">
          {calls.map((entry, i) => (
            <li key={i} className="flex flex-wrap gap-x-3">
              <span className="w-14 font-bold text-accent-text">{entry.method}</span>
              <span className="min-w-0 flex-1 truncate">{entry.path}</span>
              <span className="text-muted">λ {entry.fn}</span>
              <span className={entry.status >= 400 ? "text-text" : "text-accent-text"}>{entry.status}</span>
              <span className="w-14 whitespace-nowrap text-right tabular-nums text-muted">{entry.ms} ms</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Mask({ src, className }: { src: string; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
