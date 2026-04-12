"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const tCommon = useTranslations("Common");
  const tFooter = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-yield-dark/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Newsletter stub — non-functional until Story 5.6 */}
        <fieldset disabled className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto sm:mx-0">
          <legend className="sr-only">{tFooter("newsletter.comingSoon")}</legend>
          <input
            type="email"
            aria-label={tFooter("newsletter.placeholder")}
            placeholder={tFooter("newsletter.placeholder")}
            className="flex-1 h-9 rounded-md border border-border bg-yield-dark px-3 text-sm text-yield-ink placeholder:text-yield-ink/40 focus:outline-none focus:ring-1 focus:ring-yield-gold/50"
          />
          <button
            type="button"
            className="h-9 px-4 rounded-md bg-yield-gold/20 border border-yield-gold/30 text-yield-gold text-sm font-medium cursor-not-allowed opacity-60"
          >
            {tFooter("newsletter.cta")}
          </button>
        </fieldset>

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
