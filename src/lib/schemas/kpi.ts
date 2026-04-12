import { z } from 'zod';

export const KpiSchema = z.object({
  id: z.string(),
  category: z.enum(['rates', 'spreads', 'indices', 'volatility', 'macro']),
  label: z.object({ fr: z.string(), en: z.string() }),
  value: z.number(),
  unit: z.string(),
  change_day: z.number(),
  change_pct: z.number(),
  direction: z.enum(['up', 'down', 'flat']),
  source: z.enum(['finnhub', 'fred', 'alpha_vantage', 'calculated']),
  timestamp: z.iso.datetime(),
  freshness_level: z.enum(['live', 'stale', 'very_stale']),
});

export type Kpi = z.infer<typeof KpiSchema>;
