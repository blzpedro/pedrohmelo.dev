import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Demo } from "@/components/demos/Demo";
import { ImportPipeline } from "@/components/demos/ImportPipeline";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LogoMark } from "@/components/LogoMark";
import { TechIcon } from "@/components/TechIcon";
import { formatPeriod, getProjects, isProjectSlug, projectSlugs } from "@/content";
import { languageTag, routing } from "@/i18n/routing";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

/*
  Every slug is prerendered above, so each page still ships as static HTML.
  `instant = false` only tells Cache Components that reading `params` at the top
  of the page may block a client-side transition; the site links here with plain
  anchors (full page loads), so there is no transition to keep instant.
*/
export const instant = false;

async function load(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale) || !isProjectSlug(slug)) notFound();
  const projects = getProjects(locale);
  const index = projects.findIndex((p) => p.slug === slug);
  return { locale, project: projects[index], next: projects[(index + 1) % projects.length] };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, project } = await load(params);
  const path = `/${locale}/projects/${project.slug}`;
  return {
    title: `${project.title} | Pedro Melo`,
    description: project.tagline,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((l) => [languageTag[l], `/${l}/projects/${project.slug}`]),
      ),
    },
    openGraph: { title: project.title, description: project.tagline, url: path, type: "article" },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, project, next } = await load(params);
  const t = await getTranslations("Projects");
  const tExperience = await getTranslations("Experience");
  const { company } = project;
  const period = formatPeriod(locale, company.start, company.end, tExperience("present"));

  return (
    <>
      <Header />
      <main id="main">
        <article data-testid="case-study">
          <header className="container-page pb-14 pt-10 sm:pb-20 sm:pt-14">
            <a
              href={`/${locale}#projects`}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {t("all")}
            </a>

            <p className="mt-10 flex items-center gap-3 text-muted">
              <LogoMark logo={company.logo} monogram={company.monogram} className="size-11" />
              <span>{company.company}</span>
              {company.sideProject && (
                <span className="rounded-full border border-line px-2 font-mono text-xs">
                  {tExperience("sideProject")}
                </span>
              )}
            </p>
            <h1 className="mt-5 max-w-[20ch] text-[clamp(2.25rem,6vw,4.25rem)] font-black leading-[1.02] tracking-[-0.03em]">
              {project.title}
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg text-muted sm:text-xl">{project.tagline}</p>
            {project.live && project.liveLabel && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-accent"
              >
                {project.liveLabel}
                <ArrowUpRight aria-hidden="true" className="size-4 text-accent-text" />
              </a>
            )}

            <dl className="mt-10 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="font-mono text-xs text-muted">{t("role")}</dt>
                <dd className="mt-1 font-semibold">{project.role}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs text-muted">{t("period")}</dt>
                <dd className="mt-1 font-semibold">{period}</dd>
              </div>
              {project.results.map((result) => (
                <div key={result.label}>
                  <dt className="font-mono text-xs text-muted">{result.label}</dt>
                  <dd className="mt-1 whitespace-nowrap text-xl font-black tracking-tight tabular-nums text-accent-text lg:text-2xl">
                    {result.value}
                  </dd>
                </div>
              ))}
            </dl>
          </header>

          <section aria-labelledby="demo-title" className="border-y border-line bg-bg-raised/40">
            <div className="container-page py-14 sm:py-20">
              <h2 id="demo-title" className="text-2xl font-extrabold tracking-tight">
                {t("try")}
              </h2>
              <p className="mt-2 max-w-[60ch] text-muted">{project.demoNote}</p>
              <div className="mt-8">
                <Demo kind={project.demo} />
              </div>
            </div>
          </section>

          {project.architecture === "csv-import" && project.architectureText && (
            <section aria-labelledby="architecture-title" className="border-b border-line">
              <div className="container-page py-14 sm:py-20">
                <h2 id="architecture-title" className="text-2xl font-extrabold tracking-tight">
                  {project.architectureText.title}
                </h2>
                <p className="mt-2 max-w-[62ch] text-muted">{project.architectureText.intro}</p>
                <div className="mt-8">
                  <ImportPipeline />
                </div>
              </div>
            </section>
          )}

          <div className="container-page grid gap-14 py-16 sm:py-24 lg:grid-cols-12 lg:gap-12">
            <section aria-labelledby="problem-title" className="lg:col-span-5">
              <h2 id="problem-title" className="text-xl font-extrabold tracking-tight">
                {t("problem")}
              </h2>
              <div className="mt-4 space-y-4 text-lg text-muted">
                {project.problem.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section aria-labelledby="built-title" className="lg:col-span-7">
              <h2 id="built-title" className="text-xl font-extrabold tracking-tight">
                {t("built")}
              </h2>
              <ul className="mt-4 space-y-3 text-lg">
                {project.built.map((item) => (
                  <li key={item} className="relative pl-6">
                    <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-px w-3 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="decisions-title" className="lg:col-span-12">
              <h2 id="decisions-title" className="text-xl font-extrabold tracking-tight">
                {t("decisions")}
              </h2>
              <dl className="mt-6 grid gap-x-10 gap-y-8 border-t border-line pt-6 md:grid-cols-3">
                {project.decisions.map((decision) => (
                  <div key={decision.title}>
                    <dt className="font-bold">{decision.title}</dt>
                    <dd className="mt-2 text-muted">{decision.text}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="stack-title" className="lg:col-span-12">
              <h2 id="stack-title" className="text-xl font-extrabold tracking-tight">
                {t("stack")}
              </h2>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                {project.stack.map((tech) => (
                  <li key={tech} className="inline-flex items-center gap-2">
                    <TechIcon name={tech} className="size-[18px] text-accent-text" />
                    {tech}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <nav aria-label={t("next")} className="border-t border-line">
            <a
              href={`/${locale}/projects/${next.slug}`}
              className="container-page group flex flex-col gap-2 py-12 sm:py-16"
            >
              <span className="font-mono text-xs text-muted">{t("next")}</span>
              <span className="max-w-[24ch] text-2xl font-black tracking-tight transition-colors group-hover:text-accent-text sm:text-4xl">
                {next.title}
              </span>
            </a>
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
