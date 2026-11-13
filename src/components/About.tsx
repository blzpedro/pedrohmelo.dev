import { getTranslations } from "next-intl/server";
import { fillYears, type ProfileText } from "@/content";
import { Section } from "./Section";

export async function About({ years, text }: { years: number; text: ProfileText }) {
  const t = await getTranslations("About");
  const tEducation = await getTranslations("Education");
  const { education, languages } = text;

  return (
    <Section id="about" title={t("title")}>
      <div className="max-w-[62ch] space-y-5 text-lg">
        {text.about.map((paragraph, i) => (
          <p key={i} className={i === 0 ? undefined : "text-muted"}>
            {fillYears(paragraph, years)}
          </p>
        ))}
      </div>

      {/* Education and languages, folded in so the page reads less like a CV. */}
      <dl className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
        <div>
          <dt className="font-mono text-xs text-muted">{tEducation("education")}</dt>
          <dd className="mt-1">
            <span className="font-semibold">{education.degree}</span>
            <span className="block text-sm text-muted">
              {education.school}, <span className="font-mono">{education.period}</span>
            </span>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-xs text-muted">{tEducation("languages")}</dt>
          <dd className="mt-1 space-y-0.5">
            {languages.map((language) => (
              <span key={language.name} className="block">
                <span className="font-semibold">{language.name}</span>{" "}
                <span className="text-sm text-muted">{language.level}</span>
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </Section>
  );
}
