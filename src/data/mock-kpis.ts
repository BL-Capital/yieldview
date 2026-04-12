import type { Kpi } from '@/lib/schemas/kpi'

export const MOCK_PRIMARY_KPIS: Kpi[] = [
  {
    id: 'cac40',
    category: 'indices',
    label: { fr: 'CAC 40', en: 'CAC 40' },
    value: 7234.56,
    unit: 'pts',
    change_day: 174.23,
    change_pct: 2.47,
    direction: 'up',
    source: 'finnhub',
    timestamp: '2026-04-12T06:30:00.000Z',
    freshness_level: 'live',
  },
  {
    id: 'spx',
    category: 'indices',
    label: { fr: 'S&P 500', en: 'S&P 500' },
    value: 5123.45,
    unit: 'pts',
    change_day: -12.34,
    change_pct: -0.24,
    direction: 'down',
    source: 'finnhub',
    timestamp: '2026-04-12T06:30:00.000Z',
    freshness_level: 'live',
  },
  {
    id: 'eurusd',
    category: 'macro',
    label: { fr: 'EUR/USD', en: 'EUR/USD' },
    value: 1.0823,
    unit: '',
    change_day: 0.0045,
    change_pct: 0.42,
    direction: 'up',
    source: 'finnhub',
    timestamp: '2026-04-12T06:30:00.000Z',
    freshness_level: 'live',
  },
  {
    id: 'gold',
    category: 'macro',
    label: { fr: 'Or', en: 'Gold' },
    value: 2312.80,
    unit: '$/oz',
    change_day: 18.40,
    change_pct: 0.80,
    direction: 'up',
    source: 'finnhub',
    timestamp: '2026-04-12T06:30:00.000Z',
    freshness_level: 'live',
  },
  {
    id: 'btc',
    category: 'indices',
    label: { fr: 'Bitcoin', en: 'Bitcoin' },
    value: 67450.0,
    unit: '$/BTC',
    change_day: -1234.5,
    change_pct: -1.80,
    direction: 'down',
    source: 'finnhub',
    timestamp: '2026-04-12T06:30:00.000Z',
    freshness_level: 'live',
  },
  {
    id: 'vix',
    category: 'volatility',
    label: { fr: 'VIX', en: 'VIX' },
    value: 22.4,
    unit: '',
    change_day: 1.2,
    change_pct: 5.66,
    direction: 'up',
    source: 'fred',
    timestamp: '2026-04-12T06:30:00.000Z',
    freshness_level: 'live',
  },
]

export interface SecondaryKpi {
  label: string
  value: number
  change: number
  unit?: string
}

export const MOCK_SECONDARY_KPIS: SecondaryKpi[] = [
  { label: 'DAX', value: 18234, change: 0.34, unit: 'pts' },
  { label: 'Nasdaq', value: 17890, change: -0.55, unit: 'pts' },
  { label: 'FTSE 100', value: 8123, change: 0.12, unit: 'pts' },
  { label: 'Nikkei 225', value: 38456, change: 1.23, unit: 'pts' },
  { label: 'Pétrole WTI', value: 82.4, change: -0.87, unit: '$/bbl' },
  { label: 'OAT 10Y', value: 3.12, change: 0.05, unit: '%' },
  { label: 'US10Y', value: 4.38, change: -0.03, unit: '%' },
  { label: 'Argent XAG', value: 27.45, change: 1.44, unit: '$/oz' },
]
