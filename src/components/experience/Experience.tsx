import { getTranslations } from "next-intl/server";
import { formatPeriod, getExperience, type Experience as Role } from "@/content";
import type { AppLocale } from "@/i18n/routing";
import { GitLog } from "./GitLog";
import type { CommitEntry, GraphRow } from "./types";

/** Stable, git-looking short hash for a role (FNV-1a). */
function shortSha(seed: string): string {
  let hash = 0x811c9dc5;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0").slice(0, 7);
}

/**
 * Like `git log --graph`: the main job is HEAD on the main line, a side project
 * runs on a parallel branch that joins main below it, and past roles follow.
 */
function graphFor(roles: Role[]): GraphRow[] {
  return roles.map((role, i) => ({
    lane: role.sideProject ? 1 : 0,
    main: i === 0 ? "fromNode" : i === roles.length - 1 ? "toNode" : "through",
    branchMergesBelow: Boolean(role.sideProject),
  }));
}

function refsFor(role: Role, isHead: boolean): Pick<CommitEntry, "refs" | "checkout"> {
  if (isHead) return { refs: [{ name: "HEAD -> main", kind: "head" }], checkout: "main" };
  if (role.sideProject) {
    const branch = `side/${role.id}`;
    return { refs: [{ name: branch, kind: "branch" }], checkout: branch };
  }
  return { refs: [{ name: `tag: ${role.id}`, kind: "tag" }], checkout: role.id };
}

export async function Experience({ locale }: { locale: AppLocale }) {
  const t = await getTranslations("Experience");
  const roles = getExperience(locale);
  const graph = graphFor(roles);

  const entries: CommitEntry[] = roles.map((role, i) => ({
    id: role.id,
    sha: shortSha(`${role.id}${role.start}`),
    ...refsFor(role, i === 0),
    sideProject: Boolean(role.sideProject),
    logo: role.logo,
    monogram: role.monogram,
    company: role.company,
    role: role.role,
    location: role.location,
    period: formatPeriod(locale, role.start, role.end, t("present")),
    summary: role.summary,
    highlights: role.highlights,
    metrics: role.metrics,
    scope: role.scope,
    stack: role.stack,
    graph: graph[i],
  }));

  return (
    <section id="experience" aria-labelledby="experience-title" className="border-t border-line">
      <div className="container-page pb-16 pt-20 sm:pb-24 sm:pt-28">
        <div className="max-w-[60ch]">
          <h2 id="experience-title" className="text-2xl font-extrabold tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted">{t("intro")}</p>
        </div>
        <GitLog entries={entries} />
      </div>
    </section>
  );
}
