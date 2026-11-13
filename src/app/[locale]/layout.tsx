import type { Metadata, Viewport } from "next";
import { Overpass, Overpass_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { languageTag, routing } from "@/i18n/routing";
import { getYearsOfExperience } from "@/lib/years";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  weight: "variable",
});

const overpassMono = Overpass_Mono({
  variable: "--font-overpass-mono",
  subsets: ["latin"],
  weight: "variable",
});

const themeScript = `(function(){var t="dark";try{if(localStorage.getItem("theme")==="light")t="light"}catch(e){}document.documentElement.classList.add(t)})()`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c1a2e" },
    { media: "(prefers-color-scheme: light)", color: "#eef3fb" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "Metadata" });
  const years = await getYearsOfExperience();
  const title = t("title");
  const description = t("description", { years });

  return {
    metadataBase: siteUrl,
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [languageTag[l], `/${l}`]),
        ),
        "x-default": `/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      type: "profile",
      title,
      description,
      url: `/${locale}`,
      siteName: "Pedro Melo",
      locale: languageTag[locale].replace("-", "_"),
      firstName: "Pedro",
      lastName: "Melo",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={languageTag[locale]}
      className={`${overpass.variable} ${overpassMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved theme before first paint, so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <body>. */}
      <body className="min-h-svh" suppressHydrationWarning>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
