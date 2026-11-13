import { getLocale, getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const sections = ["projects", "about", "experience", "skills", "contact"] as const;

export async function Header() {
  const t = await getTranslations("Nav");
  const locale = await getLocale();
  // Absolute links, so the header also works from a case study page.
  const home = `/${locale}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-1.5 focus:text-on-accent"
      >
        {t("skip")}
      </a>
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <a
          href={home}
          aria-label={t("home")}
          className="flex items-center gap-2 font-extrabold tracking-tight"
        >
          <span aria-hidden="true" className="size-2.5 rounded-full bg-accent" />
          Pedro Melo
        </a>
        <nav aria-label={t("primary")} className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm text-muted">
            {sections.map((id) => (
              <li key={id}>
                <a href={`${home}#${id}`} className="transition-colors hover:text-text">
                  {t(id)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
