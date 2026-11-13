import { languageTag, type AppLocale } from "@/i18n/routing";
import { careerStart, contact, experienceBase, skills } from "./base";
import { en } from "./en";
import { pt } from "./pt";
import { projectsBase } from "./projects.base";
import { projectsEn } from "./projects.en";
import { projectsPt } from "./projects.pt";
import { projectSlugs, type Experience, type ProfileText, type ProjectBase, type ProjectSlug, type ProjectText } from "./types";

export { contact, projectSlugs, skills };
export type * from "./types";

const texts: Record<AppLocale, ProfileText> = { en, pt };

export function getProfileText(locale: AppLocale): ProfileText {
  return texts[locale];
}

export type Project = ProjectBase & ProjectText & { company: Experience };

const projectTexts: Record<AppLocale, Record<ProjectSlug, ProjectText>> = { en: projectsEn, pt: projectsPt };

export function isProjectSlug(value: string): value is ProjectSlug {
  return (projectSlugs as readonly string[]).includes(value);
}

/** Case studies in home-page order, each with the role it came from. */
export function getProjects(locale: AppLocale): Project[] {
  const roles = new Map(getExperience(locale).map((role) => [role.id, role]));
  return projectsBase.map((base) => ({
    ...base,
    ...projectTexts[locale][base.slug],
    company: roles.get(base.experience)!,
  }));
}

/** Main job first, then the side project, then past roles. */
export function getExperience(locale: AppLocale): Experience[] {
  const text = texts[locale].experience;
  return experienceBase.map((base) => ({ ...base, ...text[base.id] }));
}

/** Whole years since the first role, as of `now`. */
export function yearsOfExperience(now: Date = new Date()): number {
  const [year, month] = careerStart.split("-").map(Number);
  const months =
    (now.getUTCFullYear() - year) * 12 + (now.getUTCMonth() + 1 - month);
  return Math.floor(months / 12);
}

export function fillYears(text: string, years: number): string {
  return text.replaceAll("{years}", String(years));
}

function parseMonth(value: string): Date {
  const [year, month] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1));
}

/** "May 2026 – Present" / "mai. de 2026 – Atual" */
export function formatPeriod(
  locale: AppLocale,
  start: string,
  end: string | null,
  presentLabel: string,
): string {
  const format = new Intl.DateTimeFormat(languageTag[locale], {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const from = format.format(parseMonth(start));
  const to = end ? format.format(parseMonth(end)) : presentLabel;
  return `${from} – ${to}`;
}
