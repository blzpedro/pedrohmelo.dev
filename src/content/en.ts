import type { ProfileText } from "./types";

export const en: ProfileText = {
  about: [
    "I'm a software developer who loves front-end work, football and technology. Over the last {years} years I've built products for logistics, automotive, banking, retail and healthcare, including global brands like BMW, Electrolux and Renault, and a year on site in Lisbon as a fullstack developer on an e-commerce platform live in more than 30 countries.",
    "I care about quality people can feel: fast screens, clear flows and code the next developer can trust. These days that includes working with AI agents through spec-driven development, with every change still reviewed by a human.",
    "Whether I'm coding, watching a match or trying a new tool, I'm always looking for the next thing to learn.",
  ],
  focus: "React, Angular, Node.js, React Native",
  experience: {
    movio: {
      role: "Fullstack Developer",
      location: "Brazil",
      summary:
        "Last-mile delivery platform integrated with iFood, 99Food, Takeat and Open Delivery.",
      highlights: [
        "Courier app in React Native on Google Play: real-time ride offers over WebSocket, proof of delivery, background location and OTA updates.",
        "Brought in Spec Kit: each feature starts as a business spec, then becomes a plan and tasks before AI agents build it.",
        "Every change goes through lint, typecheck, E2E tests and human review on the PR.",
      ],
      metrics: [
        { value: "55k+", label: "deliveries" },
        { value: "~4s", label: "to accept an order" },
      ],
    },
    electrolux: {
      role: "Front-end Developer",
      location: "São Paulo, Brazil",
      summary:
        "Internal tools for cost control and supplier management across factories.",
      highlights: [
        "Sole front-end developer on the Excel-like app that replaced legacy PowerOn, built with React, TanStack Query and React Datasheet Grid.",
        "Real-time updates with SignalR, Excel/PDF exports, tests with Vitest and MSW, deployed on Kubernetes.",
        "Supplier onboarding as Angular 20 micro frontends with Module Federation and Signals.",
      ],
      metrics: [
        { value: "30–45s → 3–5s", label: "load and batch save" },
        { value: "US$300", label: "per-user license removed" },
      ],
      scope: "Global, Electrolux Group is a Swedish multinational",
    },
    "linked-gourmet": {
      role: "Front-end Developer",
      location: "São Paulo, Brazil",
      summary: "Digital menus, store networks and point of sale for restaurants.",
      highlights: [
        "Built PIX payments, table QR codes, batch menu editing and order scheduling.",
        "Migrated the app from Angular 7 to Angular 20, adopting Signals, standalone components, the new control flow and inject().",
      ],
      metrics: [{ value: "7 → 20", label: "Angular versions migrated" }],
    },
    mobilize: {
      role: "Front-end Developer",
      location: "Brazil",
      summary:
        "Banking app for RCI Bank, Renault Group's financial arm: financial simulations, dealerships and approval limits.",
      highlights: [
        "Micro frontends in Angular with Module Federation, NgRx and an internal design system.",
        "Took part in the migration from Angular 9 to Angular 15.",
      ],
      metrics: [{ value: "9 → 15", label: "Angular versions migrated" }],
      scope: "Global, the financial services arm of Renault Group",
    },
    bmw: {
      role: "Fullstack Developer",
      location: "Lisbon, Portugal",
      summary:
        "High-traffic e-commerce for BMW, MINI and BMW Motorrad, live in more than 30 countries.",
      highlights: [
        "Built the cart across the stack: React and Next.js on the front end, Node.js and AWS Lambda behind it.",
        "Laid the foundation of BMW Motorrad on the platform, including its gear and garment shop and AWS infrastructure.",
        "Built the vehicle selector: enter a VIN and the shop only shows the parts that fit.",
      ],
      metrics: [
        { value: "30+", label: "countries" },
        { value: "40k", label: "visits a day" },
      ],
      scope: "Global, built on site in Lisbon for BMW, MINI and BMW Motorrad",
    },
    performa: {
      role: "Front-end Developer",
      location: "Campinas, Brazil",
      summary: "Job search app and customer portals.",
      highlights: [
        "Coordinated the team behind a job search app used by more than 3,000 people.",
        "Designed the architecture of a customer portal from scratch, leading 2 front-end developers.",
        "Integrated GraphQL APIs with Apollo Client and typed operations from GraphQL Code Generator.",
      ],
      metrics: [{ value: "3,000+", label: "job seekers" }],
    },
    modalgr: {
      role: "Front-end Developer",
      location: "Santos, Brazil",
      summary: "Systems for port operations, medical clinics and customer portals.",
      highlights: [
        "Built a self-service kiosk and a front desk system for a medical clinic.",
        "Built customer portals from scratch and mentored new developers and interns.",
        "React, React Native and Angular with GraphQL, TDD and Jest.",
      ],
      metrics: [],
    },
    alleasy: {
      role: "Fullstack Developer",
      location: "São Paulo, Brazil",
      summary: "Academic and financial systems for a university.",
      highlights: [
        "Fixed bugs and shipped features in an academic system used by more than 30,000 students.",
        "PHP and Laravel on the back end, Vue on the front end.",
      ],
      metrics: [{ value: "30k+", label: "students" }],
    },
  },
  skillGroups: {
    frontend: "Front-end",
    mobile: "Mobile",
    backend: "Back end and cloud",
    testing: "Testing",
    delivery: "CI/CD and infrastructure",
    ai: "AI-assisted development",
    ways: "Ways of working",
  },
  education: {
    degree: "Technologist degree in Internet Systems",
    school: "Fatec Baixada Santista Rubens Lara",
    period: "2017–2020",
    location: "Santos, Brazil",
  },
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "C1, advanced" },
  ],
};
