"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { languageTag, routing } from "@/i18n/routing";
import { Flag } from "./Flag";

/** The visible section the reader is in, so switching language keeps their place. */
function currentSectionHash(): string {
  let current = "";
  for (const section of document.querySelectorAll<HTMLElement>("main section[id]")) {
    if (section.getClientRects().length === 0) continue;
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.4) {
      current = section.id;
    }
  }
  return current && current !== "top" ? `#${current}` : "";
}

/**
 * Plain links on purpose: a full page load is the right way to change the root
 * layout's language. The proxy then stores the choice in the NEXT_LOCALE cookie.
 */
export function LocaleSwitcher() {
  const t = useTranslations("Locale");
  const locale = useLocale();
  // Same page in the other language: /pt/projects/x -> /en/projects/x.
  const rest = usePathname().replace(/^\/[^/]+/, "");

  function addSectionHash(event: MouseEvent<HTMLAnchorElement>) {
    if (rest !== "" && rest !== "/") return;
    const link = event.currentTarget;
    link.hash = currentSectionHash();
  }

  return (
    <nav aria-label={t("label")} className="flex items-center gap-1.5">
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <a
            key={code}
            href={`/${code}${rest}`}
            hrefLang={languageTag[code]}
            lang={languageTag[code]}
            aria-current={active ? "page" : undefined}
            aria-label={t(code)}
            title={active ? t(code) : t("switchTo")}
            onClick={active ? (e) => e.preventDefault() : addSectionHash}
            className={`grid size-8 place-items-center rounded-full transition ${
              active
                ? "ring-2 ring-accent ring-offset-2 ring-offset-bg"
                : "opacity-55 grayscale hover:opacity-100 hover:grayscale-0"
            }`}
          >
            <Flag locale={code} className="size-[22px]" />
          </a>
        );
      })}
    </nav>
  );
}
