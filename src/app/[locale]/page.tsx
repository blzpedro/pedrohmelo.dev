import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/experience/Experience";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/projects/Projects";
import { Skills } from "@/components/Skills";
import { contact, getProfileText } from "@/content";
import { languageTag, routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import { getYearsOfExperience } from "@/lib/years";

export default async function HomePage() {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  const text = getProfileText(locale);
  const years = await getYearsOfExperience();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pedro Henrique Melo Teixeira dos Santos",
    alternateName: "Pedro Melo",
    jobTitle: locale === "pt" ? "Desenvolvedor Fullstack" : "Fullstack Developer",
    url: new URL(`/${locale}`, siteUrl).toString(),
    sameAs: [contact.linkedin, contact.github],
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    knowsLanguage: ["pt-BR", "en"],
    inLanguage: languageTag[locale],
  };

  return (
    <>
      <Header />
      <main id="main">
        <Hero years={years} text={text} />
        <Projects locale={locale} />
        <About years={years} text={text} />
        <Experience locale={locale} />
        <Skills text={text} />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  );
}
