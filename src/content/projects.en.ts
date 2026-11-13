import type { ProjectSlug, ProjectText } from "./types";

export const projectsEn: Record<ProjectSlug, ProjectText> = {
  "electrolux-cost-grid": {
    title: "Excel-like cost control for a global manufacturer",
    tagline:
      "Replaced a legacy PowerOn tool with a fast web grid used across Electrolux factories.",
    role: "Sole front-end developer",
    metric: { value: "30–45s → 3–5s", label: "load and batch save" },
    problem: [
      "Costs, raw-material indexing, savings and master data for factories and service suppliers lived in a legacy PowerOn application. Screens and batch saves took 30 to 45 seconds, and every user needed a US$300 license.",
      "The people using it think in spreadsheets: many rows, many edits at once, one save at the end. The replacement had to feel like Excel, only faster.",
    ],
    built: [
      "An Excel-like web app in React, TypeScript and Vite, with React Datasheet Grid for spreadsheet-style editing and Tailwind CSS for the interface.",
      "Server state with TanStack Query, with edits collected and saved as a batch.",
      "Real-time notifications with SignalR, plus Excel and PDF exports.",
      "Tests with Vitest, Testing Library and MSW, CI on GitHub Actions, and deploys with Docker on Kubernetes.",
    ],
    decisions: [
      {
        title: "Save in batches",
        text: "Changes pile up on the client and go to the server together, the way people already worked in spreadsheets.",
      },
      {
        title: "Mock the API from day one",
        text: "MSW handlers let the front end move ahead of the back end and keep the tests deterministic.",
      },
      {
        title: "Ship like a product",
        text: "Every change runs through tests and CI and goes out as a container on Kubernetes.",
      },
    ],
    results: [
      { value: "30–45s → 3–5s", label: "screen load and batch save" },
      { value: "US$300", label: "per-user license removed" },
    ],
    demoNote:
      "Edit a few cells and save them in one batch. The data is made up; the real app is internal.",
  },
  "bmw-digital-shop": {
    title: "The cart and the BMW Motorrad launch on BMW Group's shop",
    tagline:
      "Fullstack on a high-traffic e-commerce platform for BMW, MINI and BMW Motorrad, live in more than 30 countries. Built on site in Lisbon.",
    role: "Fullstack developer",
    metric: { value: "30+", label: "countries" },
    problem: [
      "BMW and MINI customers needed one place to buy digital services and car parts and to book maintenance and repairs, with a cart that works the same way in every market.",
      "Then a third brand was coming: BMW Motorrad needed its own shop, on the same platform, without forking the code.",
      "All of it runs in more than 30 countries, so every price, tax line and date has to follow the market, at high traffic.",
    ],
    built: [
      "The cart: adding services, parts and gear, changing quantities, and the totals, taxes and currency for each market, from the React and Next.js front end down to the Node.js and AWS Lambda back end.",
      "The foundation of BMW Motorrad on the platform, next to BMW and MINI: its shop for gear and garments, with sizes and sale prices, and the AWS infrastructure behind it.",
      "The vehicle selector: customers enter their VIN, the vehicle is identified, and the shop only offers the parts that fit it.",
      "The digital shop for services and parts, the booking flow for maintenance and repairs, and tests with Jest on a platform with about 40k visits a day.",
      "A CSV importer on AWS for products, filters and dealers: files land in S3 behind Akamai, a Lambda validates every field, credentials come from Secrets Manager, data goes to commercetools, and X-Ray and CloudWatch trace each step.",
    ],
    decisions: [
      {
        title: "One platform, three brands",
        text: "BMW, MINI and BMW Motorrad share the shop and the cart; each brand brings its own catalog and look instead of its own codebase.",
      },
      {
        title: "Start from the vehicle",
        text: "A VIN identifies the exact car or bike, so customers aren't left guessing whether a part fits.",
      },
      {
        title: "The market decides the numbers",
        text: "Currency, tax, sale-price rules and date formats come from the market, so the same cart reads right in Germany, the UK or Japan.",
      },
    ],
    results: [
      { value: "3", label: "brands on one platform, Motorrad included" },
      { value: "30+", label: "countries" },
      { value: "40k", label: "visits a day, per Adobe Analytics" },
    ],
    demoNote:
      "Enter a sample VIN to identify the vehicle and see which parts fit, browse BMW Motorrad gear with sizes, fill the cart and check out. Requests go to simulated Lambdas; products, VINs and prices are made up.",
    liveLabel: "See the live BMW Motorrad shop",
    architectureText: {
      title: "Behind the shop: the catalog importer",
      intro:
        "Products, filters and dealers reach the shop through a CSV import on AWS. Pick a file and follow each step; the second row is the shop reading what was imported.",
    },
  },
  "movio-courier-app": {
    title: "A courier app built spec-first with AI agents",
    tagline:
      "Movio's React Native courier app, and the spec-driven workflow where AI agents implement and people review. A side project.",
    role: "Fullstack developer, side project",
    metric: { value: "55k+", label: "deliveries" },
    problem: [
      "Movio connects restaurants on iFood, 99Food, Takeat and Open Delivery to couriers. An order has to reach a courier and be accepted quickly, and couriers are on the move, on unstable networks, with the app often in the background.",
      "Most of the code is written by AI agents in Cursor and Claude Code. Without a clear spec they guess, and review turns into rework.",
    ],
    built: [
      "In the courier app: the real-time ride-offer queue over WebSocket, proof of delivery with a photo and a code, background location, push notifications, OTA updates and Sentry.",
      "Brought Spec Kit into the project: every relevant feature starts as a business spec, which becomes a plan and tasks before the agents implement it.",
      "Each repository's rules live in AGENTS.md and CLAUDE.md, and every delivery goes through lint, typecheck, build, E2E tests and human review on the PR.",
      "The API's delivery-domain spec gathers the scenarios, contracts and data model that guide the agents.",
    ],
    decisions: [
      {
        title: "The spec is the source of truth",
        text: "Acceptance scenarios are written first, in Given/When/Then; plans, tasks and tests come from them.",
      },
      {
        title: "Push offers, don't poll",
        text: "Offers reach the courier over WebSocket the moment they exist.",
      },
      {
        title: "Ship without a store release",
        text: "Once a PR is approved, an OTA update puts the change on couriers' phones.",
      },
    ],
    results: [
      { value: "55k+", label: "deliveries" },
      { value: "~4s", label: "to accept an order" },
      { value: "5", label: "checks before every merge" },
    ],
    demoNote:
      "On the left, a feature goes from spec to plan, tasks, PR and OTA update. On the right, the courier app before and after it. Try a delivery first, then ship the feature and try again. The data is made up.",
  },
};
