import type { ProjectBase } from "./types";

/** Order shown on the home page. The first one is featured. */
export const projectsBase: ProjectBase[] = [
  {
    slug: "bmw-digital-shop",
    experience: "bmw",
    demo: "shop",
    architecture: "csv-import",
    stack: [
      "React",
      "Next.js",
      "Node.js",
      "AWS Lambda",
      "Amazon S3",
      "Secrets Manager",
      "CloudWatch",
      "commercetools",
      "Akamai",
      "Jest",
    ],
    live: "https://www.bmw-motorrad.de/de/shop/ls/cp/physical-goods/BF_GEAR_AND_GARMENT",
  },
  {
    slug: "electrolux-cost-grid",
    experience: "electrolux",
    demo: "grid",
    stack: [
      "React",
      "TypeScript",
      "TanStack Query",
      "React Datasheet Grid",
      "SignalR",
      "Vitest",
      "MSW",
      "GitHub Actions",
      "Docker",
      "Kubernetes",
    ],
  },
  {
    slug: "movio-courier-app",
    experience: "movio",
    demo: "movio",
    stack: [
      "React Native",
      "TypeScript",
      "WebSocket",
      "OTA",
      "Sentry",
      "Node.js",
      "PostgreSQL",
      "Spec Kit",
      "Claude Code",
      "Cursor",
      "Playwright",
    ],
  },
];
