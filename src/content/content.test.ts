import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import enMessages from "../../messages/en.json";
import ptMessages from "../../messages/pt.json";
import { techIcons } from "@/components/TechIcon";
import { experienceBase, skills } from "./base";
import { projectsBase } from "./projects.base";
import { projectsEn } from "./projects.en";
import { projectsPt } from "./projects.pt";
import { en } from "./en";
import { formatPeriod, getExperience, yearsOfExperience } from "./index";
import { pt } from "./pt";
import { experienceIds, projectSlugs } from "./types";

function keyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("UI messages", () => {
  it("have the same keys in English and Portuguese", () => {
    expect(keyPaths(ptMessages).sort()).toEqual(keyPaths(enMessages).sort());
  });

  it("have no empty strings", () => {
    for (const messages of [enMessages, ptMessages]) {
      const empty = keyPaths(messages).filter((path) => {
        const value = path.split(".").reduce<unknown>(
          (node, key) => (node as Record<string, unknown>)[key],
          messages,
        );
        return typeof value === "string" && value.trim() === "";
      });
      expect(empty).toEqual([]);
    }
  });
});

describe("CV content", () => {
  it("lists every experience once, main job first", () => {
    expect(experienceBase.map((e) => e.id)).toEqual([...experienceIds]);
  });

  it("matches between languages, item by item", () => {
    expect(pt.about).toHaveLength(en.about.length);
    expect(pt.languages).toHaveLength(en.languages.length);

    for (const id of experienceIds) {
      expect(pt.experience[id].highlights, id).toHaveLength(en.experience[id].highlights.length);
      expect(pt.experience[id].metrics, id).toHaveLength(en.experience[id].metrics.length);
      expect(Boolean(pt.experience[id].scope), id).toBe(Boolean(en.experience[id].scope));
    }
  });

  it("keeps each role short enough to fit one screen", () => {
    for (const text of [en, pt]) {
      for (const id of experienceIds) {
        const role = text.experience[id];
        expect(role.highlights.length, id).toBeLessThanOrEqual(3);
        expect(role.metrics.length, id).toBeLessThanOrEqual(2);
        for (const highlight of role.highlights) {
          expect(highlight.length, `${id}: ${highlight}`).toBeLessThanOrEqual(160);
        }
      }
    }
  });

  it("merges shared facts with translated text", () => {
    const [electrolux, movio] = getExperience("pt");
    expect(electrolux.company).toBe("Electrolux Group");
    expect(electrolux.sideProject).toBeUndefined();
    expect(movio.role).toBe("Desenvolvedor Fullstack");
    expect(movio.sideProject).toBe(true);
    expect(movio.end).toBeNull();
  });
});

describe("case studies", () => {
  it("list every slug once", () => {
    expect(projectsBase.map((p) => p.slug)).toEqual([...projectSlugs]);
  });

  it("match between languages, section by section", () => {
    for (const slug of projectSlugs) {
      const [a, b] = [projectsEn[slug], projectsPt[slug]];
      expect(b.problem, slug).toHaveLength(a.problem.length);
      expect(b.built, slug).toHaveLength(a.built.length);
      expect(b.decisions, slug).toHaveLength(a.decisions.length);
      expect(b.results, slug).toHaveLength(a.results.length);
      expect(Boolean(b.architectureText), slug).toBe(Boolean(a.architectureText));
    }
  });

  it("only use tech that has an icon", () => {
    const missing = projectsBase.flatMap((p) => p.stack).filter((name) => !(name in techIcons));
    expect(missing).toEqual([]);
  });
});

describe("company logos", () => {
  it("point to files that exist in /public", () => {
    for (const role of experienceBase) {
      if (role.logo) expect(existsSync(`public${role.logo}`), role.id).toBe(true);
      expect(role.monogram.length, role.id).toBeGreaterThan(0);
    }
  });
});

describe("tech icons", () => {
  it("exist for every skill and every stack item", () => {
    const names = new Set([
      ...skills.flatMap((group) => group.items),
      ...experienceBase.flatMap((role) => role.stack),
    ]);
    const missing = [...names].filter((name) => !(name in techIcons));
    expect(missing).toEqual([]);
  });
});

describe("dates", () => {
  it("counts whole years since the first role", () => {
    expect(yearsOfExperience(new Date(Date.UTC(2026, 3, 30)))).toBe(6);
    expect(yearsOfExperience(new Date(Date.UTC(2026, 4, 1)))).toBe(7);
    expect(yearsOfExperience(new Date(Date.UTC(2026, 10, 12)))).toBe(7);
  });

  it("formats periods per language", () => {
    expect(formatPeriod("en", "2022-06", "2023-07", "Present")).toBe("Jun 2022 – Jul 2023");
    expect(formatPeriod("en", "2026-05", null, "Present")).toBe("May 2026 – Present");
    expect(formatPeriod("pt", "2026-05", null, "Atual")).toMatch(/^mai\.? de 2026 – Atual$/);
  });
});
