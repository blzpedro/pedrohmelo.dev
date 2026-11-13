import { getLocale, getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  const locale = await getLocale();

  return (
    <main id="main" className="container-page flex min-h-svh flex-col justify-center py-20">
      <p className="font-mono text-sm text-accent-text">404</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight">{t("title")}</h1>
      <p className="mt-4 text-lg text-muted">{t("text")}</p>
      <a href={`/${locale}`} className="link-underline mt-8 font-semibold">
        {t("back")}
      </a>
    </main>
  );
}
