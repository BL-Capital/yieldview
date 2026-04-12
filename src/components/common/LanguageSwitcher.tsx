"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

import type { Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");

  const switchLocale = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t(locale as Locale)}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-yield-ink/70 hover:text-yield-ink hover:bg-white/5 transition-colors"
      >
        {locale.toUpperCase()}
        <ChevronDown className="h-3 w-3" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => switchLocale(l)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {l === locale ? (
              <Check className="h-3 w-3 text-yield-gold" aria-hidden="true" />
            ) : (
              <span className="h-3 w-3" aria-hidden="true" />
            )}
            {t(l)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
