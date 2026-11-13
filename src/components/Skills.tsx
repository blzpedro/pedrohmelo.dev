import { getTranslations } from "next-intl/server";
import { skills, type ProfileText } from "@/content";
import { Section } from "./Section";
import { TechIcon } from "./TechIcon";

export async function Skills({ text }: { text: ProfileText }) {
  const t = await getTranslations("Skills");

  return (
    <Section id="skills" title={t("title")}>
      <div className="divide-y divide-line border-y border-line">
        {skills.map((group) => (
          <div key={group.id} className="grid gap-3 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <h3 className="text-sm font-bold sm:pt-0.5">{text.skillGroups[group.id]}</h3>
            <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="inline-flex items-center gap-2 text-sm">
                  <TechIcon name={item} className="size-[18px] shrink-0 text-accent-text" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
