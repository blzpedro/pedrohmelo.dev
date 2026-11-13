import { getTranslations } from "next-intl/server";
import { contact } from "@/content";
import { CopyEmail } from "./CopyEmail";

export async function Contact() {
  const t = await getTranslations("Contact");

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line">
      <div className="container-page py-20 sm:py-28">
        <h2 id="contact-title" className="text-2xl font-extrabold tracking-tight">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-[48ch] text-lg text-muted">{t("text")}</p>
        <a
          href={`mailto:${contact.email}`}
          className="mt-10 inline-block break-all text-[clamp(1.6rem,6.2vw,4.25rem)] font-black leading-none tracking-[-0.03em] decoration-accent decoration-[3px] underline-offset-[0.18em] hover:underline"
        >
          {contact.email}
        </a>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <CopyEmail email={contact.email} />
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="text-sm text-muted">{t("elsewhere")}</span>
            <a href={contact.linkedin} className="link-underline font-semibold" rel="me">
              LinkedIn
            </a>
            <a href={contact.github} className="link-underline font-semibold" rel="me">
              GitHub
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
