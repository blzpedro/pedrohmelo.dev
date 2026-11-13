import type { MetadataRoute } from "next";
import { projectSlugs } from "@/content";
import { languageTag, routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [languageTag[l], new URL(`/${l}`, siteUrl).toString()]),
  );

  const home: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: new URL(`/${locale}`, siteUrl).toString(),
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));

  const projects: MetadataRoute.Sitemap = projectSlugs.flatMap((slug) =>
    routing.locales.map((locale) => ({
      url: new URL(`/${locale}/projects/${slug}`, siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [languageTag[l], new URL(`/${l}/projects/${slug}`, siteUrl).toString()]),
        ),
      },
    })),
  );

  return [...home, ...projects];
}
