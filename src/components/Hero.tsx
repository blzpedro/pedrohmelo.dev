import { getTranslations } from "next-intl/server";
import { contact, type ProfileText } from "@/content";

export async function Hero({ years, text }: { years: number; text: ProfileText }) {
  const t = await getTranslations("Hero");

  const facts = [
    { label: t("base"), value: t("baseValue") },
    { label: t("experience"), value: t("experienceValue", { years }) },
    { label: t("now"), value: t("nowValue") },
    { label: t("side"), value: t("sideValue") },
    { label: t("global"), value: t("globalValue") },
    { label: t("focus"), value: text.focus },
  ];

  return (
    <section id="top" aria-labelledby="hero-title" className="container-page pb-20 pt-16 sm:pb-28 sm:pt-24">
      {/* The name is already in the header; the role is the headline here. */}
      <h1
        id="hero-title"
        className="text-[clamp(2.75rem,11.5vw,8.5rem)] font-black leading-[0.88] tracking-[-0.045em]"
      >
        <span className="sr-only">Pedro Melo, </span>
        {t("title")
          .split(" ")
          .map((word, i) => (
            <span key={word} className="block">
              {word}
              {i === 0 ? <span className="sr-only"> </span> : null}
            </span>
          ))}
      </h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="max-w-[34ch] text-xl font-bold tracking-tight sm:text-2xl">
            {t("headline")}
          </p>
          <p className="mt-5 max-w-[58ch] text-lg text-muted">{t("intro", { years })}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={`mailto:${contact.email}`}
              className="rounded-full bg-accent px-5 py-2.5 font-bold text-on-accent transition-opacity hover:opacity-90"
            >
              {t("emailMe")}
            </a>
            <a href={contact.linkedin} className="link-underline font-semibold" rel="me">
              LinkedIn
            </a>
            <a href={contact.github} className="link-underline font-semibold" rel="me">
              GitHub
            </a>
          </div>
        </div>

        <dl
          aria-label={t("facts")}
          className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 self-end border-l border-line pl-6 text-sm lg:col-span-4 lg:col-start-9"
        >
          {facts.map((fact) => (
            <div key={fact.label} className="contents">
              <dt className="text-muted">{fact.label}</dt>
              <dd className="font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
