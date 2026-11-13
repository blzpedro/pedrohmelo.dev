"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function CopyEmail({ email }: { email: string }) {
  const t = useTranslations("Contact");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the mailto link next to it still works.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-accent"
    >
      <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
    </button>
  );
}
