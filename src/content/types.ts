export const experienceIds = [
  "electrolux",
  "movio",
  "linked-gourmet",
  "mobilize",
  "bmw",
  "performa",
  "modalgr",
  "alleasy",
] as const;

export type ExperienceId = (typeof experienceIds)[number];

export const skillGroupIds = [
  "frontend",
  "mobile",
  "backend",
  "testing",
  "delivery",
  "ai",
  "ways",
] as const;

export type SkillGroupId = (typeof skillGroupIds)[number];

export type Metric = { value: string; label: string };

/** Facts that don't change between languages. */
export type ExperienceBase = {
  id: ExperienceId;
  company: string;
  /** Short label for the route rail. */
  shortName: string;
  /** `YYYY-MM` */
  start: string;
  /** `YYYY-MM`, or `null` for a current role. */
  end: string | null;
  /** Runs in parallel with the main job. */
  sideProject?: boolean;
  /** Company mark in /public/logos, drawn as a single-colour mask; without it, `monogram` is shown. */
  logo?: string;
  monogram: string;
  stack: string[];
};

/** Everything a reader sees in their language. */
export type ExperienceText = {
  role: string;
  location: string;
  summary: string;
  /** Up to three short bullets; the card has to fit one screen. */
  highlights: string[];
  metrics: Metric[];
  /** Set for roles at global companies; shown as a `Scope:` trailer in the terminal. */
  scope?: string;
};

export type Experience = ExperienceBase & ExperienceText;

export type SkillGroup = { id: SkillGroupId; items: string[] };

export type ProfileText = {
  /** Paragraphs; `{years}` is replaced with the computed number of years. */
  about: string[];
  focus: string;
  experience: Record<ExperienceId, ExperienceText>;
  skillGroups: Record<SkillGroupId, string>;
  education: {
    degree: string;
    school: string;
    period: string;
    location: string;
  };
  languages: { name: string; level: string }[];
};

/* ---------- Case studies ---------- */

export const projectSlugs = ["bmw-digital-shop", "electrolux-cost-grid", "movio-courier-app"] as const;

export type ProjectSlug = (typeof projectSlugs)[number];

/** Which interactive demo a case study embeds. */
export type DemoKind = "grid" | "shop" | "movio";

export type ProjectBase = {
  slug: ProjectSlug;
  /** The role this project came from; gives the logo, company and period. */
  experience: ExperienceId;
  demo: DemoKind;
  stack: string[];
  /** A public page of the real product, when there is one. */
  live?: string;
  /** An interactive architecture diagram shown below the demo. */
  architecture?: "csv-import";
};

export type ProjectText = {
  title: string;
  /** One line for the home page list. */
  tagline: string;
  role: string;
  metric: Metric;
  problem: string[];
  built: string[];
  decisions: { title: string; text: string }[];
  results: Metric[];
  /** Explains what the demo is and that its data is made up. */
  demoNote: string;
  /** Link text for `live`. */
  liveLabel?: string;
  /** Heading and intro for the architecture diagram. */
  architectureText?: { title: string; intro: string };
};
