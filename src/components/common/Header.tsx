"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-yield-dark/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-yield-gold text-xl font-bold tracking-tight hover:text-yield-gold/80 transition-colors"
        >
          YieldField
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-yield-ink/70 hover:text-yield-ink transition-colors"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/coulisses"
            className="text-yield-ink/70 hover:text-yield-ink transition-colors"
          >
            {t("nav.coulisses")}
          </Link>
        </nav>

        {/* Language switcher */}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
