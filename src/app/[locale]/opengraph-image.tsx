import { ImageResponse } from "next/og";
import { routing, type AppLocale } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pedro Melo";

const copy: Record<AppLocale, { role: string; line: string }> = {
  en: {
    role: "Fullstack Developer",
    line: "React, Angular, Node.js and React Native. São Paulo, Brazil.",
  },
  pt: {
    role: "Desenvolvedor Fullstack",
    line: "React, Angular, Node.js e React Native. São Paulo, Brasil.",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy[(locale as AppLocale) in copy ? (locale as AppLocale) : "en"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0c1a2e",
          color: "#e6eefa",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 0.9, letterSpacing: -5 }}>
            Pedro Melo
          </div>
          <div style={{ marginTop: 28, fontSize: 44, fontWeight: 700 }}>{text.role}</div>
          <div style={{ marginTop: 12, fontSize: 30, color: "#8ea3c2" }}>{text.line}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i === 7 ? 0 : 1 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  border: "4px solid #5b9dff",
                  background: i === 7 ? "#5b9dff" : "#0c1a2e",
                }}
              />
              {i < 7 ? <div style={{ flex: 1, height: 4, background: "#5b9dff" }} /> : null}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
