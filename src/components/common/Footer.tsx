"use client";

import { useTranslations, useLocale } from "next-intl";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const tCommon = useTranslations("Common");
  const tFooter = useTranslations("Footer");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-yield-dark/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Newsletter */}
        <NewsletterForm locale={locale} />

        {/* Disclaimer */}
        <p className="text-xs text-yield-ink/40 max-w-2xl">
          {tCommon("disclaimer")}
        </p>

        {/* Copyright */}
        <p className="text-xs text-yield-ink/30">
          © {year} YieldField — {tFooter("copyright")}
        </p>
      </div>
    </footer>
  );
}
