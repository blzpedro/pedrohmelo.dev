import { getTranslations } from "next-intl/server";
import { getProjects, type Project } from "@/content";
import type { AppLocale } from "@/i18n/routing";
import { LogoMark } from "../LogoMark";
import { ProjectPreview } from "./ProjectPreview";

type Labels = { demoBadge: string; read: string; sideProject: string };

export async function Projects({ locale }: { locale: AppLocale }) {
  const t = await getTranslations("Projects");
  const tExperience = await getTranslations("Experience");
  const [featured, ...rest] = getProjects(locale);
  const labels: Labels = { demoBadge: t("demoBadge"), read: t("read"), sideProject: tExperience("sideProject") };

  return (
    <section id="projects" aria-labelledby="projects-title" className="border-t border-line">
      <div className="container-page py-20 sm:py-28">
        <div className="max-w-[60ch]">
          <h2 id="projects-title" className="text-2xl font-extrabold tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted">{t("intro")}</p>
        </div>

        <ul className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-2">
          <li className="md:col-span-2">
            <FeaturedCard project={featured} locale={locale} labels={labels} />
          </li>
          {rest.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} locale={locale} labels={labels} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Company({ project, labels, size }: { project: Project; labels: Labels; size: string }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
      <LogoMark logo={project.company.logo} monogram={project.company.monogram} className={size} />
      <span>{project.company.company}</span>
      {project.company.sideProject && (
        <span className="rounded-full border border-line px-2 font-mono text-xs">{labels.sideProject}</span>
      )}
    </p>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="absolute right-3 top-3 rounded-full border border-line bg-bg-raised/90 px-2 py-0.5 font-mono text-[0.68rem] text-muted">
      {text}
    </span>
  );
}

/** The lead project: wide, with a bigger preview and its key numbers. */
function FeaturedCard({ project, locale, labels }: { project: Project; locale: AppLocale; labels: Labels }) {
  return (
    <a
      href={`/${locale}/projects/${project.slug}`}
      data-testid="project-card"
      data-featured
      className="group grid overflow-hidden rounded-2xl border border-line bg-bg-raised transition-colors hover:border-accent/60 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
    >
      <div className="relative aspect-[16/10] border-b border-line bg-bg lg:aspect-auto lg:min-h-[24rem] lg:border-b-0 lg:border-r">
        <ProjectPreview kind={project.demo} large />
        <Badge text={labels.demoBadge} />
      </div>
      <div className="flex flex-col p-6 sm:p-8">
        <Company project={project} labels={labels} size="size-10" />
        <h3 className="mt-5 text-2xl font-black leading-tight tracking-tight sm:text-[1.9rem]">{project.title}</h3>
        <p className="mt-3 text-muted">{project.tagline}</p>
        <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-5">
          {project.results.map((result) => (
            <div key={result.label} className="flex flex-col">
              <dt className="order-2 mt-1 font-mono text-[0.7rem] leading-snug text-muted">{result.label}</dt>
              <dd className="order-1 text-2xl font-black tracking-tight tabular-nums text-accent-text">{result.value}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-auto pt-6 text-sm font-semibold underline decoration-line underline-offset-4 transition-colors group-hover:decoration-accent">
          {labels.read}
        </span>
      </div>
    </a>
  );
}

function ProjectCard({ project, locale, labels }: { project: Project; locale: AppLocale; labels: Labels }) {
  return (
    <a
      href={`/${locale}/projects/${project.slug}`}
      data-testid="project-card"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg-raised transition-colors hover:border-accent/60"
    >
      <div className="relative aspect-[16/10] border-b border-line bg-bg">
        <ProjectPreview kind={project.demo} />
        <Badge text={labels.demoBadge} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Company project={project} labels={labels} size="size-8" />
        <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight">{project.title}</h3>
        <p className="mt-2 text-sm text-muted">{project.tagline}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
          <p className="flex flex-col">
            <span className="text-xl font-black tracking-tight tabular-nums text-accent-text">{project.metric.value}</span>
            <span className="font-mono text-xs text-muted">{project.metric.label}</span>
          </p>
          <span className="text-sm font-semibold underline decoration-line underline-offset-4 transition-colors group-hover:decoration-accent">
            {labels.read}
          </span>
        </div>
      </div>
    </a>
  );
}
