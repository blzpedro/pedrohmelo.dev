import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];

/** BCP 47 tags used for `<html lang>`, hreflang and Intl formatting. */
export const languageTag: Record<AppLocale, string> = {
  en: "en",
  pt: "pt-BR",
};
