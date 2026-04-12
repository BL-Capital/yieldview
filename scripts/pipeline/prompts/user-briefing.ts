import type { Kpi } from '../../../src/lib/schemas/kpi.js';
import type { AlertState } from '../../../src/lib/schemas/alert.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FRENCH_DAYS = [
  'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi',
] as const;

export function frenchDayOfWeek(date: Date): string {
  return FRENCH_DAYS[date.getDay()]!;
}

export function formatKpiForPrompt(kpi: Kpi): string {
  const arrow = kpi.direction === 'up' ? '+' : kpi.direction === 'down' ? '-' : '=';
  return `- ${kpi.label.fr} : ${kpi.value} ${kpi.unit} (${arrow}${Math.abs(kpi.change_day).toFixed(2)} ${kpi.unit}, ${kpi.change_pct > 0 ? '+' : ''}${kpi.change_pct.toFixed(2)}%)`;
}

export function formatSpreadAnalysis(kpis: Kpi[]): string {
  const oatBund = kpis.find((k) => k.id === 'spread_oat_bund');
  const bundUs = kpis.find((k) => k.id === 'spread_bund_us');
  const lines: string[] = [];
  if (oatBund) {
    lines.push(
      `Spread OAT-Bund : ${oatBund.value} bps (${oatBund.direction}, variation jour : ${oatBund.change_day > 0 ? '+' : ''}${oatBund.change_day.toFixed(1)} bps)`,
    );
  }
  if (bundUs) {
    lines.push(
      `Spread Bund-US : ${bundUs.value} bps (${bundUs.direction}, variation jour : ${bundUs.change_day > 0 ? '+' : ''}${bundUs.change_day.toFixed(1)} bps)`,
    );
  }
  return lines.length > 0 ? lines.join('\n') : 'Aucune donnee de spread disponible.';
}

// ─── Main builder ─────────────────────────────────────────────────────────────

export function buildUserPrompt(kpis: Kpi[], alert: AlertState): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const dayName = frenchDayOfWeek(now);

  const kpiBlock = kpis.map(formatKpiForPrompt).join('\n');
  const spreadBlock = formatSpreadAnalysis(kpis);

  const alertBlock = alert.active
    ? `ALERTE ACTIVE — Niveau : ${(alert.level ?? 'UNKNOWN').toUpperCase()}
VIX actuel : ${alert.vix_current} | Seuil P90 (252j) : ${alert.vix_p90_252d}
Declenchee a : ${alert.triggered_at}`
    : `Aucune alerte active. VIX actuel : ${alert.vix_current} (sous le seuil P90 de ${alert.vix_p90_252d}).`;

  return `## Briefing du ${dayName} ${dateStr}

### Donnees de marche du jour

${kpiBlock}

### Analyse des spreads

${spreadBlock}

### Etat d'alerte VIX

${alertBlock}

### Instructions de sortie

Produis un JSON valide (sans commentaires, sans markdown fences) avec cette structure exacte :

{
  "briefing": { "fr": "4-5 phrases, ton Chartiste Lettre, >= 3 chiffres precis par paragraphe" },
  "tagline": { "fr": "Max 80 caracteres, accroche magazine du jour" },
  "metadata": {
    "theme_of_day": { "fr": "1-3 mots, le theme dominant" },
    "certainty": "preliminary ou definitive",
    "upcoming_event": { "fr": "evenement cle attendu" } ou null,
    "risk_level": "low | medium | high | crisis"
  }
}

Rappel : formulations descriptives uniquement. Ce contenu est editorial et informatif. Il ne constitue pas un conseil en investissement.`;
}
